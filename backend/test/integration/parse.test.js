const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, rm, readdir, mkdir, writeFile } = require('node:fs/promises');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { Pool } = require('pg');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { createServer } = require('../../src/server');

test('Parse/PostgreSQL preserves the frontend contract and isolates tenants', { timeout: 120_000 }, async (t) => {
  const databaseURI = process.env.TEST_DATABASE_URI;
  assert.ok(databaseURI, 'Configure TEST_DATABASE_URI apontando para um banco vazio exclusivo de testes.');
  assert.match(new URL(databaseURI).pathname, /^\/menuzap_test[a-z0-9_]*$/, 'Nunca execute esta suíte em um banco de produção.');
  const files = await mkdtemp(path.join(tmpdir(), 'menuzap-files-'));
  const port = process.env.TEST_PORT || '14337';
  const base = `http://127.0.0.1:${port}/parse`;
  const env = { PARSE_APPLICATION_ID: 'menuzap-integration', PARSE_JAVASCRIPT_KEY: 'integration-public',
    PARSE_MASTER_KEY: 'integration-master-secret-'.repeat(3), DATABASE_URI: databaseURI,
    PUBLIC_ORIGIN: `http://127.0.0.1:${port}`, PORT: port, FILES_DIRECTORY: files, LOG_LEVEL: 'error' };
  let instance;
  let listener;
  async function start() {
    instance = await createServer(env);
    listener = instance.server.listen(Number(port), '127.0.0.1');
    await new Promise((resolve, reject) => { listener.once('listening', resolve); listener.once('error', reject); });
  }
  async function stop() {
    await instance.close();
  }
  await start();
  t.after(async () => { await stop(); await rm(files, { recursive: true, force: true }); });
  async function api(route, { method = 'GET', body, token, headers = {}, raw } = {}) {
    const response = await fetch(`${base}${route}`, {
      method,
      headers: { 'X-Parse-Application-Id': env.PARSE_APPLICATION_ID,
        'X-Parse-JavaScript-Key': env.PARSE_JAVASCRIPT_KEY,
        ...(token ? { 'X-Parse-Session-Token': token } : {}),
        'Content-Type': 'application/json', ...headers },
      body: raw || (body === undefined ? undefined : JSON.stringify(body)),
      signal: AbortSignal.timeout(10_000),
    });
    return { status: response.status, data: await response.json() };
  }
  const pointer = (className, objectId) => ({ __type: 'Pointer', className, objectId });
  const suffix = Date.now().toString(36);
  async function owner(name) {
    const user = await api('/users', { method: 'POST', body: {
      username: `${name}-${suffix}`, password: 'Segredo-de-teste-123', email: `${name}-${suffix}@example.com`, nome: name,
      ACL: { '*': { read: true, write: true } },
    } });
    assert.equal(user.status, 201, JSON.stringify(user.data));
    const token = user.data.sessionToken;
    assert.ok(token);
    const company = await api('/classes/Empresa', { method: 'POST', token, body: {
      nome: name, subdominio: `${name}-${suffix}`, id_user: pointer('_User', user.data.objectId), cnpj: 'privado',
    } });
    assert.equal(company.status, 201, JSON.stringify(company.data));
    return { user: user.data.objectId, company: company.data.objectId, token, slug: `${name}-${suffix}` };
  }
  const a = await owner('loja-a');
  const b = await owner('loja-b');
  let category;
  let product;
  let order;
  let imageUrl;
  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
  await t.test('public catalog, authenticated images and private user/profile fields', async () => {
    const upload = await api('/files/test.png', { method: 'POST', token: a.token, raw: image, headers: { 'Content-Type': 'image/png' } });
    assert.equal(upload.status, 201, JSON.stringify(upload.data));
    imageUrl = upload.data.url;
    assert.ok((await readdir(files)).length > 0, 'Images must be written inside the configured persistent directory.');
    const file = { __type: 'File', ...upload.data };
    const categoryResponse = await api('/classes/Categoria', { method: 'POST', token: a.token,
      body: { nome: 'Bebidas', id_empresa: pointer('Empresa', a.company), imagem: file } });
    assert.equal(categoryResponse.status, 201, JSON.stringify(categoryResponse.data));
    category = categoryResponse.data.objectId;
    const productResponse = await api('/classes/Produto', { method: 'POST', token: a.token, body: {
      nome: 'Suco', descricao: 'Natural', preco: 12.55, imagem: file, id_categoria: pointer('Categoria', category),
    } });
    assert.equal(productResponse.status, 201, JSON.stringify(productResponse.data));
    product = productResponse.data.objectId;
    const publicCompany = await api(`/classes/Empresa/${a.company}`);
    assert.equal(publicCompany.status, 200);
    assert.equal(publicCompany.data.cnpj, undefined);
    assert.equal((await api(`/classes/Empresa/${a.company}`, { token: a.token })).data.cnpj, 'privado');
    assert.equal((await api(`/classes/Produto/${product}`)).data.preco, 12.55);
    assert.notEqual((await api(`/users/${a.user}`, { token: b.token })).status, 200);
    assert.notEqual((await api('/users')).status, 200);
    assert.notEqual((await api('/files/anonymous.png', { method: 'POST', raw: image, headers: { 'Content-Type': 'image/png' } })).status, 201);
    assert.notEqual((await api('/files/fake.png', { method: 'POST', token: a.token, raw: Buffer.from('<html>'), headers: { 'Content-Type': 'image/png' } })).status, 201);
    assert.deepEqual(Buffer.from(await (await fetch(imageUrl)).arrayBuffer()), image);
  });
  await t.test('ownership is enforced even when clients forge pointers and ACLs', async () => {
    for (const route of [`/classes/Empresa/${a.company}`, `/classes/Categoria/${category}`, `/classes/Produto/${product}`]) {
      assert.notEqual((await api(route, { method: 'PUT', token: b.token, body: { nome: 'Invadido' } })).status, 200);
    }
    assert.notEqual((await api('/classes/Produto', { method: 'POST', token: b.token,
      body: { nome: 'Intruso', preco: 1, id_categoria: pointer('Categoria', category) } })).status, 201);
    assert.notEqual((await api(`/classes/Categoria/${category}`, { method: 'DELETE', token: b.token })).status, 200);
    assert.notEqual((await api(`/classes/Empresa/${b.company}`, { method: 'PUT', token: b.token,
      body: { id_user: pointer('_User', a.user) } })).status, 200);
    assert.notEqual((await api(`/classes/Empresa/${b.company}`, { method: 'PUT', token: b.token,
      body: { subdominio: a.slug } })).status, 200);
    assert.equal((await api(`/classes/Empresa/${b.company}`, { method: 'PUT', token: b.token,
      body: { subdominio: ` ${a.slug} ` } })).status, 400);
    assert.notEqual((await api('/classes/Empresa', { method: 'POST', token: a.token,
      body: { nome: 'Segunda', subdominio: `segunda-${suffix}`, id_user: pointer('_User', a.user) } })).status, 201);
    const forgedACL = await api(`/classes/Produto/${product}`, { method: 'PUT', token: a.token,
      body: { ACL: { '*': { read: true, write: true } } } });
    assert.equal(forgedACL.status, 200);
    assert.notEqual((await api(`/classes/Produto/${product}`, { method: 'PUT', body: { preco: 0 } })).status, 200);
    assert.notEqual((await api('/classes/Unexpected', { method: 'POST', token: a.token, body: { anything: 1 } })).status, 201);
    assert.notEqual((await api(`/classes/Produto/${product}`, { method: 'PUT', token: a.token, body: { newField: true } })).status, 200);
  });
  await t.test('owners can update profiles and catalogs and delete their own catalog records', async () => {
    assert.equal((await api(`/classes/Empresa/${a.company}`, { method: 'PUT', token: a.token,
      body: { celular: '69999999999', cidade: 'Porto Velho', cnpj: 'atualizado' } })).status, 200);
    assert.equal((await api(`/classes/Empresa/${a.company}`, { token: a.token })).data.cnpj, 'atualizado');
    assert.equal((await api(`/classes/Categoria/${category}`, { method: 'PUT', token: a.token, body: { nome: 'Bebidas naturais' } })).status, 200);
    assert.equal((await api(`/classes/Produto/${product}`, { method: 'PUT', token: a.token, body: { descricao: 'Feito na hora', preco: 12.55 } })).status, 200);
    assert.equal((await api(`/classes/Produto/${product}`)).data.descricao, 'Feito na hora');
    assert.equal((await api(`/classes/Categoria/${category}`, { method: 'DELETE', token: a.token })).status, 400);
    const extraCategory = await api('/classes/Categoria', { method: 'POST', token: a.token,
      body: { nome: 'Temporária', id_empresa: pointer('Empresa', a.company) } });
    assert.equal(extraCategory.status, 201);
    const extraProduct = await api('/classes/Produto', { method: 'POST', token: a.token,
      body: { nome: 'Temporário', preco: 1.25, id_categoria: pointer('Categoria', extraCategory.data.objectId) } });
    assert.equal(extraProduct.status, 201);
    assert.equal((await api(`/classes/Produto/${extraProduct.data.objectId}`, { method: 'DELETE', token: a.token })).status, 200);
    assert.equal((await api(`/classes/Categoria/${extraCategory.data.objectId}`, { method: 'DELETE', token: a.token })).status, 200);
  });
  const orderBody = () => ({
    id_empresa: pointer('Empresa', a.company), nome: ' Cliente ', celular: '69999999999', cpf: '123',
    tipoPagamento: 'pix', tipoEntrega: 'buscar', status: 'finalizado', valorTotal: 0.01,
    produtos: [{ id: product, amount: 3, preco: 0.01, nome: 'Fraude' }],
    ACL: { '*': { read: true, write: true } },
  });
  await t.test('anonymous orders use catalog prices, private ACLs and server-controlled status', async () => {
    const result = await api('/classes/Pedido', { method: 'POST', body: orderBody() });
    assert.equal(result.status, 201, JSON.stringify(result.data));
    order = result.data.objectId;
    const saved = await api(`/classes/Pedido/${order}`, { token: a.token });
    assert.equal(saved.status, 200, JSON.stringify(saved.data));
    assert.equal(saved.data.valorTotal, 37.65);
    assert.equal(saved.data.produtos[0].preco, 12.55);
    assert.equal(saved.data.produtos[0].nome, 'Suco');
    assert.equal(saved.data.status, 'novo');
    assert.notEqual((await api(`/classes/Pedido/${order}`)).status, 200);
    assert.notEqual((await api(`/classes/Pedido/${order}`, { token: b.token })).status, 200);
    assert.equal((await api('/classes/Pedido', { token: b.token })).data.results.length, 0);
    assert.notEqual((await api(`/classes/Pedido/${order}`, { method: 'PUT', token: b.token, body: { status: 'pronto' } })).status, 200);
    assert.notEqual((await api(`/classes/Pedido/${order}`, { method: 'PUT', token: a.token, body: { valorTotal: 1 } })).status, 200);
    assert.notEqual((await api(`/classes/Pedido/${order}`, { method: 'PUT', token: a.token, body: { status: 'inexistente' } })).status, 200);
    const updated = await api(`/classes/Pedido/${order}`, { method: 'PUT', token: a.token, body: { status: 'pronto' } });
    assert.equal(updated.status, 200, JSON.stringify(updated.data));
    assert.equal((await api(`/classes/Pedido/${order}`, { token: a.token })).data.status, 'pronto');
  });
  await t.test('rejects foreign products, missing products and invalid quantities', async () => {
    for (const body of [
      { ...orderBody(), id_empresa: pointer('Empresa', b.company) },
      { ...orderBody(), produtos: [{ id: 'missing', amount: 1 }] },
      { ...orderBody(), produtos: [{ id: product, amount: -1 }] },
      { ...orderBody(), produtos: [{ id: product, amount: 1.5 }] },
      { ...orderBody(), produtos: [] },
    ]) assert.notEqual((await api('/classes/Pedido', { method: 'POST', body })).status, 201);
  });
  await t.test('data, sessions, indexes and images survive backend recreation', async () => {
    await stop();
    await start();
    assert.equal((await api(`/classes/Pedido/${order}`, { token: a.token })).data.status, 'pronto');
    assert.equal((await api(`/classes/Produto/${product}`)).data.preco, 12.55);
    assert.deepEqual(Buffer.from(await (await fetch(imageUrl)).arrayBuffer()), image);
    const login = await api('/login', { method: 'POST', body: { username: `loja-a-${suffix}`, password: 'Segredo-de-teste-123' } });
    assert.equal(login.status, 200);
    assert.equal((await api('/logout', { method: 'POST', token: login.data.sessionToken, body: {} })).status, 200);
    assert.notEqual((await api('/users/me', { token: login.data.sessionToken })).status, 200);
  });
  await t.test('encrypted database + file backup restores into an empty database and directory', async () => {
    const exec = promisify(execFile);
    const backup = await mkdtemp(path.join(tmpdir(), 'menuzap-backup-test-'));
    const restoredFiles = path.join(backup, 'restored-files');
    const extracted = path.join(backup, 'extracted');
    const gpgHome = path.join(backup, 'gnupg');
    await mkdir(restoredFiles);
    await mkdir(extracted);
    await mkdir(gpgHome, { mode: 0o700 });
    await writeFile(path.join(backup, 'key'), 'temporary-integration-test-passphrase', { mode: 0o600 });
    const restoredDatabase = `menuzap_test_restore_${suffix}`;
    const restoredURI = new URL(databaseURI);
    restoredURI.pathname = `/${restoredDatabase}`;
    const admin = new Pool({ connectionString: databaseURI });
    await stop();
    try {
      await exec('pg_dump', ['--dbname', databaseURI, '--format=custom', '--file', path.join(backup, 'database.dump')]);
      await exec('tar', ['-C', files, '-cf', path.join(backup, 'files.tar'), '.']);
      await exec('tar', ['-C', backup, '-cf', path.join(backup, 'backup.tar'), 'database.dump', 'files.tar']);
      const cryptoOptions = ['--homedir', gpgHome, '--batch', '--yes', '--pinentry-mode', 'loopback', '--passphrase-file', path.join(backup, 'key')];
      await exec('gpg', [...cryptoOptions, '--symmetric', '--cipher-algo', 'AES256', '--output', path.join(backup, 'backup.tar.gpg'), path.join(backup, 'backup.tar')]);
      await exec('gpg', [...cryptoOptions, '--decrypt', '--output', path.join(extracted, 'backup.tar'), path.join(backup, 'backup.tar.gpg')]);
      await exec('tar', ['-C', extracted, '-xf', path.join(extracted, 'backup.tar'), 'database.dump', 'files.tar']);
      await admin.query(`CREATE DATABASE "${restoredDatabase}"`);
      await exec('pg_restore', ['--dbname', restoredURI.toString(), '--exit-on-error', '--no-owner', path.join(extracted, 'database.dump')]);
      await exec('tar', ['-C', restoredFiles, '-xf', path.join(extracted, 'files.tar')]);
      env.DATABASE_URI = restoredURI.toString();
      env.FILES_DIRECTORY = restoredFiles;
      await start();
      assert.equal((await api(`/classes/Pedido/${order}`, { token: a.token })).data.valorTotal, 37.65);
      assert.equal((await api(`/classes/Pedido/${order}`, { token: a.token })).data.status, 'pronto');
      assert.deepEqual(Buffer.from(await (await fetch(imageUrl)).arrayBuffer()), image);
      assert.notEqual((await api(`/classes/Pedido/${order}`, { token: b.token })).status, 200);
      await stop();
    } finally {
      env.DATABASE_URI = databaseURI;
      env.FILES_DIRECTORY = files;
      await admin.query(`DROP DATABASE IF EXISTS "${restoredDatabase}" WITH (FORCE)`);
      await admin.end();
      await start();
      await rm(backup, { recursive: true, force: true });
    }
  });
});

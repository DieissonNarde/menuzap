// Runs inside the isolated restore-check backend, never on the public endpoint.
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

async function verify() {
  const base = 'http://127.0.0.1:1337/parse';
  const headers = { 'X-Parse-Application-Id': process.env.PARSE_APPLICATION_ID,
    'X-Parse-Master-Key': process.env.PARSE_MASTER_KEY };
  for (const className of ['_User', 'Empresa', 'Categoria', 'Produto', 'Pedido']) {
    const response = await fetch(`${base}/classes/${className}?limit=1&count=1`, { headers });
    assert.ok(response.ok, `Não foi possível consultar ${className}.`);
    const data = await response.json();
    console.log(`${className}: ${data.count} registros restaurados`);
  }
  const directory = process.env.FILES_DIRECTORY;
  let checked = 0;
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const filename = decodeURIComponent(entry.name);
    const response = await fetch(`${base}/files/${process.env.PARSE_APPLICATION_ID}/${encodeURIComponent(filename)}`);
    assert.ok(response.ok, 'Imagem restaurada não está acessível pela API.');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await fs.readFile(path.join(directory, entry.name)));
    checked++;
  }
  console.log(`Restauração verificada: ${checked} arquivos servidos e comparados byte a byte.`);
}
verify().catch((error) => { console.error(error.message); process.exitCode = 1; });

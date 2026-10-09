const { STATUSES, PAYMENTS, DELIVERIES, requireText, cents, calculateOrder } = require('./order');

module.exports = function registerCloud(Parse) {
  const privileged = { useMasterKey: true };
  const fail = (message) => { throw new Parse.Error(Parse.Error.VALIDATION_ERROR, message); };
  const requireUser = (request) => {
    if (!request.user) fail('Autenticação obrigatória.');
    return request.user.id;
  };
  function pointerId(object, key, target) {
    const value = object.get(key);
    if (!(value instanceof Parse.Object) || value.className !== target || !value.id) fail(`${key} inválido.`);
    return value.id;
  }
  async function get(className, id) {
    return new Parse.Query(className).get(id, privileged);
  }
  function setOwnerACL(object, owner, publicRead = false) {
    const acl = new Parse.ACL();
    acl.setReadAccess(owner, true);
    acl.setWriteAccess(owner, true);
    if (publicRead) acl.setPublicReadAccess(true);
    object.setACL(acl);
  }
  async function companyOwner(id) {
    const company = await get('Empresa', id);
    return pointerId(company, 'id_user', '_User');
  }
  async function categoryOwner(id) {
    const category = await get('Categoria', id);
    return companyOwner(pointerId(category, 'id_empresa', 'Empresa'));
  }
  function immutable(request, key, target) {
    if (request.original && pointerId(request.object, key, target) !== pointerId(request.original, key, target)) {
      fail('Não é permitido transferir registros entre estabelecimentos.');
    }
  }
  function boundStrings(object) {
    for (const key of Object.keys(object.attributes)) {
      const value = object.get(key);
      if (typeof value === 'string' && value.length > (key === 'descricao' ? 5000 : 300)) fail(`${key} excede o limite.`);
    }
  }
  Parse.Cloud.beforeSave('_User', (request) => {
    boundStrings(request.object);
    // Parse validates passwords and ownership; users cannot choose public ACLs.
    if (request.object.id) setOwnerACL(request.object, request.object.id);
    else request.object.setACL(new Parse.ACL()); // Parse adds the new user's own access on insert.
  });

  Parse.Cloud.beforeSave('Empresa', async (request) => {
    const owner = requireUser(request);
    immutable(request, 'id_user', '_User');
    if (pointerId(request.object, 'id_user', '_User') !== owner) fail('Empresa não pertence ao usuário.');
    boundStrings(request.object);
    request.object.set('nome', requireText(request.object.get('nome'), 'Nome'));
    const slug = requireText(request.object.get('subdominio'), 'Subdomínio', 80);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail('Subdomínio inválido.');
    request.object.set('subdominio', slug);
    setOwnerACL(request.object, owner, true);
  });

  for (const className of ['Categoria', 'Produto']) {
    Parse.Cloud.beforeSave(className, async (request) => {
      const user = requireUser(request);
      const key = className === 'Categoria' ? 'id_empresa' : 'id_categoria';
      const parent = className === 'Categoria' ? 'Empresa' : 'Categoria';
      immutable(request, key, parent);
      const parentId = pointerId(request.object, key, parent);
      const owner = await (className === 'Categoria' ? companyOwner(parentId) : categoryOwner(parentId));
      if (owner !== user) fail('Registro não pertence ao usuário.');
      boundStrings(request.object);
      request.object.set('nome', requireText(request.object.get('nome'), 'Nome'));
      if (className === 'Produto') request.object.set('preco', cents(request.object.get('preco')) / 100);
      setOwnerACL(request.object, owner, true);
    });
    Parse.Cloud.beforeDelete(className, async (request) => {
      const user = requireUser(request);
      const id = className === 'Categoria'
        ? pointerId(request.object, 'id_empresa', 'Empresa')
        : pointerId(request.object, 'id_categoria', 'Categoria');
      const owner = await (className === 'Categoria' ? companyOwner(id) : categoryOwner(id));
      if (owner !== user) fail('Registro não pertence ao usuário.');
      if (className === 'Categoria') {
        const product = await new Parse.Query('Produto').equalTo('id_categoria', request.object).first(privileged);
        if (product) fail('Remova os produtos antes de excluir a categoria.');
      }
    });
  }

  Parse.Cloud.beforeSave('Pedido', async (request) => {
    const order = request.object;
    const companyId = pointerId(order, 'id_empresa', 'Empresa');
    const owner = await companyOwner(companyId);
    if (request.original) {
      if (requireUser(request) !== owner) fail('Pedido não pertence ao usuário.');
      if (order.dirtyKeys().some((key) => key !== 'status')) fail('Somente o status do pedido pode ser alterado.');
      if (!STATUSES.includes(order.get('status'))) fail('Status inválido.');
      return;
    }
    boundStrings(order);
    order.set('nome', requireText(order.get('nome'), 'Nome do cliente'));
    requireText(order.get('celular'), 'Celular', 30);
    if (!PAYMENTS.includes(order.get('tipoPagamento'))) fail('Pagamento inválido.');
    if (!DELIVERIES.includes(order.get('tipoEntrega'))) fail('Entrega inválida.');
    if (order.get('tipoEntrega') === 'mesa') requireText(order.get('mesa'), 'Mesa', 30);
    if (order.get('tipoEntrega') === 'delivery') {
      for (const key of ['cep', 'uf', 'cidade', 'logradouro', 'bairro', 'numero']) requireText(order.get(key), key);
    }
    const items = order.get('produtos');
    if (!Array.isArray(items) || !items.length || items.length > 100) fail('Carrinho inválido.');
    const ids = items.map((item) => requireText(item?.id, 'Produto', 100));
    const products = await new Parse.Query('Produto').containedIn('objectId', ids).limit(100).find(privileged);
    const categoryIds = [...new Set(products.map((product) => pointerId(product, 'id_categoria', 'Categoria')))];
    const categories = await new Parse.Query('Categoria').containedIn('objectId', categoryIds).limit(100).find(privileged);
    const allowed = new Set(categories.filter((category) => pointerId(category, 'id_empresa', 'Empresa') === companyId).map((category) => category.id));
    const catalog = new Map(products.filter((product) => allowed.has(product.get('id_categoria').id)).map((product) => [product.id, {
      nome: product.get('nome'), descricao: product.get('descricao') || '',
      preco: product.get('preco'), imagem: product.get('imagem')?.url() || '',
    }]));
    const result = calculateOrder(items, catalog);
    order.set('produtos', result.produtos);
    order.set('valorTotal', result.valorTotal);
    order.set('status', 'novo');
    setOwnerACL(order, owner);
  });

  // Uploaded catalog images are public, but only signed-in owners may upload.
  Parse.Cloud.beforeSave(Parse.File, async (request) => {
    requireUser(request);
    const extension = request.file.name().split('.').pop().toLowerCase();
    const data = Buffer.from(await request.file.getData(), 'base64');
    const valid = {
      png: data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      jpg: data.subarray(0, 3).equals(Buffer.from([255, 216, 255])),
      jpeg: data.subarray(0, 3).equals(Buffer.from([255, 216, 255])),
      gif: ['GIF87a', 'GIF89a'].includes(data.subarray(0, 6).toString()),
      webp: data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WEBP',
    };
    if (valid[extension] !== true) fail('Formato de imagem não permitido.');
  });
};

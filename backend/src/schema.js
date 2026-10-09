const stringFields = (names) => Object.fromEntries(names.map((name) => [name, { type: 'String' }]));
const pointer = (targetClass) => ({ type: 'Pointer', targetClass });
const publicRead = { get: { '*': true }, find: { '*': true } };
const authenticatedWrite = {
  create: { requiresAuthentication: true },
  update: { requiresAuthentication: true },
  delete: { requiresAuthentication: true },
  addField: {},
};

module.exports = [
  {
    className: '_User',
    fields: stringFields(['nome']),
    classLevelPermissions: {
      get: { requiresAuthentication: true }, find: {}, create: { '*': true },
      update: { requiresAuthentication: true }, delete: {}, addField: {},
    },
  },
  {
    className: 'Empresa',
    fields: {
      ...stringFields(['nome', 'subdominio', 'cnpj', 'email', 'celular', 'telefone',
        'inicioSemanaAberto', 'fimSemanaAberto', 'inicioHorarioNormal', 'fimHorarioNormal',
        'inicioHorarioFeriado', 'fimHorarioFeriado', 'cep', 'uf', 'cidade', 'logradouro', 'bairro', 'numero']),
      id_user: pointer('_User'), logo: { type: 'File' },
    },
    classLevelPermissions: { ...publicRead, ...authenticatedWrite, delete: {} },
    indexes: { empresa_slug: { subdominio: 1 }, empresa_owner: { id_user: 1 } },
  },
  {
    className: 'Categoria',
    fields: { nome: { type: 'String' }, imagem: { type: 'File' }, id_empresa: pointer('Empresa') },
    classLevelPermissions: { ...publicRead, ...authenticatedWrite },
    indexes: { categoria_empresa_nome: { id_empresa: 1, nome: 1 } },
  },
  {
    className: 'Produto',
    fields: { ...stringFields(['nome', 'descricao']), preco: { type: 'Number' },
      imagem: { type: 'File' }, id_categoria: pointer('Categoria') },
    classLevelPermissions: { ...publicRead, ...authenticatedWrite },
    indexes: { produto_categoria_nome: { id_categoria: 1, nome: 1 } },
  },
  {
    className: 'Pedido',
    fields: { ...stringFields(['nome', 'cpf', 'celular', 'tipoPagamento', 'trocoPagamento',
      'tipoEntrega', 'mesa', 'horas', 'cep', 'uf', 'cidade', 'logradouro', 'bairro', 'numero', 'status']),
      id_empresa: pointer('Empresa'), produtos: { type: 'Array' }, valorTotal: { type: 'Number' } },
    classLevelPermissions: {
      get: { requiresAuthentication: true }, find: { requiresAuthentication: true },
      create: { '*': true }, update: { requiresAuthentication: true }, delete: {}, addField: {},
    },
    indexes: { pedido_empresa_data: { id_empresa: 1, createdAt: -1 } },
  },
];

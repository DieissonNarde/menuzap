const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateOrder, cents } = require('../src/order');
const { config } = require('../src/config');

test('replaces browser prices and descriptions with authoritative catalog snapshots', () => {
  const catalog = new Map([['p1', { nome: 'Suco', descricao: 'Natural', imagem: '', preco: 12.55 }]]);
  const result = calculateOrder([{ id: 'p1', amount: 3, preco: 0.01, nome: 'Fraude' }], catalog);
  assert.equal(result.valorTotal, 37.65);
  assert.deepEqual(result.produtos[0], { id: 'p1', amount: 3, nome: 'Suco', descricao: 'Natural', imagem: '', preco: 12.55 });
});

test('adds decimal money in integer cents', () => {
  const result = calculateOrder([{ id: 'a', amount: 1 }, { id: 'b', amount: 1 }], new Map([
    ['a', { preco: 0.1 }], ['b', { preco: 0.2 }],
  ]));
  assert.equal(result.valorTotal, 0.3);
});

test('rejects missing, foreign, duplicate and malformed items', () => {
  const catalog = new Map([['p', { preco: 5 }]]);
  for (const items of [[], null, [{ id: 'foreign', amount: 1 }], [{ id: 'p', amount: 0 }],
    [{ id: 'p', amount: 1.5 }], [{ id: 'p', amount: '2' }], [{ id: 'p', amount: 1000 }],
    [{ id: 'p', amount: 1 }, { id: 'p', amount: 1 }]]) {
    assert.throws(() => calculateOrder(items, catalog));
  }
  for (const price of [-1, Infinity, NaN, '5', 1.001]) assert.throws(() => cents(price));
});

test('requires isolated master credentials, PostgreSQL and HTTPS in production', () => {
  const env = { PARSE_APPLICATION_ID: 'test-app', PARSE_JAVASCRIPT_KEY: 'public-key',
    PARSE_MASTER_KEY: 'a'.repeat(64), DATABASE_URI: 'postgres://localhost/test',
    PUBLIC_ORIGIN: 'https://menu.example.com', NODE_ENV: 'production' };
  assert.equal(config(env).parse.publicServerURL, 'https://menu.example.com/parse');
  for (const overrides of [{ PARSE_MASTER_KEY: 'short' }, { DATABASE_URI: 'mongodb://localhost/test' },
    { PUBLIC_ORIGIN: 'http://menu.example.com' }, { PUBLIC_ORIGIN: 'https://example.com/path' },
    { PARSE_JAVASCRIPT_KEY: env.PARSE_MASTER_KEY }]) assert.throws(() => config({ ...env, ...overrides }));
});

const STATUSES = ['novo', 'em andamento', 'pronto', 'em transporte', 'finalizado', 'cancelado'];
const PAYMENTS = ['dinheiro', 'debito', 'credito', 'pix'];
const DELIVERIES = ['mesa', 'buscar', 'delivery'];

function requireText(value, label, max = 200) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new Error(`${label} inválido.`);
  }
  return value.trim();
}

function cents(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1_000_000) {
    throw new Error('Preço inválido no catálogo.');
  }
  const amount = Math.round((value + Number.EPSILON) * 100);
  if (Math.abs(value * 100 - amount) > 0.00001) throw new Error('O preço deve ter até duas casas decimais.');
  return amount;
}

function calculateOrder(items, catalog) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 100) throw new Error('Carrinho inválido.');
  const seen = new Set();
  let totalCents = 0;
  const produtos = items.map((item) => {
    if (!item || typeof item.id !== 'string' || seen.has(item.id)
      || !Number.isSafeInteger(item.amount) || item.amount < 1 || item.amount > 999) {
      throw new Error('Produto ou quantidade inválida.');
    }
    seen.add(item.id);
    const product = catalog.get(item.id);
    if (!product) throw new Error('Produto não pertence ao estabelecimento.');
    const priceCents = cents(product.preco);
    totalCents += priceCents * item.amount;
    if (!Number.isSafeInteger(totalCents) || totalCents > 100_000_000) throw new Error('Total do pedido excede o limite.');
    return { ...product, id: item.id, preco: priceCents / 100, amount: item.amount };
  });
  return { produtos, valorTotal: totalCents / 100 };
}

module.exports = { STATUSES, PAYMENTS, DELIVERIES, requireText, cents, calculateOrder };

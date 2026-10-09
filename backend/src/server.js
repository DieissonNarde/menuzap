// Parse initializes a global logger on import, before instance options apply.
// Disable its file transport as well so the non-root container only needs its
// designated persistent image volume to be writable.
process.env.PARSE_SERVER_LOGS_FOLDER ??= 'null';
const express = require('express');
const http = require('node:http');
const { ParseServer } = require('parse-server');
const { Pool } = require('pg');
const { config } = require('./config');

async function createServer(env = process.env) {
  const settings = config(env);
  const parse = new ParseServer(settings.parse);
  const app = express();
  const server = http.createServer(app);
  parse.server = server;
  const pool = new Pool({ connectionString: settings.parse.databaseURI, max: 2 });
  try {
    await parse.start();
    // Parse's schema API does not expose unique indexes. Install these on every
    // startup, before serving requests; PostgreSQL also prevents concurrent duplicates.
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS "Empresa_unique_subdominio" ON "Empresa" ("subdominio")');
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS "Empresa_unique_id_user" ON "Empresa" ("id_user")');
  } catch (error) {
    await pool.end();
    await parse.handleShutdown();
    throw error;
  }
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback, linklocal, uniquelocal');
  app.get('/healthz', async (_request, response) => {
    try {
      await pool.query('SELECT 1');
      response.json({ status: 'ok' });
    } catch {
      response.status(503).json({ status: 'unavailable' });
    }
  });
  app.use('/parse', parse.app);
  return { app, server, port: settings.port, close: async () => { await parse.handleShutdown(); await pool.end(); } };
}

if (require.main === module) {
  createServer().then((instance) => {
    instance.server.listen(instance.port, '0.0.0.0', () => console.log('Menu Zap backend iniciado.'));
    let closing = false;
    const shutdown = () => {
      if (closing) return;
      closing = true;
      instance.close().then(() => process.exit(0)).catch(() => process.exit(1));
      setTimeout(() => process.exit(1), 25_000).unref();
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }).catch((error) => { console.error('Falha ao iniciar o backend:', error.message); process.exit(1); });
}
module.exports = { createServer };

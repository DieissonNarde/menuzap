const path = require('node:path');
const schemas = require('./schema');
const cloud = require('./cloud');

function requireEnv(env, name) {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Configure ${name}.`);
  return value;
}

function config(env = process.env) {
  const appId = requireEnv(env, 'PARSE_APPLICATION_ID');
  const masterKey = requireEnv(env, 'PARSE_MASTER_KEY');
  const javascriptKey = requireEnv(env, 'PARSE_JAVASCRIPT_KEY');
  if (masterKey.length < 32 || [appId, javascriptKey].includes(masterKey)) throw new Error('PARSE_MASTER_KEY deve ser exclusiva e ter pelo menos 32 caracteres.');
  const port = Number(env.PORT || 1337);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT inválida.');
  const origin = new URL(requireEnv(env, 'PUBLIC_ORIGIN'));
  if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('PUBLIC_ORIGIN deve usar HTTP ou HTTPS.');
  if (env.NODE_ENV === 'production' && origin.protocol !== 'https:') throw new Error('PUBLIC_ORIGIN deve usar HTTPS em produção.');
  if (origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('PUBLIC_ORIGIN deve conter apenas a origem.');
  const databaseURI = requireEnv(env, 'DATABASE_URI');
  if (!/^postgres(ql)?:\/\//.test(databaseURI)) throw new Error('DATABASE_URI deve apontar para PostgreSQL.');
  return {
    port,
    parse: {
      appId, appName: 'Menu Zap', masterKey, javascriptKey, databaseURI,
      serverURL: `http://127.0.0.1:${port}/parse`, publicServerURL: `${origin.origin}/parse`,
      cloud, allowClientClassCreation: false, enforcePrivateUsers: true,
      enableAnonymousUsers: false, enableExpressErrorHandler: false,
      masterKeyIps: ['127.0.0.1', '::1'],
      readOnlyMasterKeyIps: ['127.0.0.1', '::1'],
      maxUploadSize: '5mb', fileUpload: { enableForPublic: false, enableForAnonymousUser: false, enableForAuthenticatedUser: true, allowedFileUrlDomains: [origin.hostname] },
      // The official adapter prefixes its option with "files/", even for an
      // absolute path. Make the option relative to that prefix so the configured
      // directory (and Docker volume) is the actual storage location.
      filesAdapter: { module: '@parse/fs-files-adapter', options: {
        filesSubDirectory: path.relative(path.resolve('files'), path.resolve(env.FILES_DIRECTORY || 'var/files')),
      } },
      logLevel: env.LOG_LEVEL || 'warn', logsFolder: null,
      logLevels: { triggerBeforeError: 'silent', triggerBeforeSuccess: 'silent', triggerAfter: 'silent' },
      schema: { definitions: schemas, lockSchemas: true, keepUnknownIndexes: true,
        deleteExtraFields: false, recreateModifiedFields: false },
      protectedFields: { Empresa: { '*': ['cnpj'], 'userField:id_user': [] } },
      protectedFieldsOwnerExempt: true, protectedFieldsTriggerExempt: true, protectedFieldsSaveResponseExempt: false,
      pages: { encodePageParamHeaders: true },
      installation: { duplicateDeviceTokenActionEnforceAuth: true },
      allowAggregationForReadOnlyMasterKey: false,
      requestComplexity: { includeDepth: 5, includeCount: 20, subqueryDepth: 5, queryDepth: 10,
        graphQLDepth: 10, graphQLFields: 100, batchRequestLimit: 50 },
      passwordPolicy: { validatorPattern: /^.{10,128}$/ },
      rateLimit: [
        { requestPath: '/login', requestTimeWindow: 60_000, requestCount: 20 },
        { requestPath: '/users', requestTimeWindow: 60_000, requestCount: 20 },
        { requestPath: '/classes/Pedido', requestTimeWindow: 60_000, requestCount: 120 },
      ],
    },
  };
}
module.exports = { config };

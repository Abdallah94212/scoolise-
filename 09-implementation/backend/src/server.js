const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`Scoolize API démarrée sur http://localhost:${env.port} (env: ${env.nodeEnv})`);
  console.log(`Documentation Swagger : http://localhost:${env.port}/api/docs`);
});

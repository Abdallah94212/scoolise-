const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./config/swagger');
const apiRoutes = require('./modules/index.routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();

// Réfléchit l'origine de la requête plutôt qu'une seule origine fixe : le
// frontend est un site statique qui peut être ouvert de plusieurs façons
// (serveur local sur un port différent, fichier ouvert directement en
// file:// → Origin "null", etc.). Aucune donnée de session n'est stockée en
// cookie (JWT en en-tête Authorization), donc réfléchir l'origine ne pose pas
// de risque CSRF ici.
app.use(cors({ origin: true }));
app.use(express.json());
if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

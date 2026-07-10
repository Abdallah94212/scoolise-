const statsService = require('./stats.service');

async function listByFormation(req, res, next) {
  try {
    res.json(await statsService.listByFormation(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function upsert(req, res, next) {
  try {
    res.status(201).json(await statsService.upsert(req.params.id, req.body, req.user));
  } catch (err) {
    next(err);
  }
}

module.exports = { listByFormation, upsert };

const formationsService = require('./formations.service');

async function list(req, res, next) {
  try {
    res.json(await formationsService.list(req.query));
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    res.json(await formationsService.getById(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await formationsService.create(req.body, req.user));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await formationsService.update(req.params.id, req.body, req.user));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await formationsService.remove(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };

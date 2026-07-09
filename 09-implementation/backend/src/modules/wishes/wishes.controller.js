const wishesService = require('./wishes.service');

async function listAllForAdmin(req, res, next) {
  try {
    res.json(await wishesService.listAll(req.query));
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    res.json(await wishesService.listMine(req.user.id));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await wishesService.create(req.user.id, req.body.formationId));
  } catch (err) {
    next(err);
  }
}

async function updateRank(req, res, next) {
  try {
    res.json(await wishesService.updateRank(req.params.id, req.user.id, req.body.rank));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await wishesService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listAllForAdmin, listMine, create, updateRank, remove };

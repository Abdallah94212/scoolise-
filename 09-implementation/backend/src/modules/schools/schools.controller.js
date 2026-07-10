const schoolsService = require('./schools.service');
const formationsService = require('../formations/formations.service');

async function list(req, res, next) {
  try {
    res.json(await schoolsService.list(req.query));
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    res.json(await schoolsService.getById(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function listFormations(req, res, next) {
  try {
    await schoolsService.getById(req.params.id);
    res.json(await formationsService.list({ ...req.query, schoolId: req.params.id }));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await schoolsService.create(req.body));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await schoolsService.update(req.params.id, req.body, req.user));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await schoolsService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, listFormations, create, update, remove };

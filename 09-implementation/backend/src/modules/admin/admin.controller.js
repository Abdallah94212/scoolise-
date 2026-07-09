const adminService = require('./admin.service');

async function dashboard(req, res, next) {
  try {
    res.json(await adminService.dashboard());
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    res.json(await adminService.listUsers(req.query));
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    res.json(await adminService.updateUser(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await adminService.deleteUser(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, listUsers, updateUser, deleteUser };

const { Router } = require('express');
const authRoutes = require('./auth/auth.routes');
const schoolsRoutes = require('./schools/schools.routes');
const formationsRoutes = require('./formations/formations.routes');
const adminRoutes = require('./admin/admin.routes');
const wishesRoutes = require('./wishes/wishes.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolsRoutes);
router.use('/formations', formationsRoutes);
router.use('/admin', adminRoutes);
router.use('/wishes', wishesRoutes);

module.exports = router;

const router = require('express').Router();
const adminAuthController = require('../controller/admin_auth_controller');
const adminManagementController = require('../controller/admin_management_controller');
const authMiddleware = require('../middleware/auth_middleware');
const validationMiddleware = require('../middleware/validation_middleware');

router.get('/login', authMiddleware.oturumAcilmamis,adminAuthController.login);
router.post('/login',validationMiddleware.validateLogin(), authMiddleware.oturumAcilmamis,adminAuthController.loginPost);

router.get('/forget-password', authMiddleware.oturumAcilmamis, adminAuthController.forgetPassword);
router.post('/forget-password',validationMiddleware.validateEmail(), authMiddleware.oturumAcilmamis, adminAuthController.forgetPost);

router.get('/reset-password/:id/:token', authMiddleware.oturumAcilmamis, adminAuthController.newPassword)
router.get('/reset-password', authMiddleware.oturumAcilmamis,adminAuthController.newPassword)
router.post('/reset-password', validationMiddleware.validateNewPassword(), authMiddleware.oturumAcilmamis, adminAuthController.newPasswordSave)

router.get('/',authMiddleware.oturumAcilmis, adminManagementController.home);

router.get('/tables', authMiddleware.oturumAcilmis, adminManagementController.tables);
router.get('/tables-data', authMiddleware.oturumAcilmis, adminManagementController.tablesData);

router.get('/charts', authMiddleware.oturumAcilmis, adminManagementController.charts);     
router.get('/chartsData',authMiddleware.oturumAcilmis, adminManagementController.chartsData);

router.get('/dashboard', authMiddleware.oturumAcilmis, adminManagementController.dashboard);
router.get('/dashboard-data', authMiddleware.oturumAcilmis, adminManagementController.dashboardData)

router.post('/logout', authMiddleware.oturumAcilmis, adminManagementController.logout);

router.get(authMiddleware.oturumAcilmis, adminManagementController.errorNotFound);

module.exports = router;
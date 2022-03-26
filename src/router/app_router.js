const router = require('express').Router();
const authController = require('../controller/auth_controller');
const missionController = require('../controller/mission_controller')
const tokenMiddleware = require('../middleware/token_middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
 
router.post('/add',tokenMiddleware, missionController.missionAdd);
router.post('/delete',tokenMiddleware, missionController.missionDelete);
router.get('/list',tokenMiddleware, missionController.missionList);
router.post('/update',tokenMiddleware, missionController.missionUpdate);
router.post('/iscompleted',tokenMiddleware, missionController.missionIsCompleted);
router.post('/search',tokenMiddleware, missionController.missionSearch); 
 


module.exports = router;
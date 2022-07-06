const router = require('express').Router();
const userController = require('../controller/auth_controller');
const validationMiddleware = require('../middleware/validation_middleware');
const authMiddleware = require('../middleware/auth_middleware');

router.get('/register', userController.showRegister);
router.post('/register', validationMiddleware.validateNewUser(), userController.register);

router.get('/login', userController.showLogin);
router.post('/login', validationMiddleware.validateLogin(),userController.login);

router.get('/logout', userController.logOut); 

module.exports = router;
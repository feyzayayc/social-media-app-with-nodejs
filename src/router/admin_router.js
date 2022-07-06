const router = require('express').Router();
const adminController = require('../controller/admin_controller');
const authMiddleware = require('../middleware/auth_middleware');
const validationMiddleware = require('../middleware/validation_middleware');

router.get('/',authMiddleware.isLoggedIn, adminController.showIndex);

router.get('/timeline',authMiddleware.isLoggedIn, adminController.showTimeline);
router.post('/timeline',authMiddleware.isLoggedIn, adminController.timeline);

router.get('/settings',authMiddleware.isLoggedIn,adminController.showSettings);
router.post('/settings',authMiddleware.isLoggedIn,validationMiddleware.validateUpdateUser(), adminController.settings);

router.get('/timeline/post/delete/:id',authMiddleware.isLoggedIn, adminController.deletePost);

router.get('/timeline/post/edit/:id',authMiddleware.isLoggedIn, adminController.showEditpost);
router.post('/timeline/post/edit/:id',authMiddleware.isLoggedIn, adminController.editPost);

router.get('/timeline/post/like/:id',authMiddleware.isLoggedIn, adminController.likePost);
router.get('/timeline/post/dislike/:id',authMiddleware.isLoggedIn, adminController.dislikePost);


module.exports = router;
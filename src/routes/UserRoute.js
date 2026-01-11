import express from 'express';
import UserController from '../controllers/UserController.js';
import authMiddlewares from '../middlewares/authMiddlewares.js';
import upload  from '../middlewares/upload.js'
let routes = express.Router();


routes.post('/sign-up', UserController.createUser);
routes.post('/sign-in', UserController.loginUser);
routes.post('/log-out', UserController.logoutUser);
routes.put('/update-user/:id',authMiddlewares.authMiddleware,upload.none(), UserController.updateUser);
routes.delete('/delete-user/:id', UserController.deleteUser);
routes.delete('/delete-user-admin/:id',authMiddlewares.authMiddleware,authMiddlewares.adminMiddlewarw, UserController.deleteUser);
routes.get('/getAll',authMiddlewares.authMiddleware,authMiddlewares.adminMiddlewarw, UserController.getAllUsers);
routes.get('/getUserDetail/:id',authMiddlewares.authMiddleware, UserController.getUserDetail);
routes.post('/refresh-token', UserController.refreshToken);
routes.put('/avatar/:id', upload.single('avatar'),UserController.uploadAvatar);
routes.post('/delete-many' ,authMiddlewares.authMiddleware,authMiddlewares.adminMiddlewarw, UserController.deleteUsermany);

export default routes;
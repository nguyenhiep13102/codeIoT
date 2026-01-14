import express from "express";
import Fancontrollers from "../controllers/fan.controller.js";
import authMiddlewares from '../middlewares/authMiddlewares.js';
import Notification from "../controllers/Notification.controller.js";
const routerfan = express.Router();

routerfan.get("/state/:IdUser", authMiddlewares.authMiddleware,Fancontrollers.getFanByUserId,);  
routerfan.get("/getFanId/:id", Fancontrollers.getFanById);  
routerfan.post("/control", Fancontrollers.controlFan);     
routerfan.post("/createfan", Fancontrollers.createFanIoT);  
routerfan.get("/chart/:fanId", Fancontrollers.getFanChartData);   
routerfan.post("/SettingAuto/:fanId", Fancontrollers.settingAuto);   

routerfan.get('/latest/:fanId', Notification.getLatestNotifications);
routerfan.get('/unread-count/:fanId', Notification.getUnreadCount);
routerfan.put('/read/:id', Notification.markAsRead);
routerfan.get('/NotificationsByUser/:userId', Notification.getLatestNotificationsByUser);
export default routerfan;

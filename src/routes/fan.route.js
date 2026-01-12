import express from "express";
import Fancontrollers from "../controllers/fan.controller.js";
import authMiddlewares from '../middlewares/authMiddlewares.js';
const routerfan = express.Router();

routerfan.get("/state/:IdUser", authMiddlewares.authMiddleware,Fancontrollers.getFanByUserId,);  
routerfan.get("/getFanId/:id", Fancontrollers.getFanById);  
routerfan.post("/control", Fancontrollers.controlFan);     
routerfan.post("/createfan", Fancontrollers.createFanIoT);  
routerfan.get("/chart/:fanId", Fancontrollers.getFanChartData);   
export default routerfan;

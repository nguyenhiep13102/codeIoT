import jwt from 'jsonwebtoken';
import User from "../models/UserModel.js"; 
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("Received Token:", token);

        if (!token) {
            return res.status(401).json({ status: "error", message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json({ status: "error", message: "loi token" });
    }
};
const  adminMiddlewarw = (req, res, next)=>{
    if(!req.user || !req.user.isAdmin ){
       return res.status(403).json({ status: "error", message: "không phải quản trị viên " });
    }
    next();
}
export default {
    authMiddleware,
    adminMiddlewarw
};
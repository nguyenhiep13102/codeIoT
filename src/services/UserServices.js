import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const CreateUser = async (userData) => {
    try {
        const { name, email, password, phone, isAdmin, addres } = userData;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            isAdmin: isAdmin || false,
            addres,
        });

        const savedUser = await newUser.save();

        return {
            status: "success",
            message: "Tạo tài khoản thành công!",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                isAdmin: savedUser.isAdmin,
                hashedPassword: savedUser.password ,
                addres: addres
            },
        };
    } catch (e) {      
        throw e;
    }
};
const LoginUser = async(email,password)=>{
    try{
        const user = await User.findOne({ email });
        if (!user) {
            return {
                status: 'ERR',
                message: 'Email không tồn tại!',
            };
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                status: 'ERR',
                message: 'Mật khẩu không đúng!',
            };
        }
        const accessToken = await generateAccessToken(user._id,user.isAdmin );
        const  refreshToken = await generateRefreshToken(user._id);
         user.refresh_token = refreshToken;
        await user.save();
        console.log('accessToken',accessToken);
         return {
            status: 'success',
            message: 'Đăng nhập thành công!',
            accessToken,
            refreshToken,
            // user: {
            //     id: user._id,
            //     name: user.name,
            //     email: user.email,
            //     phone: user.phone,
            //     isAdmin: user.isAdmin,
              

            // },
        }

    }catch{
        throw e;
    }
}

const updateUser = async(id ,data)=>{
    try{
        const user = await User.findById(id);
         if(!user){
            return{
                 status: "error",
                message: "Không tìm thấy người dùng!",
            };
         };
          if (data.name) user.name = data.name;
        if (data.email) user.email = data.email;
        if (data.phone) user.phone = data.phone;
        if (data.avatar) user.avatar = data.avatar;
        if (data.addres) user.addres = data.addres;
        if (data.city) user.city = data.city;


         if (data.password) {
            const matkhaumoi = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(data.password, matkhaumoi);
        }
         const updatedUser = await user.save();
        return {
            status: "success",
            message: "Cập nhật thông tin thành công!",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                isAdmin: updatedUser.isAdmin,
                avatar:updatedUser.avatar,
                 addres:updatedUser.addres,
                 city:updatedUser.city,
               
                
            },
        };
      

    }catch{
        throw e;
    }
};
const deleteUserMany = async(ids)=>{
    try{
        
        const user = await User.deleteMany({ _id: { $in: ids } });
        
          if (user.deletedCount === 0) {
            return {
                status: "error",
                message: "Không tìm thấy sản phẩm nào để xoá!",
            };
        }
       

        return {
            status: "success",
            message: `Đã xoá ${user.deletedCount} người dùng thành công!`,
        };  
    }catch{
        throw e;
    }
};
const deleteUser = async(id ,data)=>{
    try{
        const user = await User.findById(id);
        if (!user) {
            return {
                status: "error",
                message: "Không tìm thấy người dùng để xoá!",
            };
        } 
        await user.deleteOne();

        return {
            status: "success",
            message: "Xoá người dùng thành công!",
        };  
    }catch{
        throw e;
    }
};
const getAllUser = async () => {
    try {
        const users = await User.find({}, "-password"); 
        return users;
    } catch (error) {
        console.error("Error in getAllUsers Service:", error);
        throw error; 
    }
};
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId, "-password"); // Lấy user theo ID và ẩn password
        return user;
    } catch (error) {
        console.error("Error in getUserById Service:", error);
        throw error;
    }
};


export default {
    CreateUser,
    LoginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getUserById,
    deleteUserMany
    
};

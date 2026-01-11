import User from "../models/UserModel.js";
import UserServices from "../services/UserServices.js";
import { refreshTokenService } from "../utils/token.js";
import cookieParser  from 'cookie-parser'
const createUser = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        const { name, email, password, confirmPassword, phone, isAdmin} = req.body;

        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(400).json({
                status: "ERR",
                message: "Tất cả các trường đều là bắt buộc!",
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "ERR",
                message: "Email không hợp lệ!",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "Mật khẩu xác nhận không khớp!",
            });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "ERR",
                message: "Email đã được sử dụng!",
            });
        }
        // Gửi dữ liệu sang service để tạo user
        const result = await UserServices.CreateUser({
            name,
            email,
            password,
            phone,
            isAdmin,
           

        });    
        return res.status(201).json(result);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi server: " + e.message,
        });
    }
};
const loginUser = async(req,res) =>{
   try{
    const {email , password} = req.body;
    if(!email|| !password){
        return res.status(400).json({
                status: 'ERR',
                message: 'Email và mật khẩu là bắt buộc!',
            });
    }
     const result = await UserServices.LoginUser(email, password);
        if (result.status === 'ERR') {
            return res.status(400).json(result);
        }
        const { refreshToken , ...newReponse} = result;
        res.cookie('refreshToken'  , refreshToken, {
            httpOnly : true,
            secure :false ,
            samesite : 'strict'
        });
        return res.status(200).json(newReponse);
   } catch(e){
    return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server: ' + e.message,
        });
    }

   }
const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        console.log("Dữ liệu cập nhật:", req.body)
       const result = await UserServices.updateUser(id ,req.body);
       if (result.status === "error") {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);     
    } catch (e) {
        return res.status(500).json({
            status: "error",
            message: "Lỗi server: " + e.message,
        });
    }
};
 const deleteUser = async (req, res) => {
    try {
       const { id } = req.params;
       console.log(id);

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Thiếu ID người dùng!',
            });
        }

        const result = await UserServices.deleteUser(id);

        if (result.status === "error") {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);    
    } catch (e) {
        return res.status(500).json({
            status: "error",
            message: "Lỗi server: " + e.message,
        });
    }
};
 const deleteUsermany = async (req, res) => {
    try {
        console.log('Raw req.body:', req.body);
       const {ids}   = req.body;
       console.log("IDs nhận được:", ids);

         if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Danh sách ID người dùng không hợp lệ!',
            });
        }

        const result = await UserServices.deleteUserMany(ids);

        if (result.status === "error") {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);    
    } catch (e) {
        return res.status(500).json({
            status: "error",
            message: "Lỗi server: o day " + e.message,
        });
    }
};
 const getAllUsers = async (req, res) => {
    try {
        const users= await UserServices.getAllUser();
        return res.status(200).json({
            status: "success",
            results: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
const getUserDetail = async (req, res) => {
    try {
        const { id } = req.params; 
        const user = await UserServices.getUserById(id );

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        return res.status(200).json({ status: "success", data: user });
    } catch (error) {
        console.error("Error in getUserDetail Controller:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: "error",
        message: "No refresh token provided",
      });
    }

    const response = await refreshTokenService(refreshToken);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Refresh token expired or invalid",
    });
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie('refresh_token')
    return res.status(200).json({
        status: 'ok',
        message :`logout successfully`
    })
   

    
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "log-out user loi roi ",
    });
  }
};
export const uploadAvatar = async (req, res) => {
  try {
    // Kiểm tra file có được gửi không
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được tải lên!' });
    }

    const userId = req.params.id;
    console.log('upload ', userId)
    const user = await User.findById(userId);

    // Kiểm tra người dùng tồn tại
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }

    // Tạo đường dẫn tĩnh cho avatar (trùng với configViewEngine)
    const avatarUrl = `/api/v1/public/${req.file.filename}`;
    user.avatar = avatarUrl;

    await user.save();

    return res.status(200).json({
      message: 'Cập nhật avatar thành công!',
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Lỗi máy chủ: ${error.message}` });
  }
};


export default {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserDetail,
   refreshToken,
   logoutUser,
   uploadAvatar,
   deleteUsermany,

};

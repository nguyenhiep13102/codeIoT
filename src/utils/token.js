import jwt from 'jsonwebtoken';
import User from "../models/UserModel.js";

export const generateAccessToken = (userId,isAdmin )=> {
    console.log('userId',userId)
    console.log('isAdmin:', isAdmin);
    return jwt.sign({id : userId ,isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
    });
};
export const generateRefreshToken = async (userId) => {
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d", // Hạn 7 ngày
    });

    
    await User.findByIdAndUpdate(userId, { refreshToken });

    return refreshToken;
};
export const refreshTokenService = async (refreshToken) => {
    try {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }

        
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error("User not found");
        }

        const newAccessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" } 
        );

        return { status: "success", accessToken: newAccessToken };
    } catch (error) {
        throw new Error(error.message || "Invalid refresh token");
    }
};
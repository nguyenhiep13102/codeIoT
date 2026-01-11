import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    phone: { type: String, required: true },
    addres: {type: String},
    city : {type: String},
    avatar: {type : String },
    access_token: { type: String },
    refresh_token: { type: String },
  },
  {
    timestamps: true,
  }
);

// Tạo và xuất mô hình người dùng
const User = mongoose.model('User', userSchema);
export default User;

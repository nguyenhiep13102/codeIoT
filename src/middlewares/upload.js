import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import appRoot from 'app-root-path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(appRoot.path, 'src/uploads/image');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload ảnh jpeg, jpg, png!'));
    }
  }
});

export default upload;

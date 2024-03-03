import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // For
import path from 'path';
// Multer configuration for handling file uploads
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`; // Generate unique filename
    cb(null, uniqueFileName);
  },
});
export const upload = multer({ storage: storage });

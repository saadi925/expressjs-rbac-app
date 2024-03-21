import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars');
  },
  filename: function (req, file, cb) {
    console.log(file);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

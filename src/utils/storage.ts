// var express = require('express');
// var router = express.Router();
// var _ = require('lodash');
// var path = require('path');
// var multer = require('multer');
// var AvatarStorage = require('../utils/avatar.storage');

// var storage = AvatarStorage({
// square: true,
// responsive: true,
// greyscale: true,
// quality: 90
// });

// var limits = {
// files: 1, // allow only 1 file per request
// fileSize: 10 * 1024 * 1024, // 1 MB (max file size)
// };

// var fileFilter = function(req : any, file : any, cb : any) {
// var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

// if (_.includes(allowedMimes, file.mimetype)) {
// // allow supported image files
// cb(null, true);
// } else {
// // throw error for invalid files
// cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
// }
// };

// // setup multer
// export var upload = multer({
// storage: storage,
// limits: limits,
// fileFilter: fileFilter
// });
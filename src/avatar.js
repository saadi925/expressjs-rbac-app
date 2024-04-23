import express from 'express';
import path from 'path';
import multer from 'multer';
import { authMiddleware } from './middleware/authMiddleware';
import { upload } from './utils/storage';
import _ from 'lodash';
const r = express.Router();
r.post('/avatar', authMiddleware, upload.single('avatar') ,  function(req, res, next) {

    try {
        var files;
    var file = req.file.filename;
    var matches = file.match(/^(.+?)_.+?\.(.+)$/i);
    
    if (matches) {
    files = _.map(['lg', 'md', 'sm'], function(size) {
    return matches[1] + '_' + size + '.' + matches[2];
    });
    } else {
    files = [file];
    }
    
    files = _.map(files, function(file) {
    var port = req.app.get('port');
    var base = req.protocol + '://' + req.hostname + (port ? ':' + port : '');
    var url = path.join(req.file.baseUrl, file).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');
    
    return (req.file.storage == 'local' ? base : '') + '/' + url;
    });
    
    res.json({
    images: files
    });
    } catch (error) {
       console.log(error);
       res.status(500).json({error: error.message}); 
    }
    
    });
export { r as avatarUploadRoutes };
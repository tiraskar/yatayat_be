const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  // TODO Update the Location
  destination: 'assets',
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    callback(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const documentFileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpg|jpeg|png|gif|svg|JPG|JPEG|webp|mp4)$/;

  if (!file.originalname.match(allowedExtensions)) {
    req.fileValidationError = 'You can upload only image file!';
    return cb(null, false, new Error('You can upload only image file!'));
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // for 50mb
  }
}).array('attachment');

const individual = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // for 5mb
  }
});

module.exports = {
  upload /*: [upload, handleVideoCompressionInUpload]*/,
  individual
};

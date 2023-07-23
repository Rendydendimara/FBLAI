const multer = require('multer');

const filterFile = (req, file, cb) => {
  if (file.mimetype.includes('text/csv')) {
    cb(null, true);
  } else {
    cb('Harap unggah file type .csv', false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/csv');
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const newFileName = `${timestamp}-${file.originalname
      .split(' ')
      .join('_')}`;
    cb(null, newFileName);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 30099999, //  30.099999 MB
  },
  // fileFilter: filterFile,
});

module.exports = { uploadFile };

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/product'); 
    },
    filename: (req, file, cb) => {
        const name = Date.now() + "_" + file.originalname; 
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    cb(null, true); 
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;

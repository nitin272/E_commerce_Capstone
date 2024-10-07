const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/product'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const name = Date.now() + "_" + file.originalname; // Unique filename
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    // Implement file filtering if needed (e.g., limit file types)
    cb(null, true); // Accept all files for now
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;

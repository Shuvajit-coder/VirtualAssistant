// middleware/multer.js
import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public"); // folder name
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


// Upload instance
const upload = multer({
    storage,
});

export default upload;
import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/categories', // Folder where images will be saved
    filename: (req, file, cb) => {
        console.log(file);
        // create a unique filename: category-smartwatch.jpg
        cb(null, `${file.fieldname}-${req.body.name}${path.extname(file.originalname)}`);
    }
})

// Check file type
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Error: Images Only (jpeg, jpg, png, webp)'));
    }
};

// Upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Limit 5MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

export default upload;
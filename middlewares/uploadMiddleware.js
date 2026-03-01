import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {// Folder where images will be saved
        let folder = './uploads/';

        if (file.fieldname === 'category') {
            folder += 'categories';

        } else if (file.fieldname === 'product') {
            folder += 'products';
        }

        // Create folder if it doesn't exist
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },
    filename: (req, file, cb) => {
        // create a unique filename: category-smartwatch.jpg
        const name = (req.body.name || req.body.title || 'uploads').replace(/\s+/g, '-').toLowerCase();
        cb(null, `${file.fieldname}-${name}-${Date.now()}${path.extname(file.originalname)}`);
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
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

export default upload;
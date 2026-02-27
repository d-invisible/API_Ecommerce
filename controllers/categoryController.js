import Category from "../schema/categorySchema.js";


const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // chekc if file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        // The path where the image is stored
        const imageFileName = req.file.filename;

        const newCategory = await Category.create({
            name,
            image: imageFileName
        });

        res.status(201).json({ success: true, message: "Category created successfully", category: newCategory });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({ success: true, categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export { createCategory, getAllCategory };
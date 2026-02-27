import Product from "../schema/productSchema.js";


const createProduct = async (req, res) => {
    try {
        const { title, description, seller, price, category, stock } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const images = req.files.map(file => file.filename);

        const newProduct = await Product.create({
            title,
            description,
            seller,
            price,
            category,
            stock,
            images
        });

        res.status(201).json({ success: true, message: "Product created successfully", product: newProduct });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export { createProduct };
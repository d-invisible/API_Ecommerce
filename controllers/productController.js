import Category from "../schema/categorySchema.js";
import Product from "../schema/productSchema.js";


const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const images = req.files.map(file => file.filename);

        const newProduct = await Product.create({
            title,
            description,
            seller: req.user.id,
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

const getAllProducts = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const queryCategory = req.query.category || null;
        const searchQuery = req.query.search || null;

        let query;
        if (queryCategory) {
            const category = await Category.findOne({ name: queryCategory });
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
            query = { category: category._id };
        }

        if (searchQuery) {
            query = {
                ...query,
                title: { $regex: searchQuery, $options: "i" }
            }
        }



        const products = await Product.find(query)
            .select('-description -seller -category -__v')
            .skip(skip)
            .limit(limit)
            .lean();

        const formatedProducts = products.map((product) => {
            const numberOfReviews = product.reviews.length;
            const sumOfRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
            const avgRating = numberOfReviews > 0 ? sumOfRatings / numberOfReviews : 0;
            return {
                ...product,
                images: product.images[0],
                reviews: {
                    numberOfReviews,
                    avgRating
                }
            }
        })

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true, message: "Products fetched successfully",
            products: formatedProducts,
            totalProducts,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPrevPage
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).select('-description -seller -category -__v').lean();
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const numberOfReviews = product.reviews.length;
        const sumOfRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = numberOfReviews > 0 ? sumOfRatings / numberOfReviews : 0;
        const formatedProduct = {
            ...product,
            images: product.images[0],
            reviews: {
                numberOfReviews,
                avgRating
            }
        }
        res.status(200).json({ success: true, message: "Product fetched successfully", product: formatedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const review = {
            user: req.user.id,
            rating,
            comment
        }
        product.reviews.push(review);
        await product.save();
        res.status(200).json({ success: true, message: "Review added successfully", review });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export { createProduct, getAllProducts, getProductById, deleteProduct, addReview };
import Cart from "../schema/cartSchema.js";
import Product from "../schema/productSchema.js";


const addProductToCart = async (req, res) => {

    try {

        const { productId, quantity } = req.body;

        const user = req.user;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }



        let cart = await Cart.findOne({ user: user.id });

        if (!cart) {
            console.log('new cart')
            if (product.stock < quantity) {
                return res.status(400).json({ message: `Product is out of stock, only ${product.stock} left` });
            }
            const newCart = await Cart.create({
                user: user.id,
                products: [
                    {
                        productId: productId,
                        quantity: quantity,
                        price: product.price,
                        image: product.images[0],
                        totalPrice: product.price * quantity
                    }
                ],
                totalCartPrice: product.price * quantity,
                totalProducts: 1
            });

            product.stock -= quantity;
            await product.save();
            return res.status(200).json({ message: "Product added to cart", cart: newCart });
        }

        const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId);



        if (productIndex !== -1) {
            console.log('existing product');
            cart.products[productIndex].quantity += quantity;
            cart.products[productIndex].totalPrice += product.price * quantity;

            if (product.stock < cart.products[productIndex].quantity) {
                console.log('outofstock in existing cart')
                return res.status(400).json({ message: `Product is out of stock, only ${product.stock} left` });
            }
        } else {
            console.log('new product');
            cart.products.push({
                productId: productId,
                quantity: quantity,
                price: product.price,
                image: product.images[0],
                totalPrice: product.price * quantity
            });

            if (product.stock < quantity) {
                console.log('outofstock in existing cart')
                return res.status(400).json({ message: `Product is out of stock, only ${product.stock} left` });
            }
        }

        cart.totalCartPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);
        cart.totalProducts = cart.products.length;

        product.stock -= quantity;
        await product.save();

        await cart.save();

        return res.status(200).json({ message: "Product added to cart", cart });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }


}

const incProductQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let cart = await Cart.findOne({ user: user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
            cart.products[productIndex].totalPrice += product.price;
            cart.totalCartPrice += product.price;

            if (cart.products[productIndex].quantity > product.stock) {
                return res.status(400).json({ message: `Product is out of stock, only ${product.stock} left` });
            }

            product.stock -= 1;
            await product.save();

            await cart.save();
            return res.status(200).json({ message: "Product quantity increased", cart });
        }
        return res.status(404).json({ message: "Product not found in cart" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const decProductQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let cart = await Cart.findOne({ user: user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId);
        if (productIndex !== -1 && cart.products[productIndex].quantity > 0) {
            cart.products[productIndex].quantity -= 1;
            cart.products[productIndex].totalPrice -= product.price;
            cart.totalCartPrice -= product.price;

            if (cart.products[productIndex].quantity === 0) {
                cart.products.splice(productIndex, 1);
                cart.totalProducts -= 1;
                cart.totalCartPrice -= product.price;
            }

            product.stock += 1;
            await product.save();

            await cart.save();
            return res.status(200).json({ message: "Product quantity decreased", cart });
        }
        return res.status(404).json({ message: "Product not found in cart" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const deleteProductFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId.toString());
        if (productIndex !== -1) {
            product.stock += cart.products[productIndex].quantity;
            await product.save();

            cart.totalCartPrice -= cart.products[productIndex].totalPrice;
            cart.totalProducts -= 1;
            cart.products.splice(productIndex, 1);



            await cart.save();
            return res.status(200).json({ message: "Product deleted from cart", cart });
        }
        return res.status(404).json({ message: "Product not found in cart" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getCart = async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.findOne({ user: user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        return res.status(200).json({ message: "Cart found", cart });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const clearCart = async (req, res) => {
    try {
        const user = req.user;

        const cart = await Cart.findOne({ user: user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products.forEach(async (prod) => {
            const product = await Product.findById(prod.productId);
            product.stock += prod.quantity;
            await product.save();
        });

        const deletedCart = await Cart.deleteOne({ user: user.id });



        if (!deletedCart) {
            return res.status(404).json({ message: "Cart not found" });
        }



        return res.status(200).json({ message: "Cart cleared", deletedCart });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export { addProductToCart, incProductQuantity, decProductQuantity, deleteProductFromCart, getCart, clearCart };
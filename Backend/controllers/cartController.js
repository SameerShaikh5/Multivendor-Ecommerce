import { TryCatch } from "../middlewares/errorMiddleware.js";
import Cart from "../models/CartModel.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import Product from "../models/ProductModel.js";


export const getCart = TryCatch(
    async (req, res, next) => {

        const cart = await Cart.findOne({ user_id: req.user._id }).populate("items.product_id")


        if (!cart) {
            return res.status(200).json({
                success: true,
                data: { items: [] }
            });
        }



        return res.status(200).json({
            success: true,
            data: {
                ...cart.toObject(),
                shipping: Number(process.env.SHIPPING),
            }
        });

    }
)


export const addToCart = TryCatch(async (req, res, next) => {
    const { product_id, quantity } = req.body;

    if (!quantity || quantity < 1) {
        throw new ErrorHandler(400, "Invalid quantity");
    }

    // check if product exists
    const product = await Product.findById(product_id)

    if (!product) {
        throw new ErrorHandler(404, "Product not found");
    }



    let cart = await Cart.findOne({ user_id: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user_id: req.user._id,
            items: [{ product_id, quantity, price: product.price, vendor_id: product.vendor_id }]
        });
    } else {
        const existingItem = cart.items.find(
            item => item.product_id.toString() === product_id
        );

        if (existingItem) existingItem.quantity += quantity;
        else cart.items.push({ product_id, quantity, price: product.price, vendor_id: product.vendor_id });

        await cart.save();
    }

    res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: cart
    });
});



export const removeFromCart = TryCatch(
    async (req, res, next) => {
        const { productId } = req.params

        const cart = await Cart.findOne({ user_id: req.user._id })
        if (!cart) {
            throw new ErrorHandler(404, "Cart not found");
        }

        const itemIndex = cart.items.findIndex(item => item.product_id.toString() === productId);

        if (itemIndex === -1) {
            throw new ErrorHandler(404, "Product not found in cart");
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart
        })
    }
)


export const increaseQuantity = TryCatch(
    async (req, res, next) => {
        const { productId } = req.params

        const cart = await Cart.findOne({ user_id: req.user._id })
        if (!cart) {
            throw new ErrorHandler(404, "Cart not found");
        }

        const item = cart.items.find(item => item.product_id.toString() === productId);

        if (!item) {
            throw new ErrorHandler(404, "Product not found in cart");
        }

        item.quantity += 1;
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product quantity increased",
            data: cart
        })
    }
)

export const decreaseQuantity = TryCatch(
    async (req, res, next) => {
        const { productId } = req.params

        const cart = await Cart.findOne({ user_id: req.user._id })

        if (!cart) {
            throw new ErrorHandler(404, "Cart not found");
        }

        const item = cart.items.find(item => item.product_id.toString() === productId);

        if (!item) {
            throw new ErrorHandler(404, "Product not found in cart");
        }

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.items = cart.items.filter(
                i => i.product_id.toString() !== productId
            );
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product quantity updated",
            data: cart
        });

    }
)


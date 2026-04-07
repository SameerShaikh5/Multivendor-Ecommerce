import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api/productApi";
import toast from "react-hot-toast";
import { useCart } from "../ContextApi/CartContext.jsx";

const ProductDetails = () => {
    const { productId } = useParams();
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(null);
    /* ================================
       FETCH PRODUCT
    ================================ */
    const { data, isLoading, isError } = useQuery({
        queryKey: ["product", productId],
        queryFn: fetchProductById,
        enabled: !!productId,
        staleTime: 1000 * 60 * 5,
    });

    /* ================================
       TRANSFORM BACKEND DATA
    ================================ */
    const product = data?.data
        ? {
            id: data.data._id,
            name: data.data.name,
            description: data.data.description,
            price: data.data.price,
            images:
                data.data.images?.map((img) => img.secure_url) || [],
        }
        : null;

    /* ================================
       SET DEFAULT IMAGE
    ================================ */
    useEffect(() => {
        if (!data?.data?.images?.length) return;

        const thumbnail =
            data.data.images.find((img) => img.isThumbnail)?.secure_url ||
            data.data.images[0].secure_url;

        setActiveImage(thumbnail);
    }, [data?.data?._id]);

    /* ================================
       QUANTITY
    ================================ */
    const increaseQty = () => setQuantity((prev) => prev + 1);

    const decreaseQty = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1);
    };

    /* ================================
       STATES
    ================================ */
    if (isLoading)
        return <div className="text-center py-20">Loading product...</div>;

    if (isError || !product)
        return (
            <div className="text-center py-20 text-red-500">
                Failed to load product
            </div>
        );


    const handleAddtoCart = async () => {
        const res = await addToCart({
            productId: product.id,
            quantity,
        });

        if (res.success) {
            toast.success("Added to cart ");
        } else {
            toast.error(res.message);
        }
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Images */}
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-md">

                        {/* Main Image */}
                        <div className="aspect-square bg-white border border-gray-100 rounded-3xl overflow-hidden mb-4">
                            {activeImage ? (
                                <img
                                    src={activeImage}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                    alt={product.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No image available
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 justify-center">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 rounded-xl cursor-pointer border
                  ${activeImage === img
                                            ? "border-indigo-600"
                                            : "border-gray-200"
                                        }`}
                                >
                                    <img
                                        src={img}
                                        className="w-full h-full object-cover rounded-xl"
                                        alt="thumbnail"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-4">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 mb-6">{product.description}</p>

                    <div className="text-2xl font-extrabold text-indigo-600 mb-6">
                        ₹{product.price.toLocaleString()}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="font-semibold">Quantity</span>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={decreaseQty}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                            >
                                −
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button
                                onClick={increaseQty}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleAddtoCart}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-indigo-600 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
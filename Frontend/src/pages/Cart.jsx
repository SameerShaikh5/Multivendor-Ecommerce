import React, { useEffect } from 'react'
import { useCart } from '../ContextApi/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

const Cart = () => {

    const navigate = useNavigate()
    const {
        cartItems,
        incrementQty,
        decrementQty,
        removeFromCart,
        shippingCost,
    } = useCart();

   

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        if (cartItems.length > 0) return navigate("/checkout")
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">

            <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* CART ITEMS */}
                <section className="lg:col-span-2 space-y-6">

                    {cartItems.length === 0 && (
                        <p className="text-gray-500">Your cart is empty.</p>
                    )}

                    {cartItems.map(item => (
                        <CartItem item={item} key={item.id} incrementQty={incrementQty} decrementQty={decrementQty} removeFromCart={removeFromCart} />
                    ))}
                </section>

                {/* ORDER SUMMARY */}
                <aside className="bg-white border border-gray-100 rounded-2xl p-6 h-fit">

                    <h3 className="font-semibold mb-6">Order Summary</h3>

                    <div className="space-y-4 text-sm text-gray-600 mb-6">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{shippingCost}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-4 flex justify-between font-semibold text-gray-900">
                            <span>Total</span>
                            <span>₹{(shippingCost + subtotal).toLocaleString()}</span>
                        </div>
                    </div>

                    <button onClick={handleCheckout} className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition">
                        Proceed to Checkout
                    </button>

                </aside>

            </div>
        </main>
    )
}

export default Cart;

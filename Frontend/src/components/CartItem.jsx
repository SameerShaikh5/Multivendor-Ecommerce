import React from 'react'

const CartItem = ({item, decrementQty, incrementQty, removeFromCart}) => {

    return (
        <>
            <div
                
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-4"
            >

                <img src={item.image} alt={item.name} loading='lazy' className="w-24 h-24 bg-gray-100 rounded-xl" />

                <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                        {item.name}
                    </h3>

                    <div className="flex items-center gap-6 mt-4">

                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => decrementQty(item.productId)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                                −
                            </button>
                            <span className="px-4 text-sm">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => incrementQty(item.productId)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>

                        {/* Remove */}
                        <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-sm text-gray-500 hover:text-red-500"
                        >
                            Remove
                        </button>
                    </div>
                </div>

                <div className="font-semibold text-indigo-600 sm:text-right">
                    ₹{(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        </>
    )
}

export default CartItem
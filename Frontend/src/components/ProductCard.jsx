import { Link } from "react-router-dom";
import { useCart } from "../ContextApi/CartContext.jsx";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {

  const { addToCart } = useCart();
  const quantity = 1

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
    <div className="bg-white border border-gray-100 rounded-3xl p-4 hover:shadow-md transition">

      <div className="aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}

            loading="lazy"
            className="w-full h-full object-cover hover:scale-110 transition duration-500"
          />
        </Link>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1">
        {product.name}
      </h3>

      {product.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-lg font-extrabold text-indigo-600">
          ₹{product.price}
        </span>

        <button className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition text-md font-semibold" onClick={handleAddtoCart}>
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

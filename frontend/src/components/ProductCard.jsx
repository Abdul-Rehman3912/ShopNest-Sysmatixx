import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#18181b] shadow-md transition-transform hover:-translate-y-2 hover:shadow-xl">
      <img src={product.imageUrl} alt={product.name} className="w-full h-60 object-cover transition-transform duration-500" />
      <div className="p-5 flex flex-col justify-between">
        <h3 className="text-white text-base truncate">{product.name}</h3>
        <p className="text-orange-400 font-bold text-lg mt-3">${product.price}</p>
        <Link
          to={`/product/${product._id}`}
          className="mt-4 inline-block text-center text-white font-semibold text-sm rounded-2xl px-6 py-3 transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

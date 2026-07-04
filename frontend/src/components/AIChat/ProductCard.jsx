import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {product.imageUrl && (
          <div className="h-32 overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-3">
          <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
          <div className="flex items-center justify-between mt-1">
            <span className="text-blue-600 font-bold">${product.price}</span>
            {product.stock > 0 ? (
              <span className="text-xs text-green-600">In Stock</span>
            ) : (
              <span className="text-xs text-red-500">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
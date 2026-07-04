import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { axiosInstance } from "../libs/axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          qty: 1,
        }),
      );
      alert("Successfully added to your cart!");
    }
  };

  if (loading)
    return (
      <div className="text-center my-24 text-orange-400">Loading Product...</div>
    );
  if (!product)
    return (
      <div className="text-center my-24 text-red-500">Product Not Found</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-0 sm:p-5">
      <div className="text-sm text-slate-400 mb-5 break-words">
        <Link to="/" className="text-orange-400">Home</Link> / <Link to="/shop" className="text-orange-400">Shop</Link> / {product.category} / <span className="text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 bg-[#18181b] p-4 rounded-lg border border-slate-700 sm:p-6 md:grid-cols-2 lg:gap-12 lg:p-8">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full max-h-[520px] rounded-lg object-cover shadow-xl" />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2 text-white sm:text-3xl">{product.name}</h2>

          <p className="text-2xl text-orange-400 font-bold my-4 sm:text-3xl">${product.price.toFixed(2)}</p>

          <div className="mb-6">
            <h4 className="text-white font-semibold mb-2">Product Description</h4>
            <p className="text-slate-400 leading-7">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleAddToCart} className="flex-1 px-5 py-3 text-white text-base rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 font-semibold sm:px-6 sm:py-4 sm:text-lg">Add to Shopping Cart</button>
          </div>

          <p className={`mt-4 font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} units available)` : "Temporarily Out of Stock"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


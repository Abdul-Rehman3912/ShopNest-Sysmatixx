import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { axiosInstance } from "../libs/axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/products");
        setProducts(res.data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="px-0 sm:px-4">
      <div className="relative overflow-hidden rounded-xl px-5 py-16 text-center mb-10 bg-gradient-to-br from-slate-900 via-slate-800 to-black shadow-2xl border border-white/5 sm:px-10 sm:py-20 lg:p-24 lg:mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Welcome to ShopNest</h1>
        <p className="mt-4 text-base text-slate-300 sm:text-lg">Discover the best products at unbeatable prices.</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 mt-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import AIChat from "../components/AIChat/AIChat";
import { axiosInstance } from "../libs/axios.js";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-0 sm:px-4 relative min-h-screen">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg px-4 py-3 rounded-lg bg-[#18181b] border border-slate-700 text-white text-base focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <AIChat />
    </div>
  );
};

export default Shop;

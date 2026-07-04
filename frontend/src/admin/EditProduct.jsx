import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../libs/axios";

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/products/${id}`);
        const data = res.data;
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    if (image) data.append("image", image);

    try {
      const res = await axiosInstance.put(`/api/products/${id}`, data, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.status === 200) {
        alert("Product updated successfully!");
        navigate("/admin/products");
      } else {
        alert(res.data?.message || "Error updating product");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        background: "#18181b",
        width: "100%",
        padding: "clamp(20px, 5vw, 40px)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>Edit Product</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          required
          rows="4"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Price"
          required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Category"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Stock"
          required
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          style={inputStyle}
        />
        <div
          style={{
            padding: "15px",
            border: "1px dashed #f97316",
            borderRadius: "8px",
          }}
        >
          <label
            style={{ display: "block", marginBottom: "10px", color: "#a1a1aa" }}
          >
            Replace Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ color: "#fff" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-block text-center text-white font-semibold text-sm rounded-2xl px-6 py-3 transition-transform duration-300 transform bg-gradient-to-br from-orange-500 to-orange-600 shadow-md hover:-translate-y-1"
          style={{ marginTop: "10px" }}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  background: "#09090b",
  border: "1px solid #27272a",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
};
export default EditProduct;

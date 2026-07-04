import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../libs/axios";

const AddProduct = () => {
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

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("image", image);

    try {
      await axiosInstance.post("/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Product created successfully with Cloudinary Image URL!");
      navigate("/shop");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error creating product");
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
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>
        Add New Product
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Product Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          required
          rows="4"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Price"
          required
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Category"
          required
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          required
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
            Upload Product Image (Cloudinary)
          </label>
          <input
            type="file"
            accept="image/*"
            required
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
          {loading ? "Uploading & Creating..." : "Publish Product"}
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

export default AddProduct;

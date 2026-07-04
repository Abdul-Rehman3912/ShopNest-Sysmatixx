import React, { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";
import { axiosInstance } from "../libs/axios";

const OrderSuccess = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const finalizeOrder = async () => {
      const savedData = localStorage.getItem("pendingOrderDetails");

      if (!savedData) {
        setIsSaving(false);
        return;
      }

      try {
        const { items, totalAmount, address } = JSON.parse(savedData);

        const formattedAddress = {
          fullName: address.fullName,
          street: address.street,
          city: address.city,
          postCode: address.postalCode,
          country: address.country,
        };

        await axiosInstance.post(
          "/api/orders",
          {
            items: items,
            totalAmount: totalAmount,
            address: formattedAddress,
            paymentId: sessionId || "stripe_success_" + Date.now(),
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );

        dispatch(clearCart());
        localStorage.removeItem("pendingOrderDetails");
      } catch (err) {
        console.error("Failed to record order in DB:", err);
        console.log("Server Error Response Data:", err.response?.data);
        setError(
          "Payment was successful, but we had trouble updating your dashboard.",
        );
      } finally {
        setIsSaving(false);
      }
    };

    if (user) {
      finalizeOrder();
    }
  }, [user, sessionId, dispatch]);

  const containerStyle = {
    maxWidth: "600px",
    margin: "clamp(20px, 8vw, 50px) auto",
    width: "100%",
    padding: "clamp(28px, 7vw, 50px) clamp(18px, 5vw, 30px)",
    background: "#18181b",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      {isSaving ? (
        <>
          <h2
            style={{ fontSize: "2rem", marginBottom: "20px", color: "#f59e0b" }}
          >
            Processing Order...
          </h2>
          <p style={{ color: "#a1a1aa" }}>
            Securing your cart and finalizing setup. Please don't close this
            window.
          </p>
        </>
      ) : error ? (
        <>
          <h2
            style={{ fontSize: "2rem", marginBottom: "20px", color: "#ef4444" }}
          >
            Something Went Wrong
          </h2>
          <p style={{ color: "#a1a1aa", marginBottom: "40px" }}>{error}</p>
          <Link to="/shop" className="inline-block text-center text-white font-semibold text-sm rounded-2xl px-6 py-3 transition-transform duration-300 transform bg-gradient-to-br from-orange-500 to-orange-600 shadow-md hover:-translate-y-1">
            Return to Shop
          </Link>
        </>
      ) : (
        <>
          <h2
            style={{
              fontSize: "2.5rem",
              marginBottom: "20px",
              color: "#10b981",
            }}
          >
            Payment Successful!
          </h2>
          <p
            style={{
              color: "#a1a1aa",
              fontSize: "1.2rem",
              marginBottom: "40px",
            }}
          >
            Thank you for your order. We have securely received your payment and
            registered your items into your profile.
          </p>
          <Link to="/shop" className="inline-block text-center text-white font-semibold text-sm rounded-2xl px-6 py-3 transition-transform duration-300 transform bg-gradient-to-br from-orange-500 to-orange-600 shadow-md hover:-translate-y-1">
            Continue Shopping
          </Link>
        </>
      )}
    </div>
  );
};

export default OrderSuccess;

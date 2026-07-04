import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../libs/axios";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentLoading, setPaymentLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const handleHostedCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await axiosInstance.post("/api/payment/order", {
        amount: totalPrice,
        cartItems: cartItems,
        shippingAddress: address,
        userId: user._id,
      });

      const orderData = response.data;

      if (orderData.success && orderData.url) {
        localStorage.setItem(
          "pendingOrderDetails",
          JSON.stringify({
            items: cartItems,
            totalAmount: totalPrice,
            address: address,
          }),
        );
        window.location.href = orderData.url;
      } else {
        alert("Could not start payment transaction.");
        setPaymentLoading(false);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to initiate payment.";
      alert(errorMessage);
      setPaymentLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleHostedCheckout} className="shipping-form">
          <h3>Shipping Address</h3>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Street"
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            required
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Postal Code"
            required
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Country"
            required
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
          />

          <div className="checkout-summary">
            <h4>Total to Pay: ${totalPrice.toFixed(2)}</h4>
            <button type="submit" disabled={paymentLoading} className="inline-block w-full text-center text-white font-semibold text-sm rounded-2xl px-6 py-3 transition-transform duration-300 transform bg-gradient-to-br from-orange-500 to-orange-600 shadow-md hover:-translate-y-1 sm:w-auto">
              {paymentLoading ? "Processing..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

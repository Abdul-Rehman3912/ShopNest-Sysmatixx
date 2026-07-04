import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, addToCart } from "../redux/cartSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (item, qty) => {
    if (qty > 0) {
      dispatch(addToCart({ ...item, qty }));
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link to="/shop" className="text-orange-400">
            Go Shopping
          </Link>
        </p>
      ) : (
        <div className="flex gap-6 mt-6 flex-col lg:flex-col lg:gap-10">
          <div className="flex-2 flex flex-col gap-5 w-full">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col bg-[#18181b] p-4 rounded-lg shadow-md border border-white/5 transition-transform hover:translate-x-1 sm:flex-row sm:items-center sm:p-5"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="mb-4 h-48 w-full rounded-md object-cover sm:mb-0 sm:mr-6 sm:h-28 sm:w-28"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-white text-lg">{item.name}</h4>
                  <p className="text-slate-300">${item.price}</p>
                  <div className="flex items-center gap-4 my-3">
                    <button
                      onClick={() => handleUpdateQty(item, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-md text-white hover:bg-orange-500 hover:border-orange-500"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.qty}</span>
                    <button
                      onClick={() => handleUpdateQty(item, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-md text-white hover:bg-orange-500 hover:border-orange-500"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="px-4 py-2 rounded-md font-semibold text-sm border border-red-400/30 text-red-500 bg-transparent hover:bg-red-500 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-[#18181b] p-5 rounded-lg shadow-md border border-white/5 lg:sticky lg:top-24 lg:p-6">
            <h3 className="text-xl font-semibold mb-4">
              Total: ${totalPrice.toFixed(2)}
            </h3>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full px-4 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

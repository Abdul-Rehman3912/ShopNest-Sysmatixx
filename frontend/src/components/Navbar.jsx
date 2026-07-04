import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-white/5 shadow-lg sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-12 lg:py-5 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
      <div className="navbar-brand">
        <Link to="/" className="flex items-center gap-2 text-white text-xl sm:text-2xl font-bold">
          <img
            src="/ShopNestLogo.png"
            alt="ShopNest"
            style={{
              height: "36px",
              width: "36px",
              borderRadius: "8px",
              objectFit: "cover",
              filter: "drop-shadow(0 2px 8px rgba(249, 115, 22, 0.35))",
            }}
          />
          ShopNest
        </Link>
      </div>
      <ul className="flex w-full flex-wrap items-center justify-center gap-3 text-sm sm:gap-5 lg:w-auto lg:justify-end lg:gap-8 ">
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/cart">Cart ({cartItems.length})</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/profile">Hi, {user.name}</Link>
            </li>
            {user.role === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="px-3 py-2 sm:px-4 rounded-lg font-semibold text-sm border border-red-400/30 text-red-500 bg-transparent hover:bg-red-50/10"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

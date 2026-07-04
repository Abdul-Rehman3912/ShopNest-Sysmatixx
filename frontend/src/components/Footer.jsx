import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#09090b] px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:flex-wrap sm:text-left">
        <div>
          <h3 style={{ color: "#f97316", marginBottom: "10px" }}>ShopNest</h3>
          <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
            Premium E-Commerce Platform.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          <Link to="/about" style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
            About Us
          </Link>
          <Link to="/return" style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
            Return Policy
          </Link>
          <Link
            to="/disclaimer"
            style={{ color: "#a1a1aa", fontSize: "0.9rem" }}
          >
            Disclaimer
          </Link>
        </div>

        <div style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

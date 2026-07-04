import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../libs/axios";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await axiosInstance.get("/api/orders/myorders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          logout();
          navigate("/login");
        }

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto my-6 p-4 bg-[#18181b] rounded-lg border border-white/5 text-white sm:my-10 sm:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b border-white/10 pb-8 mb-8 gap-6">
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">My Profile</h2>
          <p className="text-slate-400 text-lg mb-1"><strong>Name:</strong> {user.name}</p>
          <p className="text-slate-400 text-lg mb-3"><strong>Email:</strong> {user.email}</p>
          <span className={`inline-block px-2 py-1 rounded-md font-bold ${user.role === 'admin' ? 'bg-orange-300/10 text-orange-400' : 'bg-emerald-300/10 text-emerald-400'}`}>{user.role?.toUpperCase()}</span>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 rounded-md font-semibold text-sm text-white bg-red-500 hover:bg-red-600">Logout</button>
      </div>

      <h3 className="text-orange-400 mb-5 text-lg">Order History</h3>

      {loading ? (
        <p className="text-slate-400">Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-[#09090b] p-6 rounded-md text-center border border-slate-800">
          <p className="text-slate-400 mb-4">You haven't placed any orders yet.</p>
          <Link to="/shop" className="inline-block px-4 py-2 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-[#09090b] p-4 rounded-lg border border-slate-800 flex flex-wrap justify-between items-center gap-4">
              <div className="min-w-0">
                <p className="text-slate-400 text-sm mb-1">Order ID: <span className="text-white">{order._id}</span></p>
                <p className="text-slate-400 text-sm mb-1">Placed On: <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                <p className="text-slate-400 text-sm">Total: <strong className="text-emerald-400">${order.totalAmount.toFixed(2)}</strong></p>
              </div>
              <div>
                <span className={`px-4 py-2 rounded-full font-bold ${order.status === 'Delivered' ? 'bg-emerald-300/10 text-emerald-400' : order.status === 'Shipped' ? 'bg-sky-300/10 text-sky-500' : 'bg-amber-300/10 text-amber-400'}`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

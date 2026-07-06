import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../libs/axios";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/getAll", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [user]);

  const updateStatus = async (id, role) => {
    try {
      const res = await axiosInstance.put(
        `/api/auth/${id}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      if (res.status === 200) {
        setUsers(users.map((u) => (u._id === id ? { ...u, role } : u)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>User Directory</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>EMAIL</th>
              <th style={thStyle}>ROLE</th>
              {/* <th style={thStyle}>JOINED</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={rowStyle}>
                <td style={tdStyle}>{u._id?.substring(0, 8)}...</td>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>
                  {u.role === "user" ? (
                    <select
                      onChange={(e) => updateStatus(u._id, e.target.value)}
                      value={u.role}
                      style={{
                        background: "#09090b",
                        color: "#fff",
                        padding: "6px",
                        border: "1px solid #27272a",
                        borderRadius: "4px",
                        outline: "none",
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span>{u.role?.toUpperCase()}</span>
                  )}
                </td>
                {/* <td style={tdStyle}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "40px auto",
  width: "100%",
  padding: "clamp(18px, 4vw, 30px)",
  background: "#18181b",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.05)",
  color: "#fafafa",
};
const tableStyle = {
  width: "100%",
  minWidth: "720px",
  borderCollapse: "collapse",
};
const rowStyle = { borderBottom: "1px solid rgba(255,255,255,0.1)" };
const thStyle = {
  padding: "15px",
  textAlign: "left",
  color: "#a1a1aa",
  fontSize: "0.9rem",
};
const tdStyle = { padding: "15px", textAlign: "left" };

export default AdminUsers;

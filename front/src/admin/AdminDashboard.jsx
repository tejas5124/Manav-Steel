import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminId } = useParams(); // Get adminId from URL params
  //console.log(adminId);
  const [admin, setAdmin] = useState();
  const [error, setError] = useState("");
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❌ No token found. Redirecting to login...");
      navigate("/admin/login");
      return;
    }

    const fetchAdminData = async () => {
      try {
        console.log("🔄 Fetching admin details...");
        const response = await axios.get(`https://tejas.avishkar.digital/manav-steel/back/admin/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Admin data:", response.data);
        setAdmin(response.data);
      } catch (err) {
        console.error("❌ API Error:", err.response ? err.response.data : err.message);
        setError("Failed to fetch admin data.");
      }
    };

    fetchAdminData();
  }, [adminId, navigate]);
  
  //console.log("admin ka data :",admin);
  if (!admin) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard">
      <AdminSidebar admin={admin} />

      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="admin-info">
          <p><strong>Username:</strong> {admin.username}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

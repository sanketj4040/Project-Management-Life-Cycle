import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Call the backend API to authenticate admin
      const response = await authService.adminLogin({
        admin_id: adminId,
        password: pass
      });
      
      if (response && response.status === 'success') {
        // Successful login
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin-dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 401) {
        setError("Invalid User ID or Password!");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input 
          type="text" 
          placeholder="Admin ID" 
          value={adminId} 
          onChange={(e) => setAdminId(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={pass} 
          onChange={(e) => setPass(e.target.value)} 
          required 
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="login-error">{error}</div>
        <div className="login-link">
          Not an admin? <Link to="/">Go to Home</Link>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;

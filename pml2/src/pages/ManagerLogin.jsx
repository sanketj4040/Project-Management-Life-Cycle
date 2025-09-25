import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

function ManagerLogin() {
  const [managerId, setManagerId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Call the backend API to authenticate manager
      const response = await authService.managerLogin({
        manager_id: managerId,
        password: pass
      });
      
      if (response && response.status === 'success') {
        // Successful login
        localStorage.setItem("managerLoggedIn", "true");
        localStorage.setItem("managerName", response.data.name);
        localStorage.setItem("managerId", response.data.manager_id);
        navigate("/manager-dashboard");
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
        <h2>Manager Login</h2>
        <input 
          type="text" 
          placeholder="Manager ID" 
          value={managerId} 
          onChange={(e) => setManagerId(e.target.value)} 
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
          <div className="registration-note">
            Please contact the administrator for registration.
          </div>
          <Link to="/">Go to Home</Link>
        </div>
      </form>
    </div>
  );
}

export default ManagerLogin;
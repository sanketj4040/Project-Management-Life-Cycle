import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

function TeamMemberLogin() {
  const [teamMemberId, setTeamMemberId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Call the backend API to authenticate team member
      const response = await authService.teamMemberLogin({
        team_member_id: teamMemberId,
        password: pass
      });
      
      if (response && response.status === 'success') {
        // Successful login
        localStorage.setItem("teamLoggedIn", "true");
        localStorage.setItem("teamMemberId", response.data.team_member_id);
        localStorage.setItem("teamMemberName", response.data.name);
        
        // If this is a first-time login (not from registration), we'd typically fetch manager data
        // from the database, but for simplicity we'll use default values for now
        if (!localStorage.getItem("teamMemberManagerName")) {
          localStorage.setItem("teamMemberManagerId", "1");
          localStorage.setItem("teamMemberManagerName", "Default Manager");
          localStorage.setItem("teamMemberManagerDepartment", "IT");
        }
        
        navigate("/team-dashboard");
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
        <h2>Team Member Login</h2>
        <input 
          type="text" 
          placeholder="Team Member ID" 
          value={teamMemberId} 
          onChange={(e) => setTeamMemberId(e.target.value)} 
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

export default TeamMemberLogin;
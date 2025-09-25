import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TeamMemberDashboard() {
  const [myTasks, setMyTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if team member is logged in
    if (!localStorage.getItem("teamLoggedIn")) {
      navigate("/team");
      return;
    }

    // Initialize empty data arrays
    setProjects([]);
    setMyTasks([]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("teamLoggedIn");
    navigate("/team");
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setMyTasks(myTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Team Dashboard</h2>
        </div>
        <ul className="sidebar-nav">
          <li>
            <a 
              href="#" 
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("dashboard");
              }}
            >
              My Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeTab === "tasks" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("tasks");
              }}
            >
              My Tasks
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeTab === "projects" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("projects");
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeTab === "calendar" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("calendar");
              }}
            >
              Calendar
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeTab === "profile" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("profile");
              }}
            >
              My Profile
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        <div className="simple-header">
          <div className="header-nav">
            <a href="/">Home</a>
            <a href="/services">Services</a>
            <a href="/help">Help</a>
          </div>
          <div className="header-user">
            <span>Team Member</span>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            <div className="dashboard-welcome">
              <h2>Welcome!</h2>
              <p>Here's an overview of your tasks and projects.</p>
            </div>
            
            <div className="dashboard-summary">
              <div className="summary-section">
                <h3>Recent Activity</h3>
                <p>No recent activity to display.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="content-section">
            <h3>My Tasks</h3>
            <div className="task-stats">
              <div className="task-stat-item">
                <span className="stat-label">Total Tasks:</span>
                <span className="stat-value">{myTasks.length}</span>
              </div>
              <div className="task-stat-item">
                <span className="stat-label">Completed:</span>
                <span className="stat-value">{myTasks.filter(task => task.status === "Completed").length}</span>
              </div>
              <div className="task-stat-item">
                <span className="stat-label">In Progress:</span>
                <span className="stat-value">{myTasks.filter(task => task.status === "In Progress").length}</span>
              </div>
              <div className="task-stat-item">
                <span className="stat-label">Pending:</span>
                <span className="stat-value">{myTasks.filter(task => task.status === "Pending").length}</span>
              </div>
            </div>

            <div>
              <h4>Task List</h4>
              {myTasks.length === 0 ? (
                <p className="no-data">No tasks assigned yet.</p>
              ) : (
                myTasks.map((task) => (
                  <div className="project-card" key={task.id}>
                    <div className="project-header">
                      <div>
                        <h4>{task.title}</h4>
                        <small>Project: {projects.find(p => p.id === task.projectId)?.title || "Unknown"}</small>
                      </div>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "4px", 
                        backgroundColor: 
                          task.priority === "High" ? "#f44336" : 
                          task.priority === "Medium" ? "#ff9800" : "#4caf50",
                        color: "white",
                        fontSize: "0.8em"
                      }}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <p>{task.description}</p>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                      <span>Due: {task.dueDate}</span>
                      <select 
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        style={{ 
                          padding: "4px", 
                          borderRadius: "4px",
                          backgroundColor: 
                            task.status === "Completed" ? "#4caf50" : 
                            task.status === "In Progress" ? "#2196f3" : "#ff9800",
                          color: "white"
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === "projects" && (
          <div className="project-list">
            <h3>Projects</h3>
            {projects.length === 0 ? (
              <p className="no-data">No projects assigned yet.</p>
            ) : (
              projects.map((project) => (
                <div className="project-card" key={project.id} style={{ padding: "15px" }}>
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <p>Deadline: {project.deadline}</p>
                  <p>My Tasks: {myTasks.filter(task => task.projectId === project.id).length}</p>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === "calendar" && (
          <div className="project-list">
            <h3>Calendar</h3>
            <p className="no-data">Calendar view is not available yet.</p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="project-list">
            <h3>My Profile</h3>
            <div className="profile-section">
              <div className="profile-info">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> </p>
              </div>
              
              <div className="profile-info">
                <h4>Manager Information</h4>
                <div className="manager-profile-details">
                  <div className="manager-avatar-profile"></div>
                  <div className="manager-info">
                    <p><strong>Manager Name:</strong> </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamMemberDashboard;

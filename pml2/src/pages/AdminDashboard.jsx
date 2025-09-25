import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSupportRequests } from "../services/supportService";
import { managerService, teamMemberService, projectService } from "../services/apiService";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeJoineeTab, setActiveJoineeTab] = useState("manager");
  const [managers, setManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [managerFormError, setManagerFormError] = useState("");
  const [managerFormSuccess, setManagerFormSuccess] = useState(false);
  const [teamMemberFormError, setTeamMemberFormError] = useState("");
  const [teamMemberFormSuccess, setTeamMemberFormSuccess] = useState(false);
  const [managerData, setManagerData] = useState({
    name: "",
    managerId: "",
    password: ""
  });
  const [teamMemberData, setTeamMemberData] = useState({
    name: "",
    teamMemberId: "",
    password: "",
    position: ""
  });
  const [error, setError] = useState("");
  // Help section data
  const [helpData, setHelpData] = useState([]);
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpError, setHelpError] = useState("");
  
  // Projects section data
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  
  // Managers section data
  const [managersLoading, setManagersLoading] = useState(false);
  const [managersError, setManagersError] = useState("");
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  
  // Team members section data  
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);
  const [teamMembersError, setTeamMembersError] = useState("");
  const [teamMemberSearchQuery, setTeamMemberSearchQuery] = useState("");
  
  const navigate = useNavigate();

  // Function to fetch help data
  const fetchHelpData = async () => {
    try {
      setHelpLoading(true);
      setHelpError("");
      const data = await getAllSupportRequests();
      setHelpData(data);
    } catch (error) {
      console.error("Error fetching help data:", error);
      setHelpError("Failed to load help requests");
    } finally {
      setHelpLoading(false);
    }
  };

  // Function to fetch managers from API
  const fetchManagers = async () => {
    try {
      setManagersLoading(true);
      setManagersError("");
      const managersData = await managerService.getAll();
      setManagers(managersData);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagersError("Failed to load managers");
    } finally {
      setManagersLoading(false);
    }
  };

  // Function to fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setTeamMembersLoading(true);
      setTeamMembersError("");
      const teamMembersData = await teamMemberService.getAll();
      setTeamMembers(teamMembersData);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembersError("Failed to load team members");
    } finally {
      setTeamMembersLoading(false);
    }
  };

  // Function to fetch projects from API
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      setProjectsError("");
      const projectsData = await projectService.getAll();
      console.log('Projects data received:', projectsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError("Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("adminLoggedIn")) {
      navigate("/admin");
      return;
    }

    // Fetch data from API
    fetchHelpData();
    fetchManagers();
    fetchTeamMembers();
    fetchProjects();
    
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin");
  };

  // Manager form handlers
  const handleManagerInputChange = (e) => {
    const { name, value } = e.target;
    setManagerData({
      ...managerData,
      [name]: value
    });
    
    if (managerFormError) {
      setManagerFormError("");
    }
  };
  
  const validateManagerForm = () => {
    if (!managerData.name.trim()) return "Name is required";
    if (!managerData.managerId.trim()) return "Manager ID is required";
    
    const managerId = parseInt(managerData.managerId);
    if (isNaN(managerId) || managerId <= 0) return "Manager ID must be a positive number";
    
    // Check if Manager ID already exists in current managers list
    const existingManager = managers.find(m => m.manager_id === managerId);
    if (existingManager) return `Manager with ID ${managerId} already exists`;
    
    if (!managerData.password.trim()) return "Password is required";
    if (managerData.password.length < 6) return "Password must be at least 6 characters";
    
    return "";
  };
  
  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    setManagerFormError("");
    setManagerFormSuccess(false);
    
    const error = validateManagerForm();
    if (error) {
      setManagerFormError(error);
      return;
    }
    
    try {
      // Prepare data for API
      const managerDataForAPI = {
        manager_id: parseInt(managerData.managerId),
        name: managerData.name,
        password: managerData.password
      };
      
      // Call API to create manager
      const createdManager = await managerService.create(managerDataForAPI);
      
      // Update local state with the new manager
      setManagers(prevManagers => [...prevManagers, createdManager]);
      
      // Reset form
      setManagerData({
        name: "",
        managerId: "",
        password: ""
      });
      
      setManagerFormSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setManagerFormSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error creating manager:', error);
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          setManagerFormError(error.response.data.error);
        } else if (error.response.data.manager_id) {
          setManagerFormError("Manager ID: " + error.response.data.manager_id[0]);
        } else {
          setManagerFormError("Failed to create manager. Please check your input.");
        }
      } else {
        setManagerFormError("Failed to create manager. Please try again.");
      }
    }
  };
  
  // Team Member form handlers
  const handleTeamMemberInputChange = (e) => {
    const { name, value } = e.target;
    setTeamMemberData({
      ...teamMemberData,
      [name]: value
    });
    
    if (teamMemberFormError) {
      setTeamMemberFormError("");
    }
  };
  
  const validateTeamMemberForm = () => {
    if (!teamMemberData.name.trim()) return "Name is required";
    if (!teamMemberData.teamMemberId.trim()) return "Team Member ID is required";
    
    const teamMemberId = parseInt(teamMemberData.teamMemberId);
    if (isNaN(teamMemberId) || teamMemberId <= 0) return "Team Member ID must be a positive number";
    
    // Check if Team Member ID already exists in current team members list
    const existingTeamMember = teamMembers.find(tm => tm.team_member_id === teamMemberId);
    if (existingTeamMember) return `Team Member with ID ${teamMemberId} already exists`;
    
    if (!teamMemberData.password.trim()) return "Password is required";
    if (teamMemberData.password.length < 6) return "Password must be at least 6 characters";
    
    return "";
  };
  
  const handleTeamMemberSubmit = async (e) => {
    e.preventDefault();
    setTeamMemberFormError("");
    setTeamMemberFormSuccess(false);
    
    const error = validateTeamMemberForm();
    if (error) {
      setTeamMemberFormError(error);
      return;
    }
    
    try {
      // Prepare data for API
      const teamMemberDataForAPI = {
        team_member_id: parseInt(teamMemberData.teamMemberId),
        team_member_name: teamMemberData.name,
        password: teamMemberData.password,
        position: teamMemberData.position
      };
      
      // Call API to create team member
      const createdTeamMember = await teamMemberService.create(teamMemberDataForAPI);
      
      // Update local state with the new team member
      setTeamMembers(prevTeamMembers => [...prevTeamMembers, createdTeamMember]);
      
      // Reset form
      setTeamMemberData({
        name: "",
        teamMemberId: "",
        password: "",
        position: ""
      });
      
      setTeamMemberFormSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setTeamMemberFormSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error creating team member:', error);
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          setTeamMemberFormError(error.response.data.error);
        } else if (error.response.data.team_member_id) {
          setTeamMemberFormError("Team Member ID: " + error.response.data.team_member_id[0]);
        } else {
          setTeamMemberFormError("Failed to create team member. Please check your input.");
        }
      } else {
        setTeamMemberFormError("Failed to create team member. Please try again.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Welcome Admin</h2>
        </div>
        
        <ul className="sidebar-nav">
          <li>
            <a 
              href="#dashboard" 
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className={activeTab === "projects" ? "active" : ""}
              onClick={() => setActiveTab("projects")}
            >
              📁 Projects
            </a>
          </li>
          <li>
            <a 
              href="#newjoinee" 
              className={activeTab === "newjoinee" ? "active" : ""}
              onClick={() => setActiveTab("newjoinee")}
            >
              🆕 New Joinee
            </a>
          </li>

          <li>
            <a 
              href="#ourmanagers" 
              className={activeTab === "ourmanagers" ? "active" : ""}
              onClick={() => setActiveTab("ourmanagers")}
            >
              👥 Our Managers
            </a>
          </li>
          <li>
            <a 
              href="#ourteam" 
              className={activeTab === "ourteam" ? "active" : ""}
              onClick={() => setActiveTab("ourteam")}
            >
              🏢 Our Team
            </a>
          </li>
            <li>
              <a 
                href="#help" 
                className={activeTab === "help" ? "active" : ""}
                onClick={() => setActiveTab("help")}
              >
                🆘 Help
              </a>
            </li>
        </ul>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
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
            <span>Admin</span>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            <h3>Welcome to the Admin Dashboard</h3>
            <p>This is your central command center for managing the entire system.</p>
            
            {/* Summary Statistics Blocks */}
            <div style={{ 
              marginTop: '30px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Total Projects Block */}
              <div style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>📊</span>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {projects ? projects.length : 0}
                  </div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>
                    Total Projects
                  </div>
                </div>
              </div>

              {/* Completed Projects Block */}
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {projects ? projects.filter(project => (project.progress || 0) === 100).length : 0}
                  </div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>
                    Completed Projects
                  </div>
                </div>
              </div>

              {/* Pending Projects Block */}
              <div style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>⏳</span>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {projects ? projects.filter(project => (project.progress || 0) < 100).length : 0}
                  </div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>
                    Pending Projects
                  </div>
                </div>
              </div>
            </div>
            
            {/* Project Progress Chart */}
            <div className="chart-container" style={{ 
              marginTop: '30px', 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h4 style={{ marginBottom: '20px', color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                Project Progress Overview
              </h4>
              
              <div style={{ marginBottom: '15px' }}>
                <button 
                  onClick={fetchProjects}
                  disabled={projectsLoading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: projectsLoading ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: projectsLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {projectsLoading ? 'Loading...' : 'Refresh Data'}
                </button>
              </div>

              {projectsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Loading project data...</p>
                </div>
              ) : projectsError ? (
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  border: '1px solid #fca5a5', 
                  color: '#dc2626', 
                  padding: '15px', 
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  {projectsError}
                  <button 
                    onClick={fetchProjects}
                    style={{
                      marginLeft: '10px',
                      textDecoration: 'underline',
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : !projects || projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#6b7280' }}>No projects available for chart display.</p>
                </div>
              ) : (
                <div className="horizontal-chart" style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gap: '12px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {projects.map((project, index) => {
                      const progress = project.progress || 0;
                      const maxNameLength = 25;
                      const displayName = project.project_name.length > maxNameLength 
                        ? project.project_name.substring(0, maxNameLength) + '...'
                        : project.project_name;
                      
                      // Color based on progress
                      const getProgressColor = (progress) => {
                        if (progress >= 75) return '#10b981'; // Green
                        if (progress >= 50) return '#3b82f6'; // Blue  
                        if (progress >= 25) return '#f59e0b'; // Yellow
                        return '#6b7280'; // Gray
                      };
                      
                      return (
                        <div key={project.project_id} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          padding: '8px 0',
                          borderBottom: index < projects.length - 1 ? '1px solid #f3f4f6' : 'none'
                        }}>
                          {/* Project Name (Y-axis label) */}
                          <div style={{ 
                            width: '200px', 
                            textAlign: 'right', 
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151',
                            flexShrink: 0,
                            paddingRight: '8px'
                          }} title={project.project_name}>
                            {displayName}
                          </div>
                          
                          {/* Progress Bar Container */}
                          <div style={{ 
                            flex: '1', 
                            position: 'relative',
                            height: '24px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '12px',
                            overflow: 'hidden'
                          }}>
                            {/* Progress Bar Fill */}
                            <div style={{
                              width: `${progress}%`,
                              height: '100%',
                              backgroundColor: getProgressColor(progress),
                              borderRadius: '12px',
                              transition: 'width 0.5s ease-in-out',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              paddingRight: progress > 10 ? '8px' : '0'
                            }}>
                              {progress > 10 && (
                                <span style={{ 
                                  color: 'white', 
                                  fontSize: '12px', 
                                  fontWeight: '600' 
                                }}>
                                  {progress}%
                                </span>
                              )}
                            </div>
                            
                            {/* Progress percentage outside bar for low values */}
                            {progress <= 10 && (
                              <div style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#374151'
                              }}>
                                {progress}%
                              </div>
                            )}
                          </div>
                          
                          {/* Progress Value */}
                          <div style={{ 
                            width: '50px', 
                            textAlign: 'left', 
                            fontSize: '14px',
                            fontWeight: '600',
                            color: getProgressColor(progress),
                            flexShrink: 0
                          }}>
                            {progress}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Chart X-axis labels */}
                  <div style={{ 
                    marginTop: '15px', 
                    paddingLeft: '212px', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                  
                  {/* Legend */}
                  <div style={{ 
                    marginTop: '20px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#6b7280', 
                        borderRadius: '2px' 
                      }}></div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>0-24%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#f59e0b', 
                        borderRadius: '2px' 
                      }}></div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>25-49%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#3b82f6', 
                        borderRadius: '2px' 
                      }}></div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>50-74%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#10b981', 
                        borderRadius: '2px' 
                      }}></div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>75-100%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="content-section">
            <h3>Projects Management</h3>
            <p>Overview of all projects across the organization.</p>
            
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search projects by name..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '300px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <button 
                onClick={fetchProjects}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Refresh Projects
              </button>
            </div>
            
            {projectsLoading ? (
              <div className="text-center py-8">
                <p>Loading projects...</p>
              </div>
            ) : projectsError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {projectsError}
                <button 
                  onClick={fetchProjects}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p>No projects found.</p>
              </div>
            ) : (
              <div className="projects-overview" style={{ marginTop: '20px' }}>
                {(() => {
                  const filteredProjects = projects.filter(project => 
                    project.project_name.toLowerCase().includes(projectSearchQuery.toLowerCase())
                  );
                  
                  if (filteredProjects.length === 0 && projectSearchQuery) {
                    return (
                      <div className="text-center py-8">
                        <p>No projects found matching "{projectSearchQuery}".</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="projects-table-container">
                      <table className="projects-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Project ID</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Project Name</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Manager</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProjects.map(project => (
                            <tr key={project.project_id}>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                {project.project_id}
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                <strong>{project.project_name}</strong>
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                {project.description || 'No description'}
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                {project.manager && project.manager.name ? project.manager.name : 'Not assigned'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
        
        {activeTab === "newjoinee" && (
          <div className="content-section">
            <h3>New Joinee Registration</h3>
            <p>Register new managers and team members to onboard them to the system.</p>
            
            <div className="joinee-tabs">
              <div className="tab-navigation">
                <button 
                  className={activeJoineeTab === "manager" ? "tab-button active" : "tab-button"}
                  onClick={() => setActiveJoineeTab("manager")}
                >
                  Manager Registration
                </button>
                <button 
                  className={activeJoineeTab === "teamMember" ? "tab-button active" : "tab-button"}
                  onClick={() => setActiveJoineeTab("teamMember")}
                >
                  Team Member Registration
                </button>
              </div>
              
              {activeJoineeTab === "manager" && (
                <div className="form-container">
                  <h3>Register New Manager</h3>
                  {managerFormError && <div className="error-message">{managerFormError}</div>}
                  {managerFormSuccess && <div className="success-message">Manager registered successfully! Credentials have been saved.</div>}
                  
                  <form onSubmit={handleManagerSubmit} className="registration-form">
                    <div className="form-group">
                      <label htmlFor="managerName">Manager Name*</label>
                      <input
                        type="text"
                        id="managerName"
                        name="name"
                        value={managerData.name}
                        onChange={handleManagerInputChange}
                        placeholder="Enter manager name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="managerManagerId">Manager ID*</label>
                      <input
                        type="number"
                        id="managerManagerId"
                        name="managerId"
                        value={managerData.managerId}
                        onChange={handleManagerInputChange}
                        placeholder="Enter manager ID"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="managerPassword">Password*</label>
                      <input
                        type="password"
                        id="managerPassword"
                        name="password"
                        value={managerData.password}
                        onChange={handleManagerInputChange}
                        placeholder="Enter password"
                      />
                    </div>

                    <button type="submit" className="submit-button">Register Manager</button>
                  </form>
                </div>
              )}
              
              {activeJoineeTab === "teamMember" && (
                <div className="form-container">
                  <h3>Register New Team Member</h3>
                  {teamMemberFormError && <div className="error-message">{teamMemberFormError}</div>}
                  {teamMemberFormSuccess && <div className="success-message">Team Member registered successfully! Credentials have been saved.</div>}
                  
                  <form onSubmit={handleTeamMemberSubmit} className="registration-form">
                    <div className="form-group">
                      <label htmlFor="teamMemberName">Team Member Name*</label>
                      <input
                        type="text"
                        id="teamMemberName"
                        name="name"
                        value={teamMemberData.name}
                        onChange={handleTeamMemberInputChange}
                        placeholder="Enter team member name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="teamMemberTeamMemberId">Team Member ID*</label>
                      <input
                        type="number"
                        id="teamMemberTeamMemberId"
                        name="teamMemberId"
                        value={teamMemberData.teamMemberId}
                        onChange={handleTeamMemberInputChange}
                        placeholder="Enter team member ID"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="teamMemberPassword">Password*</label>
                      <input
                        type="password"
                        id="teamMemberPassword"
                        name="password"
                        value={teamMemberData.password}
                        onChange={handleTeamMemberInputChange}
                        placeholder="Enter password"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="teamMemberPosition">Position in Company</label>
                      <input
                        type="text"
                        id="teamMemberPosition"
                        name="position"
                        value={teamMemberData.position}
                        onChange={handleTeamMemberInputChange}
                        placeholder="Enter position (e.g., Developer, Designer, Analyst)"
                      />
                    </div>

                    <button type="submit" className="submit-button">Register Team Member</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}



        {activeTab === "ourmanagers" && (
          <div className="content-section">
            <h3>Our Managers</h3>
            <p>Overview of management team across the organization.</p>
            
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search managers by name..."
                value={managerSearchQuery}
                onChange={(e) => setManagerSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '300px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <button 
                onClick={fetchManagers}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Refresh Managers
              </button>
            </div>
            
            {managersLoading ? (
              <div className="text-center py-8">
                <p>Loading managers...</p>
              </div>
            ) : managersError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {managersError}
                <button 
                  onClick={fetchManagers}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            ) : !managers || managers.length === 0 ? (
              <div className="text-center py-8">
                <p>No managers found.</p>
              </div>
            ) : (
              <div className="managers-overview" style={{ marginTop: '20px' }}>
                {(() => {
                  const filteredManagers = managers.filter(manager => 
                    manager.name.toLowerCase().includes(managerSearchQuery.toLowerCase())
                  );
                  
                  if (filteredManagers.length === 0 && managerSearchQuery) {
                    return (
                      <div className="text-center py-8">
                        <p>No managers found matching "{managerSearchQuery}".</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="managers-table-container">
                      <table className="managers-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Manager ID</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Manager Name</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Projects Assigned</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredManagers.map(manager => {
                            const assignedProjects = projects.filter(project => project.manager && project.manager.manager_id === manager.manager_id);
                            return (
                              <tr key={manager.manager_id}>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {manager.manager_id}
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  <strong>{manager.name}</strong>
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {assignedProjects.length > 0 ? assignedProjects.length + ' projects' : 'No projects assigned'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {activeTab === "ourteam" && (
          <div className="content-section">
            <h3>Our Team Members</h3>
            <p>Overview of team members across the organization.</p>
            
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search team members by name..."
                value={teamMemberSearchQuery}
                onChange={(e) => setTeamMemberSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '300px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <button 
                onClick={fetchTeamMembers}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Refresh Team Members
              </button>
            </div>
            
            {teamMembersLoading ? (
              <div className="text-center py-8">
                <p>Loading team members...</p>
              </div>
            ) : teamMembersError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {teamMembersError}
                <button 
                  onClick={fetchTeamMembers}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            ) : !teamMembers || teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <p>No team members found.</p>
              </div>
            ) : (
              <div className="team-members-overview" style={{ marginTop: '20px' }}>
                {(() => {
                  const filteredTeamMembers = teamMembers.filter(member => 
                    member.team_member_name.toLowerCase().includes(teamMemberSearchQuery.toLowerCase())
                  );
                  
                  if (filteredTeamMembers.length === 0 && teamMemberSearchQuery) {
                    return (
                      <div className="text-center py-8">
                        <p>No team members found matching "{teamMemberSearchQuery}".</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="team-members-table-container">
                      <table className="team-members-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Member ID</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Member Name</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTeamMembers.map(member => (
                            <tr key={member.team_member_id}>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                {member.team_member_id}
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                <strong>{member.team_member_name}</strong>
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                {member.position || 'Position not specified'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

          {activeTab === "help" && (
            <div className="content-section">
              <h3>Help Requests</h3>
              <p>Overview of help requests and support tickets from users.</p>
              
              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={fetchHelpData}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Refresh Help Requests
                </button>
              </div>
              
              {helpLoading ? (
                <div className="text-center py-8">
                  <p>Loading help requests...</p>
                </div>
              ) : helpError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {helpError}
                  <button 
                    onClick={fetchHelpData}
                    className="ml-2 underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              ) : helpData.length === 0 ? (
                <div className="text-center py-8">
                  <p>No help requests found.</p>
                </div>
              ) : (
                <div className="help-overview" style={{ marginTop: '20px' }}>
                  <div className="help-table-container">
                    <table className="help-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                          <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                          <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                          <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Mobile</th>
                          <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Subject</th>
                          <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                          <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {helpData.map((item) => (
                          <tr key={item.id}>
                            <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                              {item.id}
                            </td>
                            <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                              <strong>{item.name}</strong>
                            </td>
                            <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                              {item.email}
                            </td>
                            <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                              {item.mobile}
                            </td>
                            <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                              {item.subject}
                            </td>
                            <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb', minWidth: '250px' }}>
                              <div style={{ wordWrap: 'break-word', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                {item.description || 'N/A'}
                              </div>
                            </td>
                            <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

      </div>
    </div>
  );
}

export default AdminDashboard;
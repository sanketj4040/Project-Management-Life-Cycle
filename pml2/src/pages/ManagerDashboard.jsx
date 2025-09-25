import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { teamMemberService, projectService, taskService, managerService, projectTeamMemberService } from "../services/apiService";

function ManagerDashboard() {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);
  const [teamMembersError, setTeamMembersError] = useState("");
  const [teamMemberSearchQuery, setTeamMemberSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loggedInManager, setLoggedInManager] = useState({
    manager_id: "",
    name: ""
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [taskFormData, setTaskFormData] = useState({
    task_name: "",
    manager_id: "",
    team_member_id: "",
    priority: "medium"
  });
  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    description: "",
    deadline: "",
    manager_id: "",
    team_member_id: ""  // Keep this for backward compatibility
  });
  const [numberOfMembers, setNumberOfMembers] = useState(1);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([""]);
  const navigate = useNavigate();

  // Function to fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setTeamMembersLoading(true);
      setTeamMembersError("");
      const teamMembersData = await teamMemberService.getAll();
      console.log('Team members data received:', teamMembersData);
      setTeamMembers(teamMembersData);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembersError("Failed to load team members");
    } finally {
      setTeamMembersLoading(false);
    }
  };

  // Function to fetch current manager's profile information
  const fetchCurrentManagerProfile = async () => {
    try {
      const loggedInManagerId = localStorage.getItem("managerId");
      if (!loggedInManagerId) return;

      const managersData = await managerService.getAll();
      const currentManager = managersData.find(manager => 
        manager.manager_id === parseInt(loggedInManagerId)
      );
      
      if (currentManager) {
        setLoggedInManager({
          manager_id: currentManager.manager_id,
          name: currentManager.name
        });
        console.log('Current manager profile loaded:', currentManager);
      }
    } catch (error) {
      console.error('Error fetching manager profile:', error);
    }
  };

  // Function to fetch projects from API (filtered by manager)
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      setProjectsError("");
      const projectsData = await projectService.getAll();
      console.log('Projects data received:', projectsData);
      
      // Filter projects by logged-in manager
      const managerId = localStorage.getItem('managerId');
      const filteredProjects = projectsData.filter(project => 
        project.manager && project.manager.manager_id === parseInt(managerId)
      );
      console.log('Filtered projects for manager:', filteredProjects);
      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError("Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  // Function to fetch assigned tasks for the logged-in manager
  const fetchAssignedTasks = async () => {
    try {
      setTasksLoading(true);
      setTasksError("");
      
      // Get logged-in manager ID
      const loggedInManagerId = localStorage.getItem("managerId");
      
      if (!loggedInManagerId) {
        setTasksError("Manager not properly logged in");
        return;
      }
      
      const tasksData = await taskService.getAll();
      console.log('All tasks data received:', tasksData);
      
      // Filter tasks to show only those assigned by the logged-in manager
      const managerTasks = tasksData.filter(task => 
        task.manager && task.manager.manager_id === parseInt(loggedInManagerId)
      );
      
      console.log(`Filtered tasks for manager ID ${loggedInManagerId}:`, managerTasks);
      setAssignedTasks(managerTasks);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      setTasksError("Failed to load assigned tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    // Check if manager is logged in
    if (!localStorage.getItem("managerLoggedIn")) {
      navigate("/manager");
      return;
    }

    // Get logged-in manager ID and set it in both task and project forms
    const loggedInManagerId = localStorage.getItem("managerId");
    if (loggedInManagerId) {
      setTaskFormData(prevData => ({
        ...prevData,
        manager_id: loggedInManagerId
      }));
      
      setFormData(prevData => ({
        ...prevData,
        manager_id: loggedInManagerId
      }));
    }
    
    // Fetch data from database
    fetchTeamMembers();
    fetchCurrentManagerProfile();
  }, [navigate]);

  // Automatically fetch projects when dashboard or my-projects tab is active
  // Automatically fetch assigned tasks when assigned-tasks tab is active
  useEffect(() => {
    if (activeTab === "my-projects" || activeTab === "dashboard") {
      fetchProjects();
    }
    if (activeTab === "assigned-tasks") {
      fetchAssignedTasks();
    }
  }, [activeTab]);

  // Initialize empty form with today's date when form is shown
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("managerLoggedIn");
    navigate("/manager");
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({
      ...taskFormData,
      [name]: value
    });
  };

  // Handle number of members change
  const handleNumberOfMembersChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setNumberOfMembers(count);
    
    // Initialize selectedTeamMembers array with empty strings
    const newSelectedMembers = Array(count).fill("");
    // Copy existing selections if they exist
    for (let i = 0; i < Math.min(count, selectedTeamMembers.length); i++) {
      newSelectedMembers[i] = selectedTeamMembers[i];
    }
    setSelectedTeamMembers(newSelectedMembers);
  };

  // Handle team member selection for specific dropdown
  const handleTeamMemberSelection = (index, value) => {
    const newSelectedMembers = [...selectedTeamMembers];
    newSelectedMembers[index] = value;
    setSelectedTeamMembers(newSelectedMembers);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!taskFormData.task_name || !taskFormData.manager_id || !taskFormData.team_member_id) {
      setError("Please fill all required fields!");
      return;
    }

    try {
      // Create task data object for API
      const taskData = {
        task_name: taskFormData.task_name,
        manager_id: parseInt(taskFormData.manager_id),
        team_member_id: parseInt(taskFormData.team_member_id),
        priority: taskFormData.priority
      };

      console.log('Creating task:', taskData);
      
      // Call API to create task
      const createdTask = await taskService.create(taskData);
      console.log('Task created successfully:', createdTask);
      
      // Reset form but keep manager_id
      const loggedInManagerId = localStorage.getItem("managerId");
      setTaskFormData({
        task_name: "",
        manager_id: loggedInManagerId || "",
        team_member_id: "",
        priority: "medium"
      });
      
      setShowTaskForm(false);
      alert("Task assigned successfully!");
      
    } catch (error) {
      console.error('Error creating task:', error);
      setError("Failed to assign task. Please try again.");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.project_name || !formData.description || !formData.manager_id) {
      setError("Please fill all required fields!");
      return;
    }

    // Validate that at least one team member is selected
    const validTeamMembers = selectedTeamMembers.filter(id => id && id !== "");
    if (validTeamMembers.length === 0) {
      setError("Please select at least one team member!");
      return;
    }

    try {
      // Create project data object for API (without team_member_id as we'll handle it separately)
      const projectData = {
        project_id: formData.project_id || null,
        project_name: formData.project_name,
        description: formData.description,
        deadline: formData.deadline || null,
        manager_id: parseInt(formData.manager_id)
      };

      console.log('Creating project:', projectData);
      
      // Call API to create project
      const createdProject = await projectService.create(projectData);
      console.log('Project created successfully:', createdProject);

      // Now assign team members to the project using the many-to-many relationship
      if (validTeamMembers.length > 0) {
        console.log('Assigning team members to project:', validTeamMembers);
        const teamMemberIds = validTeamMembers.map(id => parseInt(id));
        await projectTeamMemberService.bulkCreate(createdProject.project_id, teamMemberIds);
        console.log('Team members assigned successfully');
      }

      // Reset form but keep manager_id
      const loggedInManagerId = localStorage.getItem("managerId");
      setFormData({
        project_id: "",
        project_name: "",
        description: "",
        deadline: "",
        manager_id: loggedInManagerId || "",
        team_member_id: ""
      });
      
      // Reset multiple team member selection
      setNumberOfMembers(1);
      setSelectedTeamMembers([""]);
      
      setShowForm(false);
      alert("Project created successfully with team member assignments!");
      
    } catch (error) {
      console.error('Error creating project or assigning team members:', error);
      setError("Failed to create project or assign team members. Please try again.");
    }
  };

  // Helper function to get team member name by ID
  const getTeamMemberName = (teamMemberId) => {
    if (!teamMemberId) return 'Not assigned';
    
    if (teamMembers.length === 0) return 'Loading...';
    
    const teamMember = teamMembers.find(member => member.team_member_id === teamMemberId);
    
    return teamMember ? teamMember.team_member_name : `Unknown (ID: ${teamMemberId})`;
  };

  // Helper function to convert numeric priority to label
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Manager Dashboard</h2>
        <ul className="sidebar-nav">
          <li>
            <a 
              href="#dashboard" 
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className={activeTab === "projects" ? "active" : ""}
              onClick={() => setActiveTab("projects")}
            >
              New Project
            </a>
          </li>
          <li>
            <a 
              href="#my-projects" 
              className={activeTab === "my-projects" ? "active" : ""}
              onClick={() => setActiveTab("my-projects")}
            >
              My Projects
            </a>
          </li>
          <li>
            <a 
              href="#tasks" 
              className={activeTab === "tasks" ? "active" : ""}
              onClick={() => setActiveTab("tasks")}
            >
              Assign Task
            </a>
          </li>
          <li>
            <a 
              href="#assigned-tasks" 
              className={activeTab === "assigned-tasks" ? "active" : ""}
              onClick={() => setActiveTab("assigned-tasks")}
            >
              Assigned Tasks
            </a>
          </li>
          <li>
            <a 
              href="#team" 
              className={activeTab === "team" ? "active" : ""}
              onClick={() => setActiveTab("team")}
            >
              Team Members
            </a>
          </li>
          <li>
            <a 
              href="#profile" 
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              My Profile
            </a>
          </li>
        </ul>
        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button onClick={handleLogout}>Logout</button>
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
            <span>Manager</span>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            <h3>Welcome to the Manager Dashboard</h3>
            <p>This is your central command center for managing projects and team members.</p>
            
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
          <div className="dashboard-content">
            <div className="section-header">
              <h3>Projects Management</h3>
            </div>
            
            <div className="project-management">
              <p>Manage your projects, track progress, and allocate resources effectively.</p>
              
              <div className="action-buttons project-actions">
                <button 
                  className={`action-btn primary ${showForm ? 'cancel' : ''}`} 
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? '✖ Cancel' : '+ New Project'}
                </button>
              </div>
              
              {showForm && (
                <div className="form-container" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3>Create New Project</h3>
                  {error && <div className="error-message" style={{ color: '#dc2626', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Project ID (Optional)</label>
                      <input
                        type="number"
                        name="project_id"
                        value={formData.project_id}
                        onChange={handleInputChange}
                        placeholder="Leave empty for auto-generation"
                      />
                    </div>
                    <div className="form-group">
                      <label>Project Name*</label>
                      <input
                        type="text"
                        name="project_name"
                        value={formData.project_name}
                        onChange={handleInputChange}
                        placeholder="Enter project name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description*</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter project description"
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label>Deadline</label>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        placeholder="Select project deadline"
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Team Members*</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={numberOfMembers}
                        onChange={handleNumberOfMembersChange}
                        placeholder="Enter number of team members"
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </div>
                    
                    {/* Dynamic Team Member Selection */}
                    {Array.from({ length: numberOfMembers }, (_, index) => (
                      <div key={index} className="form-group">
                        <label>Team Member {index + 1}*</label>
                        <select
                          value={selectedTeamMembers[index] || ""}
                          onChange={(e) => handleTeamMemberSelection(index, e.target.value)}
                          required
                          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                          <option value="">-- Select Team Member {index + 1} --</option>
                          {teamMembers.map(member => (
                            <option 
                              key={member.team_member_id} 
                              value={member.team_member_id}
                              disabled={selectedTeamMembers.includes(member.team_member_id.toString()) && selectedTeamMembers[index] !== member.team_member_id.toString()}
                            >
                              {member.team_member_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                    
                    <button type="submit" className="submit-button" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '15px', fontWeight: '500' }}>Create Project</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "my-projects" && (
          <div className="dashboard-content">
            <div className="section-header">
              <h3>My Projects</h3>
            </div>
            
            <div className="projects-view-container" style={{ marginTop: '20px' }}>
              <p>Overview of projects assigned to you as a manager.</p>
              
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
              ) : !projects || projects.length === 0 ? (
                <div className="text-center py-8">
                  <p>No projects assigned to you found.</p>
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
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Deadline</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProjects.map((project) => (
                              <tr key={project.project_id}>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {project.project_id}
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  <strong>{project.project_name}</strong>
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb', maxWidth: '200px' }}>
                                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={project.description}>
                                    {project.description || 'No description'}
                                  </div>
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {project.deadline ? (
                                    <span style={{ color: new Date(project.deadline) < new Date() ? '#dc2626' : '#059669' }}>
                                      {project.deadline}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>No deadline set</span>
                                  )}
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ 
                                      width: '60px', 
                                      height: '6px', 
                                      backgroundColor: '#e5e7eb', 
                                      borderRadius: '3px',
                                      overflow: 'hidden'
                                    }}>
                                      <div style={{
                                        width: `${project.progress || 0}%`,
                                        height: '100%',
                                        backgroundColor: (project.progress || 0) >= 75 ? '#10b981' : 
                                                       (project.progress || 0) >= 50 ? '#3b82f6' : 
                                                       (project.progress || 0) >= 25 ? '#f59e0b' : '#6b7280',
                                        borderRadius: '3px',
                                        transition: 'width 0.3s ease'
                                      }}></div>
                                    </div>
                                    <span style={{ 
                                      fontSize: '13px', 
                                      fontWeight: '600',
                                      color: (project.progress || 0) >= 75 ? '#10b981' : 
                                             (project.progress || 0) >= 50 ? '#3b82f6' : 
                                             (project.progress || 0) >= 25 ? '#f59e0b' : '#6b7280'
                                    }}>
                                      {project.progress || 0}%
                                    </span>
                                  </div>
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
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="dashboard-content">
            <div className="section-header">
              <h3>Task Assignment</h3>
            </div>
            
            <div className="task-management">
              <p>Assign tasks to your team members.</p>
              
              <div className="action-buttons task-actions">
                <button 
                  className={`action-btn primary ${showTaskForm ? 'cancel' : ''}`}
                  onClick={() => setShowTaskForm(!showTaskForm)}
                >
                  {showTaskForm ? '✖ Cancel' : '+ Assign Task'}
                </button>
              </div>

              {showTaskForm && (
                <div className="form-container" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3>Assign New Task</h3>
                  {error && <div className="error-message" style={{ color: '#dc2626', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
                  
                  <form onSubmit={handleTaskSubmit} className="registration-form">
                    <div className="form-group">
                      <label htmlFor="task_name">Task Name*</label>
                      <input
                        type="text"
                        id="task_name"
                        name="task_name"
                        value={taskFormData.task_name}
                        onChange={handleTaskInputChange}
                        placeholder="Enter task name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="team_member_id">Team Member*</label>
                      <select
                        id="team_member_id"
                        name="team_member_id"
                        value={taskFormData.team_member_id}
                        onChange={handleTaskInputChange}
                        required
                      >
                        <option value="">-- Select Team Member --</option>
                        {teamMembers.map(member => (
                          <option key={member.team_member_id} value={member.team_member_id}>
                            {member.team_member_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="priority">Priority*</label>
                      <select
                        id="priority"
                        name="priority"
                        value={taskFormData.priority}
                        onChange={handleTaskInputChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      >
                        <option value="very_urgent">🔴 Very Urgent</option>
                        <option value="urgent">🟠 Urgent</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                      </select>
                    </div>

                    <button type="submit" className="submit-button" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '15px', fontWeight: '500' }}>
                      Assign Task
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "assigned-tasks" && (
          <div className="dashboard-content">
            <div className="section-header">
              <h3>My Assigned Tasks</h3>
            </div>
            
            <div className="assigned-tasks-management">
              <p>View and manage all tasks you have assigned to your team members.</p>
              
              <div style={{ marginBottom: '15px' }}>
                <button 
                  onClick={fetchAssignedTasks}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Refresh Tasks
                </button>
              </div>

              {tasksLoading ? (
                <div className="text-center py-8">
                  <p>Loading assigned tasks...</p>
                </div>
              ) : tasksError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {tasksError}
                  <button 
                    onClick={fetchAssignedTasks}
                    className="ml-2 underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              ) : assignedTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="no-data">You haven't assigned any tasks yet.</p>
                  {loggedInManager.manager_id && (
                    <p style={{ color: '#6b7280', fontSize: '0.9em', marginTop: '8px' }}>
                      Showing tasks assigned by Manager ID: {loggedInManager.manager_id}
                    </p>
                  )}
                </div>
              ) : (
                <div className="tasks-overview">
                  {/* Pending Tasks Section */}
                  <div className="task-section" style={{ marginBottom: '30px' }}>
                    <h4 style={{ 
                      color: '#ea580c', 
                      marginBottom: '15px', 
                      padding: '10px 15px', 
                      backgroundColor: '#fff7ed', 
                      border: '1px solid #fed7aa', 
                      borderRadius: '8px',
                      fontSize: '1.1em',
                      fontWeight: '600'
                    }}>
                      🔄 Pending Tasks ({assignedTasks.filter(task => task.status !== 'completed').length})
                    </h4>
                    
                    {assignedTasks.filter(task => task.status !== 'completed').length === 0 ? (
                      <div className="text-center py-8">
                        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No pending tasks</p>
                      </div>
                    ) : (
                      <div className="tasks-table-container">
                        <table className="tasks-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Task ID</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Task Name</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Priority</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Assigned To</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignedTasks.filter(task => task.status !== 'completed').map(task => (
                              <tr key={task.task_id}>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {task.task_id}
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  <strong>{task.task_name}</strong>
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {task.priority ? (
                                    <span style={{ 
                                      color: task.priority === 'very_urgent' ? '#dc2626' : 
                                             task.priority === 'urgent' ? '#ea580c' : 
                                             task.priority === 'medium' ? '#ca8a04' : '#16a34a',
                                      fontWeight: task.priority === 'very_urgent' || task.priority === 'urgent' ? 'bold' : 'normal'
                                    }}>
                                      {task.priority === 'very_urgent' ? '🔴 Very Urgent' :
                                       task.priority === 'urgent' ? '🟠 Urgent' :
                                       task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>No priority set</span>
                                  )}
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    color: '#7c2d12',
                                    backgroundColor: '#fed7aa',
                                    border: '1px solid #fdba74',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}>
                                    ⏳ In Progress
                                  </span>
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {getTeamMemberName(task.team_member_id)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Completed Tasks Section */}
                  <div className="task-section">
                    <h4 style={{ 
                      color: '#065f46', 
                      marginBottom: '15px', 
                      padding: '10px 15px', 
                      backgroundColor: '#f0fdf4', 
                      border: '1px solid #a7f3d0', 
                      borderRadius: '8px',
                      fontSize: '1.1em',
                      fontWeight: '600'
                    }}>
                      ✅ Completed Tasks ({assignedTasks.filter(task => task.status === 'completed').length})
                    </h4>
                    
                    {assignedTasks.filter(task => task.status === 'completed').length === 0 ? (
                      <div className="text-center py-8">
                        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No completed tasks</p>
                      </div>
                    ) : (
                      <div className="tasks-table-container">
                        <table className="tasks-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Task ID</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Task Name</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Priority</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Assigned To</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignedTasks.filter(task => task.status === 'completed').map(task => (
                              <tr key={task.task_id}>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {task.task_id}
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  <strong>{task.task_name}</strong>
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {task.priority ? (
                                    <span style={{ 
                                      color: task.priority === 'very_urgent' ? '#dc2626' : 
                                             task.priority === 'urgent' ? '#ea580c' : 
                                             task.priority === 'medium' ? '#ca8a04' : '#16a34a',
                                      fontWeight: task.priority === 'very_urgent' || task.priority === 'urgent' ? 'bold' : 'normal'
                                    }}>
                                      {task.priority === 'very_urgent' ? '🔴 Very Urgent' :
                                       task.priority === 'urgent' ? '🟠 Urgent' :
                                       task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>No priority set</span>
                                  )}
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    color: '#065f46',
                                    backgroundColor: '#d1fae5',
                                    border: '1px solid #a7f3d0',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}>
                                    ✅ Completed
                                  </span>
                                </td>
                                <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                  {getTeamMemberName(task.team_member_id)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="dashboard-content">
            <div className="section-header">
              <h3>Team Management</h3>
            </div>
            
            <div className="team-management">
              <p>Manage your team, assign roles, and monitor individual performance.</p>
              
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
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button 
                  onClick={fetchTeamMembers}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
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
              ) : teamMembers.length === 0 ? (
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
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Team Member ID</th>
                              <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Name</th>
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
                                  {member.position || 'Not specified'}
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
          </div>
        )}

        {activeTab === "profile" && (
          <div className="dashboard-content">
            <h3>My Profile</h3>
            <p>View and update your personal information and preferences.</p>
            
            <div className="profile-section">
              <div className="profile-info">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> {loggedInManager.name || 'Loading...'}</p>
                <p><strong>Manager ID:</strong> {loggedInManager.manager_id || 'Loading...'}</p>
                {/* <p>Department: </p>
                <p>Role: </p> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;

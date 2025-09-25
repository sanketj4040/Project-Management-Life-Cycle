import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskService, projectService, teamMemberService, projectTeamMemberService } from "../services/apiService";

function TeamMemberDashboard() {
  const [myTasks, setMyTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTeamMember, setCurrentTeamMember] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({
    id: "",
    name: ""
  });
  const [progressUpdates, setProgressUpdates] = useState({});
  const [updatingProgress, setUpdatingProgress] = useState({});
  const navigate = useNavigate();

  // Function to fetch tasks from API
  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      setTasksError("");
      
      // Get logged-in team member ID
      const loggedInTeamMemberId = localStorage.getItem("teamMemberId");
      
      if (!loggedInTeamMemberId) {
        setTasksError("User not properly logged in");
        return;
      }
      
      const tasksData = await taskService.getAll();
      console.log('All tasks data received:', tasksData);
      
      // Filter tasks to show only those assigned to the logged-in team member
      const userTasks = tasksData.filter(task => 
        task.team_member_id === parseInt(loggedInTeamMemberId)
      );
      
      console.log(`Filtered tasks for team member ID ${loggedInTeamMemberId}:`, userTasks);
      setMyTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasksError("Failed to load tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  // Function to fetch projects from API using project_team_members relationship
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      setProjectsError("");
      
      // Get logged-in team member ID
      const loggedInTeamMemberId = localStorage.getItem("teamMemberId");
      
      if (!loggedInTeamMemberId) {
        setProjectsError("User not properly logged in");
        return;
      }

      console.log(`Fetching projects for team member ID: ${loggedInTeamMemberId}`);
      
      // Step 1: Get all project-team member relationships
      const projectTeamMemberData = await projectTeamMemberService.getAll();
      console.log('All project-team member relationships:', projectTeamMemberData);
      
      // Step 2: Filter relationships to find projects assigned to the logged-in team member
      const assignedRelationships = projectTeamMemberData.filter(relation => 
        relation.team_member && relation.team_member.team_member_id === parseInt(loggedInTeamMemberId)
      );
      
      console.log(`Found ${assignedRelationships.length} project assignments for team member ${loggedInTeamMemberId}:`, assignedRelationships);
      
      if (assignedRelationships.length === 0) {
        console.log('No project assignments found for this team member');
        setProjects([]);
        return;
      }
      
      // Step 3: Extract project IDs from the relationships
      const assignedProjectIds = assignedRelationships.map(relation => relation.project.project_id);
      console.log('Assigned project IDs:', assignedProjectIds);
      
      // Step 4: Get all projects and filter by assigned project IDs
      const allProjects = await projectService.getAll();
      console.log('All projects data received:', allProjects);
      
      // Step 5: Filter projects to show only those assigned to the team member
      const userProjects = allProjects.filter(project => 
        assignedProjectIds.includes(project.project_id)
      );
      
      console.log(`Filtered projects for team member ID ${loggedInTeamMemberId}:`, userProjects);
      setProjects(userProjects);
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError("Failed to load projects. Please try again.");
    } finally {
      setProjectsLoading(false);
    }
  };

  // Function to fetch current team member details
  const fetchCurrentTeamMember = async () => {
    try {
      setProfileLoading(true);
      setProfileError("");
      
      const teamMemberId = localStorage.getItem("teamMemberId");
      if (!teamMemberId) {
        setProfileError("Team member ID not found");
        return;
      }
      
      const teamMemberData = await teamMemberService.getById(teamMemberId);
      console.log('Current team member data:', teamMemberData);
      setCurrentTeamMember(teamMemberData);
    } catch (error) {
      console.error('Error fetching team member details:', error);
      setProfileError("Failed to load team member details");
    } finally {
      setProfileLoading(false);
    }
  };

  // Function to update project progress
  const updateProjectProgress = async (projectId, progress) => {
    try {
      setUpdatingProgress(prev => ({ ...prev, [projectId]: true }));
      
      // Validate progress value (0-100)
      const progressValue = parseInt(progress);
      if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
        alert("Progress must be a number between 0 and 100");
        return;
      }

      // Update project progress via API
      await projectService.patch(projectId, { progress: progressValue });
      
      // Update local state
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.project_id === projectId 
            ? { ...project, progress: progressValue }
            : project
        )
      );
      
      // Clear the progress input for this project
      setProgressUpdates(prev => ({ ...prev, [projectId]: '' }));
      
      console.log(`Progress updated for project ${projectId}: ${progressValue}%`);
    } catch (error) {
      console.error('Error updating project progress:', error);
      alert("Failed to update project progress. Please try again.");
    } finally {
      setUpdatingProgress(prev => ({ ...prev, [projectId]: false }));
    }
  };

  useEffect(() => {
    // Check if team member is logged in
    if (!localStorage.getItem("teamLoggedIn")) {
      navigate("/team");
      return;
    }

    // Initialize logged-in user information
    const teamMemberId = localStorage.getItem("teamMemberId");
    const teamMemberName = localStorage.getItem("teamMemberName");
    
    if (teamMemberId && teamMemberName) {
      setLoggedInUser({
        id: teamMemberId,
        name: teamMemberName
      });
    }

    // Fetch data from database
    fetchTasks();
    fetchProjects();
    fetchCurrentTeamMember();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("teamLoggedIn");
    localStorage.removeItem("teamMemberId");
    localStorage.removeItem("teamMemberName");
    setLoggedInUser({ id: "", name: "" });
    navigate("/team");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Get the current task data
      const currentTask = myTasks.find(task => task.task_id === taskId);
      if (!currentTask) {
        console.error('Task not found:', taskId);
        return;
      }

      // Create updated task data with new status
      const updatedTaskData = {
        ...currentTask,
        status: newStatus
      };

      // Update task via API
      await taskService.update(taskId, updatedTaskData);
      
      // Update local state
      setMyTasks(prevTasks => 
        prevTasks.map(task => 
          task.task_id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      );
      
      console.log(`Task ${taskId} status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert("Failed to update task status. Please try again.");
    }
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
            <h3>My Tasks {loggedInUser.name && `- ${loggedInUser.name} (ID: ${loggedInUser.id})`}</h3>

            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={fetchTasks}
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
                <p>Loading tasks...</p>
              </div>
            ) : tasksError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {tasksError}
                <button 
                  onClick={fetchTasks}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            ) : myTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="no-data">No tasks assigned to you yet.</p>
                {loggedInUser.id && (
                  <p style={{ color: '#6b7280', fontSize: '0.9em', marginTop: '8px' }}>
                    Showing tasks for Team Member ID: {loggedInUser.id}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {/* Pending Tasks Section */}
                <div className="pending-tasks-section">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '15px',
                    padding: '10px 15px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    borderLeft: '4px solid #f59e0b'
                  }}>
                    <h4 style={{ margin: 0, color: '#92400e', fontSize: '18px', fontWeight: 'bold' }}>
                      🔄 Pending Tasks ({myTasks.filter(task => task.status !== 'completed').length})
                    </h4>
                  </div>
                  
                  {myTasks.filter(task => task.status !== 'completed').length === 0 ? (
                    <div className="text-center py-6" style={{ backgroundColor: '#fefce8', borderRadius: '8px', padding: '20px' }}>
                      <p style={{ color: '#a16207', fontStyle: 'italic' }}>🎉 Great! No pending tasks remaining.</p>
                    </div>
                  ) : (
                    <div className="tasks-table-container">
                      <table className="tasks-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Task ID</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Task Name</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Priority</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Manager</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myTasks.filter(task => task.status !== 'completed').map(task => (
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
                                {task.manager && task.manager.name ? task.manager.name : 'Not assigned'}
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                <button
                                  onClick={() => updateTaskStatus(task.task_id, 'completed')}
                                  style={{
                                    backgroundColor: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                  }}
                                  onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
                                  onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
                                >
                                  Mark Complete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Completed Tasks Section */}
                <div className="completed-tasks-section">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '15px',
                    padding: '10px 15px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '8px',
                    borderLeft: '4px solid #16a34a'
                  }}>
                    <h4 style={{ margin: 0, color: '#166534', fontSize: '18px', fontWeight: 'bold' }}>
                      ✅ Completed Tasks ({myTasks.filter(task => task.status === 'completed').length})
                    </h4>
                  </div>
                  
                  {myTasks.filter(task => task.status === 'completed').length === 0 ? (
                    <div className="text-center py-6" style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '20px' }}>
                      <p style={{ color: '#166534', fontStyle: 'italic' }}>No completed tasks yet. Keep working!</p>
                    </div>
                  ) : (
                    <div className="tasks-table-container">
                      <table className="tasks-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Task ID</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Task Name</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Priority</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Manager</th>
                            <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myTasks.filter(task => task.status === 'completed').map(task => (
                            <tr key={task.task_id} style={{ opacity: 0.8 }}>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                {task.task_id}
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                <strong style={{ color: '#6b7280' }}>{task.task_name}</strong>
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                {task.priority ? (
                                  <span style={{ 
                                    color: task.priority === 'very_urgent' ? '#dc2626' : 
                                           task.priority === 'urgent' ? '#ea580c' : 
                                           task.priority === 'medium' ? '#ca8a04' : '#16a34a',
                                    fontWeight: task.priority === 'very_urgent' || task.priority === 'urgent' ? 'bold' : 'normal',
                                    opacity: 0.7
                                  }}>
                                    {task.priority === 'very_urgent' ? '🔴 Very Urgent' :
                                     task.priority === 'urgent' ? '🟠 Urgent' :
                                     task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                                  </span>
                                ) : (
                                  <span style={{ color: '#6b7280', fontStyle: 'italic', opacity: 0.7 }}>No priority set</span>
                                )}
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{ color: '#6b7280' }}>
                                  {task.manager && task.manager.name ? task.manager.name : 'Not assigned'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{ 
                                  color: '#16a34a', 
                                  fontWeight: 'bold',
                                  padding: '4px 8px',
                                  backgroundColor: '#dcfce7',
                                  borderRadius: '4px',
                                  fontSize: '12px'
                                }}>
                                  ✅ Completed
                                </span>
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
        )}
        
        {activeTab === "projects" && (
          <div className="content-section">
            <h3>My Projects {loggedInUser.name && `- ${loggedInUser.name} (ID: ${loggedInUser.id})`}</h3>
            
            <div style={{ marginBottom: '20px' }}>
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
                <p className="no-data">No projects assigned to you yet.</p>
                {loggedInUser.id && (
                  <p style={{ color: '#6b7280', fontSize: '0.9em', marginTop: '8px' }}>
                    Showing projects assigned to Team Member ID: {loggedInUser.id}
                  </p>
                )}
              </div>
            ) : (
              <div className="projects-overview" style={{ marginTop: '20px' }}>
                <div className="projects-table-container">
                  <table className="projects-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Project ID</th>
                        <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Project Name</th>
                        <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                        <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Deadline</th>
                        <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Progress (%)</th>
                        <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>Manager</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(project => (
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
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={progressUpdates[project.project_id] !== undefined ? progressUpdates[project.project_id] : (project.progress || 0)}
                                onChange={(e) => setProgressUpdates(prev => ({ ...prev, [project.project_id]: e.target.value }))}
                                style={{
                                  width: '60px',
                                  padding: '4px 8px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                                placeholder="0-100"
                              />
                              <span>%</span>
                              <button
                                onClick={() => updateProjectProgress(project.project_id, progressUpdates[project.project_id] || project.progress || 0)}
                                disabled={updatingProgress[project.project_id]}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: updatingProgress[project.project_id] ? '#d1d5db' : '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: updatingProgress[project.project_id] ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {updatingProgress[project.project_id] ? 'Updating...' : 'Update'}
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: '12px 15px', borderBottom: '1px solid #e5e7eb' }}>
                            {project.manager && project.manager.name ? project.manager.name : 'Not assigned'}
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

        {activeTab === "profile" && (
          <div className="project-list">
            <h3>My Profile</h3>
            <div className="profile-section">
              {profileLoading ? (
                <div className="text-center py-8">
                  <p>Loading profile...</p>
                </div>
              ) : profileError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {profileError}
                  <button 
                    onClick={fetchCurrentTeamMember}
                    className="ml-2 text-red-800 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="profile-info">
                  <h4>Personal Information</h4>
                  <p><strong>Name:</strong> {currentTeamMember ? currentTeamMember.team_member_name : 'Loading...'}</p>
                  <p><strong>Team Member ID:</strong> {currentTeamMember ? currentTeamMember.team_member_id : 'Loading...'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamMemberDashboard;

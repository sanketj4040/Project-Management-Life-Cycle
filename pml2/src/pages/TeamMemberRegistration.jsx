// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Footer from "../components/Footer";

// function TeamMemberRegistration() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     mobile: "",
//     designation: "",
//     experience: "",
//     skills: "",
//     managerId: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [submitError, setSubmitError] = useState("");
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [managers, setManagers] = useState([]);



//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Clear field-specific error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ""
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Name validation
//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }
    
//     // Username validation
//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.trim().length < 4) {
//       newErrors.username = "Username must be at least 4 characters";
//     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
//       newErrors.username = "Username can only contain letters, numbers and underscore";
//     }
    
//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email address is invalid";
//     }
    
//     // Mobile validation
//     if (!formData.mobile.trim()) {
//       newErrors.mobile = "Mobile number is required";
//     } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
//       newErrors.mobile = "Mobile number must be 10 digits";
//     }
    
//     // Designation validation
//     if (!formData.designation.trim()) {
//       newErrors.designation = "Designation is required";
//     }
    
//     // Experience validation
//     if (!formData.experience) {
//       newErrors.experience = "Experience is required";
//     } else if (isNaN(formData.experience) || parseInt(formData.experience) < 0) {
//       newErrors.experience = "Experience must be a positive number";
//     }
    
//     // Skills validation
//     if (!formData.skills.trim()) {
//       newErrors.skills = "Skills are required";
//     }
    
//     // Manager validation
//     if (!formData.managerId) {
//       newErrors.managerId = "Please select a manager";
//     }
    
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }
    
//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitError("");
    
//     if (validateForm()) {
//       // Simulating API call or registration process
//       try {
//         // In a real app, you would send the data to your backend here
//         console.log("Team Member registration data:", formData);
        
//         // Get the selected manager details
//         const selectedManager = managers.find(manager => manager.id === Number(formData.managerId));
        
//         // Store registration data in localStorage to simulate successful registration
//         localStorage.setItem("registeredTeamMemberEmail", formData.email);
//         localStorage.setItem("teamMemberName", formData.name);
//         localStorage.setItem("teamMemberUsername", formData.username);
        
//         // Store manager information
//         if (selectedManager) {
//           localStorage.setItem("teamMemberManagerId", selectedManager.id);
//           localStorage.setItem("teamMemberManagerName", selectedManager.name);
//           localStorage.setItem("teamMemberManagerDepartment", selectedManager.department);
//         }
        
//         setSubmitSuccess(true);
        
//         // Redirect to login page after a short delay
//         setTimeout(() => {
//           navigate("/team");
//         }, 2000);
//       } catch (error) {
//         setSubmitError("Registration failed. Please try again later.");
//       }
//     }
//   };

//   return (
//     <>
//       <div className="header">
//         <img src="/images/logo.png" alt="Logo" className="logo" />
//         <div className="header-text">
//           <h1>Team Member Registration</h1>
//           <p>Join our project team</p>
//         </div>
//         <nav className="main-nav">
//           <ul className="nav-links">
//             <li><Link to="/" className="nav-link">Home</Link></li>
//             <li><Link to="/services" className="nav-link">Services</Link></li>
//             <li><Link to="/help" className="nav-link">Help</Link></li>
//           </ul>
//         </nav>
//       </div>

//       <div className="registration-container">
//         <div className="registration-form-wrapper">
//           <h2>Create Team Member Account</h2>
//           <p className="form-subtitle">Please fill in your information to register as a Team Member</p>

//           {submitSuccess && (
//             <div className="success-message">
//               Registration successful! Redirecting to login page...
//             </div>
//           )}

//           {submitError && (
//             <div className="error-message">
//               {submitError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="registration-form">
//             <div className="form-single-column">
//               <div className="form-group">
//                 <label htmlFor="name">Full Name*</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter your full name"
//                   className={errors.name ? "error-input" : ""}
//                 />
//                 {errors.name && <div className="input-error">{errors.name}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="username">Username*</label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   placeholder="Create a username"
//                   className={errors.username ? "error-input" : ""}
//                 />
//                 {errors.username && <div className="input-error">{errors.username}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">Email Address*</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email address"
//                   className={errors.email ? "error-input" : ""}
//                 />
//                 {errors.email && <div className="input-error">{errors.email}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="mobile">Mobile Number*</label>
//                 <input
//                   type="tel"
//                   id="mobile"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   placeholder="Enter your 10-digit mobile number"
//                   className={errors.mobile ? "error-input" : ""}
//                 />
//                 {errors.mobile && <div className="input-error">{errors.mobile}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="designation">Designation*</label>
//                 <input
//                   type="text"
//                   id="designation"
//                   name="designation"
//                   value={formData.designation}
//                   onChange={handleChange}
//                   placeholder="Enter your job title"
//                   className={errors.designation ? "error-input" : ""}
//                 />
//                 {errors.designation && <div className="input-error">{errors.designation}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="experience">Experience (years)*</label>
//                 <input
//                   type="number"
//                   id="experience"
//                   name="experience"
//                   value={formData.experience}
//                   onChange={handleChange}
//                   placeholder="Enter years of experience"
//                   min="0"
//                   step="0.5"
//                   className={errors.experience ? "error-input" : ""}
//                 />
//                 {errors.experience && <div className="input-error">{errors.experience}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="skills">Skills*</label>
//                 <input
//                   type="text"
//                   id="skills"
//                   name="skills"
//                   value={formData.skills}
//                   onChange={handleChange}
//                   placeholder="Enter your skills (comma separated)"
//                   className={errors.skills ? "error-input" : ""}
//                 />
//                 {errors.skills && <div className="input-error">{errors.skills}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="managerId">Select Manager*</label>
//                 <select
//                   id="managerId"
//                   name="managerId"
//                   value={formData.managerId}
//                   onChange={handleChange}
//                   className={errors.managerId ? "error-input" : ""}
//                 >
//                   <option value="">-- Select a Manager --</option>
//                   {managers.map(manager => (
//                     <option key={manager.id} value={manager.id}>
//                       {manager.name} - {manager.department}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.managerId && <div className="input-error">{errors.managerId}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">Password*</label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Create a password"
//                   className={errors.password ? "error-input" : ""}
//                 />
//                 {errors.password && <div className="input-error">{errors.password}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="confirmPassword">Confirm Password*</label>
//                 <input
//                   type="password"
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Confirm your password"
//                   className={errors.confirmPassword ? "error-input" : ""}
//                 />
//                 {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
//               </div>
//             </div>

//             <div className="form-footer">
//               <button type="submit" className="register-button">Register as Team Member</button>
//               <p className="login-link">
//                 Already have an account? <Link to="/team">Log in</Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
      
//       <Footer />
//     </>
//   );
// }

// export default TeamMemberRegistration;

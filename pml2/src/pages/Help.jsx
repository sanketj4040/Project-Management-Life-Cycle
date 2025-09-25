import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiSupportService } from "../services/apiService";

function Help() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    description: ""
  });

  // Error state
  const [errors, setErrors] = useState({});
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState("");
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Email validation
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Mobile validation
    if (!formData.mobile || !formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    
    // Subject validation
    if (!formData.subject || !formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    // Description validation
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    console.log("Form validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Create help request data matching exactly what the backend expects
        const helpData = {
          name: formData.name,
          email: formData.email,
          number: formData.mobile,  // Mobile from form needs to be mapped to number in DB
          subject: formData.subject,
          description: formData.description
        };
        
        console.log("Submitting help request:", helpData);
        
        // Call the real API service function to create a help request
        await apiSupportService.createSupportRequest(helpData);
        
        // Show success message
        setSuccessMessage("Your support request has been submitted successfully!");
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          description: ""
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } catch (error) {
        console.error("Error submitting support request:", error);
        let errorMessage = "Failed to submit support request. Please try again.";
        
        // Get detailed error message if available
        if (error.response && error.response.data) {
          console.log("Server error details:", error.response.data);
          if (typeof error.response.data === 'object') {
            errorMessage = Object.keys(error.response.data)
              .map(key => `${key}: ${error.response.data[key]}`)
              .join(', ');
          }
        }
        
        setErrors({ 
          submit: `${errorMessage} (${error.message})` 
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Form has errors");
    }
  };

  return (
    <>
      <Header />
      <main style={{paddingTop: '100px', paddingBottom: '20px', minHeight: 'calc(100vh - 150px)'}}>
        <div className="help-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div className="help-section">
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.8rem' }}>Contact Support</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>Please fill out the form below to get in touch with our support team:</p>
            
            {successMessage && (
              <div className="success-message" style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontWeight: '500'
              }}>
                {successMessage}
              </div>
            )}
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name" 
                  className={`border rounded px-3 py-2 w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="error-text" style={{color: '#dc2626', fontSize: '0.85em', marginTop: '4px'}}>{errors.name}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address" 
                  className={`border rounded px-3 py-2 w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="error-text" style={{color: '#dc2626', fontSize: '0.85em', marginTop: '4px'}}>{errors.email}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input 
                  type="tel" 
                  id="mobile" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number" 
                  className={`border rounded px-3 py-2 w-full ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.mobile && <p className="error-text" style={{color: '#dc2626', fontSize: '0.85em', marginTop: '4px'}}>{errors.mobile}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter the subject of your inquiry" 
                  className={`border rounded px-3 py-2 w-full ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.subject && <p className="error-text" style={{color: '#dc2626', fontSize: '0.85em', marginTop: '4px'}}>{errors.subject}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your issue or question in detail" 
                  rows="5"
                  className={`border rounded px-3 py-2 w-full ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                ></textarea>
                {errors.description && <p className="error-text" style={{color: '#dc2626', fontSize: '0.85em', marginTop: '4px'}}>{errors.description}</p>}
              </div>
              
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? '#93c5fd' : '#2563eb', 
                  color: 'white', 
                  padding: '12px 24px', 
                  borderRadius: '6px', 
                  fontWeight: 'bold', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  width: '100%',
                  marginTop: '10px'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
              </button>
              
              {errors.submit && (
                <p className="error-text" style={{
                  color: '#dc2626', 
                  fontSize: '0.9em', 
                  marginTop: '10px',
                  textAlign: 'center'
                }}>
                  {errors.submit}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Help;

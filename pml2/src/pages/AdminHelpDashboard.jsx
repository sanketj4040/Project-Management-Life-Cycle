import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllSupportRequests, updateSupportRequest } from "../services/supportService";

function AdminHelpDashboard() {
  // State for support requests
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseText, setResponseText] = useState("");
  
  // Fetch support requests on component mount
  useEffect(() => {
    fetchSupportRequests();
  }, []);
  
  // Function to fetch support requests
  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllSupportRequests();
      setSupportRequests(data);
      
      // Select the first request by default if available
      if (data.length > 0 && !selectedRequest) {
        setSelectedRequest(data[0]);
      }
    } catch (err) {
      setError("Failed to fetch support requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update request status
  const updateStatus = async (id, newStatus) => {
    try {
      const updatedRequest = await updateSupportRequest(id, { status: newStatus });
      
      // Update the requests in state
      setSupportRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === id ? updatedRequest : request
        )
      );
      
      // Update selected request if it's the one being updated
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(updatedRequest);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update request status. Please try again.");
    }
  };
  
  // Function to handle viewing a request
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setResponseText(""); // Clear response text
  };
  
  // Function to handle sending a response
  const handleSendResponse = async () => {
    if (!selectedRequest || !responseText.trim()) {
      return;
    }
    
    try {
      // Here you would typically send the response to the customer via email
      // and update the request in the database
      
      // For now, just update the status to in-progress
      await updateStatus(selectedRequest.id, 'in-progress');
      
      alert("Response sent successfully");
      setResponseText("");
    } catch (err) {
      console.error("Error sending response:", err);
      alert("Failed to send response. Please try again.");
    }
  };
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <>
      <Header />
      <main style={{paddingTop: '100px', paddingBottom: '20px', minHeight: 'calc(100vh - 150px)'}}>
        <div className="admin-help-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div className="admin-section" style={{
            background: 'white',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{
              color: '#1e293b',
              fontSize: '1.8em',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #e2e8f0'
            }}>Support Requests Dashboard</h2>
            
            {loading ? (
              <div style={{textAlign: 'center', padding: '40px'}}>
                <p>Loading support requests...</p>
              </div>
            ) : error ? (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            ) : supportRequests.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px'}}>
                <p>No support requests found.</p>
              </div>
            ) : (
              <div className="support-requests-table">
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{backgroundColor: '#f8fafc'}}>
                      <th style={{padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>ID</th>
                      <th style={{padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Name</th>
                      <th style={{padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Email</th>
                      <th style={{padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Mobile</th>
                      <th style={{padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Subject</th>
                      <th style={{padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Created</th>
                      <th style={{padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Status</th>
                      <th style={{padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportRequests.map((request) => (
                      <tr 
                        key={request.id} 
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: selectedRequest && selectedRequest.id === request.id ? '#f0f9ff' : 'transparent',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleViewRequest(request)}
                      >
                        <td style={{padding: '12px 15px'}}>{request.id}</td>
                        <td style={{padding: '12px 15px'}}>{request.name}</td>
                        <td style={{padding: '12px 15px'}}>
                          <a 
                            href={`mailto:${request.email}`} 
                            style={{color: '#2563eb'}}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {request.email}
                          </a>
                        </td>
                        <td style={{padding: '12px 15px'}}>
                          <a 
                            href={`tel:${request.mobile}`} 
                            style={{color: '#2563eb'}}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {request.mobile}
                          </a>
                        </td>
                        <td style={{padding: '12px 15px'}}>{request.subject}</td>
                        <td style={{padding: '12px 15px'}}>{formatDate(request.createdAt)}</td>
                        <td style={{padding: '12px 15px'}}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.85em',
                            fontWeight: '600',
                            ...(request.status === 'pending' ? {
                              backgroundColor: '#fef3c7',
                              color: '#d97706'
                            } : request.status === 'in-progress' ? {
                              backgroundColor: '#dbeafe',
                              color: '#2563eb'
                            } : {
                              backgroundColor: '#d1fae5',
                              color: '#059669'
                            })
                          }}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td style={{padding: '12px 15px'}}>
                          <div className="request-actions" style={{display: 'flex', gap: '8px'}}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(request.id, 'pending');
                              }}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#fef3c7',
                                color: '#d97706',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85em'
                              }}
                            >
                              Pending
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(request.id, 'in-progress');
                              }}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#dbeafe',
                                color: '#2563eb',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85em'
                              }}
                            >
                              In Progress
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(request.id, 'resolved');
                              }}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#d1fae5',
                                color: '#059669',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85em'
                              }}
                            >
                              Resolved
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="admin-section" style={{
            background: 'white',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            marginTop: '30px'
          }}>
            <h2 style={{
              color: '#1e293b',
              fontSize: '1.8em',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #e2e8f0'
            }}>Support Request Details</h2>
            
            {/* Request Details */}
            {selectedRequest ? (
              <div className="request-detail">
                <h3 style={{color: '#1e293b', fontSize: '1.4em', marginBottom: '15px'}}>
                  {selectedRequest.subject}
                </h3>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px'}}>
                  <div>
                    <p style={{margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9em'}}>From:</p>
                    <p style={{margin: '0 0 15px 0', fontWeight: '500'}}>{selectedRequest.name}</p>
                    
                    <p style={{margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9em'}}>Email:</p>
                    <p style={{margin: '0 0 15px 0'}}>
                      <a href={`mailto:${selectedRequest.email}`} style={{color: '#2563eb'}}>
                        {selectedRequest.email}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <p style={{margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9em'}}>Mobile:</p>
                    <p style={{margin: '0 0 15px 0'}}>
                      <a href={`tel:${selectedRequest.mobile}`} style={{color: '#2563eb'}}>
                        {selectedRequest.mobile}
                      </a>
                    </p>
                    
                    <p style={{margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9em'}}>Date Submitted:</p>
                    <p style={{margin: '0 0 15px 0'}}>{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <p style={{margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9em'}}>Description:</p>
                  <p style={{
                    margin: '0',
                    padding: '15px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    lineHeight: '1.6'
                  }}>
                    {selectedRequest.description}
                  </p>
                </div>
                
                <div style={{marginTop: '30px'}}>
                  <h4 style={{color: '#1e293b', fontSize: '1.2em', marginBottom: '15px'}}>Response</h4>
                  
                  <textarea 
                    placeholder="Type your response here..."
                    rows="5"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      marginBottom: '15px'
                    }}
                  ></textarea>
                  
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button 
                      onClick={handleSendResponse}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Send Response
                    </button>
                    
                    <button 
                      onClick={() => updateStatus(selectedRequest.id, 'resolved')}
                      style={{
                        backgroundColor: '#d1fae5',
                        color: '#059669',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{textAlign: 'center', padding: '40px'}}>
                <p>Select a support request to view details.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminHelpDashboard;

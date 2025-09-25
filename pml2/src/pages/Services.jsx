import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Services() {
  return (
    <>
      <Header />
      <main style={{paddingTop: '100px', paddingBottom: '20px', minHeight: 'calc(100vh - 150px)'}}>
        <div className="services-container">
          <h2 className="services-title">Our Project Management Services</h2>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <img src="/images/services_task_mng.png" alt="Task Management" />
              </div>
              <h3>Task Management</h3>
              <p>Create, assign, and track tasks with ease. Set priorities, deadlines, and monitor progress in real-time.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <img src="/images/services_progress.png" alt="Progress Tracking" />
              </div>
              <h3>Progress Tracking</h3>
              <p>Visual progress indicators help you keep projects on schedule with percentage-based completion tracking.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <img src="/images/services_graphical.png" alt="Graphical Reports" />
              </div>
              <h3>Graphical Reports</h3>
              <p>Comprehensive visual reporting to analyze project performance, resource allocation, and timeline adherence.</p>
            </div>
          </div>
          
          <div className="service-cta">
            <h3>Ready to streamline your project management?</h3>
            <p>Choose the role that fits your needs and get started today.</p>
            <div className="cta-buttons">
              <a href="/admin" className="cta-button admin">Admin Access</a>
              <a href="/manager" className="cta-button manager">Manager Access</a>
              <a href="/team" className="cta-button team">Team Member Access</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Services;
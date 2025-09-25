import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <div className="dashboard">
        <div className="card">
          <img
            src="/images/admin-img.png"
            alt="Admin"
            className="role-img"
          />
          <h2>Admin Panel</h2>
          <ul>
            <li>• Manage all projects</li>
            <li>• Oversee team members</li>
            <li>• System administration</li>
            <li>• Generate reports</li>
          </ul>
          <Link to="/admin">
            <button>Admin Login</button>
          </Link>
        </div>

        <div className="card">
          <img
            src="/images/manager-img (1).png"
            alt="Manager"
            className="role-img"
          />
          <h2>Manager Dashboard</h2>
          <ul>
            <li>• Create and manage projects</li>
            <li>• Assign tasks to team members</li>
            <li>• Track project progress</li>
            <li>• Team coordination</li>
          </ul>
          <Link to="/manager">
            <button>Manager Login</button>
          </Link>
        </div>

        <div className="card">
          <img
            src="/images/team-member-img.png"
            alt="Team Member"
            className="role-img"
          />
          <h2>Team Member Portal</h2>
          <ul>
            <li>• View assigned tasks</li>
            <li>• Update task progress</li>
            <li>• Collaborate with team</li>
            <li>• Submit deliverables</li>
          </ul>
          <Link to="/team">
            <button>Team Member Login</button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

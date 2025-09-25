import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerLogin from "./pages/ManagerLogin";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerProfile from "./pages/ManagerProfile";
// Manager registration is now handled by Admin Dashboard
import TeamMemberLogin from "./pages/TeamMemberLogin";
import TeamMemberDashboard from "./pages/TeamMemberDashboard";
// Team member registration is now handled by Admin Dashboard
import Services from "./pages/Services";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/manager" element={<ManagerLogin />} />
      {/* Registration is now handled by Admin Dashboard */}
      {/* <Route path="/manager-register" element={<ManagerRegistration />} /> */}
      <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      <Route path="/profile" element={<ManagerProfile />} />
      <Route path="/team" element={<TeamMemberLogin />} />
      {/* Registration is now handled by Admin Dashboard */}
      {/* <Route path="/team-register" element={<TeamMemberRegistration />} /> */}
      <Route path="/team-dashboard" element={<TeamMemberDashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/help" element={<Help />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;



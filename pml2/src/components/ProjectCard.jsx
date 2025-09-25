import React from "react";

function ProjectCards() {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <div style={{ background: "#333", color: "#fff", padding: "1rem", borderRadius: "8px" }}>
        <h3>Project 1</h3>
        <p>Description for project 1.</p>
      </div>
      <div style={{ background: "#333", color: "#fff", padding: "1rem", borderRadius: "8px" }}>
        <h3>Project 2</h3>
        <p>Description for project 2.</p>
      </div>
      {/* Add more cards as needed */}
    </div>
  );
}

export default ProjectCards;
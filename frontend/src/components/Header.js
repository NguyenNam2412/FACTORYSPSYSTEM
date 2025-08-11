import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ empName, empId }) {
  const navigate = useNavigate();
  const empInfo = JSON.parse(localStorage.getItem("empInfo"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("empInfo");
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#1976d2",
        color: "#fff",
      }}
    >
      <div>
        {empInfo.empName} ({empInfo.empId})
      </div>
      <button
        style={{
          backgroundColor: "#fff",
          color: "#1976d2",
          border: "none",
          padding: "6px 12px",
          cursor: "pointer",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;

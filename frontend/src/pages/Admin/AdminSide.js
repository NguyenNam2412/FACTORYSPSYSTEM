import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authConstants from "@store/constants/authConstants";

function AdminSide() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    dispatch({
      type: authConstants.LOGOUT,
    });
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
      <div>Hello {username}</div>
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

export default AdminSide;

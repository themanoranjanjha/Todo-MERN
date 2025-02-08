// components/LogoutPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../services/apis"; // Adjust the path as necessary
import Cookies from "js-cookie";

export default function LogoutPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Logging out...");

      const response = await fetch(endpoint.LOGOUT_API, { // Adjust the URL to your backend
        method: "POST",
        credentials: "include", // Important for sending cookies
      });

      // console.log("Logout API Response:", response);

      if (response.ok) {
        console.log("Logout successful!");
        localStorage.removeItem("user");
        // Remove tokens
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");

        // Redirect to login
        navigate("/login");
      } else {
        const data = await response.json(); // Parse the JSON response
        console.error("Logout failed: Unexpected response status", response.status);
        alert(data.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An unexpected error occurred during logout.");
    }
  };

  return (
    // <div className="flex justify-center items-center h-screen bg-gray-100">
      
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
    
    // </div>
  );
}
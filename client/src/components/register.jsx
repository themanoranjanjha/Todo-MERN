import React, { useState } from "react";
import { apiConnector } from "../services/apiConnector"; // Adjust the path
import { AxiosError } from "axios";
import { endpoint } from "../services/apis";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
 
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!userName || !email || !fullName || !password || !avatar) {
      setMessage("Please provide all required fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Create form data for the request
      const formData = new FormData();
      formData.append("username", userName);
      formData.append("email", email);
      formData.append("fullname", fullName);
      formData.append("password", password);
      formData.append("avatar", avatar);

      // API call using apiConnector
      const response = await apiConnector(
        "POST",
        endpoint.SIGNIN_API,
        // "http://localhost:8000/api/v1/users/register",
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response.status === 201) {
        setMessage("User registered successfully!");
        navigate("/todo");

      } else {
        setMessage("Registration failed.");
      }
    } catch (error) {
      // Handling errors
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.message || "An error occurred. Please try again.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {message && (
          <p
            className={`mb-4 text-center font-semibold ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Username Field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none "
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Full Name Field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="fullname"
          >
            Full Name
          </label>
          <input
            id="fullname"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Avatar Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            onChange={(e) => setAvatar(e.target.files[0])}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register"}
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            If you already have an account,{" "}
            <a
              href="/login"
              className="text-blue-500 hover:underline"
            >
              please login
            </a>.
          </p>
        </div>
      </form>
      
    </div>

  );
};

export default Register;

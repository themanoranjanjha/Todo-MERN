import React, { useState } from "react";
import { apiConnector } from "../services/apiConnector"; // Adjust the path as needed
import { AxiosError } from "axios";
import { endpoint } from "../services/apis"; // Define the LOGIN_API endpoint in your apis.js file

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!username || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Create login payload
      const loginData = {
        username,
        email,
        password,
      };

      // API call using apiConnector
      const response = await apiConnector("POST", endpoint.LOGIN_API, loginData, {
        "Content-Type": "application/json",
      });

      if (response.status === 200) {
        setMessage("Login successful!");
        console.log("User Data:", response.data);
        // Perform actions like storing token, redirecting, etc.
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (error) {
      // Handle errors from Axios
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.message || "An error occurred. Please try again.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {message && (
          <p
            className={`mb-4 text-center font-semibold ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Don’t have an account?{" "}
            <a
              href="/"
              className="text-blue-500 hover:underline"
            >
              Register here
            </a>.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;

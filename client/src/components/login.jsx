import React, { useState , useContext} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { endpoint } from "../services/apis";
import { UserContext } from "../context/UserContext"

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Store user data
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!username || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const loginData = { username, email, password };

      const response = await fetch(endpoint.LOGIN_API, { // Adjust the URL to your backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify(loginData),
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        setMessage("Login successful!");
        const { user, accessToken, refreshToken } = data.data; // Access the data correctly

        // Store user data and tokens
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        
        Cookies.set("accessToken", accessToken, { secure: true, sameSite: "Strict" });
        Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "Strict" });

        // console.log("User data:", user);
        // console.log("Access Token:", accessToken);
        // console.log("Refresh Token:", refreshToken);
        

        // Redirect to the todo page
        navigate("/todo");
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {message && (
          <p className={`mb-4 text-center font-semibold ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-lg transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Don’t have an account? <a href="/" className="text-blue-500 hover:underline">Register here</a>.
          </p>
        </div>
      </form>

      {/* Debugging - Display User Data */}
      {/* {userData && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">User  Info:</h3>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Full Name:</strong> {userData.fullname}</p>
          {userData.avatar && <img src={userData.avatar} alt="Avatar" className="w-16 h-16 rounded-full mt-2" />}
        </div>
      )} */}
    </div>
  );
};

export default Login;
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { endpoint } from "../services/apis"; // Adjust the import based on your project structure

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");


      if (!accessToken) {
        if (refreshToken) {
        console.log("accessToken geting from backend");
          try {
            const response = await fetch(endpoint.REFRESH_TOKEN_API, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // Important for sending cookies
              body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
              throw new Error("Failed to refresh token");
            }

            const data = await response.json();
            const { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn } = data.data;

            // Set new tokens in cookies with expiration time
            const expirationTime = expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined;

            Cookies.set("accessToken", newAccessToken, {
              path: "/",
              secure: true, // Set to true in production
              sameSite: "Strict",
              expires: expirationTime ? expirationTime : undefined,
            });
            Cookies.set("refreshToken", newRefreshToken, {
              path: "/",
              secure: true, // Set to true in production
              sameSite: "Strict",
              expires: expirationTime ? expirationTime : undefined,
            });

            setIsAuthenticated(true);
          } catch (error) {
            console.error("Refresh token failed:", error);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(true);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
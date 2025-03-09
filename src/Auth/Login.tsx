import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/google.svg";
import appleIcon from "../assets/apple.svg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-medium mb-8">Kindly Login</h1>

        <form className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Contact"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none transition-colors bg-transparent"
            />
            
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none transition-colors bg-transparent"
              />
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password
                </button>
              </div>
            </div>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">or</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="p-2 hover:opacity-80 transition-opacity"
              onClick={() => {/* Handle Google login */}}
            >
              <img src={googleIcon} alt="Google" className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="p-2 hover:opacity-80 transition-opacity"
              onClick={() => {/* Handle Apple login */}}
            >
              <img src={appleIcon} alt="Apple" className="w-6 h-6" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded hover:bg-blue-800 transition-colors"
            disabled={isLoading}
          >
            Login
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
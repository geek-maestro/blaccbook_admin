import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // TODO: Implement password reset logic here
      setMessage("Password reset instructions have been sent to your email.");
    } catch (error) {
      setMessage("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-medium mb-2">Forgot Password</h1>
        <p className="text-gray-600 text-sm mb-8">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none transition-colors bg-transparent"
              required
            />
          </div>

          {message && (
            <div className={`text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded hover:bg-blue-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword; 
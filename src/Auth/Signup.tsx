import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-white p-4">
      <div className="w-full pt-8 px-8">
        <div className="max-w-2xl mx-auto relative">
        <h1 className="text-2xl font-bold mb-6 absolute -left-60 -top-10">REGISTRATION</h1>

          <p className="text-gray-600 mb-8 mt-8 font-semibold">Kindly register here.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contact"
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-8">
              <input
                type="file"
                onChange={handleDocumentUpload}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer block"
                style={{ borderRadius: '16px' }}
              >
                <span className="text-red-500">Click here</span>
                <span className="text-gray-600"> to upload your document</span>
              </label>
            </div>

            <div className="flex justify-center space-x-4 text-sm mt-6">
              <a href="#" className="text-gray-600 hover:underline">Terms & condition</a>
              <a href="#" className="text-gray-600 hover:underline">Privacy Policy</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 mt-6"
            >
              Register
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
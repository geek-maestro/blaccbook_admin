import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignUp } from "@/services/auth1.service";

const Signup = () => {
  const navigate = useNavigate();
  const { mutate: signUp, isPending, error } = useSignUp();

  // Form state
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "vendor",
    avatar: ""
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(form, {
      onSuccess: () => navigate("/dashboard"), // Redirect after success
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="grid grid-cols-1 lg:grid-cols-2 shadow-none border-0 overflow-hidden w-full max-w-[70%]  max-h-[90vh] bg-white">
        {/* Left Side */}
        <div className="hidden lg:block relative h-full min-h-[600px] bg-gradient-to-br from-blue-600/90 to-blue-800/90 md:flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">Welcome to BlaccBook</h1>
          <p className="text-teal-100 text-center max-w-md">Invest in blacc Businesses</p>
        </div>

        {/* Right Side (Form) */}
        <CardContent className="w-full p-8 lg:p-12 flex flex-col justify-center h-[95vh] overflow-y-auto">
          <div className="max-w-md mx-auto w-full h-full">
            <CardHeader className="text-center p-0 mb-4">
              <CardTitle className="text-3xl font-bold text-blue-800 mb-2">Sign Up</CardTitle>
              <CardDescription>Register To Be Part of BlaccBook</CardDescription>
            </CardHeader>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-3 h-full" onSubmit={handleSubmit}>
              {/** First Name */}
              <div className="space-y-1">
                <Label htmlFor="firstname">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="firstname"
                    name="firstname"
                    className="pl-10"
                    type="text"
                    value={form.firstname}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              {/** Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="lastname"
                    name="lastname"
                    className="pl-10"
                    type="text"
                    value={form.lastname}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              {/** Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="username"
                    name="username"
                    className="pl-10"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              {/** Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    className="pl-10"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              {/** Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    className="pl-10"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              {/** Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={isPending}
              >
                {isPending ? "Signing up..." : "Sign Up"}
              </Button>

              {/** Google Sign-In */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full" disabled={isPending}>
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign in with Google
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;

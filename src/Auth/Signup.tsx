import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

import images from "../assets/comp2.jpg";

import { Mail, Lock, User, Eye, EyeOff, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignUp, useSocialLogin } from "@/services/auth1.service";

const Signup = () => {
  const navigate = useNavigate();
  const { mutate: signUp, isPending, error } = useSignUp();
  const { mutate: socialLogin, isPending: socialLoginPending, error: socialLoginError } = useSocialLogin();

  // Form state
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "vendor",
    avatar: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ""
  });
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Check password strength
    if (name === "password") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Check password match
    if (name === "confirmPassword" || name === "password") {
      const isMatch = form.password === (name === "confirmPassword" ? value : form.confirmPassword);
      setPasswordMatch(isMatch);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 2) feedback = "Weak password";
    else if (score < 4) feedback = "Fair password";
    else feedback = "Strong password";

    return { score, feedback };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (form.password !== form.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    // Remove confirmPassword from form data before submission
    const { confirmPassword, ...signupData } = form;
    
    signUp(signupData, {
      onSuccess: () => navigate("/home"),
      onError: (error) => {
        console.error("Signup error:", error);
      }
    });
  };

  // Handle social login
  const handleSocialLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken && result.user) {
          socialLogin(credential.accessToken, {
            onSuccess: () => navigate("/home"),
            onError: (error) => {
              console.error("Social login error:", error);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Google sign in error:", error);
      });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 2) return "text-red-500";
    if (passwordStrength.score < 4) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl">
        <Card className="grid grid-cols-1 lg:grid-cols-2 shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
          {/* Left side with image */}
          <div className="hidden lg:block relative h-full min-h-[700px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${images})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-indigo-900/95 flex flex-col items-center justify-center p-12">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-white leading-tight">
                      Join <span className="text-blue-200">BlaccBook</span>
                    </h1>
                    <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                      Connect your business with investors and grow your community impact. Start your journey today.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-blue-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Free Registration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Secure Platform</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side with form */}
          <div className="flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Join BlaccBook and start your journey
                </p>
              </div>

              {(error || socialLoginError) && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error instanceof Error ? error.message : socialLoginError instanceof Error ? socialLoginError.message : "An error occurred"}
                  </AlertDescription>
                </Alert>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="firstname"
                        name="firstname"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        type="text"
                        value={form.firstname}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="lastname"
                        name="lastname"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        type="text"
                        value={form.lastname}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        required
                        disabled={isPending}
                      />
                    </div>
                  </div>
                </div>

                {/* Username and Email Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="username"
                        name="username"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        required
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        name="email"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        disabled={isPending}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        required
                        disabled={isPending}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {form.password && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={getPasswordStrengthColor()}>
                          {passwordStrength.feedback}
                        </span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 w-8 rounded-full ${
                                level <= passwordStrength.score
                                  ? passwordStrength.score < 2
                                    ? "bg-red-500"
                                    : passwordStrength.score < 4
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors ${
                          form.confirmPassword && !passwordMatch ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        disabled={isPending}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isPending}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {form.confirmPassword && !passwordMatch && (
                      <div className="flex items-center space-x-2 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>Passwords do not match</span>
                      </div>
                    )}
                    {form.confirmPassword && passwordMatch && form.confirmPassword && (
                      <div className="flex items-center space-x-2 text-sm text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <span>Passwords match</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  disabled={isPending || !passwordMatch}
                >
                  {isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  disabled={isPending || socialLoginPending}
                  onClick={handleSocialLogin}
                >
                  <svg
                    className="mr-3 h-5 w-5"
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
                  {socialLoginPending ? "Creating account..." : "Continue with Google"}
                </Button>

                <div className="text-center pt-6">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      type="button"
                      className="text-blue-600 font-semibold hover:text-blue-700 p-0 h-auto"
                      onClick={() => !isPending && navigate("/login")}
                    >
                      Sign In
                    </Button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import images from "../assets/comp1.jpg";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useCredSignIn } from "@/services/auth1.service";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const { mutate: signIn, isPending, error } = useCredSignIn();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAppError(null);
    signIn(
      { email, password },
      {
        onSuccess: async (data) => {
          console.log("User ID:", data.user?.uid);
          console.log("Token:", (data as any).token);

          // Resolve role from userData
          const rawRole = data.userData?.role || data.userData?.userType;
          const role = typeof rawRole === 'string' ? rawRole.toLowerCase().trim() : '';
          console.log("Resolved role for routing:", role);

          if (role === 'customer' || role === 'consumer') {
            // Customer accounts must use the mobile app
            setAppError("Use mobile app to view your customer page.");
            try {
              const { signOut } = await import("firebase/auth");
              const { auth } = await import("@/lib/firebaseConfig");
              await signOut(auth);
            } catch (signOutErr) {
              console.warn("Error signing out customer session:", signOutErr);
            }
            localStorage.removeItem("userData");
            sessionStorage.clear();
            return;
          }

          if (role === 'super_admin' || role === 'admin' || ['support_staff', 'content_moderator', 'finance_manager'].includes(role)) {
            navigate("/admin");
          } else if (role === 'merchant' || role === 'business_owner') {
            navigate("/home", { state: { token: (data as any).token } });
          } else {
            // Default fallback for merchant portal
            navigate("/home", { state: { token: (data as any).token } });
          }
        },
        onError: (error) => {
          console.error("Login error:", error);
        }
      }
    );
  };

  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 h-screen">
      <div className="w-full max-w-6xl">
        <Card className="grid grid-cols-1 lg:grid-cols-2 shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
          {/* Left side with image */}
          <div className="hidden lg:block relative h-full min-h-[569px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${images})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-indigo-900/95 flex flex-col items-center justify-center p-12">
                <div className="text-center space-y-6">
                  <div className=" bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-xl overflow-hidden border-2 border-white/30">
                    <img src="/logo.jpeg" alt="BlaccBook Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-white leading-tight">
                      Welcome to <span className="text-blue-200">BlaccBook</span>
                    </h1>
                    <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                      Connect with innovative black-owned businesses and discover investment opportunities that drive community growth.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-blue-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <span className="text-sm">Secure Platform</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <span className="text-sm">Verified Businesses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side with form */}
          <div className="flex items-center justify-center p-8 lg:p-1">
            <div className="w-full max-w-md space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-sm">
                  Sign in to your account to continue
                </p>
              </div>

              {(error || appError) && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {appError || (error instanceof Error ? error.message : "An error occurred")}
                  </AlertDescription>
                </Alert>
              )}

              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      type="button"
                      className="text-blue-600 font-semibold hover:text-blue-700 p-0 h-auto"
                      onClick={() => !isPending && navigate("/signup")}
                    >
                      Create Account
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
}

export default Login;

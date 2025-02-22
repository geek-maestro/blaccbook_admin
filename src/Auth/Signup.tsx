import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// import images from "../images/loginpic.jpg";

import { Mail, Lock ,User} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="grid grid-cols-1 lg:grid-cols-2 shadow-none border-0 overflow-hidden w-full max-w-5xl bg-white">
        {/* Left side with image */}
        <div className="hidden lg:block relative h-full min-h-[600px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              // backgroundImage: `url(${images})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/90 flex flex-col items-center justify-center p-8">
              {/* <RiHospitalLine className="text-6xl text-white mb-6" /> */}
              <h1 className="text-4xl font-bold text-white mb-4 text-center">
                Welcome to BlaccBook
              </h1>
              <p className="text-teal-100 text-center max-w-md">
      Invest in blacc Businesses
              </p>
            </div>
          </div>
        </div>

        {/* Right side with form */}
        <CardContent className="w-full p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <CardHeader className="text-center p-0 mb-8">
              <CardTitle className="text-3xl font-bold text-blue-800 mb-2">Sign Up</CardTitle>
              <CardDescription>Register To Be Part of BalccBook</CardDescription>
            </CardHeader>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form  className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    className="pl-10"
                    type="email"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    className="pl-10"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    className="pl-10"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Confrim Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    className="pl-10"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
               
                disabled={isLoading}
                onClick={() => !isLoading && navigate("/signup")}
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Sign in with Google
              </Button>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    type="button"
                    className="text-blue-600 font-semibold hover:text-blue-700 p-0"
                    onClick={() => !isLoading && navigate("/signup")}
                  >Sign In
                    
                  </Button>
                </p>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
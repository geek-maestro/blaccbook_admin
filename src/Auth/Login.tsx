import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";

function Login() {
  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-blue-200 to-blue-400">
      <Card className="w-96 shadow-2xl rounded-2xl bg-white">
        <CardContent className="p-8">
          <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-6">Welcome Back</h2>
          <div className="space-y-5">
            <div>
              <Label className="text-gray-700">Email</Label>
              <Input type="email" placeholder="Enter your email" className="mt-1" />
            </div>
            <div>
              <Label className="text-gray-700">Password</Label>
              <Input type="password" placeholder="Enter your password" className="mt-1" />
            </div>
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Login</Button>
            <div className="flex items-center justify-center text-gray-500 text-sm">OR</div>
            <Button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
              <FcGoogle className="text-xl" /> Register with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

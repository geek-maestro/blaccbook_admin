import React, { useState, ChangeEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Upload
} from "lucide-react";
import Sidebar from '@/components/Sidebar';

const SettingsPage = () => {
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setTimeout(() => {
        setProfileImage(URL.createObjectURL(file));
        setLoading(false);
        //unimportant
        console.log(loading);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
         <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full lg:max-w-4xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input placeholder="johndoe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Customize how others see you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileImage} />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" className="relative">
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                          <Upload className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Recommended: Square JPG, PNG. Max 1MB.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Input placeholder="Tell us about yourself" />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input type="url" placeholder="https://example.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-gray-500">
                        Choose who can see your profile
                      </p>
                    </div>
                    <Select defaultValue="public">
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Show Online Status</Label>
                      <p className="text-sm text-gray-500">
                        Let others see when you're online
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Allow Search Engines</Label>
                      <p className="text-sm text-gray-500">
                        Let search engines index your profile
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive push notifications
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4 sm:gap-4">
          <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
          <Button className="w-full sm:w-auto">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
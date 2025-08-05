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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Upload,
  Save,
  Loader2,
  Camera,
  Mail,
  Calendar,
  Shield,
  Edit3,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Sidebar from '@/components/Sidebar';
import { useUserProfile, useUpdateProfile, uploadProfileImage } from '@/services/profile.service';
import { IUser } from '@/Types/auth';

const SettingsPage = () => {
  const { toast } = useToast();
  const { data: user, isLoading: loadingProfile } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const [formData, setFormData] = useState<Partial<IUser>>({
    firstname: '',
    lastname: '',
    username: '',
    email: ''
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update form data when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email || ''
      });
      setProfileImage(user.avatarUrl || '');
    }
  }, [user]);

  const handleInputChange = (field: keyof IUser, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageLoading(true);
      try {
        const imageUrl = await uploadProfileImage(file);
        setProfileImage(imageUrl);
        toast({
          title: "Image uploaded successfully",
          description: "Your profile image has been updated.",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        profileData: formData,
        displayName: `${formData.firstname} ${formData.lastname}`.trim(),
        photoURL: profileImage
      });

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email || ''
      });
      setProfileImage(user.avatarUrl || '');
    }
    setIsEditing(false);
  };

  if (loadingProfile) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    {/* Profile Image */}
                    <div className="relative inline-block mb-4">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                        <AvatarImage src={profileImage} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {user?.firstname?.charAt(0) || user?.lastname?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                          onClick={() => document.getElementById('profile-image-input')?.click()}
                          disabled={imageLoading}
                        >
                          {imageLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      
                      <input
                        id="profile-image-input"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </div>

                    {/* User Info */}
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user?.firstname} {user?.lastname}
                      </h2>
                      <p className="text-gray-600">@{user?.username}</p>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {user?.role || 'User'}
                      </Badge>
                    </div>

                    {/* Account Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">Member Since</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {user?.isActive ? 'Active' : 'Inactive'}
                          </p>
                          <p className="text-sm text-gray-600">Status</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                          First Name
                        </Label>
                        <Input
                          id="firstname"
                          value={formData.firstname}
                          onChange={(e) => handleInputChange('firstname', e.target.value)}
                          placeholder="Enter your first name"
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                          Last Name
                        </Label>
                        <Input
                          id="lastname"
                          value={formData.lastname}
                          onChange={(e) => handleInputChange('lastname', e.target.value)}
                          placeholder="Enter your last name"
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          placeholder="Enter your username"
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Account Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">User ID</Label>
                        <Input 
                          value={user?.userId || ''} 
                          disabled 
                          className="bg-gray-50 font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Account Created</Label>
                        <Input 
                          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Edit Mode Notice */}
                  {isEditing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            You're in edit mode
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            Make your changes and click "Save Changes" to update your profile.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
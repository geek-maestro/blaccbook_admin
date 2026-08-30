import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  AlertCircle,
  AlertTriangle,
  Trash2,
  AlertOctagon
} from "lucide-react";
import Sidebar from '@/components/Sidebar';
import {
  useUserProfile,
  useUpdateProfile,
  uploadProfileImage,
  useDeleteAccount
} from '@/services/profile.service';
import { IUser } from '@/Types/auth';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: user, isLoading: loadingProfile } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const deleteAccountMutation = useDeleteAccount();

  const [formData, setFormData] = useState<Partial<IUser>>({
    firstname: '',
    lastname: '',
    phone: '',
    email: ''
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Delete account modal states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [hasAcknowledgedRisk, setHasAcknowledgedRisk] = useState(false);

  // Update form data when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        phone: user.phone || '',
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
    if (!user?.userId) {
      toast({
        title: "Error",
        description: "User not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        userId: user.userId,
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
        phone: user.phone || '',
        email: user.email || ''
      });
      setProfileImage(user.avatarUrl || '');
    }
    setIsEditing(false);
  };

  const openDeleteDialog = () => {
    setDeleteConfirmationText('');
    setHasAcknowledgedRisk(false);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleteAccountMutation.isPending) return;
    setIsDeleteDialogOpen(false);
    setDeleteConfirmationText('');
    setHasAcknowledgedRisk(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE' || !hasAcknowledgedRisk) {
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(user?.userId || '');
      setIsDeleteDialogOpen(false);
      toast({
        title: "Account Permanently Deleted",
        description: "Your merchant account and all associated data have been removed.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Account Deletion Failed",
        description: error?.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
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

        <div className="p-6 max-w-4xl mx-auto space-y-6">
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
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 capitalize">
                        {user?.role || 'Merchant'}
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
            <div className="lg:col-span-2 space-y-6">
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
                    </div>
                  </div>

                  <Separator />

                  {/* Security Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium text-gray-900">Security</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Password</Label>
                        <div>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                              if (!user?.email) {
                                toast({
                                  title: "Error",
                                  description: "Oops! We don't have an email for this account.",
                                  variant: "destructive"
                                });
                                return;
                              }
                              if (window.confirm("Send a password reset email to " + user.email + "?")) {
                                import("firebase/auth").then(({ sendPasswordResetEmail }) => {
                                  import("@/lib/firebaseConfig").then(({ auth }) => {
                                    sendPasswordResetEmail(auth, user.email!).then(() => {
                                      toast({
                                        title: "Password Reset Sent",
                                        description: "Check your email for a link to reset your password.",
                                      });
                                    }).catch((err) => {
                                      toast({
                                        title: "Error",
                                        description: err.message,
                                        variant: "destructive"
                                      });
                                    });
                                  });
                                });
                              }
                            }}
                          >
                            Change Password
                          </Button>
                        </div>
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

              {/* Danger Zone: Account Deletion */}
              <Card className="border-2 border-red-200 bg-red-50/20 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-red-50/60 border-b border-red-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-red-100 rounded-md text-red-600">
                      <AlertOctagon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-red-900">
                        Danger Zone
                      </CardTitle>
                      <CardDescription className="text-red-700 text-xs mt-0.5">
                        Irreversible and destructive account operations
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900 text-base">
                        Delete Merchant Account
                      </h4>
                      <p className="text-sm text-gray-600 max-w-lg">
                        Permanently remove your merchant profile, registered businesses, service listings, catalog products, and all associated booking & order records.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={openDeleteDialog}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium shrink-0 shadow-sm hover:shadow transition-all"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Strong Warning Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent className="sm:max-w-lg bg-white border border-red-100 shadow-2xl p-6 rounded-2xl">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="text-center space-y-1">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Permanently Delete Merchant Account?
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                This is an extremely destructive action with severe consequences. Please review carefully before proceeding.
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Strong Warning Notice Box */}
          <div className="my-2 rounded-xl bg-red-50 border border-red-200 p-4 space-y-3">
            <div className="flex items-center space-x-2 text-red-900 font-semibold text-sm">
              <AlertOctagon className="h-4 w-4 text-red-600 shrink-0" />
              <span>The following data will be permanently erased:</span>
            </div>
            <ul className="text-xs text-red-800 space-y-2 list-disc list-inside">
              <li>
                <strong className="font-semibold text-red-950">Merchant Account:</strong> Your profile credentials, login access, and merchant authority.
              </li>
              <li>
                <strong className="font-semibold text-red-950">Businesses & Catalog:</strong> All your verified businesses, service offerings, and product listings.
              </li>
              <li>
                <strong className="font-semibold text-red-950">Orders & Bookings:</strong> Your customer appointments, order transaction history, and communications.
              </li>
              <li>
                <strong className="font-semibold text-red-950">No Recovery:</strong> This action cannot be reversed or undone under any circumstances.
              </li>
            </ul>
          </div>

          {/* Verification Safeguards */}
          <div className="space-y-4 pt-1">
            {/* Step 1: Acknowledgment Checkbox */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox
                id="acknowledge-delete"
                checked={hasAcknowledgedRisk}
                onCheckedChange={(checked) => setHasAcknowledgedRisk(checked === true)}
                className="mt-0.5 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
              <Label
                htmlFor="acknowledge-delete"
                className="text-xs font-medium text-gray-700 leading-snug cursor-pointer select-none"
              >
                I understand that deleting my account is permanent, irreversible, and all my merchant data will be wiped immediately.
              </Label>
            </div>

            {/* Step 2: Confirmation phrase input */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm-phrase" className="text-xs font-medium text-gray-700">
                To confirm, type <span className="font-bold text-red-600 font-mono">DELETE</span> below:
              </Label>
              <Input
                id="confirm-phrase"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value.toUpperCase())}
                placeholder="Type DELETE to confirm"
                className="font-mono text-sm tracking-wide border-gray-300 focus:border-red-500 focus:ring-red-500"
                disabled={deleteAccountMutation.isPending}
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={deleteAccountMutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={
                deleteConfirmationText !== 'DELETE' ||
                !hasAcknowledgedRisk ||
                deleteAccountMutation.isPending
              }
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-all"
            >
              {deleteAccountMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Permanently Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
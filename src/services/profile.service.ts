import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { update, getById } from "@/lib/firestoreCrud";
import { IUser } from "@/Types/auth";

// Get current user from localStorage
const getCurrentUser = (): IUser | null => {
  const vendorData = localStorage.getItem('vendorData');
  if (vendorData) {
    return JSON.parse(vendorData);
  }
  return null;
};

// Update user profile in Firestore
const updateUserProfile = async (userId: string, profileData: Partial<IUser>) => {
  const result = await update("vendors", userId, profileData);
  
  if (result.success) {
    // Update localStorage with new data
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('vendorData', JSON.stringify(updatedUser));
    }
  }
  
  return result;
};

// Update Firebase Auth profile
const updateAuthProfile = async (displayName?: string, photoURL?: string) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user");
  }
  
  await updateProfile(auth.currentUser, {
    displayName,
    photoURL
  });
};

// Custom Hook: Update Profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      profileData, 
      displayName, 
      photoURL 
    }: {
      userId: string;
      profileData: Partial<IUser>;
      displayName?: string;
      photoURL?: string;
    }) => {
      const [firestoreResult] = await Promise.all([
        updateUserProfile(userId, profileData),
        updateAuthProfile(displayName, photoURL)
      ]);
      
      return firestoreResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    },
  });
};

// Custom Hook: Get User Profile
export const useUserProfile = () => {
  const currentUser = getCurrentUser();
  
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!currentUser?.id) {
        throw new Error("No user ID found");
      }
      
      const result = await getById("vendors", currentUser.id);
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data as IUser;
    },
    enabled: !!currentUser?.id,
  });
};

// Upload profile image (placeholder - would need Firebase Storage implementation)
export const uploadProfileImage = async (file: File): Promise<string> => {
  // This is a placeholder. In a real implementation, you would:
  // 1. Upload to Firebase Storage
  // 2. Get the download URL
  // 3. Return the URL
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
}; 
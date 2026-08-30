import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { update, getByFilters, remove } from "@/lib/firestoreCrud";
import { IUser } from "@/Types/auth";

// Get current user from localStorage
const getCurrentUser = (): IUser | null => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

// Update user profile in Firestore
const updateUserProfile = async (userId: string, profileData: Partial<IUser>) => {
  // First, find the user document by userId field
  const findResult = await getByFilters("users", [
    { key: "userId", operator: "==", value: userId }
  ]);

  if (findResult.data.length === 0) {
    throw new Error("User not found");
  }

  const userDoc = findResult.data[0];
  const result = await update("users", userDoc.id, profileData);

  if (result.success) {
    // Update localStorage with new data
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
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
      if (!currentUser?.userId) {
        throw new Error("No user ID found");
      }

      const result = await getByFilters("users", [
        { key: "userId", operator: "==", value: currentUser.userId }
      ]);

      if (result.data.length === 0) {
        throw new Error("User profile not found");
      }

      return result.data[0] as IUser;
    },
    enabled: !!currentUser?.userId,
  });
};

// Custom Hook: Send Password Reset Email
export const useSendPasswordReset = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    }
  });
};

// Delete User / Merchant Account
export const deleteUserAccount = async (userId: string) => {
  const currentUser = auth.currentUser;
  const targetUid = userId || currentUser?.uid;

  if (!targetUid) {
    throw new Error("No authenticated user to delete.");
  }

  let token: string | null = null;
  if (currentUser) {
    try {
      token = await currentUser.getIdToken();
    } catch (e) {
      console.warn("Could not get ID token before deletion:", e);
    }
  }

  // 1. Attempt backend API account deletion if available
  if (token) {
    const endpoints = [
      "https://api-wki5bofifq-uc.a.run.app/accounts/profile",
      "https://api-wki5bofifq-uc.a.run.app/merchant/account",
      "https://api-wki5bofifq-uc.a.run.app/auth/account",
    ];
    for (const url of endpoints) {
      try {
        await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.warn(`Attempted DELETE ${url}:`, err);
      }
    }
  }

  // 2. Clean up Firestore merchant document(s)
  try {
    const merchantResults = await getByFilters("merchants", [
      { key: "ownerUserId", operator: "==", value: targetUid },
    ]);
    if (merchantResults.data && merchantResults.data.length > 0) {
      for (const mDoc of merchantResults.data) {
        await remove("merchants", mDoc.id);
      }
    }
    // Also try direct document ID matching targetUid
    await remove("merchants", targetUid).catch(() => null);
  } catch (err) {
    console.warn("Error cleaning up merchants collection:", err);
  }

  // 3. Clean up Firestore business document(s) owned by this merchant
  try {
    const businessResults = await getByFilters("business", [
      { key: "ownerUserId", operator: "==", value: targetUid },
    ]);
    if (businessResults.data && businessResults.data.length > 0) {
      for (const bDoc of businessResults.data) {
        await remove("business", bDoc.id);
      }
    }
  } catch (err) {
    console.warn("Error cleaning up business collection:", err);
  }

  // 4. Clean up Firestore user profile document(s)
  try {
    const userResults = await getByFilters("users", [
      { key: "userId", operator: "==", value: targetUid },
    ]);
    if (userResults.data && userResults.data.length > 0) {
      for (const uDoc of userResults.data) {
        await remove("users", uDoc.id);
      }
    } else {
      const uidResults = await getByFilters("users", [
        { key: "uid", operator: "==", value: targetUid },
      ]);
      for (const uDoc of uidResults.data) {
        await remove("users", uDoc.id);
      }
    }
    // Also attempt direct doc deletion if doc.id == targetUid
    await remove("users", targetUid).catch(() => null);
  } catch (err) {
    console.warn("Error cleaning up users collection:", err);
  }

  // 5. Delete Firebase Auth user
  if (currentUser) {
    try {
      await deleteUser(currentUser);
    } catch (authErr: any) {
      if (authErr?.code === "auth/requires-recent-login") {
        throw new Error(
          "For security reasons, deleting your account requires a recent sign-in. Please log out, sign in again, and retry account deletion."
        );
      }
      throw authErr;
    }
  }

  // 6. Clear local/session cache
  localStorage.removeItem("userData");
  sessionStorage.clear();

  return { success: true };
};

// Custom Hook: Delete User Account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUserAccount(userId),
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    },
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
import { getByFilters, update } from "@/lib/firestoreCrud";
import { auth } from "@/lib/firebaseConfig";

export const upgradeToSuperAdmin = async (userId: string) => {
  try {
    console.log(`Elevating user ${userId} to super_admin...`);
    
    // Find the user document by userId field
    const findResult = await getByFilters("users", [
      { key: "userId", operator: "==", value: userId }
    ]);

    if (findResult.data.length === 0) {
      throw new Error("User profile not found in Firestore.");
    }

    const userDoc = findResult.data[0];
    
    // Update the role to super_admin
    const result = await update("users", userDoc.id, {
      role: "super_admin",
      userType: "super_admin", // Update both fields just in case
      updatedAt: new Date().toISOString(),
    });

    if (result.success) {
      console.log("✅ Successfully upgraded to super_admin!");
      // Update localStorage to reflect changes immediately
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        parsed.role = "super_admin";
        parsed.userType = "super_admin";
        localStorage.setItem('userData', JSON.stringify(parsed));
      }
      return { success: true };
    } else {
      throw new Error(result.error || "Failed to update user role.");
    }
  } catch (error) {
    console.error("❌ Error upgrading user:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

import { getByFilters, update, getById, put } from "@/lib/firestoreCrud";
import { auth } from "@/lib/firebaseConfig";

export const upgradeToSuperAdmin = async (userId: string) => {
  try {
    console.log(`Elevating user ${userId} to super_admin...`);
    
    let userDoc = null;

    // 1. Try finding by document ID directly (UID)
    const docResult = await getById("users", userId);
    if (docResult.data) {
      userDoc = docResult.data;
      console.log("Found user profile by document ID (UID).");
    }

    // 2. Try finding by userId field
    if (!userDoc) {
      const filterResult = await getByFilters("users", [
        { key: "userId", operator: "==", value: userId }
      ]);
      if (filterResult.data.length > 0) {
        userDoc = filterResult.data[0];
        console.log("Found user profile by userId field.");
      }
    }

    // 3. Try finding by uid field
    if (!userDoc) {
      const filterResult = await getByFilters("users", [
        { key: "uid", operator: "==", value: userId }
      ]);
      if (filterResult.data.length > 0) {
        userDoc = filterResult.data[0];
        console.log("Found user profile by uid field.");
      }
    }

    // 4. Try finding by email (if email is available)
    const email = auth.currentUser?.email;
    if (!userDoc && email) {
      const filterResult = await getByFilters("users", [
        { key: "email", operator: "==", value: email }
      ]);
      if (filterResult.data.length > 0) {
        userDoc = filterResult.data[0];
        console.log("Found user profile by email field.");
      }
    }

    // 5. If not found, create a placeholder profile document
    if (!userDoc) {
      console.log("User profile not found in Firestore. Creating new profile...");
      const userEmail = email || auth.currentUser?.email || "";
      const displayName = auth.currentUser?.displayName || "";
      const nameParts = displayName.split(" ");
      const firstname = nameParts[0] || "Admin";
      const lastname = nameParts[1] || "User";
      
      const newUserData = {
        userId: userId,
        uid: userId,
        email: userEmail,
        firstname,
        lastname,
        name: displayName || `${firstname} ${lastname}`,
        username: userEmail.split("@")[0] || userId.slice(0, 10),
        role: "super_admin",
        userType: "super_admin",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const createResult = await put("users", userId, newUserData);
      if (!createResult.success) {
        throw new Error(`Failed to create user profile: ${createResult.error}`);
      }
      userDoc = { id: userId, ...newUserData };
      console.log("✅ Successfully created user profile with super_admin role!");
    }

    // Update/ensure the role is super_admin
    const result = await update("users", userDoc.id, {
      role: "super_admin",
      userType: "super_admin", // Update both fields just in case
      updatedAt: new Date().toISOString(),
    });

    if (result.success) {
      console.log("✅ Successfully upgraded Firestore role to super_admin!");
      
      // Call backend bootstrap API to set backend role/claims
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        console.log("Calling backend bootstrap API for super_admin role...");
        const bootstrapResponse = await fetch("https://api-wki5bofifq-uc.a.run.app/auth/bootstrap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            requestedRole: "super_admin"
          })
        });

        if (!bootstrapResponse.ok) {
          const errorText = await bootstrapResponse.text();
          console.error("Failed to bootstrap user role via API:", errorText);
          throw new Error(`Failed to bootstrap role on backend: ${errorText}`);
        } else {
          console.log("✅ Successfully bootstrapped user role via API to super_admin");
          // Force refresh ID token to get the new custom claims immediately
          await auth.currentUser?.getIdToken(true);
          console.log("✅ Firebase ID token force-refreshed successfully");
        }
      } else {
        console.warn("Could not retrieve Firebase ID token. Role bootstrap skipped.");
      }

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

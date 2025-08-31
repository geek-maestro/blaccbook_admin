// Utility to create a test admin user
// Run this in your browser console or create a button to execute it

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { post } from "@/lib/firestoreCrud";

export const createTestAdmin = async () => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      "admin@blaccbook.com", 
      "admin123"
    );
    
    const userId = userCredential.user.uid;
    
    // Create user profile in Firestore
    const userData = {
      email: "admin@blaccbook.com",
      userId: userId,
      name: "Admin User",
      userType: "admin", // This will give admin access
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      phone: "",
    };
    
    const result = await post("users", userData);
    
    console.log("✅ Test admin user created successfully!");
    console.log("Email: admin@blaccbook.com");
    console.log("Password: admin123");
    console.log("User ID:", userId);
    
    return result;
  } catch (error) {
    console.error("❌ Error creating test admin:", error);
    throw error;
  }
};

// Function to create a super admin
export const createTestSuperAdmin = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      "superadmin@blaccbook.com", 
      "superadmin123"
    );
    
    const userId = userCredential.user.uid;
    
    const userData = {
      email: "superadmin@blaccbook.com",
      userId: userId,
      name: "Super Admin User",
      userType: "super_admin", // This will give super admin access
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      phone: "",
    };
    
    const result = await post("users", userData);
    
    console.log("✅ Test super admin user created successfully!");
    console.log("Email: superadmin@blaccbook.com");
    console.log("Password: superadmin123");
    console.log("User ID:", userId);
    
    return result;
  } catch (error) {
    console.error("❌ Error creating test super admin:", error);
    throw error;
  }
};

// Usage instructions:
// 1. Import this function in your component or run in browser console
// 2. Call createTestAdmin() or createTestSuperAdmin()
// 3. Login with the created credentials
// 4. You'll be automatically redirected to /admin

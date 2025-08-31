// Utility function to create an admin user for testing
// This would typically be used in development or by a super admin

import { post } from "@/lib/firestoreCrud";
import { UserRole } from "@/Types/auth";

export const createAdminUser = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  role: UserRole = 'admin'
) => {
  try {
    // This would typically create the user in Firebase Auth first
    // Then create the user profile in Firestore
    
    const userData = {
      email,
      firstname,
      lastname,
      username: `${firstname.toLowerCase()}${lastname.toLowerCase()}`,
      role,
      status: 'active',
      verifications: {
        email: true,
        phone: false,
        identity: false,
        business: false,
        documents: false
      },
      createdAt: new Date().toISOString(),
      isActive: true,
      preferences: {
        notifications: true,
        emailMarketing: true,
        smsMarketing: false
      }
    };

    // Create user profile in Firestore
    const result = await post("users", userData);
    
    console.log(`Admin user created successfully:`, result);
    return result;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

// Example usage:
// createAdminUser(
//   "admin@blaccbook.com",
//   "admin123",
//   "Admin",
//   "User",
//   "super_admin"
// );

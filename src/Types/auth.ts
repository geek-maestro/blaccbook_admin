export type UserRole = 'super_admin' | 'admin' | 'business_owner' | 'consumer' | 'support_staff' | 'content_moderator' | 'finance_manager';

export type UserStatus = 'active' | 'suspended' | 'pending_verification' | 'banned';

export type VerificationStatus = {
  email: boolean;
  phone: boolean;
  identity: boolean;
  business: boolean;
  documents: boolean;
};

export type IUser = {
  id: string;
  email: string;
  avatarUrl?: string;
  firstname?: string;
  lastname?: string;
  userId: string;
  role?: UserRole;
  username?: string;
  phone?: string;
  status?: UserStatus;
  verifications?: VerificationStatus;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  deviceTokens?: string[];
  preferences?: {
    notifications: boolean;
    emailMarketing: boolean;
    smsMarketing: boolean;
  };
  linkedBusinessIds?: string[]; // For business owners who own multiple businesses
  assignedAdminId?: string; // For support staff assignment
  permissions?: string[]; // Granular permissions
  // Legacy fields for backward compatibility
  name?: string;
  userType?: string;
  lastLogin?: string;
};

export type AdminPermissions = {
  canManageUsers: boolean;
  canManageBusinesses: boolean;
  canManageTransactions: boolean;
  canManageOrders: boolean;
  canViewAnalytics: boolean;
  canManageContent: boolean;
  canManageSettings: boolean;
  canHandleDisputes: boolean;
  canManagePayments: boolean;
};

// Export types are already declared above

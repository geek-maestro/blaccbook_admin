import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getByFilters, post, update } from "@/lib/firestoreCrud";
import { auth } from "@/lib/firebaseConfig";
import { IUser, UserRole, UserStatus, AdminPermissions } from "@/Types/auth";
import {
  DashboardMetrics,
  UserManagementFilters,
  BusinessApprovalWorkflow,
  Transaction,
  SupportTicket,
  AnalyticsFilters,
  BusinessAnalytics,
  ConsumerAnalytics,
  RevenueAnalytics,
  AppPerformanceMetrics,
  AuditLog,
  SystemSettings,
  CommissionSettings,
  TaxSettings,
  Category,
  Promotion,
  BulkNotification,
  NotificationTemplate
} from "@/Types/admin";

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, AdminPermissions> = {
  super_admin: {
    canManageUsers: true,
    canManageBusinesses: true,
    canManageTransactions: true,
    canManageOrders: true,
    canViewAnalytics: true,
    canManageContent: true,
    canManageSettings: true,
    canHandleDisputes: true,
    canManagePayments: true,
  },
  admin: {
    canManageUsers: true,
    canManageBusinesses: true,
    canManageTransactions: true,
    canManageOrders: true,
    canViewAnalytics: true,
    canManageContent: true,
    canManageSettings: false,
    canHandleDisputes: true,
    canManagePayments: true,
  },
  support_staff: {
    canManageUsers: false,
    canManageBusinesses: false,
    canManageTransactions: false,
    canManageOrders: true,
    canViewAnalytics: false,
    canManageContent: false,
    canManageSettings: false,
    canHandleDisputes: true,
    canManagePayments: false,
  },
  content_moderator: {
    canManageUsers: false,
    canManageBusinesses: false,
    canManageTransactions: false,
    canManageOrders: false,
    canViewAnalytics: false,
    canManageContent: true,
    canManageSettings: false,
    canHandleDisputes: false,
    canManagePayments: false,
  },
  finance_manager: {
    canManageUsers: false,
    canManageBusinesses: false,
    canManageTransactions: true,
    canManageOrders: true,
    canViewAnalytics: true,
    canManageContent: false,
    canManageSettings: false,
    canHandleDisputes: false,
    canManagePayments: true,
  },
  business_owner: {
    canManageUsers: false,
    canManageBusinesses: false,
    canManageTransactions: false,
    canManageOrders: false,
    canViewAnalytics: false,
    canManageContent: false,
    canManageSettings: false,
    canHandleDisputes: false,
    canManagePayments: false,
  },
  consumer: {
    canManageUsers: false,
    canManageBusinesses: false,
    canManageTransactions: false,
    canManageOrders: false,
    canViewAnalytics: false,
    canManageContent: false,
    canManageSettings: false,
    canHandleDisputes: false,
    canManagePayments: false,
  }
};

// Dashboard Analytics
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async (): Promise<DashboardMetrics> => {
      try {
        // Fetch all users
        const usersResult = await getByFilters("users", []);
        const users = usersResult.data || [];

        // Fetch all businesses from the "business" collection
        const businessesResult = await getByFilters("business", []);
        const businesses = businessesResult.data || [];

        // Calculate metrics from real data
        const totalUsers = users.length;
        const totalBusinesses = businesses.length;
        const activeBusinesses = businesses.filter((b: any) => b.status === 'approved' && !b.isBanned).length;
        const pendingApprovals = businesses.filter((b: any) => b.status === 'pending').length;

        // Calculate new signups today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newSignupsToday = users.filter((u: any) => {
          const createdAt = new Date(u.createdAt);
          return createdAt >= today;
        }).length;

        const newBusinessSignupsToday = businesses.filter((b: any) => {
          if (!b.createdAt) return false;
          const createdAt = new Date(b.createdAt);
          return createdAt >= today;
        }).length;

        // Fetch transactions data
        const transactionsResult = await getByFilters("transactions", []);
        const transactions = transactionsResult.data || [];

        // Calculate transaction metrics
        // Reuse the 'today' variable already declared above

        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);
        thisWeek.setHours(0, 0, 0, 0);

        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth() - 1);
        thisMonth.setHours(0, 0, 0, 0);

        const transactionsToday = transactions.filter((t: any) => {
          const createdAt = new Date(t.createdAt);
          return createdAt >= today && t.status === 'completed';
        }).length;

        const transactionsThisWeek = transactions.filter((t: any) => {
          const createdAt = new Date(t.createdAt);
          return createdAt >= thisWeek && t.status === 'completed';
        }).length;

        const transactionsThisMonth = transactions.filter((t: any) => {
          const createdAt = new Date(t.createdAt);
          return createdAt >= thisMonth && t.status === 'completed';
        }).length;

        const totalRevenue = transactions
          .filter((t: any) => t.status === 'completed')
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

        const appCommission = transactions
          .filter((t: any) => t.status === 'completed')
          .reduce((sum: number, t: any) => sum + (t.commission || 0), 0);

        const merchantEarnings = transactions
          .filter((t: any) => t.status === 'completed')
          .reduce((sum: number, t: any) => sum + (t.merchantEarnings || 0), 0);

        return {
          totalUsers,
          totalBusinesses,
          activeBusinesses,
          pendingApprovals,
          transactionsToday,
          transactionsThisWeek,
          transactionsThisMonth,
          totalRevenue,
          appCommission,
          merchantEarnings,
          newSignupsToday,
          newBusinessSignupsToday,
          systemHealth: {
            apiUptime: 99.9,
            errorRate: 0.1,
            activeSessions: users.filter((u: any) => u.isActive).length,
          },
        };
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        // Return default values on error
        return {
          totalUsers: 0,
          totalBusinesses: 0,
          activeBusinesses: 0,
          pendingApprovals: 0,
          transactionsToday: 0,
          transactionsThisWeek: 0,
          transactionsThisMonth: 0,
          totalRevenue: 0,
          appCommission: 0,
          merchantEarnings: 0,
          newSignupsToday: 0,
          newBusinessSignupsToday: 0,
          systemHealth: {
            apiUptime: 99.9,
            errorRate: 0.1,
            activeSessions: 0,
          },
        };
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds for live data
    staleTime: 5000, // Consider data stale after 5 seconds
  });
};

// User Management
export const useUsers = (filters?: UserManagementFilters) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async (): Promise<IUser[]> => {
      const result = await getByFilters("users", []);
      return result.data as IUser[];
    },
    refetchInterval: 15000, // Refetch every 15 seconds for live user data
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async (): Promise<IUser | null> => {
      const result = await getByFilters("users", [
        { key: "userId", operator: "==", value: userId }
      ]);
      return result.data[0] as IUser || null;
    },
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<IUser> }) => {
      return update("users", userId, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      return update("users", userId, {
        status: "suspended" as UserStatus,
        suspensionReason: reason,
        suspendedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, adminId }: { userId: string; adminId?: string }) => {
      return update("users", userId, {
        status: "active" as UserStatus,
        updatedAt: new Date().toISOString(),
        approvedBy: adminId,
        approvedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, adminId, reason }: { userId: string; adminId?: string; reason?: string }) => {
      return update("users", userId, {
        status: "rejected" as UserStatus,
        updatedAt: new Date().toISOString(),
        rejectedBy: adminId,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Business Approval Workflow
export const useBusinessApprovals = () => {
  return useQuery({
    queryKey: ["business-approvals"],
    queryFn: async (): Promise<BusinessApprovalWorkflow[]> => {
      const result = await getByFilters("business_approvals", []);
      return result.data as BusinessApprovalWorkflow[];
    },
    refetchInterval: 20000, // Refetch every 20 seconds for live approval data
    staleTime: 15000, // Consider data stale after 15 seconds
  });
};

export const useApproveBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      approvalId,
      adminId,
      notes
    }: {
      approvalId: string;
      adminId: string;
      notes?: string;
    }) => {
      const approval = await update("business_approvals", approvalId, {
        status: "approved",
        reviewedBy: adminId,
        reviewedAt: new Date().toISOString(),
        notes,
      });

      // Also update the business status
      const businessApproval = await getByFilters("business_approvals", [
        { key: "id", operator: "==", value: approvalId }
      ]);

      if (businessApproval.data[0]) {
        await update("businesses", businessApproval.data[0].businessId, {
          isApproved: true,
          approvedAt: new Date().toISOString(),
          approvedBy: adminId,
        });
      }

      return approval;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
};

export const useRejectBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      approvalId,
      adminId,
      reason
    }: {
      approvalId: string;
      adminId: string;
      reason: string;
    }) => {
      return update("business_approvals", approvalId, {
        status: "rejected",
        reviewedBy: adminId,
        reviewedAt: new Date().toISOString(),
        rejectionReason: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-approvals"] });
    },
  });
};

// Transaction Management
export const useTransactions = (filters?: any) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async (): Promise<Transaction[]> => {
      const result = await getByFilters("transactions", []);
      return result.data as Transaction[];
    },
  });
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionId,
      status,
      adminId
    }: {
      transactionId: string;
      status: string;
      adminId: string;
    }) => {
      return update("transactions", transactionId, {
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: adminId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

// Support Tickets
export const useSupportTickets = () => {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: async (): Promise<SupportTicket[]> => {
      const result = await getByFilters("support_tickets", []);
      return result.data as SupportTicket[];
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      adminId,
      adminName
    }: {
      ticketId: string;
      adminId: string;
      adminName: string;
    }) => {
      return update("support_tickets", ticketId, {
        assignedTo: adminId,
        assignedToName: adminName,
        status: "in_progress",
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};

// Analytics
export const useBusinessAnalytics = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["business-analytics", filters],
    queryFn: async (): Promise<BusinessAnalytics> => {
      // Mock data - replace with actual API calls
      return {
        topPerformingBusinesses: [],
        categoryGrowth: [],
        locationAnalytics: [],
      };
    },
  });
};

export const useConsumerAnalytics = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["consumer-analytics", filters],
    queryFn: async (): Promise<ConsumerAnalytics> => {
      // Mock data - replace with actual API calls
      return {
        activeUsers: 0,
        inactiveUsers: 0,
        newUsers: 0,
        repeatCustomers: 0,
        averageOrderValue: 0,
        userRetention: { day1: 0, day7: 0, day30: 0 },
        buyingPatterns: [],
      };
    },
  });
};

export const useRevenueAnalytics = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["revenue-analytics", filters],
    queryFn: async (): Promise<RevenueAnalytics> => {
      // Mock data - replace with actual API calls
      return {
        totalRevenue: 0,
        commission: 0,
        merchantPayouts: 0,
        refunds: 0,
        chargebacks: 0,
        dailyRevenue: [],
        monthlyTrends: [],
      };
    },
  });
};

// System Settings
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ["system-settings"],
    queryFn: async (): Promise<SystemSettings[]> => {
      const result = await getByFilters("system_settings", []);
      return result.data as SystemSettings[];
    },
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      settingId,
      value,
      adminId
    }: {
      settingId: string;
      value: any;
      adminId: string;
    }) => {
      return update("system_settings", settingId, {
        value,
        updatedBy: adminId,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
  });
};

// Audit Logs
export const useAuditLogs = (filters?: any) => {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: async (): Promise<AuditLog[]> => {
      const result = await getByFilters("audit_logs", []);
      return result.data as AuditLog[];
    },
  });
};

export const useCreateAuditLog = () => {
  return useMutation({
    mutationFn: async (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
      return post("audit_logs", {
        ...logData,
        timestamp: new Date().toISOString(),
      });
    },
  });
};

// Utility function to check permissions
export const hasPermission = (userRole: UserRole, permission: keyof AdminPermissions): boolean => {
  return ROLE_PERMISSIONS[userRole]?.[permission] || false;
};

// Business approval functions for the main business collection
export const useApproveBusinessDirect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ businessId, adminNotes }: { businessId: string; adminNotes?: string }) => {
      try {
        const idToken = await auth.currentUser?.getIdToken(true);
        const response = await fetch('https://api-wki5bofifq-uc.a.run.app/admin/verification/decision', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
          },
          body: JSON.stringify({
            businessId,
            approved: true
          })
        });

        if (!response.ok) {
          console.error("External decision API failed:", await response.text());
          throw new Error("Failed to notify external verification system");
        }
      } catch (err) {
        console.error("Error calling external decision API:", err);
        // We might want to throw or just log depending on requirements
        // throw err; 
      }

      return update("business", businessId, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        adminNotes: adminNotes || '',
        updatedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    },
  });
};

export const useRejectBusinessDirect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ businessId, reason }: { businessId: string; reason: string }) => {
      try {
        const idToken = await auth.currentUser?.getIdToken(true);
        const response = await fetch('https://api-wki5bofifq-uc.a.run.app/admin/verification/decision', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
          },
          body: JSON.stringify({
            businessId,
            approved: false
          })
        });

        if (!response.ok) {
          console.error("External decision API failed:", await response.text());
        }
      } catch (err) {
        console.error("Error calling external decision API:", err);
      }

      return update("business", businessId, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
        updatedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    },
  });
};

// Utility function to get user permissions
export const getUserPermissions = (userRole: UserRole): AdminPermissions => {
  return ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.consumer;
};

import { IUser, UserRole } from './auth';
import { IBusiness } from './business';
import { IMerchant } from './merchant';

export type DashboardMetrics = {
  totalUsers: number;
  totalBusinesses: number;
  activeBusinesses: number;
  pendingApprovals: number;
  transactionsToday: number;
  transactionsThisWeek: number;
  transactionsThisMonth: number;
  totalRevenue: number;
  appCommission: number;
  merchantEarnings: number;
  newSignupsToday: number;
  newBusinessSignupsToday: number;
  systemHealth: {
    apiUptime: number;
    errorRate: number;
    activeSessions: number;
  };
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  color: string;
  requiresPermission?: string;
};

export type UserManagementFilters = {
  role?: UserRole;
  status?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  verificationStatus?: string;
};

export type BusinessApprovalWorkflow = {
  id: string;
  businessId: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_more_info';
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  requiredDocuments: string[];
  submittedDocuments: {
    [key: string]: {
      url: string;
      uploadedAt: string;
      status: 'pending' | 'approved' | 'rejected';
    };
  };
  notes?: string;
};

export type TransactionStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded' | 'disputed';

export type Transaction = {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  businessId: string;
  businessName: string;
  amount: number;
  commission: number;
  merchantEarnings: number;
  status: TransactionStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  disputeReason?: string;
  refundAmount?: number;
  refundReason?: string;
};

export type NotificationTemplate = {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BulkNotification = {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push';
  targetAudience: {
    userRoles?: UserRole[];
    locations?: string[];
    categories?: string[];
    customFilters?: any;
  };
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  sentCount: number;
  totalCount: number;
  createdAt: string;
  sentAt?: string;
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'business_verification' | 'general' | 'dispute';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'user' | 'admin';
    message: string;
    attachments?: string[];
    createdAt: string;
  }[];
};

export type AnalyticsFilters = {
  dateRange: {
    start: string;
    end: string;
  };
  groupBy: 'day' | 'week' | 'month';
  location?: string;
  category?: string;
  businessId?: string;
};

export type BusinessAnalytics = {
  topPerformingBusinesses: {
    businessId: string;
    businessName: string;
    revenue: number;
    orders: number;
    rating: number;
    growth: number;
  }[];
  categoryGrowth: {
    category: string;
    businesses: number;
    revenue: number;
    growth: number;
  }[];
  locationAnalytics: {
    location: string;
    businesses: number;
    revenue: number;
    users: number;
  }[];
};

export type ConsumerAnalytics = {
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
  repeatCustomers: number;
  averageOrderValue: number;
  userRetention: {
    day1: number;
    day7: number;
    day30: number;
  };
  buyingPatterns: {
    location: string;
    averageSpend: number;
    favoriteCategories: string[];
  }[];
};

export type RevenueAnalytics = {
  totalRevenue: number;
  commission: number;
  merchantPayouts: number;
  refunds: number;
  chargebacks: number;
  dailyRevenue: {
    date: string;
    revenue: number;
    commission: number;
  }[];
  monthlyTrends: {
    month: string;
    revenue: number;
    growth: number;
  }[];
};

export type AppPerformanceMetrics = {
  loadTime: number;
  crashRate: number;
  activeSessions: number;
  errorLogs: {
    timestamp: string;
    error: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
    businessId?: string;
  }[];
  featureUsage: {
    feature: string;
    usage: number;
    satisfaction: number;
  }[];
};

export type AuditLog = {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
};

export type SystemSettings = {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  category: string;
  isPublic: boolean;
  updatedBy: string;
  updatedAt: string;
};

export type CommissionSettings = {
  defaultRate: number;
  categoryRates: {
    [category: string]: number;
  };
  businessRates: {
    [businessId: string]: number;
  };
  minimumPayout: number;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  payoutDay: number; // Day of week/month
};

export type TaxSettings = {
  enabled: boolean;
  rates: {
    [state: string]: number;
  };
  defaultRate: number;
  taxInclusive: boolean;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  parentId?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Promotion = {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  applicableTo: 'all' | 'categories' | 'businesses' | 'users';
  applicableIds: string[];
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

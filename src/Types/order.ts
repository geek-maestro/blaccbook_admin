export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'in_progress' | 'fulfilled' | 'cancelled' | 'refunded' | 'disputed';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'disputed' | 'initiated';

export type PaymentMethod = 'stripe' | 'paypal' | 'cash' | 'bank_transfer' | 'manual';

export interface IOrderItem {
  id: string;
  serviceId: string;
  serviceName: string;
  businessId: string;
  businessName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  imageUrl?: string;
  customizations?: Record<string, any>;
}

export interface IApiOrderItem {
  itemType: string;
  itemId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface IApiOrder {
  id: string;
  customerUid: string;
  businessId: string;
  merchantUid: string;
  businessName: string;
  businessAddress: string;
  lineItems: IApiOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  businessId: string;
  businessName: string;
  businessEmail: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  commission: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryInstructions?: string;
  scheduledDate?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  fulfilledAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  cancellationReason?: string;
  refundReason?: string;
  refundAmount?: number;
  disputeReason?: string;
  disputeStatus?: 'open' | 'resolved' | 'closed';
  rating?: number;
  review?: string;
  commissionRate: number;
  businessEarnings: number;
  platformEarnings: number;
}

export interface IOrderFilters {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  businessId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface IOrderStats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  fulfilledOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  totalRevenue: number;
  totalCommission: number;
  totalBusinessEarnings: number;
  averageOrderValue: number;
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
}

export interface IOrderAction {
  id: string;
  orderId: string;
  action: 'status_change' | 'payment_update' | 'refund' | 'dispute' | 'note_added' | 'manual_override';
  performedBy: string;
  performedByType: 'admin' | 'business' | 'customer' | 'system';
  previousValue?: any;
  newValue?: any;
  reason?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

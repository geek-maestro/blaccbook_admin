import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getByFilters, post, update, getById } from '@/lib/firestoreCrud';
import { IOrder, IOrderFilters, IOrderStats, IOrderAction, OrderStatus, PaymentStatus } from '@/Types/order';

// Get all orders with optional filters
export const useOrders = (filters?: IOrderFilters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const result = await getByFilters("orders", []);
      if (result.error) throw new Error(result.error);
      
      let orders = result.data as IOrder[];
      
      // Apply filters
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          orders = orders.filter(order => filters.status!.includes(order.status));
        }
        if (filters.paymentStatus && filters.paymentStatus.length > 0) {
          orders = orders.filter(order => filters.paymentStatus!.includes(order.paymentStatus));
        }
        if (filters.businessId) {
          orders = orders.filter(order => order.businessId === filters.businessId);
        }
        if (filters.customerId) {
          orders = orders.filter(order => order.customerId === filters.customerId);
        }
        if (filters.dateFrom) {
          orders = orders.filter(order => order.createdAt >= filters.dateFrom!);
        }
        if (filters.dateTo) {
          orders = orders.filter(order => order.createdAt <= filters.dateTo!);
        }
        if (filters.minAmount) {
          orders = orders.filter(order => order.total >= filters.minAmount!);
        }
        if (filters.maxAmount) {
          orders = orders.filter(order => order.total <= filters.maxAmount!);
        }
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          orders = orders.filter(order => 
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.customerName.toLowerCase().includes(searchLower) ||
            order.businessName.toLowerCase().includes(searchLower) ||
            order.customerEmail.toLowerCase().includes(searchLower)
          );
        }
      }
      
      // Sort by creation date (newest first)
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 15000,
  });
};

// Get single order by ID
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const result = await getById("orders", orderId);
      if (result.error) throw new Error(result.error);
      return result.data as IOrder;
    },
    enabled: !!orderId,
  });
};

// Get order statistics
export const useOrderStats = () => {
  return useQuery({
    queryKey: ["order-stats"],
    queryFn: async () => {
      const result = await getByFilters("orders", []);
      if (result.error) throw new Error(result.error);
      
      const orders = result.data as IOrder[];
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const stats: IOrderStats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        paidOrders: orders.filter(o => o.status === 'paid').length,
        fulfilledOrders: orders.filter(o => o.status === 'fulfilled').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        refundedOrders: orders.filter(o => o.status === 'refunded').length,
        totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
        totalCommission: orders.reduce((sum, o) => sum + o.commission, 0),
        totalBusinessEarnings: orders.reduce((sum, o) => sum + o.businessEarnings, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0,
        ordersToday: orders.filter(o => o.createdAt.startsWith(today)).length,
        ordersThisWeek: orders.filter(o => o.createdAt >= weekAgo).length,
        ordersThisMonth: orders.filter(o => o.createdAt >= monthAgo).length,
        revenueToday: orders.filter(o => o.createdAt.startsWith(today)).reduce((sum, o) => sum + o.total, 0),
        revenueThisWeek: orders.filter(o => o.createdAt >= weekAgo).reduce((sum, o) => sum + o.total, 0),
        revenueThisMonth: orders.filter(o => o.createdAt >= monthAgo).reduce((sum, o) => sum + o.total, 0),
      };
      
      return stats;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000,
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status, reason, adminNotes }: { 
      orderId: string; 
      status: OrderStatus; 
      reason?: string; 
      adminNotes?: string;
    }) => {
      const updates: any = {
        status,
        updatedAt: new Date().toISOString(),
      };
      
      // Add timestamp based on status
      switch (status) {
        case 'confirmed':
          updates.confirmedAt = new Date().toISOString();
          break;
        case 'fulfilled':
          updates.fulfilledAt = new Date().toISOString();
          updates.actualDelivery = new Date().toISOString();
          break;
        case 'cancelled':
          updates.cancelledAt = new Date().toISOString();
          if (reason) updates.cancellationReason = reason;
          break;
        case 'refunded':
          updates.refundedAt = new Date().toISOString();
          if (reason) updates.refundReason = reason;
          break;
      }
      
      if (adminNotes) {
        updates.adminNotes = adminNotes;
      }
      
      return update("orders", orderId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });
};

// Update payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, paymentStatus, paymentId }: { 
      orderId: string; 
      paymentStatus: PaymentStatus; 
      paymentId?: string;
    }) => {
      const updates: any = {
        paymentStatus,
        updatedAt: new Date().toISOString(),
      };
      
      if (paymentId) {
        updates.paymentId = paymentId;
      }
      
      return update("orders", orderId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });
};

// Process refund
export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, refundAmount, reason }: { 
      orderId: string; 
      refundAmount: number; 
      reason: string;
    }) => {
      const updates = {
        status: 'refunded' as OrderStatus,
        paymentStatus: 'refunded' as PaymentStatus,
        refundAmount,
        refundReason: reason,
        refundedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return update("orders", orderId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });
};

// Add order action log
export const useAddOrderAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (action: IOrderAction) => {
      return post("order_actions", action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-actions"] });
    },
  });
};

// Get order actions/history
export const useOrderActions = (orderId: string) => {
  return useQuery({
    queryKey: ["order-actions", orderId],
    queryFn: async () => {
      const result = await getByFilters("order_actions", [{ key: "orderId", operator: "==", value: orderId }]);
      if (result.error) throw new Error(result.error);
      return (result.data as IOrderAction[]).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    enabled: !!orderId,
  });
};

// Create new order (for testing/admin purposes)
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: Partial<IOrder>) => {
      const order: IOrder = {
        id: '', // Will be generated by Firebase
        orderNumber: `ORD-${Date.now()}`,
        customerId: orderData.customerId || '',
        customerName: orderData.customerName || '',
        customerEmail: orderData.customerEmail || '',
        customerPhone: orderData.customerPhone,
        businessId: orderData.businessId || '',
        businessName: orderData.businessName || '',
        businessEmail: orderData.businessEmail || '',
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        tax: orderData.tax || 0,
        commission: orderData.commission || 0,
        total: orderData.total || 0,
        status: orderData.status || 'pending',
        paymentStatus: orderData.paymentStatus || 'pending',
        paymentMethod: orderData.paymentMethod || 'stripe',
        paymentId: orderData.paymentId,
        shippingAddress: orderData.shippingAddress,
        deliveryInstructions: orderData.deliveryInstructions,
        scheduledDate: orderData.scheduledDate,
        estimatedDelivery: orderData.estimatedDelivery,
        actualDelivery: orderData.actualDelivery,
        notes: orderData.notes,
        adminNotes: orderData.adminNotes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmedAt: orderData.confirmedAt,
        fulfilledAt: orderData.fulfilledAt,
        cancelledAt: orderData.cancelledAt,
        refundedAt: orderData.refundedAt,
        cancellationReason: orderData.cancellationReason,
        refundReason: orderData.refundReason,
        refundAmount: orderData.refundAmount,
        disputeReason: orderData.disputeReason,
        disputeStatus: orderData.disputeStatus,
        rating: orderData.rating,
        review: orderData.review,
        commissionRate: orderData.commissionRate || 0.1, // 10% default
        businessEarnings: orderData.businessEarnings || 0,
        platformEarnings: orderData.platformEarnings || 0,
      };
      
      return post("orders", order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });
};

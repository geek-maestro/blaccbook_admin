export type IAvailabilityDay = {
  open: string;
  close: string;
};

export type IAvailability = {
  monday?: IAvailabilityDay;
  tuesday?: IAvailabilityDay;
  wednesday?: IAvailabilityDay;
  thursday?: IAvailabilityDay;
  friday?: IAvailabilityDay;
  saturday?: IAvailabilityDay;
  sunday?: IAvailabilityDay;
};

export type IPricing = {
  fixedPrice?: number;
  hourlyRate?: number;
};

export type IReviews = {
  average: number;
  count: number;
};

export type MerchantApprovalStatus = "pending" | "approved" | "rejected";

export type IMerchant = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  image: string;
  role?: string;
  approvalStatus: MerchantApprovalStatus;
  documentURL?: string;
  serviceTypes?: string[];
  website?: string;
  availability?: IAvailability;
  pricing?: IPricing;
  reviews?: IReviews;
  createdAt: string;
  updatedAt?: string;
  deviceTokens?: string[];
  ownerUserId?: string; // UID of the user who owns this merchant
  assignedAdminId?: string; // UID of the admin responsible for this merchant
};



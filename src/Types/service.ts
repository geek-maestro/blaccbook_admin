export type IWeeklyAvailability = {
  monday?: string; // e.g. "08:00-20:00"
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
};

export type IGeoPoint = {
  lat: number;
  lng: number;
};

export type IReviewSummary = {
  average: number;
  count: number;
};

export type IService = {
  id?: string; // Firestore doc id
  merchantId: string;
  businessId?: string; // service belongs to a specific business
  icon: string; // URL
  serviceType: string;
  title: string;
  description?: string;
  price: number;
  availability?: IWeeklyAvailability;
  location?: IGeoPoint;
  createdAt: string;
  updatedAt?: string;
  isProduct?: boolean;
  stock?: number;
  reviews?: IReviewSummary;
};



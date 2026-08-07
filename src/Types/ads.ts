export interface IAd {
  id?: string;
  adId?: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl?: string;
  placement?: string;
  startsAt?: string;
  endsAt?: string;
  priority?: number;
  duration?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

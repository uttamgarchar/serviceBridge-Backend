export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'starting';
  images: string[];
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  otp?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified: boolean;
}

export interface Complaint {
  id: string;
  bookingId: string;
  reporterId: string;
  reporterName: string;
  reporterRole: 'user' | 'provider';
  targetId: string;
  targetName: string;
  type: 'service_quality' | 'behavior' | 'payment' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ProviderApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  experience: string;
  documents: {
    type: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
  }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  serviceCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface WithdrawalRequest {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  requestedAt: string;
  processedAt?: string;
}

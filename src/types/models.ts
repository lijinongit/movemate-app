export type UserType = 'customer' | 'trainer' | 'studio';
export type AccountStatus =
  | 'pending_verification'
  | 'verified'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'suspended';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type Language = 'en' | 'ar';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  userType: UserType;
  language: Language;
  dateOfBirth?: string;
  emiratesIdVerified: boolean;
  emiratesIdStatus: VerificationStatus;
  parentGuardianId?: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Trainer extends User {
  hourlyRate: number;
  disciplines: string[];
  certifications: Certification[];
  references: Reference[];
  introVideoUrl?: string;
  rating?: number;
  totalSessions?: number;
}

export interface Certification {
  id: string;
  discipline: string;
  documentPath: string;
  expiryDate: string;
  isValid: boolean;
  verifiedAt?: string;
}

export interface Reference {
  id: string;
  name: string;
  email: string;
  relationship: string;
  status: VerificationStatus;
  verifiedAt?: string;
}

export interface Studio {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  facilities: string[];
  revenueShare: number;
  status: AccountStatus;
  createdAt: string;
}

export interface EmiratesIdDocument {
  documentPath: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  verificationStatus: VerificationStatus;
}

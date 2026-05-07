export interface ApiErrorResponse {
  error: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password: string;
  language: 'en' | 'ar';
  userType: 'customer' | 'trainer' | 'studio';
}

export interface RegisterResponse {
  userId: string;
  email?: string;
  phone?: string;
  status: 'pending_verification';
  verificationMethod: 'email' | 'sms';
}

export interface OtpVerifyRequest {
  userId: string;
  otp: string;
}

export interface OtpVerifyResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  userType: 'customer' | 'trainer' | 'studio';
  emiratesIdVerified: boolean;
  emiratesIdStatus: 'pending' | 'approved' | 'rejected';
  dateOfBirth?: string;
  age?: number;
  status: string;
  createdAt: string;
}

export interface DocumentUploadRequest {
  presignedUrl: string;
  file: Blob;
  documentType: string;
}

export interface TrainerProfileRequest {
  emiratesId: {
    documentPath: string;
    uploadedAt: string;
  };
  hourlyRate: number;
  disciplines: string[];
  certifications: {
    discipline: string;
    documentPath: string;
    expiryDate: string;
  }[];
  references: {
    name: string;
    email: string;
    relationship: string;
  }[];
  introVideo?: {
    documentPath: string;
    duration: number;
  };
}

export interface TrainerProfileResponse {
  trainerId: string;
  status: 'pending_review' | 'approved' | 'rejected';
  createdAt: string;
}

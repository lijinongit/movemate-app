import { z } from 'zod';

export const EmailSchema = z.string().email('Invalid email address');

export const PhoneSchema = z
  .string()
  .regex(/^(\+971|00971|0)?[1-9]\d{8}$/, 'Invalid phone number');

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character');

export const NameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters');

export const RegisterCustomerSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: z.string().optional(),
  phone: z.string().optional(),
  password: PasswordSchema,
  confirmPassword: z.string(),
  language: z.enum(['en', 'ar']),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine(
  (data) => data.email || data.phone,
  'You must provide either an email or phone number'
);

export const OtpSchema = z.object({
  code: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export const HourlyRateSchema = z
  .number()
  .min(50, 'Rate must be at least 50 AED')
  .max(500, 'Rate must not exceed 500 AED');

export const DisciplineSchema = z.object({
  name: z.string(),
  documentPath: z.string(),
  expiryDate: z.string().refine(
    (date) => new Date(date) > new Date(),
    'Certification must not be expired'
  ),
});

export const ReferenceSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  relationship: z.string().min(1, 'Please select a relationship'),
});

export const DateOfBirthSchema = z.string().refine(
  (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  },
  'Invalid date of birth'
);

export type RegisterCustomer = z.infer<typeof RegisterCustomerSchema>;
export type Otp = z.infer<typeof OtpSchema>;
export type HourlyRate = z.infer<typeof HourlyRateSchema>;
export type Discipline = z.infer<typeof DisciplineSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;

import * as z from 'zod';

export const profileSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: 'First Name must be at least 3 characters' }),
  lastname: z
    .string()
    .min(3, { message: 'Last Name must be at least 3 characters' }),
  email: z
    .string()
    .email({ message: 'Email should be valid one' }),
  contactno: z.string().min(6, { message: 'Please enter a valid phone number' }),
  country: z.string().min(2, { message: 'Please enter a valid country' }),
  city: z.string().min(2, { message: 'Please enter a valid city' }),
  admintype: z.enum(['Doctor', 'Hospital']),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

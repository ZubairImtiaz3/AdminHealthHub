import * as z from 'zod';

export const profileSchema = z.object({
  first_name: z.string().min(3, { message: 'First Name must be at least 3 characters' }),
  last_name: z.string().min(3, { message: 'Last Name must be at least 3 characters' }).or(z.string().max(0)),
  email: z.string().email({ message: 'Email should be valid one' }),
  phone_number: z.string().min(6, { message: 'Please enter a valid phone number' }),
  country: z.string().min(2, { message: 'Please enter a valid country' }),
  city: z.string().min(2, { message: 'Please enter a valid city' }),
  admintype: z.enum(['Doctor', 'Hospital'], {
    errorMap: (issue, ctx) => {
      return { message: 'Please select an Admin type' };
    },
  }),
  password: z.string().optional()
})

export type ProfileFormValues = z.infer<typeof profileSchema>;

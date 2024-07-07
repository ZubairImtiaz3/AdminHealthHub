'use client';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { useRouter } from 'next-nprogress-bar';

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm new password is required')
});

interface FormData {
  newPassword: string;
  confirmNewPassword: string;
}

export function ResetPassForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { newPassword } = data;
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        toast({
          title: 'Something Went Wrong',
          description: 'Error updating your password.'
        });
      } else {
        router.push('/dashboard');
        toast({
          title: 'Success! Password Reset.',
          description: 'Redirecting to your dashboard.'
        });
      }
    } catch (err) {
      console.error('Error', err);
      toast({
        title: 'Something Went Wrong',
        description: 'Error updating your password.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          disabled={isLoading}
          id="newPassword"
          type="password"
          placeholder="Enter new password"
          {...register('newPassword')}
        />
        {errors.newPassword && (
          <span className="text-sm text-red-500">
            {errors.newPassword.message}
          </span>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <Input
          disabled={isLoading}
          id="confirmNewPassword"
          type="password"
          placeholder="Confirm new password"
          {...register('confirmNewPassword')}
        />
        {errors.confirmNewPassword && (
          <span className="text-sm text-red-500">
            {errors.confirmNewPassword.message}
          </span>
        )}
      </div>
      <Button disabled={isLoading} type="submit" className="w-full">
        Reset Password
      </Button>
    </form>
  );
}

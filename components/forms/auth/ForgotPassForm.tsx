'use client';
import Link from 'next/link';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required')
});

interface formData {
  email: string;
}

export function ForgotPassForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: formData) => {
    setIsLoading(true);
    const email = data?.email;

    try {
      const { data: resetPass, error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_ORIGIN}/reset-password`
        });

      if (!error) {
        toast({
          title: 'Password Reset Email Sent',
          description:
            'An email has been sent to your registered email address.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'An unexpected error occurred.'
        });
      }
    } catch (err) {
      console.error('error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          disabled={isLoading}
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register('email')}
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>
      <Button disabled={isLoading} type="submit" className="w-full">
        Reset Password
      </Button>
      <div className="mt-4 text-center text-sm">
        Remember your password?{' '}
        <Link href="/" className="underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}

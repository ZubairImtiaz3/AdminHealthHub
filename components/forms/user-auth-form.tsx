'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Enter your password' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const defaultValues = {
    email: '',
    passwrod: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: data?.email,
      password: data?.password
    });

    if (!error) {
      toast({
        title: 'Login Successfully.',
        description: 'Redirecting to your Dashboard'
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Something Went Wrong.',
        description: error.message
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Sign in
          </Button>
        </form>
      </Form>
    </>
  );
}

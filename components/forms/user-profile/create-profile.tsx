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
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { profileSchema, type ProfileFormValues } from '@/lib/user-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { SignUpSubmit } from '@/actions/signUp';
import deleteUser from '@/actions/deleteUser';
import { AlertModal } from '@/components/modal/alert-modal';
import { z } from 'zod';
import updateUser from '@/actions/updateUser';

interface ProfileFormType {
  initialData: any | null;
  categories: any;
}

export const CreateProfileOne: React.FC<ProfileFormType> = ({
  initialData,
  categories
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Profile' : 'Create Admin Profile';
  const description = initialData
    ? 'You can edit admin profile details.'
    : 'To create a new admin, add the following information about him.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ProfileFormValues>({
    // Require password when creating new
    resolver: (values, context, options) => {
      const schemaWithRefine =
        initialData === null
          ? profileSchema.extend({
              password: z
                .string()
                .min(8, {
                  message: 'Password must be at least 8 characters long'
                })
                .regex(/[A-Z]/, {
                  message: 'Password must contain at least one uppercase letter'
                })
                .regex(/[0-9]/, {
                  message: 'Password must contain at least one number'
                })
            })
          : profileSchema;

      return zodResolver(schemaWithRefine)(values, context, options);
    },
    defaultValues: {
      first_name: initialData?.profiles?.first_name || '',
      last_name: initialData?.profiles?.last_name || '',
      email: initialData?.profiles?.email || '',
      phone_number: initialData?.profiles?.phone_number || '',
      country: initialData?.country || '',
      city: initialData?.city || '',
      admintype: initialData?.admin_type || ''
    }
  });

  const {
    formState: { errors }
  } = form;

  const adminId = params ? params.adminsId : '';

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const fieldsToCompare = [
          'first_name',
          'last_name',
          'phone_number',
          'country',
          'city'
        ];

        const compareWithInitial = fieldsToCompare.every((field) => {
          if (field === 'country' || field === 'city') {
            return (data as any)[field] === initialData[field];
          } else {
            return (data as any)[field] === initialData.profiles[field];
          }
        });

        if (compareWithInitial) {
          toast({
            variant: 'destructive',
            title: 'No changes detected.',
            description: 'Please make changes before saving.'
          });
          setLoading(false);
          return;
        }

        // Updating existing admin
        const { profileError, adminError } = await updateUser(
          data,
          adminId as string
        );

        if (profileError || adminError) {
          toast({
            title: 'Something Went Wrong.',
            description: profileError || adminError
          });
          return;
        }

        toast({
          title: 'Success.',
          description: 'Admin updated successfully.'
        });
        router.push(`/dashboard/admins`);
      } else {
        const { profileError, signUpError } = await SignUpSubmit({
          first_name: data?.first_name,
          last_name: data?.last_name,
          phone_number: data?.phone_number,
          email: data?.email,
          password: data?.password || '',
          role: 'admin',
          country: data?.country,
          city: data?.city,
          adminType: data?.admintype
        });

        if (profileError || signUpError) {
          toast({
            title: 'Something Went Wrong.',
            description: profileError?.message || signUpError?.message
          });
        } else {
          toast({
            title: 'Admin Registered Successfully.',
            description: 'Redirecting to your Dashboard'
          });
          router.push('/dashboard/admins');
        }

        setLoading(false);
      }
      router.refresh();
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const { error } = await deleteUser(adminId as string);

      router.push('/dashboard/admins');
      router.refresh();
      toast({
        title: 'Success',
        description: 'Admin record successfully deleted.'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const adminTypes = [
    { id: 'Doctor', name: 'Doctor' },
    { id: 'Hospital', name: 'Hospital' }
  ];

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="admintype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Type</FormLabel>
                  <Select
                    disabled={loading || initialData?.admin_type}
                    onValueChange={field.onChange}
                    value={field.value || initialData?.admin_type}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={initialData?.admin_type}
                          placeholder="Select Admin Type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      {adminTypes.map((adminTypes) => (
                        <SelectItem key={adminTypes.id} value={adminTypes.id}>
                          {adminTypes.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('admintype') === 'Hospital' ? (
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Hospital Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="John"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading || initialData?.profiles?.email}
                      placeholder="johndoe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!initialData && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={loading}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your contact number"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter your country"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter your city"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

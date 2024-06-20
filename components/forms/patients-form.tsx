'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '../ui/use-toast';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  first_name: z.string().min(1, { message: 'Patient First Name is required' }),
  last_name: z.string().min(1, { message: 'Patient Last Name is required' }),
  gender: z.string().min(3, { message: 'Patient Gender must be selected' }),
  phone_number: z
    .string()
    .min(1, { message: 'Patient Phone Number must be provided' })
    .regex(/^\d+$/, { message: 'Patient Phone Number must be a number' })
});

type PatientsFormValues = z.infer<typeof formSchema>;

interface PatientsFormProps {
  initialData: any | null;
  categories: any;
}

export const PatientsForm: React.FC<PatientsFormProps> = ({
  initialData,
  categories
}) => {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit patient' : 'Add patient';
  const description = initialData ? 'Edit a patient.' : 'Add a new patient';
  const toastMessage = initialData ? 'patient updated.' : 'patient created.';
  const action = initialData ? 'Save changes' : 'Create';

  console.log('params', params.patientsId);

  const defaultValues = initialData
    ? initialData
    : {
        firstName: '',
        lastName: '',
        description: '',
        gender: '',
        phone: ''
      };

  const form = useForm<PatientsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: PatientsFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone_number', data?.phone_number)
          .single();

        const userId = profile?.id;

        const { data: patients, error } = await supabase
          .from('patients')
          .insert([
            {
              user_id: '91ebb764-4d52-4cdc-94ef-7060a81300f4',
              first_name: data?.first_name,
              last_name: data?.last_name,
              phone_number: data?.phone_number,
              gender: data?.gender
            }
          ])
          .select();

        // const { data: associated_patients } = await supabase
        //   .from('associated_patients')
        //   .insert([
        //     {
        //       patients_id: patients ? patients[0]?.id : '',
        //       associated_patients_id: ''
        //     }
        //   ])
        //   .select();

        // console.log('associated_patients', associated_patients);
      }
      router.push(`/dashboard/patients`);
      toast({
        title: 'Success.',
        description: 'Patient Added Successfully.'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
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
            {/* first name */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Patient's First name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* last name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Patient's Last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value || 'Select Patient Gender'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ph no */}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Patient Phone Number"
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

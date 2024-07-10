'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modal/alert-modal';
import ReportUploader from '@/components/file-uploader';
import { createClient } from '@/utils/supabase/client';
import { PDFDocument } from 'pdf-lib';
import { useSearchParams } from 'next/navigation';
import { Icons } from '../icons';

export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  title: z.string().min(3, { message: 'Report Title must be provided' }),
  description: z.string().optional(),
  files: z
    .array(z.instanceof(File))
    .max(5, { message: 'You can upload up to 5 files.' })
});

type PatientsFormValues = z.infer<typeof formSchema>;

interface PatientsFormProps {
  initialData: any | null;
}

interface ReportData {
  title: string;
  description: string;
  report_link: string;
  report_id: string;
}

export const ReportsForm: React.FC<PatientsFormProps> = () => {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<ReportData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [errorFetch, setErrorFetch] = useState<any>(null);
  const [showUploader, setShowUploader] = useState(
    initialData === null ? true : false
  );
  const title = initialData ? 'Edit report' : 'Add report';
  const description = initialData ? 'Edit a report.' : 'Add a new report';
  const action = initialData ? 'Save changes' : 'Create';

  const reportId = params ? params.reportsId : null;

  useEffect(() => {
    const fetchReport = async () => {
      if (params.reportsId && params.reportsId !== 'new') {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('id', params.reportsId)
          .single();

        if (data) {
          setInitialData({
            title: data.report_title,
            description: data.report_description,
            report_link: data.report_link,
            report_id: data.id
          });
        } else if (error) {
          setErrorFetch(error.message);
        }
        setFetching(false);
      } else {
        setFetching(false);
      }
    };

    fetchReport();
  }, [params.reportsId, supabase, toast]);

  const defaultValues = initialData
    ? initialData
    : {
        description: '',
        title: '',
        files: []
      };

  const form = useForm<PatientsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  // useEffect(() => {
  //   setShowUploader(initialData === null);
  // }, [initialData]);

  // Function to convert images to a single PDF
  const convertImagesToPDF = async (files: File[]) => {
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const imgBuffer = await file.arrayBuffer();

      let img;
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        img = await pdfDoc.embedJpg(imgBuffer);
      } else if (file.type === 'image/png') {
        img = await pdfDoc.embedPng(imgBuffer);
      } else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  };

  // to get the patient id
  const patientId = searchParams.get('id');

  // onSubmit function
  const onSubmit = async (data: PatientsFormValues) => {
    console.log('btn hit');
    try {
      setLoading(true);

      const { data: patientData, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId);

      const patient = patientData ? patientData : [];

      // logic to generate the link for report
      const currentDateTime = new Date().toISOString().replace(/[:.-]/g, '_');
      const pdfBlob = await convertImagesToPDF(data.files);
      const pdfFileName = `${patient[0]?.first_name}_${patient[0]?.last_name}_${currentDateTime}.pdf`;
      const pdfFile = new File([pdfBlob], pdfFileName, {
        type: 'application/pdf'
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reports')
        .upload(`public/${pdfFile.name}`, pdfFile);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl }
      } = supabase.storage.from('reports').getPublicUrl(uploadData.path);

      const fileLink = publicUrl;

      const { data: reportData } = await supabase
        .from('reports')
        .select()
        .eq('id', reportId)
        .single();
      const redirectionId = reportData ? reportData?.patient_id : '';

      if (initialData) {
        if (
          data.title === initialData.title &&
          data.description === initialData.description &&
          data.files.length === 0
        ) {
          toast({
            title: 'No Changes Detected',
            description:
              'The data you entered is the same as the existing data.'
          });
          return;
        }

        // if data different then, Update report logic
        const { data: updateData, error: updateError } = await supabase
          .from('reports')
          .update({
            report_title: data.title,
            report_description: data.description,
            report_link: fileLink
          })
          .eq('id', initialData.report_id);

        toast({
          title: 'Success',
          description: 'Your report has been successfully updated.'
        });

        if (updateError) {
          console.error('Error updating report:', updateError);
          throw updateError;
        }
      } else {
        // Insert new report logic
        if (data.files.length === 0) {
          toast({
            title: 'Upload Report',
            description: 'At least one report needs to be added'
          });
          return;
        }

        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .insert([
            {
              user_id: patient[0].user_id,
              patient_id: patientId,
              report_title: data.title,
              report_description: data.description,
              report_link: fileLink
            }
          ])
          .select();

        toast({
          title: 'Success',
          description: 'Your report has been successfully submitted.'
        });
        if (reportError) {
          console.error('Error inserting report:', reportError);
          throw reportError;
        }
      }
      router.refresh();
      router.push(`/dashboard/patients/${redirectionId}`);
    } catch (error: any) {
      console.error('An error occurred:', error);
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
    const report = initialData ? initialData.report_link : '';

    // Extract the file path from the URL
    const filePath = report.split('/storage/v1/object/public/reports/')[1];

    try {
      setLoading(true);
      const { error: dbError } = await supabase
        .from('reports')
        .delete()
        .eq('id', params.reportsId);

      if (dbError) throw dbError;

      // Delete the file from storage
      const { data, error: storageError } = await supabase.storage
        .from('reports')
        .remove([filePath]);

      if (storageError) throw storageError;

      router.back();
      router.refresh();
      toast({
        title: 'Success',
        description: 'Report successfully deleted.'
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

  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="mr-2 h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (errorFetch) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Heading
          title="Invalid Patient Report Request"
          description="Something Went Wrong..."
        />
      </div>
    );
  }

  const ReportLinkCell = ({ reportLink }: { reportLink: string }) => {
    const handleClick = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      const url =
        reportLink.startsWith('http://') || reportLink.startsWith('https://')
          ? reportLink
          : `https://${reportLink}`;
      window.open(url, '_blank');
    };

    return (
      <Button className="p-auto ml-auto" onClick={handleClick}>
        View Existing Report
      </Button>
    );
  };

  const handleButtonClick = () => {
    setShowUploader(true);
  };

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
            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Title</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Report title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Report description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="m-auto flex max-w-max items-center gap-6">
            <div>
              {/* file uploader */}
              {showUploader ? (
                <Controller
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ReportUploader
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <Button className="p-auto ml-auto" onClick={handleButtonClick}>
                  Change The Report
                </Button>
              )}
            </div>
            {initialData?.report_link && (
              <div>
                <ReportLinkCell
                  reportLink={initialData?.report_link as string}
                />
              </div>
            )}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

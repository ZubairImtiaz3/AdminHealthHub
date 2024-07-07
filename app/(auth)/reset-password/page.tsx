import { AuthTemplate } from '@/components/forms/auth/AuthTemplate';
import { ResetPassForm } from '@/components/forms/auth/ResetPassForm';

const page = () => {
  return (
    <AuthTemplate
      title="Reset Password"
      description="Enter new password below to reset"
      imgOrder="right"
    >
      <ResetPassForm />
    </AuthTemplate>
  );
};

export default page;

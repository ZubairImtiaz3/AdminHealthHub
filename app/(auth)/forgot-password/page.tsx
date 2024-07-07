import { AuthTemplate } from '@/components/forms/auth/AuthTemplate';
import { ForgotPassForm } from '@/components/forms/auth/ForgotPassForm';

const page = () => {
  return (
    <AuthTemplate
      title="Forgot Password?"
      description="Enter your email below to reset your password"
      imgOrder="left"
    >
      <ForgotPassForm />
    </AuthTemplate>
  );
};

export default page;

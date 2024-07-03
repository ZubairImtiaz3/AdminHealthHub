"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { supabase as supabaseAdmin } from "@/utils/supabase/admin";
import { SignUpAdmin } from "@/types/auth";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export const SignUpSubmit = async (SignUpData: SignUpAdmin) => {
  const { data: { user }, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
    email: SignUpData.email,
    password: SignUpData.password,
    email_confirm: true
  });

  if (!user) {
    return { signUpError };
  }

  const userId = user.id;

  const profileData = {
    id: userId,
    first_name: SignUpData.first_name,
    last_name: SignUpData.last_name,
    phone_number: SignUpData.phone_number,
    email: SignUpData.email,
    role: 'admin',
  };

  const adminAdditional = {
    id: userId,
    country: SignUpData.country,
    city: SignUpData.city
  };

  const [profileResult, adminResult] = await Promise.all([
    supabase.from("profiles").insert(profileData).select(),
    supabase.from("admins").insert(adminAdditional).select()
  ]);

  const { data: profile, error: profileError } = profileResult;
  const { data: admin, error: adminError } = adminResult;

  return { user, signUpError, profile, profileError, admin, adminError };
};

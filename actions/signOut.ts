"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const signOut = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signOut();
  if (error === null) {
    return { error };
  }
};

export default signOut;

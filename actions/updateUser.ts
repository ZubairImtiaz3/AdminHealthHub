"use server";
import { ProfileFormValues } from "@/lib/user-form-schema";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

const updateUser = async (data: ProfileFormValues, id: string) => {

    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            first_name: data?.first_name,
            last_name: data?.last_name,
            phone_number: data?.phone_number
        })
        .match({ id: id })
        .select();

    if (profileError) {
        throw profileError;
    }

    const { error: adminError } = await supabase
        .from('admins')
        .update({
            country: data?.country,
            city: data?.city
        })
        .match({ id: id })
        .select();

    if (adminError) {
        throw adminError;
    }

    return { profileError, adminError }
};

export default updateUser;
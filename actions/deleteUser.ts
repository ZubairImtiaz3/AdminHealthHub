"use server";
import { supabase as supabaseAdmin } from "@/utils/supabase/admin";

const deleteUser = async (id: string) => {
    const { data: deletedAdmin, error } =
        await supabaseAdmin.auth.admin.deleteUser(id);

    return { deletedAdmin, error }
};

export default deleteUser;
import { supabase } from "../supabase";

export async function saveSession(session) {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .insert([session]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return null;
  }
}

import { supabase } from "@/integrations/supabase/client";

export async function uploadImage(
  bucket: "media" | "projects" | "testimonials" | "founder",
  file: File,
  folder = ""
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const key = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(key, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return data.publicUrl;
}

export function storagePathFromUrl(url: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return url.slice(i + marker.length);
}

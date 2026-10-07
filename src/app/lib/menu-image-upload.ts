import { supabaseAdmin } from "@/app/lib/supabase-admin";

const BUCKET = "menu-images";

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "size" in value &&
    Number((value as File).size) > 0
  );
}

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function imageUrlFromForm(formData: FormData, fallback = "") {
  const image = formData.get("image");
  if (isUploadedFile(image)) {
    const type = image.type?.startsWith("image/") ? image.type : "image/jpeg";
    const path = `${crypto.randomUUID()}.${extensionFor(type)}`;
    const bytes = Buffer.from(await image.arrayBuffer());
    const supabase = supabaseAdmin();
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: type,
      upsert: false,
    });
    if (error) {
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  const current = String(formData.get("current_image") ?? "");
  if (current && current !== "[object File]") return current;
  return fallback;
}

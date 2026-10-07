"use client";

import type { ChangeEvent } from "react";

async function compressImage(file: File) {
  if (!file.type.startsWith("image/") && file.type !== "") {
    return file;
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const max = 1200;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((next) => resolve(next), "image/jpeg", 0.8),
  );
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
    type: "image/jpeg",
  });
}

export function MenuImageInput({ required = false }: { required?: boolean }) {
  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    const data = new DataTransfer();
    data.items.add(compressed);
    input.files = data.files;
  }

  return (
    <input
      name="image"
      type="file"
      accept="image/*"
      required={required}
      onChange={onChange}
      className="border border-gray-300 rounded-md p-2"
    />
  );
}

"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import { Camera } from "lucide-react";

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
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);

  async function applyFile(input: HTMLInputElement, file: File) {
    const compressed = await compressImage(file);
    const data = new DataTransfer();
    data.items.add(compressed);
    input.files = data.files;
    setPreview(URL.createObjectURL(compressed));
  }

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    await applyFile(input, file);
  }

  async function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const input = event.currentTarget.querySelector("input[type='file']");
    const file = event.dataTransfer.files[0];
    if (!(input instanceof HTMLInputElement) || !file) return;
    await applyFile(input, file);
  }

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`flex min-h-44 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-[#F7F3EC] text-center ${
        dragging ? "border-[#E2584B]" : "border-zinc-300"
      }`}
    >
      <input
        name="image"
        type="file"
        accept="image/*"
        required={required}
        onChange={onChange}
        className="sr-only"
      />
      {preview ? (
        <img src={preview} alt="" className="h-44 w-full object-cover" />
      ) : (
        <>
          <Camera className="mb-3 size-6 text-[#E2584B]" strokeWidth={1.5} />
          <p className="text-zinc-800">写真をドラッグ＆ドロップ</p>
          <p className="mt-1 text-sm text-zinc-500">またはクリックしてアップロード</p>
        </>
      )}
    </label>
  );
}

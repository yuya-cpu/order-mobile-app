import Image from "next/image";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isMenuId(value: string) {
  return UUID_RE.test(value);
}

export function menuImageSrc(url: string | null | undefined) {
  if (!url || url === "[object File]") return undefined;
  if (
    url.startsWith("/") ||
    url.startsWith("https://") ||
    url.startsWith("http://") ||
    url.startsWith("data:image/")
  ) {
    return url;
  }
  return undefined;
}

export function MenuPhoto({
  url,
  alt,
  className,
}: {
  url?: string | null;
  alt: string;
  className: string;
}) {
  const src = menuImageSrc(url);
  const frame = `relative block overflow-hidden bg-zinc-200 ${className}`;
  if (!src) return <span aria-hidden className={frame} />;

  if (src.startsWith("data:")) {
    return (
      <span className={frame}>
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span className={frame}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 256px"
        className="object-cover"
      />
    </span>
  );
}

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
  if (!src) return <div aria-hidden className={className} />;
  return <img src={src} alt={alt} className={className} />;
}

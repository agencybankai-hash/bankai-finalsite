/** Короткая подпись устройства для админки: «iPhone · Safari». Полный UA хранится как есть. */
export function deviceLabel(ua: string | null | undefined): string {
  if (!ua) return "—";
  const os = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /Macintosh|Mac OS X/.test(ua)
            ? "Mac"
            : /Linux/.test(ua)
              ? "Linux"
              : "";
  const browser = /YaBrowser/.test(ua)
    ? "Яндекс"
    : /Edg\//.test(ua)
      ? "Edge"
      : /OPR\/|Opera/.test(ua)
        ? "Opera"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Chrome\/|CriOS\//.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "";
  const label = [os, browser].filter(Boolean).join(" · ");
  return label || ua.slice(0, 40);
}

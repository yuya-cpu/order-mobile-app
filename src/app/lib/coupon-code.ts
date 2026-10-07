// 32文字ちょうどにして 256 % 32 === 0 を満たすことでモジュロバイアスを避ける。
// 読み間違いを防ぐため 0 / O / 1 / I は含めない。
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCouponCode(length = 8) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function normalizeCouponCode(value: unknown) {
  const code = String(value ?? "").trim().toUpperCase();
  return code === "" ? null : code;
}

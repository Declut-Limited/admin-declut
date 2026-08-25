/* eslint-disable @typescript-eslint/no-explicit-any */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const message = (error as any)?.response?.data?.error?.message;
  if (Array.isArray(message)) return message.filter(Boolean).join(" ") || fallback;
  return typeof message === "string" ? message : fallback;
}
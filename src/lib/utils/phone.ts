const COUNTRY_CODES = ["+234", "+233", "+254", "+27", "+44", "+1"];

export const DEFAULT_COUNTRY_CODE = "+234";

export interface PhoneValue {
  phoneNumber: string;
  countryCode: string;
}

type PhoneInput = string | PhoneValue | undefined | null;

export function splitPhoneNumber(phone: PhoneInput) {
  if (phone && typeof phone === "object") {
    const code = phone.countryCode || DEFAULT_COUNTRY_CODE;
    const number = phone.phoneNumber ?? "";
    return { code, number: number && !number.startsWith("0") ? `0${number}` : number };
  }

  const value = phone ?? "";
  const match = COUNTRY_CODES.find((code) => value.startsWith(code));
  if (match) {
    const number = value.slice(match.length);
    return { code: match, number: number && !number.startsWith("0") ? `0${number}` : number };
  }
  return { code: DEFAULT_COUNTRY_CODE, number: value };
}

// Local numbers are entered/displayed with a leading 0 (e.g. 08012345678);
// the API wants the country code and number combined with that 0 dropped.
export function combinePhoneNumber(code: string, number: string) {
  const trimmed = number.trim();
  const withoutLeadingZero = trimmed.startsWith("0") ? trimmed.slice(1) : trimmed;
  return `${code}${withoutLeadingZero}`;
}

export function formatPhoneNumber(phone: PhoneInput) {
  if (!phone) return "";
  const { code, number } = splitPhoneNumber(phone);
  return number ? `${code} ${number}` : code;
}

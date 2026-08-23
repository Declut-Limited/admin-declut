import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface PhoneInputProps {
  countryCode: string;
  countryCodeOptions: string[];
  onCountryCodeChange: (value: string) => void;
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInput({
  countryCode,
  countryCodeOptions,
  onCountryCodeChange,
  value,
  onChange,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="phone-input-container">
      <div className="phone-input-code-wrapper" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="phone-input-code-trigger"
        >
          <span>{countryCode}</span>
          <FiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="phone-input-code-dropdown">
            {countryCodeOptions.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  onCountryCodeChange(code);
                  setOpen(false);
                }}
                className="phone-input-code-option"
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </div>

      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="phone-input-number-field"
      />
    </div>
  );
}
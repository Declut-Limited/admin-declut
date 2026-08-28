import type { ReactNode } from "react";
import logo from "@/assets/icons/auth-logo.svg";
import { FiShield } from "react-icons/fi";
import { PiShieldCheckFill } from "react-icons/pi";

interface AuthBrandPanelProps {
  heading?: ReactNode;
  subtext?: string;
}

export default function AuthBrandPanel({
  heading = (
    <>
      Run Declut with clarity
      <br />
      and control.
    </>
  ),
  subtext = "One secure workspace for finance, support, operations, compliance and investigations.",
}: AuthBrandPanelProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="hidden lg:flex lg:w-1/2 auth-brand-panel text-white flex-col justify-between p-12">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Declut" className="w-8 h-8 object-contain" />
        <span className="font-semibold text-lg">
          Declut <span className="text-[#a1a0a0] font-bold">Admin</span>
        </span>
      </div>

      <div className="flex flex-col gap-6">
        
        <div className="relative w-54 h-38">
          <div className="absolute inset-0 rounded-xl border border-white/10 bg-[#1C1C1C] overflow-visible">
            {/* title bar */}
            <div className="flex items-center gap-1.5 px-3 pt-3 bg-[#404040] p-4 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
            </div>

            {/* content bars */}
            <div className="flex flex-col gap-2.5 px-4 mt-4">
              <div className="h-2 bg-white/15 rounded-full w-3/4" />
              <div className="h-2 bg-white/15 rounded-full w-full" />
              <div className="h-2 bg-white/15 rounded-full w-2/3" />
            </div>

            {/* pill button */}
            <div className="px-4 mt-4">
              <div
                className="h-3 rounded-full w-24"
                style={{
                  background: "linear-gradient(90deg, #93B4FF, #3B5FE0)",
                }}
              />
            </div>

            {/* small dot bottom-left, overlapping edge */}
            <span className="absolute -left-1.5 bottom-3 w-3 h-3 rounded-full bg-indigo-500" />
          </div>

          {/* gradient shield circle*/}
          <div
            className="absolute right-1 bottom-2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #93B4FF, #3B5FE0)" }}
          >
            <PiShieldCheckFill className="w-9 h-9 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-dm-serif leading-snug">{heading}</h1>
          <p className="text-md text-gray-400 mt-2 max-w-xs">{subtext}</p>
        </div>

        <div className="auth-badge w-fit" style={{background: "rgba(255, 255, 255, 0.04)"}}>
          <FiShield className="w-3.5 h-3.5" />
          Protected by SSO, 2FA &amp; role-based access control
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>© {currentYear} Declut Limited</span>
        <span className="border border-white/10 rounded px-2 py-1">
          v{import.meta.env.VITE_APP_VERSION}
        </span>
      </div>
    </div>
  );
}

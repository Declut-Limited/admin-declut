import AuthBrandPanel from "@/components/generic/AuthBrandPanel";
import { FiCheck } from "react-icons/fi";

export default function PasswordResetSuccessPage() {
  return (
    <div className="min-h-screen flex tracking-wide">
      <AuthBrandPanel />

      {/* right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FCFCFD] dark:bg-gray-950 p-6">
        <div className="w-full max-w-125 text-center font-standerd">
          <span className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-4 mx-auto">
            <span className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
              <FiCheck className="w-4 h-4 text-white" />
            </span>
          </span>

          <h2 className="text-[40px] text-[#1F1F1F] dark:text-gray-100 font-dm-serif">
            Password Reset Successfully
          </h2>
          <p className="text-sm text-brand-gray-light dark:text-gray-400 mt-1">
            Your password has been updated successfully. You can now sign in using your new credentials. All other active sessions have been signed out for security.
          </p>

          <a
            href="/sign-in"
            className="block w-full bg-brand-blue text-white text-sm font-medium py-3 rounded-lg hover:bg-[#3F5EE0] transition-colors mt-5"
          >
            Go to Sign In
          </a>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Didn't make this change?{" "}
            <a href="#" className="text-brand-blue hover:underline">
              Report it to Security
            </a>{" "}
            immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
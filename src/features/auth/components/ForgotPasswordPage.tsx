import AuthBrandPanel from "@/components/generic/AuthBrandPanel";
import { useState } from "react";
import { IoMdMail } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "@/features/auth/queries";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          navigate("/resend-link", { state: { email } });
        },
        onError: (error) => {
          showToast.error("Something went wrong", {
            description: getApiErrorMessage(error),
          });
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex tracking-wide">
      <AuthBrandPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FCFCFD] dark:bg-gray-950 p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-125">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-4">
              <FaKey size={32} color="#2563EB" />
            </span>
            <h2 className="text-[40px] text-[#1F1F1F] dark:text-gray-100 font-dm-serif">
              Forgot password?
            </h2>
            <p className="text-sm text-brand-gray-light dark:text-gray-400 mt-1">
              Enter your work email address and we'll send you a secure password
              reset link.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-4 font-standerd">
            <div className="auth-input-wrapper">
              <IoMdMail className="auth-input-icon" color="#475467" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              For security, we'll only send a link if this email belongs to an
              admin account.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-blue text-white text-sm font-medium py-3 rounded-lg hover:bg-[#3F5EE0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="flex justify-center">
            <a
              href="/sign-in"
              className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 cursor-pointer hover:underline"
            >
              Back to Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

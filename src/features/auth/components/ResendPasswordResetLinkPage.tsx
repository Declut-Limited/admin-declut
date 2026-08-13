import { useState, useEffect } from "react";
import AuthBrandPanel from "@/components/generic/AuthBrandPanel";
import { IoMdMail } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const RESEND_COOLDOWN_SECONDS = 30 * 60; // 30 minutes, matches "expires in 30 minutes"

export default function ResendPasswordResetLinkPage() {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const navigate = useNavigate();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    // TODO: wire to authApi.resendResetLink, also pass email from forgot password page
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    navigate("/reset-password");
  };

  const handleOpenEmailApp = () => {
    window.location.href = "mailto:";
  };

  return (
    <div className="min-h-screen flex tracking-wide">
      <AuthBrandPanel />

      {/* right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FCFCFD] dark:bg-gray-950 p-6">
        <div className="w-full max-w-125">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-4">
              <IoMdMail size={28} color="#2563EB" />
            </span>
            <h2 className="text-[40px] font-bold text-[#1F1F1F] dark:text-gray-100">
              Check Your Email
            </h2>
            <p className="text-sm text-brand-gray-light dark:text-gray-400 mt-1">
              We've sent a secure password reset link to{" "}
              <span className="font-semibold text-[#1F1F1F] dark:text-gray-200">your email</span>. The
              link expires in 30 minutes.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-4 font-standerd">
            <button
              type="button"
              onClick={handleOpenEmailApp}
              className="w-full bg-brand-blue text-white text-sm font-medium py-3 rounded-lg hover:bg-[#3F5EE0] transition-colors"
            >
              Open Email App
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0}
              className="w-full border border-gray-200 dark:border-gray-700 text-[#414651] dark:text-gray-100 text-sm font-medium py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {secondsLeft > 0 ? `Resend Link (${formatTime(secondsLeft)})` : "Resend Link"}
            </button>
          </div>

          <div className="flex justify-center">
            <a
              href="/sign-in"
              className="flex items-center gap-1.5 text-center text-sm text-brand-blue mt-2 cursor-pointer hover:underline font-medium"
            >
              <FaArrowLeftLong className="w-4 h-4" />
              Back to Sign In
            </a>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Didn't get it? Check spam, or confirm your admin email with IT.
          </p>
        </div>
      </div>
    </div>
  );
}
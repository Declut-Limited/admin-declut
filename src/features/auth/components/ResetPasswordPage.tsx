import { useState, useMemo, useEffect } from "react";
import AuthBrandPanel from "@/components/generic/AuthBrandPanel";
import { FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";
import lockCircle from "../../../assets/icons/lock-circle.svg";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useVerifyResetToken, useResetPassword } from "@/features/auth/queries";
import { showToast } from "@/lib/utils/toast";
import PageLoader from "@/components/generic/PageLoader";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  { label: "At least 10 characters", test: (v) => v.length >= 10 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One number", test: (v) => /[0-9]/.test(v) },
  { label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function getStrength(password: string) {
  const passedCount = passwordRules.filter((rule) =>
    rule.test(password),
  ).length;

  if (password.length === 0) return { label: "", color: "", bars: 0 };
  if (passedCount <= 2)
    return { label: "Weak password", color: "bg-red-500", bars: 1 };
  if (passedCount <= 4)
    return { label: "Moderate password", color: "bg-amber-500", bars: 2 };
  return { label: "Strong password", color: "bg-green-500", bars: 4 };
}

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    data: verifyData,
    isLoading: isVerifying,
    isError: isVerifyError,
  } = useVerifyResetToken(token);
  const { mutate: resetPassword, isPending } = useResetPassword(token);

  const strength = useMemo(() => getStrength(password), [password]);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const allRulesPassed = passwordRules.every((rule) => rule.test(password));

  const isInvalidToken = isVerifyError || verifyData?.data?.valid === false;

  useEffect(() => {
    if (isInvalidToken) {
      showToast.error("Link expired", {
        description: "Request a new password reset link.",
      });
      navigate("/forgot-password", { replace: true });
    }
  }, [isInvalidToken, navigate]);

  if (isVerifying || isInvalidToken) return <PageLoader />;

  if (isVerifying) return <PageLoader />;
  if (isVerifyError || verifyData?.data?.valid === false) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!allRulesPassed || !passwordsMatch) return;

    resetPassword(
      { password, passwordConfirm: confirmPassword },
      {
        onSuccess: () => {
          navigate("/reset-password-success");
        },
        onError: (error) => {
          showToast.error("Couldn't reset password", {
            description: getApiErrorMessage(
              error,
              "Please try again or request a new link.",
            ),
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
            <span className="w-18 h-18 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-4">
              <img
                src={lockCircle}
                alt=""
                className="w-12 h-12 object-contain"
              />
            </span>
            <h2 className="text-[40px] text-[#1F1F1F] dark:text-gray-100 font-dm-serif">
              Set A New Password
            </h2>
            <p className="text-sm text-brand-gray-light dark:text-gray-400 mt-1">
              Resetting password for{" "}
              <span className="font-semibold text-[#1F1F1F] dark:text-gray-200">
                {/* {verifyData?.data?.email ?? "your account"} */}
                your account
              </span>
              . Choose a strong password you haven't used before.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="auth-input-wrapper">
                <RiLockPasswordFill
                  className="auth-input-icon"
                  color="#475467"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {password.length > 0 && (
                <>
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full ${i < strength.bars ? strength.color : "bg-gray-200 dark:bg-gray-700"}`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs mt-1 ${strength.color.replace("bg-", "text-")}`}
                  >
                    {strength.label}
                  </p>
                </>
              )}
            </div>

            <div className="bg-[#F2F4F7] dark:bg-gray-900 rounded-lg p-3 grid grid-cols-3 gap-x-4 gap-y-2">
              {passwordRules.map((rule) => {
                const passed = rule.test(password);
                return (
                  <div
                    key={rule.label}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                        passed
                          ? "bg-[#027A48]"
                          : "border border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {passed && <FiCheck className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <span
                      className={
                        passed
                          ? "text-[#027A48] dark:text-green-400"
                          : "text-brand-gray-light dark:text-gray-400"
                      }
                    >
                      {rule.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="auth-input-wrapper">
                <RiLockPasswordFill
                  className="auth-input-icon"
                  color="#475467"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!allRulesPassed || !passwordsMatch || isPending}
            className="w-full bg-brand-blue text-white text-sm font-medium py-3 rounded-lg hover:bg-[#3F5EE0] transition-colors mt-5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Resetting..." : "Reset Password"}
          </button>

          <div className="flex justify-center">
            <a
              href="/sign-in"
              className="flex items-center gap-1.5 text-center text-sm text-brand-gray-light dark:text-gray-400 mt-4 cursor-pointer hover:underline"
            >
              <FaArrowLeftLong className="w-4 h-4" />
              Back
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

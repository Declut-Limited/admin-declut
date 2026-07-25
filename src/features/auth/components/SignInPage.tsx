import AuthBrandPanel from "@/components/generic/AuthBrandPanel";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "@/assets/icons/round-logo.svg";
import { IoMdMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex tracking-wide">
      <AuthBrandPanel />

      {/* right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FCFCFD] dark:bg-gray-950 p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="w-14 h-14 flex items-center justify-center mb-4">
              <img src={logo} alt="" className="w-14 h-14 object-contain" />
            </span>
            <h2 className="text-[40px] font-bold text-[#1F1F1F] dark:text-gray-100">
              Welcome Back
            </h2>
            <p className="text-sm text-[#667085] dark:text-gray-400 mt-1">
              Sign in to the Declut administration console.
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
                // TODO: Uncomment required
              />
            </div>

            <div className="auth-input-wrapper">
              <RiLockPasswordFill className="auth-input-icon" color="#475467" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                // required
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
          </div>

          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 text-sm text-[#454545] font-medium dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember this device
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-[#2563EB] font-semibold hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563EB] text-white text-sm font-medium py-3 rounded-lg hover:bg-[#3F5EE0] transition-colors"
          >
            Sign In
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Access is by invitation only. Need an account?{" "}
            <a href="#" className="text-[#2563EB] underline">
              Contact your administrator.
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

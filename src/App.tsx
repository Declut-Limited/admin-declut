import { Routes, Route } from "react-router-dom";
import DashboardPage from "@/features/dashboard/components/DashboardPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import SignInPage from "./features/auth/components/SignInPage";
import ForgotPasswordPage from "./features/auth/components/ForgotPasswordPage";
import ResendPasswordResetLinkPage from "./features/auth/components/ResendPasswordResetLinkPage";
import ResetPasswordPage from "./features/auth/components/ResetPasswordPage";
import PasswordResetSuccessPage from "./features/auth/components/PasswordResetSuccessPage";
import UsersPage from "./features/users/components/UsersPage";

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/resend-link" element={<ResendPasswordResetLinkPage />} />
      {/* pass token as prop to reset password page , we will need to check if token is valid and then show the page else re route back to resend link*/}
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      <Route path="/reset-password-success" element={<PasswordResetSuccessPage />} />
      {/* protect the routes later */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;

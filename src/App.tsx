import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "@/features/dashboard/components/DashboardPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import SignInPage from "./features/auth/components/SignInPage";
import ForgotPasswordPage from "./features/auth/components/ForgotPasswordPage";
import ResendPasswordResetLinkPage from "./features/auth/components/ResendPasswordResetLinkPage";
import ResetPasswordPage from "./features/auth/components/ResetPasswordPage";
import PasswordResetSuccessPage from "./features/auth/components/PasswordResetSuccessPage";
import UsersPage from "./features/users/components/UsersPage";
import UserDetailPage from "./features/users/components/UserDetailPage";
import ListingsPage from "./features/listings/components/ListingsPage";
import ListingDetailPage from "./features/listings/components/ListingDetailPage";
import CategoriesPage from "./features/categories/components/CategoriesPage";
import ReviewsPage from "./features/reviews/components/ReviewsPage";
import DisputesPage from "./features/disputes/components/DisputesPage";
import DisputeDetailPage from "./features/disputes/components/DisputeDetailPage";
import ActivityLogsPage from "./features/activity-logs/components/ActivityLogsPage";
import ActivityLogDetailPage from "./features/activity-logs/components/ActivityLogDetailPage";
import PromotionsPage from "./features/promotions/components/PromotionsPage";
import PromotionDetailPage from "./features/promotions/components/PromotionDetailPage";
import NotificationsPage from "./features/notifications/components/NotificationsPage";
import AutomationRulesPage from "./features/notifications/components/AutomationRulesPage";
import NotificationDetailPage from "./features/notifications/components/NotificationDetailPage";
import ContentDetailPage from "./features/content/components/ContentDetailPage";
import ContentPage from "./features/content/components/ContentPage";
import TransactionsPage from "./features/transactions/components/TransactionsPage";
import TransactionDetailPage from "./features/transactions/components/TransactionDetailPage";
import EscrowPage from "./features/escrows/components/EscrowsPage";
import EscrowDetailPage from "./features/escrows/components/EscrowDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sign-in" replace />} />

      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/resend-link" element={<ResendPasswordResetLinkPage />} />
      {/* pass token as prop to reset password page , we will need to check if token is valid and then show the page else re route back to resend link*/}
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
        path="/reset-password-success"
        element={<PasswordResetSuccessPage />}
      />
      {/* protect the routes later */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserDetailPage />} />

        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:listingId" element={<ListingDetailPage />} />

        <Route path="/categories" element={<CategoriesPage />} />

        <Route path="/reviews" element={<ReviewsPage />} />

        <Route path="/disputes" element={<DisputesPage />} />
        <Route path="/disputes/:reportCode" element={<DisputeDetailPage />} />

        <Route path="/activity-logs" element={<ActivityLogsPage />} />
        <Route
          path="/activity-logs/:logId"
          element={<ActivityLogDetailPage />}
        />

        <Route path="/promotions" element={<PromotionsPage />} />
        <Route
          path="/promotions/:promotionId"
          element={<PromotionDetailPage />}
        />

        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/notifications/automation-rules"
          element={<AutomationRulesPage />}
        />
        <Route
          path="/notifications/:notificationId"
          element={<NotificationDetailPage />}
        />

        <Route path="/content" element={<ContentPage />} />
        <Route path="/content/:contentId" element={<ContentDetailPage />} />

        <Route path="/transactions" element={<TransactionsPage />} />
        <Route
          path="/transactions/:transactionId"
          element={<TransactionDetailPage />}
        />

        <Route path="/escrows" element={<EscrowPage />} />
        <Route path="/escrow/:escrowId" element={<EscrowDetailPage />} />
        
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

import { Routes, Route} from "react-router-dom";
import DashboardPage from "@/features/dashboard/components/DashboardPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import SignInPage from "./features/auth/components/SignInPage";
import ForgotPasswordPage from "./features/auth/components/ForgotPasswordPage";
import ResendPasswordResetLinkPage from "./features/auth/components/ResendPasswordResetLinkPage";
import ResetPasswordPage from "./features/auth/components/ResetPasswordPage";
import PasswordResetSuccessPage from "./features/auth/components/PasswordResetSuccessPage";
import UsersPage from "./features/users/components/UsersPage";
import UserDetailPage from "./features/users/components/UserDetailPage";
import AdminUsersPage from "./features/users/components/AdminUsersPage";
import ListingsPage from "./features/listings/components/ListingsPage";
import ListingDetailPage from "./features/listings/components/ListingDetailPage";
import CategoriesPage from "./features/categories/components/CategoriesPage";
import ReviewsPage from "./features/reviews/components/ReviewsPage";
import ReportsPage from "./features/reports/components/ReportsPage";
import ReportDetailPage from "./features/reports/components/ReportDetailPage";
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
import SettingsPage from "./features/settings/components/SettingsPage";
import ProfilePage from "./features/profile/components/ProfilePage";
import PublicOnlyRoute from "./lib/auth/PublicOnlyRoute";
import ProtectedRoute from "./lib/auth/ProtectedRoute";
import PermissionRoute, { DefaultRedirect } from "./lib/auth/PermissionRoute";
import ReferralsPage from "./features/referrals/components/ReferralsPage";
import ParticipantDetailPage from "./features/referrals/components/ParticipantDetailPage";
import WaitlistPage from "./features/waitlist/components/WaitlistPage";
import FeedbackPage from "./features/feedback/components/FeedbackPage";
import FeedbackDetailPage from "./features/feedback/components/FeedbackDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultRedirect />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/resend-link" element={<ResendPasswordResetLinkPage />} />
        {/* pass token as prop to reset password page , we will need to check if token is valid and then show the page else re route back to resend link*/}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/reset-password-success"
          element={<PasswordResetSuccessPage />}
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<PermissionRoute module="dashboard" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route element={<PermissionRoute module="users" />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:userId" element={<UserDetailPage />} />
            <Route path="/admin-users" element={<AdminUsersPage />} />
          </Route>

          <Route element={<PermissionRoute module="listings" />}>
            <Route path="/listings" element={<ListingsPage />} />
            <Route
              path="/listings/:listingId"
              element={<ListingDetailPage />}
            />
          </Route>

          <Route element={<PermissionRoute module="categories" />}>
            <Route path="/categories" element={<CategoriesPage />} />
          </Route>

          <Route element={<PermissionRoute module="reviews" />}>
            <Route path="/reviews" element={<ReviewsPage />} />
          </Route>

          <Route element={<PermissionRoute module="reports" />}>
            <Route path="/reports" element={<ReportsPage />} />
            <Route
              path="/reports/:reportCode"
              element={<ReportDetailPage />}
            />
          </Route>

          <Route element={<PermissionRoute module="activity" />}>
            <Route path="/activity-logs" element={<ActivityLogsPage />} />
            <Route
              path="/activity-logs/:logId"
              element={<ActivityLogDetailPage />}
            />
          </Route>

          <Route element={<PermissionRoute module="notifications" />}>
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route
              path="/notifications/automation-rules"
              element={<AutomationRulesPage />}
            />
            <Route
              path="/notifications/:notificationId"
              element={<NotificationDetailPage />}
            />
          </Route>

          <Route element={<PermissionRoute module="content" />}>
            <Route path="/content" element={<ContentPage />} />
           <Route path="/content/:contentSlug" element={<ContentDetailPage />} />
          </Route>

          <Route element={<PermissionRoute module="transactions" />}>
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route
              path="/transactions/:transactionId"
              element={<TransactionDetailPage />}
            />
            <Route path="/escrows" element={<EscrowPage />} />
            <Route path="/escrow/:escrowId" element={<EscrowDetailPage />} />
          </Route>

          <Route element={<PermissionRoute module="settings" />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* no permission key for promotions yet */}
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route
            path="/promotions/:promotionId"
            element={<PromotionDetailPage />}
          />

          <Route element={<PermissionRoute module="referrals" />}>
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="/referrals/participants/:participantId" element={<ParticipantDetailPage />} />
          </Route>

          <Route element={<PermissionRoute module="waitlist" />}>
            <Route path="/waitlist" element={<WaitlistPage />} />
          </Route>

          <Route element={<PermissionRoute module="feedback" />}>
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/feedback/:feedbackId" element={<FeedbackDetailPage />} />
          </Route>

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
}

export default App;

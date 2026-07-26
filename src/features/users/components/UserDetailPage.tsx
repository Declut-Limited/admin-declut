import { useParams, useNavigate } from "react-router-dom";
import { FiMail, FiEye, FiStar } from "react-icons/fi";
import Button from "@/components/generic/Button";
import EmptyState from "@/components/generic/EmptyState";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { UserDetail } from "../types";
import { FaArrowLeftLong, FaArrowRightArrowLeft } from "react-icons/fa6";
import { IoAlertCircle, IoCard } from "react-icons/io5";
import { FaTags } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";

const verificationStatusClass: Record<
  UserDetail["verification"]["status"],
  string
> = {
  Approved:
    "text-[#027A48] bg-[#F6FEF9] inline-flex items-center px-2 py-0.5 rounded-full dark:text-green-400 dark:bg-green-950",
  Rejected:
    "text-[#B42318] bg-[#FEF3F2] inline-flex items-center px-2 py-0.5 rounded-full dark:text-red-400 dark:bg-red-950",
  Pending:
    "text-[#B54708] bg-[#FFFAEB] inline-flex items-center px-2 py-0.5 rounded-full dark:text-amber-400 dark:bg-amber-950",
};

// placeholder — swap for real API response once endpoint exists, keyed by userId
const mockUsers: Record<string, UserDetail> = {
  "USR-001": {
    id: "USR-001",
    name: "Kunle Abiola",
    email: "kunle.abiola@mail.com",
    status: "Active",
    accountType: "Buyer/Seller",
    company: "Delta Electronics",
    memberSince: "Apr 27, 2025",
    rating: 4.0,
    reviewCount: 70,
    verification: {
      type: "Business Reg (CAC)",
      submitted: "Mar 14, 2026",
      status: "Rejected",
    },
    stats: {
      totalListings: 2,
      activeListings: 1,
      salesAsSeller: "₦57,000",
      completedSales: 1,
      purchasesAsBuyer: 1,
      purchaseAmount: "₦117,000",
    },
    listings: [
      {
        id: "1",
        name: "Office Desk & Chair",
        code: "LST-014",
        role: "Furniture",
        price: "₦519,000",
        status: "Active",
        date: "Mar 6, 2026",
      },
      {
        id: "2",
        name: "Samsung Galaxy S22",
        code: "LST-038",
        role: "Phones & Tablets",
        price: "₦519,000",
        status: "Pending Review",
        date: "Mar 6, 2026",
      },
    ],
    transactions: [
      { id: "1", item: "Lexus RX350", role: "Seller", amount: "₦57,000" },
      { id: "2", item: "Lexus RX350", role: "Buyer", amount: "₦117,000" },
    ],
  },
  "USR-004": {
    id: "USR-004",
    name: "Ngozi Nwosu",
    email: "ngozi.nwosu@mail.com",
    status: "Active",
    accountType: "Admin",
    company: "Coastal Goods Ltd",
    memberSince: "Apr 27, 2025",
    rating: 4.0,
    reviewCount: 70,
    verification: {
      type: "Business Reg (CAC)",
      submitted: "Mar 14, 2026",
      status: "Rejected",
    },
    stats: {
      totalListings: 0,
      activeListings: 1,
      salesAsSeller: "0",
      completedSales: 1,
      purchasesAsBuyer: 0,
      purchaseAmount: "₦117,000",
    },
    listings: [],
    transactions: [],
    permissions: [
      { module: "Dashboard", view: true, write: false, delete: false },
      { module: "Users", view: true, write: false, delete: false },
      { module: "Listings", view: true, write: false, delete: false },
      { module: "Categories", view: true, write: false, delete: false },
    ],
  },
};

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const user = userId ? mockUsers[userId] : undefined;

  if (!user) {
    return <div className="text-sm text-gray-500">User not found.</div>;
  }

  const isAdmin = user.accountType === "Admin";

  return (
    <div>
      <button
        onClick={() => navigate("/users")}
        className="flex items-center gap-1.5 text-sm text-[#2563EB] hover:underline mb-4 cursor-pointer"
      >
        <FaArrowLeftLong className="w-4 h-4" /> Back to Users
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl || avatarPlaceholder}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#1D2939] dark:text-gray-100">
                {user.name}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                {user.status}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F4F3FF] text-[#5925DC] dark:bg-indigo-950 dark:text-indigo-400">
                {user.accountType}
              </span>
            </div>
            <p className="text-xs text-[#667085] dark:text-gray-400 mt-0.5">
              {user.id} · {user.email} · {user.company}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button leftIcon={<FiMail className="w-4 h-4 text-[#98A2B3]" />}>
            Email
          </Button>
          <Button
            leftIcon={<IoAlertCircle className="w-4 h-4" />}
            bgColor="bg-[#FFFBFA] dark:bg-gray-900"
            textColor="text-[#F04438]"
            borderColor="border-[#F04438] dark:border-red-900"
          >
            Suspend
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {user.stats.totalListings}
            <span className="text-xs font-medium text-[#16A34A]">
              {user.stats.activeListings} active
            </span>
          </p>

          <p className="detail-stat-label">
            {" "}
            <FaTags className="w-4 h-4 text-[#475467]" />
            Total Listings
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {user.stats.salesAsSeller}
            <span className="text-xs font-medium text-[#16A34A]">
              {user.stats.completedSales} completed sales
            </span>
          </p>

          <p className="detail-stat-label">
            {" "}
            <IoCard className="w-4 h-4 text-[#475467]" /> Sales as Seller
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {user.stats.purchasesAsBuyer}
            <span className="text-xs font-medium text-[#16A34A]">
              {user.stats.purchaseAmount}
            </span>
          </p>

          <p className="detail-stat-label">
            {" "}
            <FaArrowRightArrowLeft className="w-4 h-4 text-[#475467]" />{" "}
            Purchases as Buyer
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {user.rating.toFixed(1)} / 5
            <span className="text-xs font-medium text-[#16A34A]">
              {user.reviewCount} reviews
            </span>
          </p>
          <p className="detail-stat-label">
            <TiStarFullOutline className="w-3.5 h-3.5" /> Rating
          </p>
        </div>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* listings */}
          <div className="detail-section-card">
            <p className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wide mb-3">
              Listings by {user.name} ({user.listings.length})
            </p>

            {user.listings.length === 0 ? (
              <EmptyState message="No listings yet." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#475467] dark:text-gray-400">
                    <th className="font-medium pb-2">User</th>
                    <th className="font-medium pb-2">Role</th>
                    <th className="font-medium pb-2">Listings</th>
                    <th className="font-medium pb-2">Status</th>
                    <th className="font-medium pb-2">Date</th>
                    <th className="font-medium pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user.listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="border-t border-gray-50 dark:border-gray-800"
                    >
                      <td className="py-2.5">
                        <p className="font-medium text-[#475467] dark:text-gray-100">
                          {listing.name}
                        </p>
                        <p className="text-xs text-[#475467]">{listing.code}</p>
                      </td>
                      <td className="py-2.5 text-[#475467] dark:text-gray-300">
                        {listing.role}
                      </td>
                      <td className="py-2.5 text-[#475467] dark:text-gray-300">
                        {listing.price}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={
                            listing.status === "Active"
                              ? "text-[#027A48] bg-[#F6FEF9] rounded-full inline-flex items-center px-2 py-0.5"
                              : "text-[#B54708] bg-[#FFFAEB] rounded-full inline-flex items-center px-2 py-0.5"
                          }
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-[#475467] dark:text-gray-400">
                        {listing.date}
                      </td>
                      <td className="py-2.5 text-right">
                        <button className="text-[#475467] hover:text-gray-600">
                          <FiEye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* transactions */}
          <div className="detail-section-card">
            <p className="text-xs font-semibold text-[#475467] dark:text-gray-400 uppercase tracking-wide mb-3">
              Recent Transactions
            </p>

            {user.transactions.length === 0 ? (
              <EmptyState message="No transactions yet." />
            ) : (
              <div className="flex flex-col gap-3">
                {user.transactions.map((txn) => (
                  <div
                    key={txn.id + txn.role}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm text-[#475467] dark:text-gray-300">
                      TXN-022 ·{" "}
                      <a href="#" className="text-[#2563EB] hover:underline">
                        {txn.item}
                      </a>{" "}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#F4F3FF] text-[#5925DC] dark:bg-indigo-950 dark:text-indigo-400">
                        as {txn.role}
                      </span>
                    </p>
                    <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                      {txn.amount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-6">
          <div className="detail-section-card">
            <p className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wide mb-2">
              Profile
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Role</span>
              <span className="profile-info-value">Seller/Buyer</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                {user.status}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Company</span>
              <span className="profile-info-value">{user.company}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">{user.memberSince}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Rating</span>
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(user.rating) ? "fill-[#F79009] text-[#F79009]" : "text-gray-200"}`}
                  />
                ))}
              </span>
            </div>
          </div>

          <div className="detail-section-card">
            <p className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wide mb-2">
              Verification
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Type</span>
              <span className="profile-info-value">
                {user.verification.type}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Submitted</span>
              <span className="profile-info-value">
                {user.verification.submitted}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Status</span>
              <span
                className={`text-sm font-medium ${verificationStatusClass[user.verification.status]}`}
              >
                {user.verification.status}
              </span>
            </div>
          </div>

          {isAdmin && user.permissions && (
            <div className="detail-section-card">
              <p className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wide mb-3">
                Module Permissions
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#667085] dark:text-gray-400">
                    <th className="font-medium pb-2">Module</th>
                    <th className="font-medium pb-2 text-center">View</th>
                    <th className="font-medium pb-2 text-center">Write</th>
                    <th className="font-medium pb-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {user.permissions.map((perm) => (
                    <tr
                      key={perm.module}
                      className="border-t border-gray-50 dark:border-gray-800"
                    >
                      <td className="py-2 text-[#667085] dark:text-gray-200">
                        {perm.module}
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={perm.view}
                          readOnly
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={perm.write}
                          readOnly
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={perm.delete}
                          readOnly
                          className="rounded border-gray-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

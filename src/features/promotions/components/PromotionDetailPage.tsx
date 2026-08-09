import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTag } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import Button from "@/components/generic/Button";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { PromotionDetail } from "../types";
import NotFoundState from "@/components/generic/NotFoundState";

const statusPillClass: Record<PromotionDetail["status"], string> = {
  Scheduled:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  Ended: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

// placeholder
const mockPromotions: Record<string, PromotionDetail> = {
  "1": {
    code: "PRM-001",
    name: "Category Spotlight 1",
    status: "Scheduled",
    type: "Featured",
    appliesTo: "Beauty",
    startDate: "Jun 28, 2026",
    setup: {
      campaignType: "Featured",
      appliesTo: "Beauty",
      eligibleAudience: "Buyers",
      startDate: "Jun 28, 2026",
      endDate: "Jul 18, 2026",
    },
    performance: {
      usage: "1,588 redemptions",
    },
    actor: {
      name: "Ngozi Nwosu",
      id: "USR-004",
      email: "ngozi.nwosu@mail.com",
      role: "Admin",
      status: "Active",
      company: "Delta Electronics",
      totalListings: 2,
      memberSince: "Apr 27, 2025",
      rating: 5,
    },
  },
};

export default function PromotionDetailPage() {
  const { promotionId } = useParams<{ promotionId: string }>();
  const navigate = useNavigate();
  const promo = promotionId ? mockPromotions[promotionId] : undefined;

  if (!promo) {
    return (
      <NotFoundState
        icon={<FiTag className="w-5 h-5" />}
        message="Promotion not found."
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/promotions")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Promotions
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1D2939] tracking-wide dark:text-gray-100">
              {promo.name}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[promo.status]}`}
            >
              {promo.status}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {promo.code} · {promo.type} · {promo.appliesTo} · Starts{" "}
            {promo.startDate}
          </p>
        </div>

        <Button
          leftIcon={<BsCheckCircleFill className="w-4 h-4" />}
          bgColor="bg-[#12B76A] hover:bg-green-500"
          textColor="text-white"
          borderColor="border-transparent"
        >
          Activate
        </Button>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Campaign Setup
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Campaign Type</span>
              <span className="profile-info-value">
                {promo.setup.campaignType}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Applies To</span>
              <span className="profile-info-value">
                {promo.setup.appliesTo}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Eligible Audience</span>
              <span className="profile-info-value">
                {promo.setup.eligibleAudience}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Start Date</span>
              <span className="profile-info-value">
                {promo.setup.startDate}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">End Date</span>
              <span className="profile-info-value">{promo.setup.endDate}</span>
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Performance
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Usage</span>
              <span className="profile-info-value">
                {promo.performance.usage}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Actor
          </p>

          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={promo.actor.avatarUrl || avatarPlaceholder}
              alt={promo.actor.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                {promo.actor.name}
              </p>
              <p className="text-xs text-brand-gray-light">
                {promo.actor.id} · {promo.actor.email} · {promo.actor.company}
              </p>
            </div>
          </div>

          <div className="profile-info-row">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{promo.actor.role}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
              {promo.actor.status}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Company</span>
            <span className="profile-info-value">{promo.actor.company}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Total Listings</span>
            <span className="profile-info-value">
              {promo.actor.totalListings}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">
              {promo.actor.memberSince}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Rating</span>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < promo.actor.rating ? "text-amber-400" : "text-gray-200"
                  }
                >
                  ★
                </span>
              ))}
            </span>
          </div>

          <button
            onClick={() => navigate(`/users/${promo.actor.id}`)}
            className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg mt-3 cursor-pointer"
          >
            View User Profile
          </button>
        </div>
      </div>
    </div>
  );
}

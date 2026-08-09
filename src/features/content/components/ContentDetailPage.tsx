import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFileText } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "@/components/generic/Button";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { ContentDetail } from "../types";
import edit from "@/assets/icons/edit-2.svg";
import NotFoundState from "@/components/generic/NotFoundState";

const statusPillClass: Record<ContentDetail["status"], string> = {
  Draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  Published:
    "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

// placeholder
const mockContent: Record<string, ContentDetail> = {
  "2": {
    code: "CNT-002",
    title: "Seller FAQ",
    status: "Published",
    type: "Page",
    placement: "Checkout — Confirmation",
    updated: "May 30, 2026",
    renderedPreview:
      "Seller FAQ content goes here. This checkout — confirmation communicates key information to users visiting this part of Declut.",
    placementDetail: {
      appearsOn: "Checkout — Confirmation",
      pageUrl: "— (not a standalone page)",
    },
    author: {
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

export default function ContentDetailPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const content = contentId ? mockContent[contentId] : undefined;

  if (!content) {
    return (
      <NotFoundState
        icon={<FiFileText className="w-5 h-5" />}
        message="Content not found."
      />
    );
  }

  const isPublished = content.status === "Published";

  return (
    <div>
      <button
        onClick={() => navigate("/content")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Content
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#1D2939] dark:text-gray-100">
              {content.title}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[content.status]}`}
            >
              {content.status}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {content.code} · {content.type} · {content.placement} · Updated{" "}
            {content.updated}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button leftIcon={<img src={edit} className="w-4 h-4" />}>
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            leftIcon={<RiDeleteBin6Line className="w-4 h-4" />}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-red-500"
            borderColor="border-red-200 dark:border-red-900"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Rendered Preview
            </p>
            <p className="text-sm text-brand-gray-dark dark:text-gray-300">
              {content.renderedPreview}
            </p>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Placement
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Appears On</span>
              <span className="profile-info-value">
                {content.placementDetail.appearsOn}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Page URL</span>
              <span className="profile-info-value">
                {content.placementDetail.pageUrl}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Author
          </p>

          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={content.author.avatarUrl || avatarPlaceholder}
              alt={content.author.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                {content.author.name}
              </p>
              <p className="text-xs text-brand-gray-light">
                {content.author.id} · {content.author.email} ·{" "}
                {content.author.company}
              </p>
            </div>
          </div>

          <div className="profile-info-row">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{content.author.role}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
              {content.author.status}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Company</span>
            <span className="profile-info-value">{content.author.company}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Total Listings</span>
            <span className="profile-info-value">
              {content.author.totalListings}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">
              {content.author.memberSince}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Rating</span>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < content.author.rating
                      ? "text-amber-400"
                      : "text-gray-200"
                  }
                >
                  ★
                </span>
              ))}
            </span>
          </div>

          <button
            onClick={() => navigate(`/users/${content.author.id}`)}
            className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg hover:bg-[#93C5FD] mt-3 cursor-pointer"
          >
            View User Profile
          </button>
        </div>
      </div>
    </div>
  );
}

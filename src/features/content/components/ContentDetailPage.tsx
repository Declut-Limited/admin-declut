import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiArrowLeft, FiEdit3, FiFileText } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "@/components/generic/Button";
import NotFoundState from "@/components/generic/NotFoundState";
import PageLoader from "@/components/generic/PageLoader";
import ConfirmModal from "@/components/generic/ConfirmModal";
import edit from "@/assets/icons/edit-2.svg";
import { useContent, useUpdateContent, useDeleteContent } from "../queries";
import { getInitials } from "@/lib/utils/getInitials";
import { showToast } from "@/lib/utils/toast";
import type { CreateContentPayload } from "../types";
import NewContentModal from "./NewContentModal";

const NOT_IN_API_YET = "—";

const statusPillClass: Record<string, string> = {
  draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  published:
    "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatType(type: string) {
  return type === "faq" ? "FAQ" : formatLabel(type);
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContentDetailPage() {
  const { contentSlug } = useParams<{ contentSlug: string }>();
  const navigate = useNavigate();
  const [removeOpen, setRemoveOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: content, isLoading, isError } = useContent(contentSlug);
  const { mutateAsync: updateContent, isPending: isUpdating } =
    useUpdateContent();
  const { mutateAsync: removeContent, isPending: isDeleting } =
    useDeleteContent();

  if (isLoading) return <PageLoader />;
  if (isError || !content) {
    return (
      <NotFoundState
        icon={<FiFileText className="w-5 h-5" />}
        message="Content not found."
      />
    );
  }

  const isPublished = content.status === "published";
  const author = content.createdBy;

  const handleTogglePublish = () => {
    showToast.promise(
      updateContent({
        contentId: content._id,
        payload: { status: isPublished ? "draft" : "published" },
      }),
      {
        loading: isPublished ? "Unpublishing..." : "Publishing...",
        success: isPublished ? "Content unpublished." : "Content published.",
        error: "Couldn't update content.",
      },
    );
  };

  const handleDelete = () => {
    showToast.promise(
      removeContent(content._id).then(() => navigate("/content")),
      {
        loading: `Removing ${content.title}...`,
        success: `${content.title} has been removed.`,
        error: "Couldn't remove content.",
      },
    );
  };

  const handleEdit = (payload: CreateContentPayload) => {
    showToast.promise(
      updateContent({ contentId: content._id, payload }).then(() =>
        setEditOpen(false),
      ),
      {
        loading: "Saving changes...",
        success: "Content updated.",
        error: "Couldn't update content.",
      },
    );
  };

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
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                statusPillClass[content.status] ?? statusFallback
              }`}
            >
              {formatLabel(content.status)}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {content.slug} · {formatType(content.contentType)} ·{" "}
            {content.whereToAppear} · Updated {formatDate(content.updatedAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleTogglePublish}
            disabled={isUpdating}
            leftIcon={<img src={edit} className="w-4 h-4" />}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            onClick={() => setEditOpen(true)}
            leftIcon={<FiEdit3 className="w-4 h-4 text-brand-gray-dark" />}
          >
            Edit
          </Button>
          <Button
            onClick={() => setRemoveOpen(true)}
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
            <div
              className="text-sm text-brand-gray-dark dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: content.contentBody }}
            />
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Placement
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Appears On</span>
              <span className="profile-info-value">
                {content.whereToAppear}
              </span>
            </div>
            {/* TODO: pageUrl is not returned by the API */}
            <div className="profile-info-row">
              <span className="profile-info-label">Page URL</span>
              <span className="profile-info-value">{NOT_IN_API_YET}</span>
            </div>
          </div>
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Author
          </p>

          {!author ? (
            <p className="text-sm text-brand-gray-light">
              No author attached to this content.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #D19E00, #2563EB)",
                  }}
                >
                  {getInitials(author.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                    {author.name}
                  </p>
                  <p className="text-xs text-brand-gray-light">
                    {author.email}
                  </p>
                </div>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-label">Role</span>
                <span className="profile-info-value">
                  {author.role?.name}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Title</span>
                <span className="profile-info-value">{author.title}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Member Since</span>
                <span className="profile-info-value">
                  {formatDate(author.createdAt)}
                </span>
              </div>
              {/* TODO: author status, company, listings and rating are not
                  returned by /admin/content */}
              {/* <div className="profile-info-row">
                <span className="profile-info-label">Status</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Company</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div> */}

              <button
                onClick={() => navigate(`/users/${author._id}`)}
                className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg hover:bg-[#93C5FD] mt-3 cursor-pointer"
              >
                View User Profile
              </button>
            </>
          )}
        </div>
      </div>

      {removeOpen && (
        <ConfirmModal
          title="Remove content"
          message={`Remove ${content.title}? This can't be undone.`}
          confirmLabel="Remove"
          isSubmitting={isDeleting}
          onClose={() => setRemoveOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {editOpen && (
        <NewContentModal
          content={content}
          isSubmitting={isUpdating}
          onClose={() => setEditOpen(false)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}

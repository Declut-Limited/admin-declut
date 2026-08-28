import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import ConfirmModal from "@/components/generic/ConfirmModal";
import { PiExportFill } from "react-icons/pi";
// import { FiChevronDown } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import { createContentColumns } from "./columns";
import NewContentModal from "./NewContentModal";
import {
  useContentList,
  useCreateContent,
  useDeleteContent,
  useExportContent,
  useUpdateContent,
} from "../queries";
import { usePageSize } from "@/lib/hooks/usePageSize";
import { showToast } from "@/lib/utils/toast";
import type { ContentRow, CreateContentPayload } from "../types";

const tabs = ["All", "Published", "Draft"];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newContentModalOpen, setNewContentModalOpen] = useState(false);
  const [removingContent, setRemovingContent] = useState<ContentRow | null>(
    null,
  );

  const navigate = useNavigate();
  const PAGE_SIZE = usePageSize();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const contentQuery = useContentList({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
  });

  const { data } = contentQuery;

  const { mutateAsync: createContent, isPending: isCreating } =
    useCreateContent();
  const { mutateAsync: removeContent, isPending: isDeleting } =
    useDeleteContent();
  const [editingContent, setEditingContent] = useState<ContentRow | null>(null);
  const { mutateAsync: updateContent, isPending: isUpdating } =
    useUpdateContent();
  const { mutateAsync: exportContent } = useExportContent();

  const handleExport = () => {
    showToast.promise(
      exportContent({
        status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
      }),
      {
        loading: "Preparing export...",
        success: "Export downloaded.",
        error: "Export failed.",
      },
    );
  };

  const contentItems = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns = useMemo(
    () =>
      createContentColumns({
        onViewDetails: (content) => navigate(`/content/${content.slug}`),
        onEdit: (content) => setEditingContent(content),
        onTogglePublish: (content) => {
          const publishing = content.status !== "published";
          showToast.promise(
            updateContent({
              contentId: content._id,
              payload: { status: publishing ? "published" : "draft" },
            }),
            {
              loading: publishing ? "Publishing..." : "Unpublishing...",
              success: `${content.title} is now ${publishing ? "published" : "a draft"}.`,
              error: "Couldn't update content.",
            },
          );
        },
        onRemove: (content) => setRemovingContent(content),
      }),
    [navigate, updateContent],
  );

  const visibleContent = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return contentItems;
    return contentItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.whereToAppear.toLowerCase().includes(q),
    );
  }, [contentItems, search]);

  const handleCreateContent = (payload: CreateContentPayload) => {
    showToast.promise(
      createContent(payload).then(() => setNewContentModalOpen(false)),
      {
        loading: `Creating ${payload.title}...`,
        success: `${payload.title} has been created.`,
        error: "Couldn't create content.",
      },
    );
  };

  const handleEditContent = (payload: CreateContentPayload) => {
    if (!editingContent) return;

    showToast.promise(
      updateContent({ contentId: editingContent._id, payload }).then(() =>
        setEditingContent(null),
      ),
      {
        loading: `Updating ${editingContent.title}...`,
        success: `${editingContent.title} has been updated.`,
        error: "Couldn't update content.",
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Content"
        subtitle="Manage static pages, banners, and help-center articles."
        actions={
          <>
            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              leftIcon={<FaCirclePlus className="w-4 h-4 text-white" />}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              onClick={() => setNewContentModalOpen(true)}
            >
              New Content
            </Button>
          </>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <TableToolbar
        label="Content"
        count={search ? visibleContent.length : total}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search content..."
      />

      <DataTable
        data={visibleContent}
        columns={columns}
        query={contentQuery}
        emptyMessage="No content found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {newContentModalOpen && (
        <NewContentModal
          isSubmitting={isCreating}
          onClose={() => setNewContentModalOpen(false)}
          onSubmit={handleCreateContent}
        />
      )}

      {removingContent && (
        <ConfirmModal
          title="Remove content"
          message={`Remove ${removingContent.title}? This can't be undone.`}
          confirmLabel="Remove"
          isSubmitting={isDeleting}
          onClose={() => setRemovingContent(null)}
          onConfirm={() => {
            showToast.promise(
              removeContent(removingContent._id).then(() =>
                setRemovingContent(null),
              ),
              {
                loading: `Removing ${removingContent.title}...`,
                success: `${removingContent.title} has been removed.`,
                error: "Couldn't remove content.",
              },
            );
          }}
        />
      )}

      {editingContent && (
        <NewContentModal
          content={editingContent}
          isSubmitting={isUpdating}
          onClose={() => setEditingContent(null)}
          onSubmit={handleEditContent}
        />
      )}
    </div>
  );
}

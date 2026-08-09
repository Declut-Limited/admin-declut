import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FiChevronDown } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import { createContentColumns } from "./columns";
import NewContentModal from "./NewContentModal";
import type { ContentRow } from "../types";

const tabs = ["All", "Published", "Draft"];

const contentItems: ContentRow[] = [
  { id: "1", title: "Trust & Safety Guide", type: "FAQ", placement: "Help Center", status: "Draft", updated: "May 13, 2026", authorName: "Femi Balogun" },
  { id: "2", title: "Seller FAQ", type: "Page", placement: "Checkout — Confirmation", status: "Published", updated: "May 30, 2026", authorName: "Ifeoma Abiola" },
  { id: "3", title: "Refund Policy", type: "Page", placement: "Seller Dashboard", status: "Draft", updated: "Jul 16, 2026", authorName: "Zainab Adekunle" },
  { id: "4", title: "Terms of Service", type: "Banner", placement: "Standalone Page (custom URL)", status: "Published", updated: "May 30, 2026", authorName: "Chidi Nwosu" },
  { id: "5", title: "About Us Page", type: "Page", placement: "Category Page", status: "Published", updated: "Jun 22, 2026", authorName: "Tunde Ogunleye" },
  { id: "6", title: "Terms of Service", type: "Banner", placement: "Seller Dashboard", status: "Draft", updated: "May 28, 2026", authorName: "Kunle Nnamdi" },
  { id: "7", title: "Homepage Banner", type: "Banner", placement: "Seller Dashboard", status: "Published", updated: "May 13, 2026", authorName: "Tosin Yusuf" },
  { id: "8", title: "About Us Page", type: "Banner", placement: "Seller Dashboard", status: "Draft", updated: "Jul 3, 2026", authorName: "Yewande Okonkwo" },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newContentModalOpen, setNewContentModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createContentColumns({
        onViewDetails: (content) => navigate(`/content/${content.id}`),
        onRemove: (content) => console.log("remove", content.id), // TODO: wire remove flow / confirm modal
      }),
    [],
  );

  const filteredContent = contentItems.filter((item) => {
    const matchesTab = activeTab === "All" || item.status === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCreateContent = (data: Record<string, string>) => {
    // TODO: wire to contentApi.create once endpoint is confirmed
    console.log("creating content", data);
    setNewContentModalOpen(false);
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
              rightIcon={<FiChevronDown className="w-4 h-4 text-[#475467]" />}
              onClick={() => {
                /* export logic */
              }}
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

      <TabFilter tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="overflow-hidden">
        <TableToolbar
          label="Content"
          count={filteredContent.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search activity logs..."
        />

        <DataTable data={filteredContent} columns={columns} />

        <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
      </div>

      {newContentModalOpen && (
        <NewContentModal onClose={() => setNewContentModalOpen(false)} onSubmit={handleCreateContent} />
      )}
    </div>
  );
}
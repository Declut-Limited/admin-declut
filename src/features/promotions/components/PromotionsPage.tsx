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
import { createPromotionColumns } from "./columns";
import type { PromotionRow } from "../types";

const tabs = ["All", "Active", "Scheduled", "Ended"];

const promotions: PromotionRow[] = [
  { id: "1", campaignName: "Hannah Pedro", type: "Featured", appliesTo: "Beauty", eligibleAudience: "Buyers", application: "-", status: "Scheduled", startDate: "Apr 6, 2026" },
  { id: "2", campaignName: "Ebubechukwu Agnes", type: "Banner", appliesTo: "All Categories", eligibleAudience: "New Users Only", application: "-", status: "Ended", startDate: "Apr 6, 2026" },
  { id: "3", campaignName: "Emmanuel Amuneke", type: "Discount", appliesTo: "Groceries", eligibleAudience: "Sellers", application: "Automatic", status: "Ended", startDate: "Mar 6, 2026" },
  { id: "4", campaignName: "Adese Samson", type: "Featured", appliesTo: "Furniture", eligibleAudience: "New Users Only", application: "-", status: "Scheduled", startDate: "Feb 6, 2026" },
  { id: "5", campaignName: "Oyebamiji Oluwasola", type: "Discount", appliesTo: "Phones & Tablet", eligibleAudience: "Buyers", application: "NEWBUYER88", status: "Ended", startDate: "Jan 5, 2026" },
  { id: "6", campaignName: "Yussuf Ahmed", type: "Discount", appliesTo: "Phones & Tablet", eligibleAudience: "New Users Only", application: "Automatic", status: "Ended", startDate: "Feb 6, 2026" },
  { id: "7", campaignName: "Jicholia Oyebola", type: "Banner", appliesTo: "Electronics", eligibleAudience: "Buyers", application: "-", status: "Active", startDate: "Jan 5, 2026" },
  { id: "8", campaignName: "Solomon Ideh", type: "Banner", appliesTo: "Home & Living", eligibleAudience: "New Users Only", application: "-", status: "Scheduled", startDate: "Feb 6, 2026" },
];

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createPromotionColumns({
        onViewDetails: (promo) => navigate(`/promotions/${promo.id}`),
        onRemove: (promo) => console.log("remove", promo.id), // TODO: wire remove flow / confirm modal
      }),
    [],
  );

  const filteredPromotions = promotions.filter((promo) => {
    const matchesTab = activeTab === "All" || promo.status === activeTab;
    const matchesSearch = promo.campaignName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Promotions"
        subtitle="Create and manage marketing campaigns across the marketplace."
        actions={
          <>
            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              rightIcon={<FiChevronDown className="w-4 h-4 text-brand-gray-dark" />}
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
              onClick={() => console.log("open new campaign modal")} // TODO: wire modal
            >
              New Campaign
            </Button>
          </>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="overflow-hidden">
        <TableToolbar
          label="Promotions"
          count={filteredPromotions.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search activity logs..."
        />

        <DataTable data={filteredPromotions} columns={columns} />

        <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
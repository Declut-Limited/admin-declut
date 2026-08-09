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
import { createNotificationColumns } from "./columns";
import NewNotificationModal from "./NewNotificationModal";
import type { NotificationRow } from "../types";
import settings from "@/assets/icons/setting-5.svg";


const tabs = ["All", "Automated", "Manual Broadcast", "Sent", "Scheduled", "Draft"];

const notifications: NotificationRow[] = [
  { id: "1", title: "Weekend promo live", trigger: "Manual Broadcast", recipientName: "Sellers", channel: "PUSH", status: "Draft", startDate: "Apr 6, 2026" },
  { id: "2", title: "New policy update", trigger: "Manual Broadcast", recipientName: "Banner", channel: "PUSH", status: "Scheduled", startDate: "Apr 6, 2026" },
  { id: "3", title: "Account Reactivated", trigger: "Account Reactivated", triggerLink: "#", recipientName: "Adaeze Ibrahim", recipientAvatarUrl: "", channel: "PUSH", status: "Sent", startDate: "Mar 6, 2026" },
  { id: "4", title: "Dispute Resolved", trigger: "Dispute Resolved", triggerLink: "#", recipientName: "Femi Balogun", recipientAvatarUrl: "", channel: "PUSH", status: "Scheduled", startDate: "Feb 6, 2026" },
  { id: "5", title: "Verification Approved", trigger: "Verification Approved", triggerLink: "#", recipientName: "Chioma Okafor", recipientAvatarUrl: "", channel: "SMS", status: "Sent", startDate: "Jan 5, 2026" },
  { id: "6", title: "Listing Flagged-L-Shaped Sofa", trigger: "Listing Flagged", triggerLink: "#", recipientName: "Kunle Nnamdi", recipientAvatarUrl: "", channel: "SMS", status: "Sent", startDate: "Feb 6, 2026" },
  { id: "7", title: "Platforms terms updated", trigger: "Manual Broadcast", recipientName: "All Users", channel: "SMS", status: "Draft", startDate: "Jan 5, 2026" },
  { id: "8", title: "Platforms terms updated", trigger: "Manual Broadcast", recipientName: "Sellers", channel: "SMS", status: "Draft", startDate: "Feb 6, 2026" },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newNotifModalOpen, setNewNotifModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createNotificationColumns({
        onViewDetails: (notif) => navigate(`/notifications/${notif.id}`),
        onRemove: (notif) => console.log("remove", notif.id), // TODO: wire remove flow / confirm modal
      }),
    [],
  );

  const filteredNotifications = notifications.filter((notif) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Automated" && notif.trigger !== "Manual Broadcast") ||
      (activeTab === "Manual Broadcast" && notif.trigger === "Manual Broadcast") ||
      notif.status === activeTab;
    const matchesSearch = notif.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCreateNotification = (data: Record<string, string>) => {
    // TODO: wire to notificationsApi.create 
    console.log("creating notification", data);
    setNewNotifModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Automated triggers and manual broadcasts sent to users across channels."
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
              leftIcon={<img src={settings} className="w-4 h-4 text-brand-gray-dark" />}
              onClick={() => navigate("/notifications/automation-rules")}
            >
              View Automation Rules
            </Button>
            <Button
              leftIcon={<FaCirclePlus className="w-4 h-4 text-white" />}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              onClick={() => setNewNotifModalOpen(true)}
            >
              New Notification
            </Button>
          </>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="overflow-hidden">
        <TableToolbar
          label="Promotions"
          count={filteredNotifications.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search activity logs..."
        />

        <DataTable data={filteredNotifications} columns={columns} />

        <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
      </div>

      {newNotifModalOpen && (
        <NewNotificationModal
          onClose={() => setNewNotifModalOpen(false)}
          onSubmit={handleCreateNotification}
        />
      )}
    </div>
  );
}
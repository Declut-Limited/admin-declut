import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
// import Button from "@/components/generic/Button";
// import { PiExportFill } from "react-icons/pi";
// import { FiChevronDown } from "react-icons/fi";
// import { FaCirclePlus } from "react-icons/fa6";
import { createNotificationColumns } from "./columns";
// import NewNotificationModal from "./NewNotificationModal";
import { useNotifications } from "../queries";
import { usePageSize } from "@/lib/hooks/usePageSize";
// import settings from "@/assets/icons/setting-5.svg";

const tabs = ["All", "Sent", "Sending", "Failed"];

export default function NotificationsPage() {
  const PAGE_SIZE = usePageSize();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [newNotifModalOpen, setNewNotifModalOpen] = useState(false);

  // const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const notificationsQuery = useNotifications({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
  });

  const { data } = notificationsQuery;

  const notifications = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns = useMemo(() => createNotificationColumns(), []);

  //   const columns = useMemo(
  //   () =>
  //     createNotificationColumns({
  //       onViewDetails: (notif) => navigate(`/notifications/${notif._id}`),
  //       onRemove: (notif) => console.log("remove", notif._id), // TODO: no delete endpoint yet
  //     }),
  //   [navigate],
  // );
  // no search param on the endpoint — filtering the current page client-side
  const visibleNotifications = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return notifications;
    return notifications.filter(
      (notif) =>
        notif.title.toLowerCase().includes(q) ||
        notif.trigger.toLowerCase().includes(q) ||
        notif.recipientDescription.toLowerCase().includes(q),
    );
  }, [notifications, search]);

  // TODO: no create endpoint yet
  // const handleCreateNotification = (data: Record<string, string>) => {
  //   console.log("creating notification", data);
  //   setNewNotifModalOpen(false);
  // };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Automated triggers and manual broadcasts sent to users across channels."
        // TODO: re-enable once the export, automation-rules and create
        // endpoints exist
        // actions={
        //   <>
        //     <Button
        //       leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
        //       rightIcon={
        //         <FiChevronDown className="w-4 h-4 text-brand-gray-dark" />
        //       }
        //       onClick={() => {
        //         /* export logic */
        //       }}
        //     >
        //       Export
        //     </Button>
        //     <Button
        //       leftIcon={
        //         <img src={settings} className="w-4 h-4 text-brand-gray-dark" />
        //       }
        //       onClick={() => navigate("/notifications/automation-rules")}
        //     >
        //       View Automation Rules
        //     </Button>
        //     <Button
        //       leftIcon={<FaCirclePlus className="w-4 h-4 text-white" />}
        //       bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
        //       textColor="text-white"
        //       borderColor="border-transparent"
        //       onClick={() => setNewNotifModalOpen(true)}
        //     >
        //       New Notification
        //     </Button>
        //   </>
        // }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <TableToolbar
        label="Notifications"
        count={search ? visibleNotifications.length : total}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notifications..."
      />

      <DataTable
        data={visibleNotifications}
        columns={columns}
        query={notificationsQuery}
        emptyMessage="No notifications found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* TODO: re-enable with the create endpoint
      {newNotifModalOpen && (
        <NewNotificationModal
          onClose={() => setNewNotifModalOpen(false)}
          onSubmit={handleCreateNotification}
        />
      )} */}
    </div>
  );
}

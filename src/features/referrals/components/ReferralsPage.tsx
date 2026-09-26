import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import Button from "@/components/generic/Button";
import { FaCirclePlus } from "react-icons/fa6";
import OverviewTab from "./OverviewTab";
import CampaignsTab from "./CampaignsTab";
import CreateCampaignModal from "./CreateCampaignModal";
import ParticipantsTab from "./ParticipantsTab";
import RewardsTab from "./RewardsTab";
import { showToast } from "@/lib/utils/toast";
import { useCreateReferralCampaign } from "../queries";

const TABS = ["Overview", "Campaigns", "Participants", "Rewards"] as const;
type ReferralTab = (typeof TABS)[number];

export default function ReferralsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const { mutateAsync: createCampaign, isPending: isCreating } =
    useCreateReferralCampaign();

  const tabParam = searchParams.get("tab");
  const activeTab: ReferralTab = TABS.includes(tabParam as ReferralTab)
    ? (tabParam as ReferralTab)
    : "Overview";

  const setActiveTab = (tab: ReferralTab) => setSearchParams({ tab });

  return (
    <div>
      <PageHeader
        title="Referral Programme"
        subtitle="Track invited users, qualification progress, and referral rewards."
        actions={
          <>
            <Button
              leftIcon={<FaCirclePlus className="w-4 h-4 text-white" />}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              onClick={() => setCreateOpen(true)}
            >
              Create Campaign
            </Button>
          </>
        }
      />

      <div className="referral-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`referral-tab ${activeTab === tab ? "referral-tab-active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && <OverviewTab />}
      {activeTab === "Campaigns" && <CampaignsTab />}
      {activeTab === "Participants" && <ParticipantsTab />}
      {activeTab === "Rewards" && <RewardsTab />}

      {createOpen && (
        <CreateCampaignModal
          isSubmitting={isCreating}
          onClose={() => setCreateOpen(false)}
          onSubmit={(payload) => {
            showToast.promise(
              createCampaign(payload).then(() => setCreateOpen(false)),
              {
                loading: `Creating ${payload.name || "campaign"}...`,
                success: "Campaign created.",
                error: "Couldn't create campaign.",
              },
            );
          }}
        />
      )}
    </div>
  );
}
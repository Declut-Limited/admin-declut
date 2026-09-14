import PageHeader from "@/components/generic/PageHeader"
import { useSearchParams } from "react-router-dom"
import { GeneralTab } from "./GeneralTab"
import PaymentsTab from "./PaymentsTab"
import FeesCommissionTab from "./FeesCommissionTab"
import { RolesPermissionsTab } from "./RolesPermissionsTab"
import IssueResolutionSlaTab from "./IssueResolutionSlaTab"

const TABS = ['General', 'Payments', 'Fees & Commission', 'Roles & Permissions', 'Issue Resolution SLA'] as const
type SettingsTab = typeof TABS[number]

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: SettingsTab = TABS.includes(tabParam as SettingsTab) ? (tabParam as SettingsTab) : 'General'

  const setActiveTab = (tab: SettingsTab) => {
    setSearchParams({ tab })
  }

  return (
    <div className="settings-page">
      <PageHeader title="Settings" subtitle="Configure how the Declut platform looks, accepts payments, and grants access." />
      <div className="settings-layout">
        <nav className="settings-sidebar">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`settings-nav-item ${activeTab === tab ? 'settings-nav-item-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="settings-content">
          {activeTab === 'General' && <GeneralTab />}
          {activeTab === 'Payments' && <PaymentsTab />}
          {activeTab === 'Fees & Commission' && <FeesCommissionTab />}
          {activeTab === 'Roles & Permissions' && <RolesPermissionsTab />}
          {activeTab === 'Issue Resolution SLA' && <IssueResolutionSlaTab />}
        </div>
      </div>
    </div>
  )
}
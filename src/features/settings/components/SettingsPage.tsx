import PageHeader from "@/components/generic/PageHeader"
import { useState } from "react"
import { GeneralTab } from "./GeneralTab"
import PaymentsTab from "./PaymentsTab"
import FeesCommissionTab from "./FeesCommissionTab"
import { RolesPermissionsTab } from "./RolesPermissionsTab"

const TABS = ['General','Payments', 'Fees & Commission', 'Roles & Permissions'] as const
type SettingsTab = typeof TABS[number]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('General')

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
        </div>
      </div>
    </div>
  )
}
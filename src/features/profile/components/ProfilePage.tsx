import PageHeader from "@/components/generic/PageHeader"
import { useSearchParams } from "react-router-dom"
import { GeneralTab } from "./GeneralTab"
import { PersonalizationTab } from "./PersonalizationTab"
import { AccountTab } from "./AccountTab"
import { SecurityLoginTab } from "./SecurityLoginTab"

const TABS = ['General', 'Personalization', 'Account', 'Security & Login'] as const
type ProfileTab = typeof TABS[number]

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: ProfileTab = TABS.includes(tabParam as ProfileTab) ? (tabParam as ProfileTab) : 'General'

  const setActiveTab = (tab: ProfileTab) => {
    setSearchParams({ tab })
  }

  return (
    <div className="settings-page">
      <PageHeader title="Profile Settings" subtitle="Manage your profile, preferences, security, and notification settings." />
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
          {activeTab === 'Personalization' && <PersonalizationTab />}
          {activeTab === 'Account' && <AccountTab />}
          {activeTab === 'Security & Login' && <SecurityLoginTab />}
        </div>
      </div>
    </div>
  )
}
interface TabFilterProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function TabFilter({ tabs, active, onChange }: TabFilterProps) {
  return (
    <div className="flex items-center gap-5 border-b border-gray-100 dark:border-gray-800 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
            active === tab
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-brand-gray-light dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
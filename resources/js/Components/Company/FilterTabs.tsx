import { ReactNode } from 'react';

interface FilterTabsProps {
    tabs: { key: string; label: string }[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function FilterTabs({
    tabs,
    activeTab,
    onTabChange,
}: FilterTabsProps): ReactNode {
    return (
        <div className="flex items-center gap-1">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.key
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

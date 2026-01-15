import { ReactNode } from 'react';
import Icon from './Icon';

interface TabItem {
    key: string;
    label: string;
    icon: string;
}

interface TabNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (key: string) => void;
}

export default function TabNavigation({
    tabs,
    activeTab,
    onTabChange,
}: TabNavigationProps): ReactNode {
    return (
        <div className="mb-8">
            <nav className="flex gap-8 border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`relative flex items-center gap-2 border-b-[3px] pb-4 text-sm font-bold transition-colors ${
                            activeTab === tab.key
                                ? 'border-primary text-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Icon name={tab.icon} className="text-lg" />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}

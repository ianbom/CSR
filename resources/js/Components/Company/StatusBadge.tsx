import { ReactNode } from 'react';

interface StatusBadgeProps {
    status: 'active' | 'draft' | 'closed';
}

const statusStyles = {
    active: 'bg-primary/10 text-primary border-primary/20',
    draft: 'bg-amber-50 text-amber-600 border-amber-200',
    closed: 'bg-slate-100 text-slate-500 border-slate-200',
};

const statusLabels = {
    active: 'Active',
    draft: 'Draft',
    closed: 'Closed',
};

export default function StatusBadge({ status }: StatusBadgeProps): ReactNode {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    );
}

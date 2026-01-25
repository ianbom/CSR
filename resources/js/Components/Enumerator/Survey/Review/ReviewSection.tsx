import { ReactNode } from 'react';

interface ReviewSectionProps {
    title: string;
    icon: string;
    children: ReactNode;
    variant?: 'list' | 'grid';
}

export default function ReviewSection({
    title,
    icon,
    children,
    variant = 'list',
}: ReviewSectionProps) {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <span className="material-symbols-outlined text-primary">
                        {icon}
                    </span>
                    {title}
                </h3>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                {variant === 'list' ? (
                    <div className="divide-y divide-gray-100">{children}</div>
                ) : (
                    <div className="p-5">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {children}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

import { ReactNode } from 'react';
import MaterialIcon from '../Icons/MaterialIcon';

interface FormSectionProps {
    icon: string;
    title: string;
    children: ReactNode;
    iconColor?: string;
}

export default function FormSection({
    icon,
    title,
    children,
    iconColor = 'text-primary',
}: FormSectionProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <MaterialIcon name={icon} className={`text-xl ${iconColor}`} />
                <h3 className="text-gray-900 font-bold text-base">{title}</h3>
            </div>
            <div className="flex flex-col gap-4">{children}</div>
        </div>
    );
}

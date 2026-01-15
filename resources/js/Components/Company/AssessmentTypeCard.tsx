import { ReactNode } from 'react';
import Icon from './Icon';

interface AssessmentTypeCardProps {
    id: string;
    icon: string;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function AssessmentTypeCard({
    id,
    icon,
    title,
    description,
    checked,
    onChange,
}: AssessmentTypeCardProps): ReactNode {
    return (
        <label className="group relative cursor-pointer">
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                id={id}
            />
            <div className="h-full rounded-xl border-2 border-slate-100 bg-slate-50/50 p-4 transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                <div className="flex flex-col gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm transition-transform group-hover:scale-110">
                        <Icon name={icon} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">
                            {title}
                        </p>
                        <p className="mt-1 text-[11px] leading-tight text-slate-500">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="absolute right-3 top-3 opacity-0 transition-opacity peer-checked:opacity-100">
                    <Icon
                        name="check_circle"
                        className="text-xl text-primary"
                    />
                </div>
            </div>
        </label>
    );
}

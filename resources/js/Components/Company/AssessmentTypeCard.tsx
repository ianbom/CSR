import { ReactNode } from 'react';
import Icon from './Icon';

interface AssessmentTypeCardProps {
    id: string;
    icon: string;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    comingSoon?: boolean;
}

export default function AssessmentTypeCard({
    id,
    icon,
    title,
    description,
    checked,
    onChange,
    disabled = false,
    comingSoon = false,
}: AssessmentTypeCardProps): ReactNode {
    return (
        <label
            className={`group relative ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                id={id}
                disabled={disabled}
            />
            <div
                className={`h-full rounded-xl border-2 p-4 transition-all ${
                    disabled
                        ? 'border-slate-100 bg-slate-50/30 opacity-60'
                        : 'border-slate-100 bg-slate-50/50 peer-checked:border-primary peer-checked:bg-primary/5'
                }`}
            >
                <div className="flex flex-col gap-3">
                    <div
                        className={`flex size-10 items-center justify-center rounded-lg bg-white shadow-sm transition-transform ${
                            disabled
                                ? 'text-slate-400'
                                : 'text-primary group-hover:scale-110'
                        }`}
                    >
                        <Icon name={icon} />
                    </div>
                    <div>
                        <p
                            className={`text-sm font-bold ${disabled ? 'text-slate-500' : 'text-slate-900'}`}
                        >
                            {title}
                            {comingSoon && (
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                                    Coming Soon
                                </span>
                            )}
                        </p>
                        <p
                            className={`mt-1 text-[11px] leading-tight ${disabled ? 'text-slate-400' : 'text-slate-500'}`}
                        >
                            {description}
                        </p>
                    </div>
                </div>
                {!disabled && (
                    <div className="absolute right-3 top-3 opacity-0 transition-opacity peer-checked:opacity-100">
                        <Icon
                            name="check_circle"
                            className="text-xl text-primary"
                        />
                    </div>
                )}
            </div>
        </label>
    );
}

import MaterialIcon from '../Icons/MaterialIcon';

interface SurveyHeaderProps {
    title: string;
    subtitle?: string;
    onClose?: () => void;
}

export default function SurveyHeader({
    title,
    subtitle,
    onClose,
}: SurveyHeaderProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                        <MaterialIcon name="assignment" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold leading-tight tracking-tight text-gray-900">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-xs font-medium text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <MaterialIcon name="close" />
                    </button>
                )}
            </div>
        </div>
    );
}

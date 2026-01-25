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
        <div className="bg-white border-b border-gray-100 px-4 py-3 -mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-2">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
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

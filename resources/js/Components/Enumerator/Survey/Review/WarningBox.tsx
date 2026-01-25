interface WarningBoxProps {
    title: string;
    message: string;
}

export default function WarningBox({ title, message }: WarningBoxProps) {
    return (
        <div className="mt-4 flex items-start gap-4 rounded-xl border border-orange-100 bg-orange-50 p-4">
            <span className="material-symbols-outlined shrink-0 text-orange-600">
                warning
            </span>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-orange-800">{title}</p>
                <p className="text-sm leading-relaxed text-orange-700">
                    {message}
                </p>
            </div>
        </div>
    );
}

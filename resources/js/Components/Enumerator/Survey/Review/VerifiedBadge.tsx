interface VerifiedBadgeProps {
    label?: string;
}

export default function VerifiedBadge({
    label = 'VERIFIED',
}: VerifiedBadgeProps) {
    return (
        <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
            {label}
        </span>
    );
}

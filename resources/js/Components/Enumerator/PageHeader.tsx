interface PageHeaderProps {
    title: string;
    description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                {title}
            </h1>
            {description && (
                <p className="text-gray-500 text-base font-normal">
                    {description}
                </p>
            )}
        </div>
    );
}

interface PageHeaderProps {
    title: string;
    description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 md:text-4xl">
                {title}
            </h1>
            {description && (
                <p className="text-base font-normal text-gray-500">
                    {description}
                </p>
            )}
        </div>
    );
}

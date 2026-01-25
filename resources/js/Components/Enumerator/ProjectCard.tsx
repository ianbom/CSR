import Badge from './UI/Badge';
import MaterialIcon from './Icons/MaterialIcon';
import Button from './UI/Button';

export type ProjectStatus = 'active' | 'upcoming' | 'finished';
export type ProjectType = 'IKM' | 'SLOI';

export interface ProjectData {
    id: string | number;
    title: string;
    institution: string;
    type: ProjectType;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
}

interface ProjectCardProps {
    project: ProjectData;
    onStartSurvey?: (project: ProjectData) => void;
    onViewReport?: (project: ProjectData) => void;
}

const typeVariants: Record<ProjectType, 'blue' | 'purple'> = {
    IKM: 'blue',
    SLOI: 'purple',
};

const statusConfig: Record<
    ProjectStatus,
    { label: string; variant: 'green' | 'amber' | 'gray'; icon: string }
> = {
    active: { label: 'Sedang Berjalan', variant: 'green', icon: 'date_range' },
    upcoming: { label: 'Akan Datang', variant: 'amber', icon: 'event_upcoming' },
    finished: { label: 'Selesai', variant: 'gray', icon: 'event_available' },
};

export default function ProjectCard({
    project,
    onStartSurvey,
    onViewReport,
}: ProjectCardProps) {
    const statusInfo = statusConfig[project.status];
    const opacityClass = project.status === 'finished' ? 'opacity-75' : project.status === 'upcoming' ? 'opacity-90' : '';

    const renderButton = () => {
        switch (project.status) {
            case 'active':
                return (
                    <Button
                        variant="primary"
                        icon="arrow_forward"
                        fullWidth
                        onClick={() => onStartSurvey?.(project)}
                    >
                        Mulai Survei
                    </Button>
                );
            case 'upcoming':
                return (
                    <Button variant="disabled" icon="lock" fullWidth disabled>
                        Belum Dibuka
                    </Button>
                );
            case 'finished':
                return (
                    <Button
                        variant="outline"
                        icon="description"
                        fullWidth
                        onClick={() => onViewReport?.(project)}
                    >
                        Lihat Laporan
                    </Button>
                );
        }
    };

    const getIconColor = () => {
        switch (project.status) {
            case 'active':
                return 'text-primary';
            case 'upcoming':
                return 'text-amber-500';
            case 'finished':
                return 'text-gray-400';
        }
    };

    return (
        <article
            className={`group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 ${opacityClass}`}
        >
            <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Header with badges */}
                <div className="flex justify-between items-start">
                    <Badge variant={typeVariants[project.type]}>
                        {project.type}
                    </Badge>
                    <Badge variant={statusInfo.variant} rounded="full">
                        {statusInfo.label}
                    </Badge>
                </div>

                {/* Title and Institution */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <MaterialIcon
                            name="account_balance"
                            className="text-[18px]"
                        />
                        <p className="text-sm font-medium">
                            {project.institution}
                        </p>
                    </div>
                </div>

                {/* Date Range */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700">
                        <MaterialIcon
                            name={statusInfo.icon}
                            className={`text-[20px] ${getIconColor()}`}
                        />
                        <p className="text-sm font-medium">
                            {project.startDate} - {project.endDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="p-5 pt-0">{renderButton()}</div>
        </article>
    );
}

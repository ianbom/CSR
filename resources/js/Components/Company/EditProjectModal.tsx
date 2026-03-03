import { Icon } from '@/Components/Company';
import ProjectForm, {
    type LocationEntry,
    type ProjectFormData,
    type Province,
} from '@/Components/Company/ProjectForm';
import { router } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';

export interface EditProjectData {
    id: number | string;
    name: string;
    description: string;
    status: string;
    target_ikm_count: number;
    target_sloi_count: number;
    startDate: string;
    endDate: string;
    enable_ikm: boolean;
    enable_sloi: boolean;
    enable_sroi: boolean;
    ikm_template_id: number | null;
    sloi_template_id: number | null;
    locations: LocationEntry[];
}

interface EditProjectModalProps {
    isOpen: boolean;
    project: EditProjectData | null;
    provinces: Province[];
    onClose: () => void;
}

export default function EditProjectModal({
    isOpen,
    project,
    provinces,
    onClose,
}: EditProjectModalProps): ReactNode {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [initialLocations, setInitialLocations] = useState<LocationEntry[]>(
        [],
    );
    const [data, setDataState] = useState<ProjectFormData>({
        name: '',
        description: '',
        status: 'draft',
        target_ikm_count: 0,
        target_sloi_count: 0,
        start_date: '',
        end_date: '',
        enable_ikm: false,
        enable_sloi: false,
        enable_sroi: false,
        ikm_template_id: null,
        sloi_template_id: null,
        district_ids: [],
    });

    // Populate form when project data changes
    useEffect(() => {
        if (isOpen && project) {
            setErrors({});
            setDataState({
                name: project.name || '',
                description: project.description || '',
                status: project.status || 'draft',
                target_ikm_count: project.target_ikm_count || 0,
                target_sloi_count: project.target_sloi_count || 0,
                start_date: project.startDate || '',
                end_date: project.endDate || '',
                enable_ikm: project.enable_ikm || false,
                enable_sloi: project.enable_sloi || false,
                enable_sroi: project.enable_sroi || false,
                ikm_template_id: project.ikm_template_id,
                sloi_template_id: project.sloi_template_id,
                district_ids: project.locations.map((l) => l.district.id),
            });
            setInitialLocations(project.locations);
        }
    }, [isOpen, project]);

    const setData = <K extends keyof ProjectFormData>(
        key: K,
        value: ProjectFormData[K],
    ) => {
        setDataState((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (!project) return;
        setSubmitting(true);
        setErrors({});

        router.put(
            `/projects/${project.id}`,
            data as unknown as Record<string, unknown>,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSubmitting(false);
                    onClose();
                },
                onError: (errs) => {
                    setErrors(errs as Record<string, string>);
                    setSubmitting(false);
                },
            },
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Edit Proyek
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Ubah detail proyek yang sudah ada
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto px-8 py-6">
                    <ProjectForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        provinces={provinces}
                        initialLocations={initialLocations}
                        showStatusField
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-8 py-5">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 rounded-lg bg-primary-btn px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-btn/20 transition-all hover:bg-primary-btn-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? (
                            'Menyimpan...'
                        ) : (
                            <>
                                Simpan Perubahan
                                <Icon name="save" className="text-sm" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

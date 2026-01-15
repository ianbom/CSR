import {
    AssessmentTypeCard,
    FormInput,
    FormTextarea,
    Icon,
    StepProgress,
} from '@/Components/Company';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface AssessmentType {
    id: string;
    icon: string;
    title: string;
    description: string;
}

const assessmentTypes: AssessmentType[] = [
    {
        id: 'ikm',
        icon: 'sentiment_satisfied',
        title: 'IKM',
        description: 'Indeks Kepuasan Masyarakat',
    },
    {
        id: 'sloi',
        icon: 'verified_user',
        title: 'SLOI',
        description: 'Social License to Operate Index',
    },
    {
        id: 'sroi',
        icon: 'paid',
        title: 'SROI',
        description: 'Social Return on Investment',
    },
];

const formSteps = [
    { label: 'Detail' },
    { label: 'Metodologi' },
    { label: 'Tinjauan' },
];

export default function CreateProject() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        targetRespondents: '500',
        launchDate: '',
        assessmentTypes: ['ikm'] as string[],
    });

    const handleAssessmentTypeChange = (typeId: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            assessmentTypes: checked
                ? [...prev.assessmentTypes, typeId]
                : prev.assessmentTypes.filter((id) => id !== typeId),
        }));
    };

    const handleSubmit = () => {
        // Navigate to next step or submit
        console.log('Form data:', formData);
        // router.post('/company/projects', formData);
    };

    const handleCancel = () => {
        router.visit('/company/projects');
    };

    return (
        <CompanyLayout
            breadcrumb={{ parent: 'Manajemen Proyek', current: 'Buat Proyek' }}
        >
            <Head title="Buat Proyek Baru" />

            <div className="mx-auto max-w-4xl px-8 py-10">
                {/* Header Halaman */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Buat Proyek Baru
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Mulai penilaian dampak Anda dengan mengisi detail
                        penting di bawah ini.
                    </p>
                </div>

                {/* Progress Tracker */}
                <StepProgress
                    currentStep={1}
                    totalSteps={3}
                    steps={formSteps}
                />

                {/* Form Section */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="space-y-8 p-8">
                        {/* Nama Proyek */}
                        <FormInput
                            label="Nama Proyek"
                            required
                            placeholder="contoh: Penilaian Dampak CSR 2024"
                            value={formData.name}
                            onChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: value,
                                }))
                            }
                        />

                        {/* Deskripsi */}
                        <FormTextarea
                            label="Deskripsi Proyek"
                            placeholder="Jelaskan secara singkat tujuan dan konteks proyek penilaian ini..."
                            value={formData.description}
                            onChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: value,
                                }))
                            }
                        />

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Target Responden */}
                            <FormInput
                                label="Target Responden"
                                type="number"
                                value={formData.targetRespondents}
                                onChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        targetRespondents: value,
                                    }))
                                }
                                helpText="Jumlah peserta yang diharapkan untuk survei ini"
                            />

                            {/* Tanggal Mulai */}
                            <FormInput
                                label="Estimasi Peluncuran"
                                type="date"
                                value={formData.launchDate}
                                onChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        launchDate: value,
                                    }))
                                }
                            />
                        </div>

                        {/* Tipe Penilaian */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-900">
                                Tipe Penilaian{' '}
                                <span className="ml-1 font-normal text-slate-400">
                                    (Pilih satu atau lebih)
                                </span>
                            </label>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {assessmentTypes.map((type) => (
                                    <AssessmentTypeCard
                                        key={type.id}
                                        id={type.id}
                                        icon={type.icon}
                                        title={type.title}
                                        description={type.description}
                                        checked={formData.assessmentTypes.includes(
                                            type.id,
                                        )}
                                        onChange={(checked) =>
                                            handleAssessmentTypeChange(
                                                type.id,
                                                checked,
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-8 py-6">
                        <button
                            onClick={handleCancel}
                            className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                        >
                            Batal
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-slate-400">
                                Semua progress disimpan sebagai draft
                            </span>
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-green-700 active:scale-95"
                            >
                                Langkah Selanjutnya
                                <Icon
                                    name="arrow_forward"
                                    className="text-sm"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <p className="mt-8 text-center text-xs text-slate-400">
                    Butuh bantuan menyiapkan proyek?{' '}
                    <Link
                        href="#"
                        className="font-bold text-primary hover:underline"
                    >
                        Baca panduan kami
                    </Link>{' '}
                    atau{' '}
                    <Link
                        href="#"
                        className="font-bold text-primary hover:underline"
                    >
                        Hubungi Dukungan
                    </Link>
                </p>
            </div>
        </CompanyLayout>
    );
}

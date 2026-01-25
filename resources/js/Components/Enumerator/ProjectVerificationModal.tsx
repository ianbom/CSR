import { useState } from 'react';
import Modal from './Modal';
import MaterialIcon from './Icons/MaterialIcon';
import Button from './UI/Button';
import { ProjectData, ProjectType } from './ProjectCard';

interface ProjectVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: ProjectData | null;
    onSubmit: (projectCode: string, surveyType: ProjectType) => void;
}

export default function ProjectVerificationModal({
    isOpen,
    onClose,
    project,
    onSubmit,
}: ProjectVerificationModalProps) {
    const [projectCode, setProjectCode] = useState('');
    const [surveyType, setSurveyType] = useState<ProjectType | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        // Validate
        if (!projectCode.trim()) {
            setError('Kode project harus diisi');
            return;
        }

        if (!surveyType) {
            setError('Pilih tipe survei');
            return;
        }

        setError('');
        onSubmit(projectCode, surveyType);
        handleClose();
    };

    const handleClose = () => {
        setProjectCode('');
        setSurveyType(null);
        setError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="lg">
            <div className="flex flex-col">
                {/* Header Section */}
                <div className="p-8 pb-4">
                    <div className="flex flex-col gap-3">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <MaterialIcon name="verified_user" className="text-3xl" />
                        </div>
                        <h2 className="text-gray-900 text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                            Verifikasi Project
                        </h2>
                        <p className="text-gray-500 text-sm font-normal leading-relaxed">
                            Masukkan kode project dan tipe survei untuk memulai pendataan
                            lapangan. Pastikan data yang dimasukkan sesuai dengan surat tugas.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-8 pt-2 flex flex-col gap-6">
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                            <MaterialIcon name="error" className="text-lg" />
                            {error}
                        </div>
                    )}

                    {/* Project Code Input */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="text-gray-900 text-sm font-semibold"
                            htmlFor="project-code"
                        >
                            Kode Project
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <MaterialIcon name="123" />
                            </div>
                            <input
                                className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary text-lg font-medium transition-all"
                                id="project-code"
                                placeholder="Contoh: 123-456"
                                type="text"
                                value={projectCode}
                                onChange={(e) => setProjectCode(e.target.value)}
                            />
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MaterialIcon name="info" className="text-[14px]" />
                            Kode terdiri dari 6 digit angka
                        </span>
                    </div>

                    {/* Survey Type Selection */}
                    <div className="flex flex-col gap-3">
                        <label className="text-gray-900 text-sm font-semibold">
                            Tipe Survei
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Option IKM */}
                            <label className="relative cursor-pointer group">
                                <input
                                    className="peer sr-only"
                                    name="survey_type"
                                    type="radio"
                                    value="IKM"
                                    checked={surveyType === 'IKM'}
                                    onChange={() => setSurveyType('IKM')}
                                />
                                <div className="flex flex-col items-start p-4 rounded-xl border border-gray-200 bg-gray-50 transition-all duration-200 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 hover:border-primary/50 h-full">
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <MaterialIcon
                                            name="thumbs_up_down"
                                            className="text-primary"
                                        />
                                        <div className="size-4 rounded-full border border-gray-400 peer-checked:bg-primary peer-checked:border-primary group-has-[:checked]:bg-primary group-has-[:checked]:border-primary flex items-center justify-center">
                                            <div className="size-2 bg-white rounded-full opacity-0 group-has-[:checked]:opacity-100" />
                                        </div>
                                    </div>
                                    <span className="text-gray-900 font-bold text-base mb-1">
                                        IKM
                                    </span>
                                    <span className="text-gray-500 text-xs leading-tight">
                                        Indeks Kepuasan Masyarakat
                                    </span>
                                </div>
                            </label>

                            {/* Option SLOI */}
                            <label className="relative cursor-pointer group">
                                <input
                                    className="peer sr-only"
                                    name="survey_type"
                                    type="radio"
                                    value="SLOI"
                                    checked={surveyType === 'SLOI'}
                                    onChange={() => setSurveyType('SLOI')}
                                />
                                <div className="flex flex-col items-start p-4 rounded-xl border border-gray-200 bg-gray-50 transition-all duration-200 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 hover:border-primary/50 h-full">
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <MaterialIcon
                                            name="apartment"
                                            className="text-primary"
                                        />
                                        <div className="size-4 rounded-full border border-gray-400 group-has-[:checked]:bg-primary group-has-[:checked]:border-primary flex items-center justify-center">
                                            <div className="size-2 bg-white rounded-full opacity-0 group-has-[:checked]:opacity-100" />
                                        </div>
                                    </div>
                                    <span className="text-gray-900 font-bold text-base mb-1">
                                        SLOI
                                    </span>
                                    <span className="text-gray-500 text-xs leading-tight">
                                        Layanan Organisasi Internal
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button
                        variant="primary"
                        icon="arrow_forward"
                        fullWidth
                        onClick={handleSubmit}
                        className="mt-4 h-12"
                    >
                        Lanjutkan
                    </Button>
                </div>

                {/* Footer Section */}
                <div className="px-8 pb-8 pt-2">
                    <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg border border-primary/10">
                        <MaterialIcon
                            name="help"
                            className="text-primary text-xl shrink-0"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-primary">
                                Butuh bantuan?
                            </span>
                            <p className="text-xs text-gray-500">
                                Jika kode tidak valid, segera hubungi admin pusat di
                                0812-3456-7890.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

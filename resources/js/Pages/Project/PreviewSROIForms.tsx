import CompanyLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Building2, CheckCircle2, ClipboardList, FileText, Hash, UserRound } from 'lucide-react';
import { ReactNode } from 'react';

interface ProjectPreview {
    id: number;
    name: string;
    projectCode: string;
    companyName: string | null;
}

interface FormPreview {
    id: number;
    name: string;
    description: string | null;
    version: number;
    status: string;
    sourceTemplateName: string | null;
}

interface QuestionPreview {
    id: number;
    code: string | null;
    questionText: string;
    helpText: string | null;
    answerType: 'text' | 'number' | null;
    unit: string | null;
    isRequired: boolean;
    isGroup: boolean;
    parentQuestionId: number | null;
    orderNo: number;
}

interface SectionPreview {
    id: number;
    title: string;
    description: string | null;
    orderNo: number;
    questions: QuestionPreview[];
}

interface Props {
    project: ProjectPreview;
    form: FormPreview;
    sections: SectionPreview[];
}

export default function PreviewSROIForms({ project, form, sections }: Props): ReactNode {
    const answerableCount = sections.reduce(
        (total, section) => total + section.questions.filter((question) => !question.isGroup && question.answerType).length,
        0,
    );

    const backToSroi = () => {
        router.visit(route('projects.show', { id: project.id, detailType: 'sroi' }));
    };

    return (
        <CompanyLayout breadcrumb={{ parent: 'Proyek', current: 'Preview SROI' }}>
            <Head title={`Preview SROI - ${project.name}`} />

            <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <button
                                type="button"
                                onClick={backToSroi}
                                className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-primary"
                            >
                                <ArrowLeft className="size-4" />
                                Kembali ke Form SROI
                            </button>
                            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Preview Form SROI</h1>
                            <p className="mt-1 text-sm text-slate-500">Tampilan ini mensimulasikan layar enumerator saat mengisi survey SROI.</p>
                        </div>
                        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase text-primary">
                            {form.status} / v{form.version}
                        </span>
                    </div>

                    <div className="mx-auto max-w-2xl">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="bg-primary px-5 py-5 text-white sm:px-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                        <ClipboardList className="size-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold uppercase tracking-widest text-white/70">Survey SROI</p>
                                        <h2 className="mt-1 text-xl font-black leading-tight">{form.name}</h2>
                                        {form.description && <p className="mt-2 text-sm leading-6 text-white/80">{form.description}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 p-4 sm:p-6">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <InfoCard icon={<Building2 className="size-5" />} label="Perusahaan" value={project.companyName || '-'} />
                                    <InfoCard icon={<Hash className="size-5" />} label="Kode Project" value={project.projectCode} />
                                </div>
                                <InfoCard icon={<FileText className="size-5" />} label="Project" value={project.name} />

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <p className="text-sm font-black text-slate-800">Progress Preview</p>
                                        <p className="text-xs font-bold text-slate-500">0 / {answerableCount} jawaban</p>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                        <div className="h-full w-0 rounded-full bg-primary" />
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-500">
                                        <Step active label="Data Responden" />
                                        <Step active label="SROI" />
                                        <Step label="Review" />
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                            <UserRound className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Data Responden</p>
                                            <p className="text-sm font-semibold text-slate-800">Nama, stakeholder, demografi, GPS, dan foto evidence diisi sebelum form ini.</p>
                                        </div>
                                    </div>
                                </div>

                                {sections.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                                        Belum ada section SROI.
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {sections.map((section) => (
                                            <section key={section.id} className="space-y-3">
                                                <div className="rounded-xl bg-slate-900 px-4 py-3 text-white">
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-white/50">Section {section.orderNo}</p>
                                                    <h3 className="mt-1 text-base font-black">{section.title}</h3>
                                                    {section.description && <p className="mt-1 text-sm text-white/70">{section.description}</p>}
                                                </div>
                                                {section.questions.map((question, index) => (
                                                    <QuestionCard key={question.id} question={question} number={index + 1} />
                                                ))}
                                            </section>
                                        ))}
                                    </div>
                                )}

                                <div className="sticky bottom-3 flex gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
                                    <button className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-600">Kembali</button>
                                    <button className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white">Review Jawaban</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
}

function InfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }): ReactNode {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="truncate text-sm font-black text-slate-800">{value}</p>
                </div>
            </div>
        </div>
    );
}

function Step({ label, active = false }: { label: string; active?: boolean }): ReactNode {
    return (
        <div className={`rounded-lg px-2 py-2 ${active ? 'bg-primary/10 text-primary' : 'bg-white text-slate-400'}`}>
            {active && <CheckCircle2 className="mx-auto mb-1 size-4" />}
            {label}
        </div>
    );
}

function QuestionCard({ question, number }: { question: QuestionPreview; number: number }): ReactNode {
    if (question.isGroup || question.answerType === null) {
        return (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Group</p>
                <h4 className="mt-1 font-black text-emerald-950">{question.questionText}</h4>
                {question.helpText && <p className="mt-1 text-sm text-emerald-800">{question.helpText}</p>}
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-black text-white">{number}</span>
                {question.code && <span className="rounded bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">{question.code}</span>}
                {question.isRequired && <span className="rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-600">Wajib</span>}
            </div>
            <label className="block">
                <span className="text-sm font-bold leading-6 text-slate-900">{question.questionText}</span>
                {question.helpText && <p className="mt-1 text-xs leading-5 text-slate-500">{question.helpText}</p>}
                {question.answerType === 'number' ? (
                    <div className="mt-3 flex overflow-hidden rounded-xl border border-slate-300 bg-slate-50">
                        <input disabled type="number" placeholder="Masukkan angka" className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-500 focus:ring-0" />
                        {question.unit && <span className="flex shrink-0 items-center border-l border-slate-200 px-3 text-xs font-bold text-slate-500">{question.unit}</span>}
                    </div>
                ) : (
                    <textarea disabled rows={4} placeholder="Tuliskan jawaban" className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500" />
                )}
            </label>
        </div>
    );
}
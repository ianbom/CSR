import CompanyLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Building2, FileText, Hash } from 'lucide-react';
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
    questionText: string;
    helpText: string | null;
    answerType: 'text' | 'number' | null;
    unit: string | null;
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

            <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={backToSroi}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali ke Form SROI
                        </button>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {form.status} / v{form.version}
                        </span>
                    </div>

                    <div className="border border-slate-400 bg-white">
                        <div className="border-b border-slate-300 bg-slate-50 px-4 py-3">
                            <h1 className="text-base font-bold text-slate-900">{form.name}</h1>
                            {form.description && <p className="mt-1 text-sm text-slate-600">{form.description}</p>}
                        </div>
                        <div className="grid gap-0 md:grid-cols-3">
                            <InfoCard label="Perusahaan" value={project.companyName || '-'} icon={<Building2 className="size-4" />} />
                            <InfoCard label="Project" value={project.name} icon={<FileText className="size-4" />} />
                            <InfoCard label="Kode Project" value={project.projectCode} icon={<Hash className="size-4" />} />
                        </div>
                        <div className="border-t border-slate-300 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                            {answerableCount} pertanyaan aktif
                            {form.sourceTemplateName ? ` · Template: ${form.sourceTemplateName}` : ''}
                        </div>
                    </div>

                    <div className="overflow-hidden border border-slate-500 bg-white shadow-sm">
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr className="bg-blue-100 text-slate-950">
                                    <th className="w-[32%] border border-slate-500 px-3 py-2 text-left text-sm font-bold">Pertanyaan</th>
                                    <th className="border border-slate-500 px-3 py-2 text-left text-sm font-bold">Jawaban</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.map((section) => (
                                    <SectionRows key={section.id} section={section} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }): ReactNode {
    return (
        <div className="border-r border-slate-300 px-4 py-3 last:border-r-0 md:last:border-r-0">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 text-slate-500">{icon}</div>
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="text-sm font-medium text-slate-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

function SectionRows({ section }: { section: SectionPreview }): ReactNode {
    const orderedQuestions = [...section.questions].sort((left, right) => left.orderNo - right.orderNo || left.id - right.id);
    const questionsByParent = orderedQuestions.reduce<Map<number | null, QuestionPreview[]>>((map, question) => {
        const key = question.parentQuestionId ?? null;
        map.set(key, [...(map.get(key) ?? []), question]);
        return map;
    }, new Map());
    const rootQuestions = questionsByParent.get(null) ?? [];

    return (
        <>
            <tr className="bg-slate-100">
                <td colSpan={2} className="border border-slate-500 px-3 py-3 text-center text-base font-bold text-slate-900">
                    {section.title}
                </td>
            </tr>
            {section.description && (
                <tr>
                    <td colSpan={2} className="border border-slate-500 px-3 py-2 text-sm text-slate-600">
                        {section.description}
                    </td>
                </tr>
            )}
            {rootQuestions.map((question) => (
                <QuestionTreeRows key={question.id} question={question} questionsByParent={questionsByParent} />
            ))}
        </>
    );
}

function QuestionTreeRows({
    question,
    questionsByParent,
}: {
    question: QuestionPreview;
    questionsByParent: Map<number | null, QuestionPreview[]>;
}): ReactNode {
    const children = questionsByParent.get(question.id) ?? [];

    if (children.length === 0) {
        return (
            <tr>
                <QuestionCell question={question} />
                <td className="align-top border border-slate-500 px-3 py-3 text-[15px] leading-8 text-slate-900">
                    <AnswerContent question={question} />
                </td>
            </tr>
        );
    }

    const rightRows = flattenRightRows(children, questionsByParent);

    return (
        <>
            <tr>
                <QuestionCell question={question} rowSpan={rightRows.length} />
                <RightQuestionCell question={rightRows[0]} />
            </tr>
            {rightRows.slice(1).map((rowQuestion) => (
                <tr key={rowQuestion.id}>
                    <RightQuestionCell question={rowQuestion} />
                </tr>
            ))}
        </>
    );
}

function flattenRightRows(children: QuestionPreview[], questionsByParent: Map<number | null, QuestionPreview[]>): QuestionPreview[] {
    return children.flatMap((child) => [child, ...flattenRightRows(questionsByParent.get(child.id) ?? [], questionsByParent)]);
}

function QuestionCell({ question, rowSpan }: { question: QuestionPreview; rowSpan?: number }): ReactNode {
    return (
        <td rowSpan={rowSpan} className="w-[32%] align-middle border border-slate-500 px-3 py-3 text-[15px] leading-8 text-slate-900">
            <QuestionText question={question} />
        </td>
    );
}

function RightQuestionCell({ question }: { question: QuestionPreview }): ReactNode {
    return (
        <td className="align-top border border-slate-500 px-3 py-3 text-[15px] leading-8 text-slate-900">
            <QuestionText question={question} strong={question.isGroup || question.answerType === null} />
            <AnswerContent question={question} />
        </td>
    );
}

function QuestionText({ question, strong = false }: { question: QuestionPreview; strong?: boolean }): ReactNode {
    return (
        <div className={strong ? 'font-bold text-slate-900' : 'text-slate-900'}>
            {question.questionText}
            {question.helpText && <p className="mt-1 text-sm font-normal leading-6 text-slate-600">{question.helpText}</p>}
        </div>
    );
}

function AnswerContent({ question }: { question: QuestionPreview }): ReactNode {
    if (question.isGroup || question.answerType === null) {
        return null;
    }

    return question.answerType === 'number' ? <NumberAnswer /> : <BlankTextLines lines={2} />;
}

function NumberAnswer(): ReactNode {
    return null;
}

function BlankTextLines({ lines }: { lines: number }): ReactNode {
    return (
        <div className="mt-2 space-y-2">
            {Array.from({ length: lines }).map((_, index) => (
                <p key={index}>-</p>
            ))}
        </div>
    );
}

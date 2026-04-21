import { Info } from 'lucide-react';
import { ReactNode, useMemo } from 'react';

interface QuestionScoreItem {
    id: string;
    question: string;
    score: number;
    importance: number;
    performance: number;
}

interface AllQuestionItem {
    id: string;
    code: string;
    category: string;
    question: string;
    order_no: number;
}

interface IKMQuestionTableProps {
    questionScores: QuestionScoreItem[];
    allQuestions?: AllQuestionItem[];
    projectName: string;
}

function formatScore(value: number): string {
    return value.toFixed(2);
}

function replaceProjectPlaceholder(question: string, projectName: string): string {
    return question.replaceAll('{project}', `<strong>${projectName}</strong>`);
}

export default function IKMQuestionTable({
    questionScores,
    allQuestions = [],
    projectName,
}: IKMQuestionTableProps): ReactNode {
    const rows = useMemo(() => {
        const questionMap = new Map<string, AllQuestionItem>();

        allQuestions
            .filter((question) => question.category === 'ikm-kepentingan')
            .forEach((question) => questionMap.set(question.code, question));

        return questionScores.map((score, index) => {
            const question = questionMap.get(score.id);
            const questionText =
                question?.question ?? score.question ?? `Pertanyaan ${score.id}`;

            return {
                id: score.id,
                orderNo: question?.order_no ?? index + 1,
                question: replaceProjectPlaceholder(questionText, projectName),
                importance: score.importance,
                performance: score.performance,
            };
        });
    }, [allQuestions, projectName, questionScores]);

    if (rows.length === 0) {
        return (
            <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-50">
                        <Info className="size-7 text-slate-300" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                        Tabel Pertanyaan IKM
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-400">
                        Belum tersedia. Data pertanyaan akan ditampilkan
                        setelah survei IKM memiliki jawaban.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-base font-bold text-slate-900">
                    Tabel Pertanyaan IKM
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                    Daftar indikator IKM beserta rerata Kepentingan dan Kinerja
                    untuk setiap pertanyaan.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="whitespace-nowrap px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Kode
                            </th>
                            <th className="min-w-[28rem] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Pertanyaan
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-blue-500">
                                Rerata Kepentingan
                            </th>
                            <th className="whitespace-nowrap px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                                Rerata Kinerja
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {rows.map((row, index) => (
                            <tr
                                key={row.id}
                                className={`transition-colors hover:bg-slate-50/50 ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                                }`}
                            >
                                <td className="whitespace-nowrap px-6 py-3.5">
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-600">
                                        {row.id}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-xs leading-relaxed text-slate-600">
                                    <div
                                        className="[&>strong]:font-bold [&>strong]:text-slate-900"
                                        dangerouslySetInnerHTML={{
                                            __html: row.question,
                                        }}
                                    />
                                </td>
                                <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                    <span className="inline-flex min-w-14 justify-center rounded-lg bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-700">
                                        {formatScore(row.importance)}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-3.5 text-center">
                                    <span className="inline-flex min-w-14 justify-center rounded-lg bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700">
                                        {formatScore(row.performance)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

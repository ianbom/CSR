import { router } from '@inertiajs/react';
import { Archive, CheckCircle, Eye, FileText, Layers3, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';

interface ProjectData { id: number; name: string; enableSroi: boolean; }
interface SroiTemplateOption { id: number; name: string; version: number; description: string | null; sectionCount: number; questionCount: number; }
interface ProjectSroiFormOption { id: number; name: string; version: number; status: string; sourceTemplateName: string | null; }
interface ProjectSroiQuestionData { id: number; sectionId: number; parentQuestionId: number | null; sourceTemplateQuestionId: number | null; code: string | null; questionText: string; helpText: string | null; answerType: 'text' | 'number' | null; unit: string | null; isRequired: boolean; isGroup: boolean; isCalculated: boolean; isActive: boolean; orderNo: number; }
interface ProjectSroiSectionData { id: number; title: string; description: string | null; orderNo: number; sourceTemplateSectionId: number | null; questions: ProjectSroiQuestionData[]; }
interface ProjectSroiFormData { id: number; name: string; description: string | null; version: number; status: string; sourceTemplateName: string | null; activatedAt: string | null; sections: ProjectSroiSectionData[]; }
interface ProjectSROIProps { project: ProjectData; templates: SroiTemplateOption[]; forms: ProjectSroiFormOption[]; form: ProjectSroiFormData | null; canEdit: boolean; }
interface SectionFormState { title: string; description: string; order_no: number | ''; }
interface QuestionFormState { section_id: number | ''; parent_question_id: number | ''; code: string; question_text: string; help_text: string; answer_type: 'text' | 'number' | ''; unit: string; is_required: boolean; is_group: boolean; is_calculated: boolean; is_active: boolean; order_no: number | ''; }

const emptySection: SectionFormState = { title: '', description: '', order_no: '' };
const emptyQuestion: QuestionFormState = { section_id: '', parent_question_id: '', code: '', question_text: '', help_text: '', answer_type: 'text', unit: '', is_required: false, is_group: false, is_calculated: false, is_active: true, order_no: '' };

export default function ProjectSROI({ project, templates, forms, form, canEdit }: ProjectSROIProps): ReactNode {
    const [templateId, setTemplateId] = useState<number | ''>(templates[0]?.id ?? '');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formState, setFormState] = useState({ name: form?.name ?? '', description: form?.description ?? '' });
    const [sectionForm, setSectionForm] = useState<SectionFormState>({ ...emptySection });
    const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
    const [questionForm, setQuestionForm] = useState<QuestionFormState>({ ...emptyQuestion });
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

    useEffect(() => { setFormState({ name: form?.name ?? '', description: form?.description ?? '' }); }, [form]);
    useEffect(() => { if (form && questionForm.section_id === '' && form.sections[0]) setQuestionForm((v) => ({ ...v, section_id: form.sections[0].id })); }, [form, questionForm.section_id]);

    const questions = useMemo(() => form?.sections.flatMap((section) => section.questions) ?? [], [form]);
    const selectedTemplate = templates.find((template) => template.id === templateId);
    const baseUrl = form ? `/projects/${project.id}/sroi/forms/${form.id}` : `/projects/${project.id}/sroi/forms`;

    const submit = (method: 'post' | 'patch' | 'delete', url: string, data: Record<string, unknown> = {}, onSuccess?: () => void) => {
        setProcessing(true); setErrors({});
        const options = { preserveScroll: true, onSuccess: () => { setProcessing(false); onSuccess?.(); }, onError: (e: Record<string, string>) => { setErrors(e); setProcessing(false); } };
        if (method === 'post') {
            router.post(url, data as any, options);
        } else if (method === 'patch') {
            router.patch(url, data as any, options);
        } else {
            router.delete(url, { ...options, data: data as any });
        }
    };

    const resetSectionForm = () => { setEditingSectionId(null); setSectionForm({ ...emptySection }); setErrors({}); };
    const resetQuestionForm = () => { setEditingQuestionId(null); setQuestionForm({ ...emptyQuestion, section_id: form?.sections[0]?.id ?? '' }); setErrors({}); };
    const useTemplate = () => { if (templateId) submit('post', `/projects/${project.id}/sroi/forms`, { template_id: templateId }); };
    const saveForm = (status?: string) => { if (form) submit('patch', baseUrl, { name: formState.name, description: formState.description, status: status ?? form.status }); };
    const saveSection = () => {
        if (!form) return;
        const url = editingSectionId ? `${baseUrl}/sections/${editingSectionId}` : `${baseUrl}/sections`;
        submit(editingSectionId ? 'patch' : 'post', url, { title: sectionForm.title, description: sectionForm.description, order_no: sectionForm.order_no || null }, resetSectionForm);
    };
    const saveQuestion = () => {
        if (!form) return;
        const url = editingQuestionId ? `${baseUrl}/questions/${editingQuestionId}` : `${baseUrl}/questions`;
        submit(editingQuestionId ? 'patch' : 'post', url, { ...questionForm, parent_question_id: questionForm.parent_question_id || null, code: questionForm.code || null, help_text: questionForm.help_text || null, unit: questionForm.unit || null, answer_type: questionForm.is_group ? null : questionForm.answer_type || null, is_required: questionForm.is_group ? false : questionForm.is_required, order_no: questionForm.order_no || null }, resetQuestionForm);
    };
    const editSection = (section: ProjectSroiSectionData) => { setEditingSectionId(section.id); setSectionForm({ title: section.title, description: section.description ?? '', order_no: section.orderNo }); setErrors({}); };
    const editQuestion = (question: ProjectSroiQuestionData) => { setEditingQuestionId(question.id); setQuestionForm({ section_id: question.sectionId, parent_question_id: question.parentQuestionId ?? '', code: question.code ?? '', question_text: question.questionText, help_text: question.helpText ?? '', answer_type: question.answerType ?? '', unit: question.unit ?? '', is_required: question.isRequired, is_group: question.isGroup, is_calculated: question.isCalculated, is_active: question.isActive, order_no: question.orderNo }); setErrors({}); };
    const deleteSection = (section: ProjectSroiSectionData) => { if (confirm(`Hapus section "${section.title}"?`)) submit('delete', `${baseUrl}/sections/${section.id}`); };
    const deleteQuestion = (question: ProjectSroiQuestionData) => { if (confirm(`Hapus pertanyaan "${question.questionText}"?`)) submit('delete', `${baseUrl}/questions/${question.id}`); };

    if (!project.enableSroi) return <Empty title="SROI belum aktif" text="Aktifkan assessment SROI di pengaturan proyek untuk membuat form." />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Form SROI Project</h2>
                            <p className="mt-1 text-sm text-slate-500">Pilih template aktif lalu custom section dan pertanyaan untuk project ini.</p>
                        </div>
                        {form && <div className="flex items-center gap-2"><StatusPill status={form.status} /><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">v{form.version}</span></div>}
                    </div>

                    {!form ? (
                        <div className="space-y-4">
                            {templates.length === 0 ? <Empty title="Belum ada template" text="Belum ada template SROI aktif yang bisa digunakan." /> : <>
                                <select value={templateId} onChange={(e) => setTemplateId(Number(e.target.value))} disabled={!canEdit || processing} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100">
                                    {templates.map((template) => <option key={template.id} value={template.id}>{template.name} v{template.version}</option>)}
                                </select>
                                {selectedTemplate && <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"><p className="font-semibold text-slate-800">{selectedTemplate.name}</p><p className="mt-1">{selectedTemplate.description || 'Tanpa deskripsi.'}</p><p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{selectedTemplate.sectionCount} section / {selectedTemplate.questionCount} pertanyaan</p></div>}
                                {errors.template_id && <ErrorText>{errors.template_id}</ErrorText>}
                                {canEdit && <button type="button" onClick={useTemplate} disabled={processing || !templateId} className="inline-flex items-center gap-2 rounded-lg bg-primary-btn px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-btn-hover disabled:opacity-50"><Layers3 className="size-4" />{processing ? 'Memproses...' : 'Gunakan Template'}</button>}
                            </>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
                            <div className="space-y-3">
                                <input value={formState.name} onChange={(e) => setFormState((v) => ({ ...v, name: e.target.value }))} disabled={!canEdit} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100" />
                                {errors.name && <ErrorText>{errors.name}</ErrorText>}
                                <textarea value={formState.description} onChange={(e) => setFormState((v) => ({ ...v, description: e.target.value }))} disabled={!canEdit} rows={3} placeholder="Deskripsi form SROI" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100" />
                                <p className="text-xs text-slate-500">Source: {form.sourceTemplateName || 'Custom'} {form.activatedAt ? `- aktif ${form.activatedAt}` : ''}</p>
                            </div>
                            <div className="flex flex-col gap-2"><Action onClick={() => router.visit(route('projects.sroi.forms.preview', [project.id, form.id]))} disabled={processing} icon={<Eye className="size-4" />}>Preview Form</Action>{canEdit && <><Action onClick={() => saveForm()} disabled={processing} icon={<Save className="size-4" />}>Simpan</Action><Action green onClick={() => saveForm('active')} disabled={processing || form.status === 'active'} icon={<CheckCircle className="size-4" />}>Aktifkan</Action><Action dark onClick={() => saveForm('archived')} disabled={processing || form.status === 'archived'} icon={<Archive className="size-4" />}>Arsipkan</Action></>}</div>
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-sm font-black uppercase tracking-wide text-slate-500">Versi Form</h3><div className="mt-3 space-y-2">{forms.length === 0 ? <p className="text-sm text-slate-400">Belum ada form.</p> : forms.map((item) => <div key={item.id} className="rounded-lg border border-slate-200 p-3"><div className="flex items-start justify-between gap-2"><p className="text-sm font-bold text-slate-800">{item.name}</p><StatusPill status={item.status} /></div><p className="mt-1 text-xs text-slate-500">v{item.version} - {item.sourceTemplateName || 'Custom'}</p></div>)}</div></div>
            </div>

            {form && <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="space-y-4">
                    {form.sections.length === 0 ? <Empty title="Belum ada section" text="Tambahkan section untuk mulai menyusun form SROI." /> : form.sections.map((section) => <section key={section.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-4">
                            <div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">{section.orderNo}</span><h3 className="font-black text-slate-900">{section.title}</h3><SourcePill isTemplate={section.sourceTemplateSectionId !== null} /></div>{section.description && <p className="mt-1 text-sm text-slate-500">{section.description}</p>}</div>
                            {canEdit && <div className="flex gap-2"><IconButton label="Edit section" onClick={() => editSection(section)}><Pencil className="size-4" /></IconButton><IconButton label="Hapus section" onClick={() => deleteSection(section)} danger><Trash2 className="size-4" /></IconButton></div>}
                        </div>
                        <div className="divide-y divide-slate-100">{section.questions.length === 0 ? <p className="p-4 text-sm text-slate-400">Belum ada pertanyaan.</p> : section.questions.map((question) => <div key={question.id} className="p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2">{question.code && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-600">{question.code}</span>}<span className="rounded bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-500">{question.isGroup ? 'group' : question.answerType || 'tanpa jawaban'}</span>{question.unit && <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">{question.unit}</span>}{!question.isActive && <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">nonaktif</span>}<SourcePill isTemplate={question.sourceTemplateQuestionId !== null} /></div><p className={`text-sm font-semibold ${question.isGroup ? 'text-slate-900' : 'text-slate-700'}`}>{question.questionText}</p>{question.helpText && <p className="mt-1 text-xs text-slate-500">{question.helpText}</p>}</div>{canEdit && <div className="flex gap-2"><IconButton label="Edit pertanyaan" onClick={() => editQuestion(question)}><Pencil className="size-4" /></IconButton><IconButton label="Hapus pertanyaan" onClick={() => deleteQuestion(question)} danger><Trash2 className="size-4" /></IconButton></div>}</div></div>)}</div>
                    </section>)}
                </div>

                {canEdit && <div className="space-y-4">
                    <EditorPanel title={editingSectionId ? 'Edit Section' : 'Tambah Section'}>
                        <Input label="Judul" value={sectionForm.title} onChange={(value) => setSectionForm((v) => ({ ...v, title: value }))} error={errors.title} />
                        <Textarea label="Deskripsi" value={sectionForm.description} onChange={(value) => setSectionForm((v) => ({ ...v, description: value }))} />
                        <Input label="Urutan" type="number" value={sectionForm.order_no.toString()} onChange={(value) => setSectionForm((v) => ({ ...v, order_no: value ? Number(value) : '' }))} />
                        <div className="flex gap-2"><button type="button" onClick={saveSection} disabled={processing} className="rounded-lg bg-primary-btn px-4 py-2 text-sm font-bold text-white hover:bg-primary-btn-hover disabled:opacity-50">{editingSectionId ? 'Update Section' : 'Tambah Section'}</button>{editingSectionId && <button type="button" onClick={resetSectionForm} className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">Batal</button>}</div>
                    </EditorPanel>
                    <EditorPanel title={editingQuestionId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}>
                        <Select label="Section" value={questionForm.section_id.toString()} onChange={(value) => setQuestionForm((v) => ({ ...v, section_id: Number(value) }))} error={errors.section_id}><option value="" disabled>Pilih section</option>{form.sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}</Select>
                        <Select label="Parent" value={questionForm.parent_question_id.toString()} onChange={(value) => setQuestionForm((v) => ({ ...v, parent_question_id: value ? Number(value) : '' }))}><option value="">Tidak ada parent</option>{questions.filter((question) => question.id !== editingQuestionId).map((question) => <option key={question.id} value={question.id}>{question.code ? `${question.code} - ` : ''}{question.questionText}</option>)}</Select>
                        <div className="grid grid-cols-2 gap-3"><Input label="Kode" value={questionForm.code} onChange={(value) => setQuestionForm((v) => ({ ...v, code: value }))} /><Input label="Urutan" type="number" value={questionForm.order_no.toString()} onChange={(value) => setQuestionForm((v) => ({ ...v, order_no: value ? Number(value) : '' }))} /></div>
                        <Textarea label="Pertanyaan" value={questionForm.question_text} onChange={(value) => setQuestionForm((v) => ({ ...v, question_text: value }))} error={errors.question_text} />
                        <Textarea label="Help Text" value={questionForm.help_text} onChange={(value) => setQuestionForm((v) => ({ ...v, help_text: value }))} />
                        <div className="grid grid-cols-2 gap-3"><Select label="Tipe Jawaban" value={questionForm.answer_type} disabled={questionForm.is_group} onChange={(value) => setQuestionForm((v) => ({ ...v, answer_type: value as QuestionFormState['answer_type'] }))}><option value="">Tanpa jawaban</option><option value="text">Text</option><option value="number">Number</option></Select><Input label="Unit" value={questionForm.unit} onChange={(value) => setQuestionForm((v) => ({ ...v, unit: value }))} /></div>
                        <div className="grid grid-cols-2 gap-2 text-sm"><Check label="Required" checked={questionForm.is_required} disabled={questionForm.is_group} onChange={(checked) => setQuestionForm((v) => ({ ...v, is_required: checked }))} /><Check label="Group" checked={questionForm.is_group} onChange={(checked) => setQuestionForm((v) => ({ ...v, is_group: checked }))} /><Check label="Calculated" checked={questionForm.is_calculated} onChange={(checked) => setQuestionForm((v) => ({ ...v, is_calculated: checked }))} /><Check label="Aktif" checked={questionForm.is_active} onChange={(checked) => setQuestionForm((v) => ({ ...v, is_active: checked }))} /></div>
                        <div className="flex gap-2"><button type="button" onClick={saveQuestion} disabled={processing || !questionForm.section_id} className="rounded-lg bg-primary-btn px-4 py-2 text-sm font-bold text-white hover:bg-primary-btn-hover disabled:opacity-50">{editingQuestionId ? 'Update Pertanyaan' : 'Tambah Pertanyaan'}</button>{editingQuestionId && <button type="button" onClick={resetQuestionForm} className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">Batal</button>}</div>
                    </EditorPanel>
                </div>}
            </div>}
        </div>
    );
}

function Empty({ title, text }: { title: string; text: string }): ReactNode { return <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><FileText className="mx-auto mb-3 size-9 text-slate-300" /><h3 className="font-bold text-slate-800">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p></div>; }
function StatusPill({ status }: { status: string }): ReactNode { const cls = status === 'active' ? 'bg-green-100 text-green-700' : status === 'archived' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'; return <span className={`rounded-full px-2.5 py-1 text-xs font-black uppercase ${cls}`}>{status}</span>; }
function SourcePill({ isTemplate }: { isTemplate: boolean }): ReactNode { return <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${isTemplate ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>{isTemplate ? 'Template' : 'Custom'}</span>; }
function Action({ children, icon, onClick, disabled, green = false, dark = false }: { children: ReactNode; icon: ReactNode; onClick: () => void; disabled?: boolean; green?: boolean; dark?: boolean }): ReactNode { const cls = green ? 'bg-green-600 text-white hover:bg-green-700' : dark ? 'bg-slate-700 text-white hover:bg-slate-800' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'; return <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50 ${cls}`}>{icon}{children}</button>; }
function IconButton({ children, label, danger = false, onClick }: { children: ReactNode; label: string; danger?: boolean; onClick: () => void }): ReactNode { return <button type="button" aria-label={label} title={label} onClick={onClick} className={`flex size-8 items-center justify-center rounded-lg border transition ${danger ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>{children}</button>; }
function EditorPanel({ title, children }: { title: string; children: ReactNode }): ReactNode { return <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><Plus className="size-4 text-primary" /><h3 className="text-sm font-black uppercase tracking-wide text-slate-700">{title}</h3></div><div className="space-y-3">{children}</div></div>; }
function Input({ label, value, onChange, type = 'text', error }: { label: string; value: string; onChange: (value: string) => void; type?: string; error?: string }): ReactNode { return <label className="block"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />{error && <ErrorText>{error}</ErrorText>}</label>; }
function Textarea({ label, value, onChange, error }: { label: string; value: string; onChange: (value: string) => void; error?: string }): ReactNode { return <label className="block"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />{error && <ErrorText>{error}</ErrorText>}</label>; }
function Select({ label, value, onChange, children, error, disabled = false }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode; error?: string; disabled?: boolean }): ReactNode { return <label className="block"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100">{children}</select>{error && <ErrorText>{error}</ErrorText>}</label>; }
function Check({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }): ReactNode { return <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-700"><input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />{label}</label>; }
function ErrorText({ children }: { children: ReactNode }): ReactNode { return <p className="mt-1 text-xs font-semibold text-red-600">{children}</p>; }

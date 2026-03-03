<?php

namespace App\Services;

use App\Models\InstrumentTemplate;
use App\Models\TemplateQuestion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class InstrumentTemplateService
{
    /**
     * Get paginated instrument templates with question counts.
     */
    public function getAllTemplates(array $params = []): LengthAwarePaginator
    {
        $query = InstrumentTemplate::query()
            ->withCount('questions')
            ->with('creator:id,name');

        // Search
        if (!empty($params['search'])) {
            $search = $params['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Type filter
        if (!empty($params['type']) && $params['type'] !== 'all') {
            $query->where('type', strtoupper($params['type']));
        }

        // Status filter
        if (!empty($params['status']) && $params['status'] !== 'all') {
            $query->where('is_active', $params['status'] === 'active');
        }

        // Sorting
        $sortBy = $params['sort_by'] ?? 'created_at';
        $sortOrder = $params['sort_order'] ?? 'desc';
        $allowed = ['name', 'type', 'version', 'is_active', 'created_at', 'published_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $params['per_page'] ?? 10;
        $paginated = $query->paginate($perPage)->withQueryString();

        $paginated->getCollection()->transform(function ($template) {
            return [
                'id'             => $template->id,
                'type'           => $template->type,
                'name'           => $template->name,
                'version'        => $template->version,
                'description'    => $template->description,
                'isActive'       => $template->is_active,
                'publishedAt'    => $template->published_at?->format('d M Y'),
                'createdBy'      => $template->creator?->name ?? '-',
                'questionsCount' => $template->questions_count ?? 0,
                'createdAt'      => $template->created_at?->format('d M Y'),
            ];
        });

        return $paginated;
    }

    /**
     * Get summary statistics.
     */
    public function getTemplateSummary(): array
    {
        $total = InstrumentTemplate::count();
        $active = InstrumentTemplate::where('is_active', true)->count();
        $ikm = InstrumentTemplate::where('type', 'IKM')->count();
        $sloi = InstrumentTemplate::where('type', 'SLOI')->count();

        return [
            'totalTemplates'  => $total,
            'activeTemplates' => $active,
            'ikmTemplates'    => $ikm,
            'sloiTemplates'   => $sloi,
        ];
    }

    /**
     * Get template detail with all questions.
     */
    public function getTemplateDetail(int $templateId): array
    {
        $template = InstrumentTemplate::withCount('questions')
            ->with('creator:id,name')
            ->findOrFail($templateId);

        $questions = TemplateQuestion::where('template_id', $templateId)
            ->orderBy('order_no')
            ->get()
            ->map(function ($q) {
                return [
                    'id'           => $q->id,
                    'category'     => $q->category,
                    'code'         => $q->code,
                    'questionText' => $q->question_text,
                    'orderNo'      => $q->order_no,
                    'createdAt'    => $q->created_at?->format('d M Y'),
                ];
            });

        return [
            'template' => [
                'id'             => $template->id,
                'type'           => $template->type,
                'name'           => $template->name,
                'version'        => $template->version,
                'description'    => $template->description,
                'isActive'       => $template->is_active,
                'publishedAt'    => $template->published_at?->format('d M Y'),
                'createdBy'      => $template->creator?->name ?? '-',
                'questionsCount' => $template->questions_count ?? 0,
                'createdAt'      => $template->created_at?->format('d M Y'),
            ],
            'questions' => $questions,
        ];
    }

    /**
     * Create a new question for a template.
     */
    public function createQuestion(int $templateId, array $data): TemplateQuestion
    {
        // Auto-set order_no if not provided
        if (empty($data['order_no'])) {
            $maxOrder = TemplateQuestion::where('template_id', $templateId)->max('order_no');
            $data['order_no'] = ($maxOrder ?? 0) + 1;
        }

        return TemplateQuestion::create([
            'template_id'   => $templateId,
            'category'      => $data['category'] ?? null,
            'code'          => $data['code'],
            'question_text' => $data['question_text'],
            'order_no'      => $data['order_no'],
        ]);
    }

    /**
     * Update an existing question.
     */
    public function updateQuestion(int $questionId, array $data): TemplateQuestion
    {
        $question = TemplateQuestion::findOrFail($questionId);

        $question->update([
            'category'      => $data['category'] ?? null,
            'code'          => $data['code'],
            'question_text' => $data['question_text'],
            'order_no'      => $data['order_no'] ?? $question->order_no,
        ]);

        return $question->fresh();
    }

    /**
     * Delete a question (soft delete).
     */
    public function deleteQuestion(int $questionId): void
    {
        $question = TemplateQuestion::findOrFail($questionId);
        $question->delete();
    }
}

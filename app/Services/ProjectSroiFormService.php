<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectSroiForm;
use App\Models\ProjectSroiQuestion;
use App\Models\ProjectSroiSection;
use App\Models\SroiTemplate;
use Illuminate\Support\Facades\DB;

class ProjectSroiFormService
{
    public function copyTemplateToProject(Project $project, SroiTemplate $template, int $userId): ProjectSroiForm
    {
        return DB::transaction(function () use ($project, $template, $userId) {
            $template->load([
                'sections' => fn ($query) => $query->orderBy('order_no')->orderBy('id'),
                'questions' => fn ($query) => $query->orderBy('section_id')->orderBy('order_no')->orderBy('id'),
            ]);

            $version = ((int) ProjectSroiForm::query()
                ->where('project_id', $project->id)
                ->max('version')) + 1;

            $form = ProjectSroiForm::create([
                'company_id' => $project->company_id,
                'project_id' => $project->id,
                'source_template_id' => $template->id,
                'name' => $template->name,
                'description' => $template->description,
                'version' => $version,
                'status' => 'draft',
                'created_by' => $userId,
            ]);

            $sectionIdMap = [];
            foreach ($template->sections as $templateSection) {
                $section = ProjectSroiSection::create([
                    'form_id' => $form->id,
                    'source_template_section_id' => $templateSection->id,
                    'title' => $templateSection->title,
                    'description' => $templateSection->description,
                    'order_no' => $templateSection->order_no,
                ]);

                $sectionIdMap[$templateSection->id] = $section->id;
            }

            $questionIdMap = [];
            foreach ($template->questions as $templateQuestion) {
                $question = ProjectSroiQuestion::create([
                    'form_id' => $form->id,
                    'section_id' => $sectionIdMap[$templateQuestion->section_id],
                    'source_template_question_id' => $templateQuestion->id,
                    'code' => $templateQuestion->code,
                    'question_text' => $templateQuestion->question_text,
                    'help_text' => $templateQuestion->help_text,
                    'answer_type' => $templateQuestion->answer_type,
                    'unit' => $templateQuestion->unit,
                    'is_required' => $templateQuestion->is_required,
                    'is_group' => $templateQuestion->is_group,
                    'is_calculated' => $templateQuestion->is_calculated,
                    'is_active' => true,
                    'order_no' => $templateQuestion->order_no,
                ]);

                $questionIdMap[$templateQuestion->id] = $question->id;
            }

            foreach ($template->questions as $templateQuestion) {
                if ($templateQuestion->parent_question_id && isset($questionIdMap[$templateQuestion->parent_question_id])) {
                    ProjectSroiQuestion::whereKey($questionIdMap[$templateQuestion->id])->update([
                        'parent_question_id' => $questionIdMap[$templateQuestion->parent_question_id],
                    ]);
                }
            }

            return $this->loadFormForDisplay($form);
        });
    }

    public function updateForm(ProjectSroiForm $form, array $data): ProjectSroiForm
    {
        return DB::transaction(function () use ($form, $data) {
            if (($data['status'] ?? null) === 'active') {
                ProjectSroiForm::query()
                    ->where('project_id', $form->project_id)
                    ->where('id', '!=', $form->id)
                    ->where('status', 'active')
                    ->update(['status' => 'archived']);

                $data['activated_at'] = now();
            }

            $form->update($data);

            return $this->loadFormForDisplay($form->fresh());
        });
    }

    public function loadFormForDisplay(ProjectSroiForm $form): ProjectSroiForm
    {
        return $form->load([
            'sourceTemplate',
            'sections' => fn ($query) => $query->orderBy('order_no')->orderBy('id'),
            'sections.questions' => fn ($query) => $query->orderBy('order_no')->orderBy('id'),
        ]);
    }
}

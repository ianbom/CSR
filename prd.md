# Product Requirements Document
# Impact Report Management Apps

**Version:** 2.0  
**Last Updated:** 22 Juni 2026  
**Status:** Revised PRD with SROI Enhancement  

---

## 1. Product Overview

Impact Report Management Apps adalah platform web untuk mengelola program pengukuran dampak CSR/ESG. Sistem mendukung administrasi perusahaan dan proyek, manajemen instrumen survei, penugasan enumerator lapangan, pengumpulan data responden, evidence capture berupa foto dan koordinat GPS, review submission, dashboard, analytics, serta export data untuk assessment IKM, SLOI, dan SROI.

Aplikasi ini menggunakan workflow berbasis role untuk `superadmin`, `admin`, `company`, dan `enumerator`. Platform mencakup landing page publik, autentikasi, dashboard, project management, instrument template, survey collection, submission approval, export, profile setting, dan company setting.

Revisi PRD ini menambahkan kebutuhan SROI yang lebih lengkap. SROI tidak lagi diperlakukan sebagai pertanyaan sederhana yang langsung melekat ke project, tetapi sebagai sistem template dan form dinamis. Admin/superadmin menyediakan template SROI, lalu company dapat memilih template tersebut saat membuat atau mengatur project. Template kemudian dicopy menjadi form SROI khusus project agar company dapat melakukan custom section dan pertanyaan tanpa mengubah template master admin.

---

## 2. Goals

- Menyediakan platform terpusat untuk setup project CSR/ESG, target responden, lokasi project, assignment enumerator, dan assessment type.
- Mengaktifkan enumerator untuk mengumpulkan data survey lapangan dengan data identitas responden, stakeholder responden, GPS, dan foto evidence.
- Mendukung assessment IKM dan SLOI menggunakan template pertanyaan standar dari admin/superadmin.
- Mendukung assessment SROI menggunakan template awal dari admin/superadmin yang dapat dicopy dan dicustom oleh company per project.
- Menyimpan jawaban SROI dalam format sederhana berupa `text` dan `number`.
- Mendukung pengelompokan pertanyaan SROI dalam section seperti Pengetahuan Perusahaan, Pengetahuan Program, Pengetahuan Kelompok, Bidang Kewirausahaan, Bidang Kesehatan, Bidang Lingkungan, Bidang Pendidikan, dan Outcome Lain.
- Mendukung pertanyaan SROI bertingkat melalui parent question atau group question.
- Memungkinkan company/admin melakukan review, approve, reject, dan export data submission.
- Menyediakan dashboard dan analytics untuk monitoring operasional across projects, companies, submissions, enumerators, regions, assessment type, dan stakeholder.
- Menyediakan export dinamis untuk IKM, SLOI, dan SROI berdasarkan pertanyaan yang berlaku pada project.

---

## 3. Non-Goals

- Native mobile app implementation tidak termasuk core scope produk web, walaupun terdapat direktori `android`.
- Payment, billing, dan subscription management tidak termasuk scope.
- External BI integration dan third-party reporting APIs tidak termasuk scope awal.
- Offline-first survey collection dan sync conflict handling tidak termasuk scope awal.
- Real-time notifications tidak termasuk scope awal.
- Advanced automated SROI financial modeling, full attribution/deadweight/drop-off calculation, dan automatic SROI ratio calculation tidak menjadi scope wajib pada versi awal.
- PDF/docx formal report generation tidak termasuk scope awal, kecuali ditambahkan pada roadmap reporting.
- Multi-language UI management tidak termasuk scope awal.

---

## 4. Target Users

### 4.1 Superadmin/Admin

Platform operator yang bertanggung jawab mengelola companies, users, global templates, SROI templates, all projects, dashboard global, dan monitoring lintas perusahaan.

### 4.2 Company User

Perwakilan perusahaan yang bertanggung jawab membuat project CSR/ESG, memilih assessment type, memilih template IKM/SLOI/SROI, melakukan custom form SROI per project, assign enumerator, monitoring progress, review submission, dan export hasil.

### 4.3 Enumerator

Petugas lapangan yang bertanggung jawab melihat project yang ditugaskan, verifikasi project code, mengisi data responden, memilih/menyimpan stakeholder responden, menjawab questionnaire IKM/SLOI/SROI, upload photo evidence, capture GPS coordinate, review jawaban, submit survey, dan edit submission yang belum approved.

### 4.4 Public Visitor

Pengunjung unauthenticated yang dapat melihat landing page, register, dan login.

---

## 5. Product Scope

### 5.1 In Scope

- Authentication dan account lifecycle:
  - register,
  - login,
  - logout,
  - reset password,
  - email verification,
  - profile update,
  - password update,
  - account deletion.
- Company management:
  - list,
  - search/filter,
  - summary,
  - create company record.
- User management:
  - list,
  - filter,
  - create/update users,
  - role assignment,
  - active/inactive status.
- Project management:
  - create project,
  - list/filter/sort/paginate project,
  - edit project,
  - update project status,
  - configure target counts,
  - configure location,
  - configure assessment flags: IKM, SLOI, SROI,
  - assign templates,
  - assign enumerators,
  - configure descriptive questions.
- Area lookup APIs:
  - provinces,
  - cities,
  - districts,
  - villages if needed.
- IKM/SLOI instrument template management:
  - create/update/delete templates,
  - view template detail,
  - create/update/delete questions.
- SROI template management:
  - admin creates SROI template,
  - admin creates template sections,
  - admin creates template questions,
  - admin publishes/activates template.
- Project SROI form management:
  - company selects SROI template,
  - system copies template to project SROI form,
  - company edits project SROI form name/description/status,
  - company edits project SROI sections,
  - company edits/adds/deactivates project SROI questions.
- Enumerator management:
  - list,
  - create,
  - update,
  - deactivate/delete,
  - detail profile,
  - related projects/submissions.
- Enumerator survey workflow:
  - assigned project list,
  - project code verification,
  - respondent form,
  - stakeholder input in respondent data,
  - IKM/SLOI questionnaire,
  - SROI dynamic questionnaire,
  - descriptive answers,
  - photo evidence,
  - GPS capture,
  - review step,
  - submit/continue,
  - survey history,
  - edit existing non-approved submission.
- Submission review:
  - bulk approve,
  - bulk reject,
  - return to submitted,
  - notes/timeline.
- Dashboard and analytics:
  - admin dashboard,
  - company dashboard,
  - project analytics,
  - IKM score distribution,
  - SLOI reliability/aspect analysis,
  - SROI response summary,
  - SROI numeric aggregation,
  - stakeholder-based SROI filtering.
- Export:
  - respondent/submission export,
  - dynamic question columns,
  - IKM/SLOI/SROI context export,
  - streamed CSV-style download.

### 5.2 Out of Scope for Current Codebase

- Full automatic financial SROI model with attribution, deadweight, displacement, duration, drop-off, discounting, and SROI ratio.
- Advanced report builder with narrative PDF/docx generation.
- Offline-first mobile survey.
- Real-time notification engine.
- Granular policy builder UI.
- BI dashboard integration.
- Multi-language content management.

---

## 6. Functional Requirements

## 6.1 Public Landing Page

- The system shall provide a public landing page describing the platform.
- The landing page shall provide login and registration navigation.
- Authenticated visitors shall be able to navigate to their appropriate dashboard or workspace.

---

## 6.2 Authentication

- Users shall register with personal and company details.
- Registration shall create or associate a company record for company users where applicable.
- Users shall login with email and password.
- Login redirection shall depend on role:
  - Enumerator: assigned project list.
  - Company: company project list or company dashboard.
  - Admin/superadmin: admin dashboard.
- Users shall be able to reset passwords.
- Authenticated users shall be able to update profile details.
- Authenticated users shall be able to update password.
- Authenticated users shall be able to delete their account through profile settings.

---

## 6.3 Role Model

Supported roles:

- `superadmin`
- `admin`
- `company`
- `enumerator`

Role responsibilities:

- Superadmin/admin:
  - global visibility,
  - company management,
  - user management,
  - IKM/SLOI template management,
  - SROI template management,
  - global dashboard,
  - all-project monitoring.
- Company:
  - company-scoped project management,
  - company-scoped enumerator management,
  - company-scoped submission review,
  - project SROI form customization,
  - export company/project data.
- Enumerator:
  - assigned project access,
  - respondent data collection,
  - survey answer submission,
  - own survey history,
  - edit own non-approved submissions.
- Public:
  - view landing page,
  - register/login only.

Access control shall prevent users from accessing data outside their permitted role/company scope.

---

## 6.4 Company Management

- Admin users shall view paginated companies with search/filter.
- Admin users shall create company records with:
  - name,
  - legal name,
  - email,
  - phone,
  - address,
  - status.
- Company status shall support values such as:
  - active,
  - pending,
  - suspended,
  - deleted.
- Company summary metrics shall include:
  - total companies,
  - active companies,
  - pending companies,
  - suspended companies.

---

## 6.5 User Management

- Admin users shall view paginated users with filters/search.
- Admin users shall create users with:
  - name,
  - email,
  - password,
  - role,
  - company,
  - phone,
  - position,
  - active status.
- Admin users shall update user profile and status fields.
- User list summaries shall include:
  - total users,
  - role breakdown,
  - status breakdown.

---

## 6.6 Project Management

Company users shall create projects with:

- project name,
- description,
- IKM target respondent count,
- SLOI target respondent count,
- assessment type flags:
  - IKM,
  - SLOI,
  - SROI,
- IKM template,
- SLOI template,
- SROI template if SROI is enabled,
- start date,
- end date,
- district-level locations,
- descriptive questions.

Project requirements:

- Projects shall receive an auto-generated project code.
- Company users shall list, search, filter, paginate, and sort company projects.
- Admin/superadmin users shall list projects across companies with company/province/status filtering.
- Company users shall update project details and status.
- Project detail shall show:
  - overview metrics,
  - locations,
  - assigned enumerators,
  - response progress,
  - score summaries,
  - demographics,
  - questions,
  - respondent rows,
  - audit log,
  - trend charts.
- Company users shall assign active company enumerators to a project.
- When SROI is enabled and a SROI template is selected, the system shall create a project SROI form by copying the selected SROI template into project-level SROI tables.
- Company users shall customize project SROI sections and questions after the form is created.
- Project SROI form shall have status:
  - draft,
  - active,
  - archived.
- Enumerators shall only see active SROI forms for survey collection.

---

## 6.7 IKM/SLOI Instrument Template Management

- Users with access shall list instrument templates with search/filter/status/type controls.
- Users shall create templates for supported types:
  - IKM,
  - SLOI.
- Users shall update/delete templates.
- Users shall view template questions.
- Users shall create/update/delete questions with:
  - category,
  - code,
  - aspect,
  - question text,
  - ordering.
- Active IKM/SLOI templates shall be used when a project enables the corresponding assessment type.

---

## 6.8 SROI Template Management

SROI template management is handled by admin/superadmin.

### 6.8.1 SROI Template

- Admin/superadmin shall create SROI templates.
- SROI template shall include:
  - name,
  - description,
  - version,
  - active status,
  - created by,
  - published date.
- Admin/superadmin shall activate or deactivate SROI templates.
- Only active SROI templates shall be selectable by company users when configuring project SROI.

### 6.8.2 SROI Template Section

- Admin/superadmin shall create sections inside a SROI template.
- Section shall include:
  - title,
  - description,
  - order number.
- Section examples:
  - I. Pengetahuan Perusahaan,
  - II. Pengetahuan Program,
  - III. Pengetahuan Kelompok,
  - Bidang Kewirausahaan,
  - Bidang Kesehatan,
  - Bidang Lingkungan,
  - Bidang Pendidikan,
  - Outcome Lain.

### 6.8.3 SROI Template Question

- Admin/superadmin shall create questions inside a SROI template section.
- Question shall include:
  - code,
  - question text,
  - help text,
  - answer type,
  - unit,
  - required flag,
  - group flag,
  - calculated flag,
  - order number.
- SROI question answer type shall be limited to:
  - `text`,
  - `number`,
  - `null` for group/title questions.
- SROI shall not use option tables.
- SROI shall not require stakeholder tables because stakeholder is stored in respondent data.
- SROI questions may be nested using `parent_question_id`.
- Group questions shall be used for headings such as:
  - Penghematan Anggaran Alat Usaha,
  - Peningkatan Pendapatan,
  - Penghematan Anggaran Sarana Prasarana.
- Number questions may use units such as:
  - rupiah_per_bulan,
  - orang,
  - persen,
  - skala_1_10.

---

## 6.9 Project SROI Form Management

Project SROI form management is handled by company users after selecting an admin-provided SROI template.

### 6.9.1 Copy Template to Project Form

- When a company enables SROI and selects a SROI template, the system shall create `project_sroi_forms`.
- The system shall copy:
  - `sroi_template_sections` into `project_sroi_sections`,
  - `sroi_template_questions` into `project_sroi_questions`.
- Each copied project section shall keep reference to `source_template_section_id`.
- Each copied project question shall keep reference to `source_template_question_id`.
- Project form customization shall not modify the original admin template.

### 6.9.2 Project SROI Form

- A project SROI form shall belong to:
  - company,
  - project,
  - optional source template.
- Project SROI form shall include:
  - name,
  - description,
  - version,
  - status,
  - created by,
  - activated at.
- A project may have multiple versions of SROI form, but only one active version should be used by enumerators at a time.

### 6.9.3 Project SROI Section

- Company users shall view project SROI sections.
- Company users shall add, update, reorder, soft-delete, or deactivate sections.
- Company users shall customize section title and description.
- Project SROI section changes shall only affect the selected project.

### 6.9.4 Project SROI Question

- Company users shall view project SROI questions.
- Company users shall add, update, reorder, soft-delete, or deactivate questions.
- Company users shall edit:
  - code,
  - question text,
  - help text,
  - answer type,
  - unit,
  - required flag,
  - group flag,
  - calculated flag,
  - active flag,
  - order number.
- Custom questions added by company shall have `source_template_question_id = null`.
- Questions copied from admin template shall keep `source_template_question_id`.
- Enumerators shall only see `is_active = true` questions.

---

## 6.10 Enumerator Management

- Company users shall list enumerators scoped to their company.
- Company users shall create enumerator accounts.
- Company users shall update enumerator details.
- Company users shall soft-delete/deactivate enumerators.
- Company users shall view enumerator detail including:
  - assigned projects,
  - respondent activity,
  - submission activity.

---

## 6.11 Enumerator Survey Workflow

- Enumerators shall see assigned non-draft projects.
- Enumerators shall search/filter assigned projects.
- Before starting a survey, enumerators shall enter a project code.
- If project code is valid, the survey page shall load:
  - project metadata,
  - selected assessment type,
  - respondent form,
  - descriptive questions,
  - IKM/SLOI questions if enabled,
  - active project SROI form if SROI is selected.
- Survey collection shall include:
  - respondent identity/demographics,
  - respondent stakeholder,
  - assessment answers,
  - descriptive answers,
  - photo evidence,
  - GPS capture,
  - review step.
- Respondent stakeholder shall be stored in respondent data, not in SROI form tables.
- SROI form shall render sections and questions according to:
  - section order,
  - parent/group question structure,
  - question order.
- SROI group questions shall appear as headings and shall not require direct answers.
- SROI text questions shall store answer into `value_text`.
- SROI number questions shall store answer into `value_number`.
- Submission shall store:
  - company,
  - project,
  - assessment type,
  - respondent,
  - enumerator,
  - project SROI form if SROI,
  - status,
  - photo path,
  - photo MIME,
  - photo size,
  - latitude,
  - longitude,
  - submitted timestamp.
- Enumerators shall choose whether to submit final and return to list or continue with another respondent.
- Duplicate respondent submissions for the same project shall be prevented or handled deterministically by the backend.
- Enumerators shall view paginated history with filters by:
  - project,
  - status,
  - assessment type,
  - sorting.
- Enumerators shall edit their own non-approved submissions.

---

## 6.12 Submission Review

- Company/admin users shall select one or more submissions from project respondent tables.
- Users shall bulk update status to:
  - approved,
  - rejected,
  - submitted.
- Status changes shall create timeline entries with:
  - action,
  - decision time,
  - actor,
  - optional notes.
- Approved submissions shall contribute to project analytics according to screen rules.
- Approved IKM/SLOI submissions shall contribute to IKM/SLOI score analytics.
- Approved SROI submissions shall contribute to SROI response summary and numeric aggregation.
- Rejected submissions shall remain visible in history and may be edited by enumerator if allowed by workflow.

---

## 6.13 Dashboards and Analytics

### 6.13.1 Company Dashboard

Company dashboard shall show:

- total projects,
- active projects,
- enumerators,
- monthly responses,
- project performance,
- IKM/SLOI score distribution,
- SROI submission count,
- SROI approved/rejected/pending count,
- recent activities,
- submission trends with optional project filter,
- project filter list.

### 6.13.2 Admin Dashboard

Admin dashboard shall show:

- companies,
- users,
- enumerators,
- projects,
- submissions,
- respondents,
- pending/approved/rejected submissions,
- recent companies/projects,
- submission trends by assessment type,
- projects by status,
- submissions by type,
- recent activity,
- top provinces by submission count.

### 6.13.3 Project Analytics

Project analytics shall show:

- project overview,
- response progress,
- demographics,
- respondent-level table,
- audit log,
- trend data,
- IKM-specific score breakdown where available,
- SLOI-specific score breakdown where available,
- SLOI reliability/aspect analysis where data is sufficient,
- SROI section/question response summary,
- SROI numeric aggregation for number answers,
- SROI stakeholder filter using respondent stakeholder,
- SROI exportable response table.

### 6.13.4 SROI Analytics

SROI analytics shall include:

- total SROI submissions,
- submitted/approved/rejected count,
- respondent count by stakeholder,
- numeric answer aggregation:
  - sum,
  - average,
  - minimum,
  - maximum,
  - count,
- examples of numeric metrics:
  - total penghematan biaya,
  - rata-rata penghematan biaya,
  - total peningkatan pendapatan,
  - rata-rata skor kepentingan program,
  - rata-rata skor kepuasan program.
- text answer browsing/filtering for qualitative analysis.
- SROI analytics shall not be required to produce final SROI ratio in the initial scope.

---

## 6.14 Export

- Users shall export project respondent data.
- Export shall include:
  - respondent metadata,
  - stakeholder,
  - submission metadata,
  - assessment type,
  - status,
  - submitted timestamp,
  - enumerator,
  - photo path where appropriate,
  - GPS coordinates.
- Export shall include dynamic question columns for selected assessment context.
- SROI export shall generate dynamic columns from active or submitted project SROI questions.
- SROI group questions shall not be exported as answer columns unless needed as section headings.
- SROI text answers shall be exported as text values.
- SROI number answers shall be exported as numeric values.
- Export shall stream a downloadable file response.

---

## 7. Data Requirements

## 7.1 Core Entities

Core entities:

- Company: organization identity and status.
- User: account, role, company, active state.
- Province/City/District/Village: Indonesian administrative geography.
- InstrumentTemplate: reusable IKM/SLOI assessment template.
- TemplateQuestion: ordered IKM/SLOI questions per template.
- Project: company assessment project with targets, status, assessment flags, templates, dates, code.
- ProjectLocation: district scope for a project.
- ProjectEnumeratorAssignment: enumerator assignment to project.
- Respondent: demographic respondent profile, including stakeholder.
- SroiTemplate: admin-provided SROI template.
- SroiTemplateSection: sections inside an admin SROI template.
- SroiTemplateQuestion: questions inside an admin SROI template.
- ProjectSroiForm: project-specific copy of selected SROI template.
- ProjectSroiSection: project-specific SROI sections editable by company.
- ProjectSroiQuestion: project-specific SROI questions editable by company.
- Submission: evidence-backed survey submission.
- SubmissionTemplateAnswer: IKM/SLOI answers.
- SubmissionSroiAnswer: SROI answer storage for text/number answers.
- SubmissionTimeline: review/status history.
- ProjectScoreSnapshot: score snapshot storage.
- ProjectDescriptiveQuestion: project-specific qualitative/descriptive question.
- SubmissionDescriptiveAnswer: answer to project descriptive question.

The complete DBML database design is documented in `db.md`.

---

## 7.2 Respondent Data Requirements

Respondent shall include:

- company_id,
- project_id,
- name,
- address,
- phone,
- age,
- gender,
- stakeholder,
- respondent_status,
- education_level,
- main_occupation,
- monthly_income,
- created_by.

Stakeholder examples:

- Penerima Manfaat,
- Fasilitator Program,
- Pemerintah Desa,
- Masyarakat.

Stakeholder is stored in respondent data to avoid duplicating stakeholder structures inside SROI form tables.

---

## 7.3 SROI Template Data Requirements

### `sroi_templates`

Stores admin master SROI template.

Required fields:

- id,
- name,
- description,
- version,
- is_active,
- created_by,
- published_at,
- timestamps,
- deleted_at.

### `sroi_template_sections`

Stores sections inside SROI template.

Required fields:

- id,
- template_id,
- title,
- description,
- order_no,
- timestamps,
- deleted_at.

### `sroi_template_questions`

Stores questions inside SROI template.

Required fields:

- id,
- template_id,
- section_id,
- parent_question_id,
- code,
- question_text,
- help_text,
- answer_type,
- unit,
- is_required,
- is_group,
- is_calculated,
- order_no,
- timestamps,
- deleted_at.

Allowed `answer_type`:

- `text`,
- `number`,
- `null` for group/title.

---

## 7.4 Project SROI Form Data Requirements

### `project_sroi_forms`

Stores project-specific SROI form copied from admin template.

Required fields:

- id,
- company_id,
- project_id,
- source_template_id,
- name,
- description,
- version,
- status,
- created_by,
- activated_at,
- timestamps,
- deleted_at.

Allowed status:

- draft,
- active,
- archived.

### `project_sroi_sections`

Stores project-specific SROI sections.

Required fields:

- id,
- form_id,
- source_template_section_id,
- title,
- description,
- order_no,
- timestamps,
- deleted_at.

### `project_sroi_questions`

Stores project-specific SROI questions.

Required fields:

- id,
- form_id,
- section_id,
- parent_question_id,
- source_template_question_id,
- code,
- question_text,
- help_text,
- answer_type,
- unit,
- is_required,
- is_group,
- is_calculated,
- is_active,
- order_no,
- timestamps,
- deleted_at.

---

## 7.5 Submission SROI Data Requirements

### `submissions`

For SROI submission, the system shall store `project_sroi_form_id` to preserve which project form version was used at submission time.

### `submission_sroi_answers`

Stores answers for SROI questions.

Required fields:

- id,
- submission_id,
- project_sroi_question_id,
- value_text,
- value_number,
- timestamps,
- deleted_at.

Storage rule:

- If `answer_type = text`, store answer in `value_text`.
- If `answer_type = number`, store answer in `value_number`.
- If `is_group = true` or `answer_type = null`, no answer is required.

---

## 8. Key User Flows

## 8.1 Company Creates and Runs Project

1. Company user logs in.
2. Company user opens Projects.
3. Company user creates project with locations, targets, assessment types, templates, and descriptive questions.
4. If SROI is enabled, company user selects SROI template.
5. System copies selected SROI template into project SROI form.
6. Company user reviews and customizes project SROI sections/questions.
7. Company user activates project SROI form.
8. Company user assigns enumerators.
9. Enumerators collect surveys.
10. Company user reviews submitted responses.
11. Company user approves/rejects submissions.
12. Dashboard and project analytics update from approved/submitted data depending on screen rules.
13. Company exports respondent/submission data.

---

## 8.2 Admin Creates SROI Template

1. Admin logs in.
2. Admin opens SROI Template Management.
3. Admin creates a new SROI template.
4. Admin adds sections, for example:
   - Pengetahuan Perusahaan,
   - Pengetahuan Program,
   - Pengetahuan Kelompok,
   - Bidang Kewirausahaan,
   - Bidang Kesehatan,
   - Bidang Lingkungan,
   - Bidang Pendidikan,
   - Outcome Lain.
5. Admin adds questions under each section.
6. Admin marks some questions as group questions where needed.
7. Admin sets answer type as `text`, `number`, or `null` for group.
8. Admin publishes and activates the template.
9. Company users can select the active template for their project.

---

## 8.3 Company Customizes Project SROI Form

1. Company opens project detail.
2. Company opens SROI Form tab.
3. System displays project SROI form copied from selected template.
4. Company edits section titles if needed.
5. Company edits question texts if needed.
6. Company adds new custom questions if needed.
7. Company disables irrelevant questions using `is_active = false`.
8. Company reorders sections/questions.
9. Company activates the form.
10. Enumerator sees only active sections/questions for SROI survey.

---

## 8.4 Enumerator Collects Survey

1. Enumerator logs in.
2. Enumerator sees assigned projects.
3. Enumerator selects a project and enters project code.
4. System loads project, respondent form, survey type, questions, and descriptive questions.
5. Enumerator fills respondent identity and stakeholder.
6. Enumerator fills IKM/SLOI/SROI questionnaire depending on selected assessment type.
7. For SROI:
   - text questions use text input,
   - number questions use number input,
   - group questions are displayed as headings.
8. Enumerator captures photo and GPS.
9. Enumerator reviews answers.
10. Enumerator submits.
11. Enumerator either continues with another respondent or returns to project list/history.

---

## 8.5 Company/Admin Reviews Submission

1. Company/admin opens project respondent/submission table.
2. User filters by assessment type, status, stakeholder, enumerator, or date.
3. User opens submission detail.
4. User reviews respondent data, evidence, GPS, and answers.
5. User approves or rejects submission.
6. System creates submission timeline entry.
7. Approved SROI answers become available for analytics/export.

---

## 8.6 Admin Monitors Platform

1. Admin logs in.
2. Admin views dashboard metrics and trends.
3. Admin manages companies, users, templates, and projects.
4. Admin audits high-level submission activity and regional distribution.
5. Admin monitors SROI template usage and project SROI adoption.

---

## 9. Permissions Matrix

| Capability | Superadmin/Admin | Company | Enumerator | Public |
| --- | --- | --- | --- | --- |
| View landing page | Yes | Yes | Yes | Yes |
| Register/login | Yes | Yes | Yes | Yes |
| Admin dashboard | Yes | No | No | No |
| Company dashboard | Scoped/All where implemented | Company scoped | No | No |
| Manage companies | Yes | No | No | No |
| Manage users | Yes | No | No | No |
| Manage own projects | Yes/All | Company scoped | No | No |
| Assign enumerators | Yes/Scoped | Company scoped | No | No |
| Manage IKM/SLOI templates | Yes | Available where permitted | No | No |
| Manage SROI master templates | Yes | No | No | No |
| Select SROI template for project | Yes/Scoped | Company scoped | No | No |
| Customize project SROI form | Yes/Scoped | Company scoped | No | No |
| Collect IKM/SLOI/SROI surveys | No | No | Assigned projects | No |
| Review submissions | Yes/All where implemented | Company scoped | No | No |
| Export respondents/submissions | Yes/All where implemented | Company scoped | No | No |

---

## 10. Non-Functional Requirements

## 10.1 Security

- All authenticated routes shall enforce role and company/project scoping.
- Sensitive routes shall prevent cross-company data access.
- Admin-only SROI template routes shall not be accessible by company/enumerator roles.
- Company users shall only customize project SROI forms within their company scope.
- Enumerators shall only access assigned projects.
- Enumerators shall only submit to active assigned projects.
- Uploaded photos shall validate MIME, extension, size, and storage path.
- Rendered HTML question text shall be sanitized or restricted to trusted templates.
- Passwords shall be hashed through Laravel auth facilities.
- SROI custom question text shall be escaped or sanitized before rendering.

---

## 10.2 Performance

- Project, dashboard, and analytics queries shall avoid N+1 relationship loading.
- Large exports shall stream responses rather than loading all rows into memory.
- Paginated list pages shall stay server-driven with filters preserved in query strings.
- Analytics should prefer aggregate database queries where practical.
- SROI dynamic form loading shall eager-load sections and questions efficiently.
- SROI export shall avoid loading excessive answer sets into memory.

---

## 10.3 Reliability

- Survey submission and status update operations shall be transactional.
- SROI template copy to project form shall be transactional.
- If SROI template copy fails, no partial project form should remain active.
- Duplicate respondent submission handling shall be deterministic and visible to users.
- Photo replacement should clean up orphaned storage files where feasible.
- Tests shall run consistently in the configured test database.
- Submission shall retain `project_sroi_form_id` to preserve the exact form version used during collection.

---

## 10.4 Usability

- Enumerator survey flow shall work well on mobile devices.
- SROI sections shall make long forms easier to navigate.
- Group questions shall visually separate sub-questions.
- Field forms shall provide clear validation feedback.
- Number fields shall show unit hints such as rupiah per month or scale 1-10.
- Dashboards and tables shall support scanning, filtering, and pagination.
- Empty states shall clearly indicate no data without breaking workflows.
- Company customization screens shall clearly distinguish admin template questions from custom project questions.

---

## 11. Current Quality Baseline

- Backend: Laravel 12, Inertia Laravel 2, Breeze, Sanctum, Pest 4.
- Frontend: React 18, Inertia React 2, TypeScript, Tailwind CSS 3, Recharts, Lucide icons.
- Database baseline includes auth, cache/jobs, geography, projects, templates, respondents, submissions, timelines, and score snapshots.
- Updated target schema adds SROI template/form tables:
  - `sroi_templates`,
  - `sroi_template_sections`,
  - `sroi_template_questions`,
  - `project_sroi_forms`,
  - `project_sroi_sections`,
  - `project_sroi_questions`,
  - updated `submission_sroi_answers`,
  - updated `respondents.stakeholder`,
  - updated `submissions.project_sroi_form_id`.
- Tests exist or should be added for:
  - auth,
  - profile,
  - instrument templates,
  - SLOI reliability,
  - submission bulk status,
  - SROI template creation,
  - SROI template copy to project,
  - project SROI customization,
  - SROI survey submission,
  - SROI export.
- Known audit findings from code review:
  - Role middleware currently has enforcement commented out.
  - Some project detail paths need stronger company scoping.
  - Some analytics SQL uses MySQL-specific functions that fail under SQLite tests.
  - Several `dangerouslySetInnerHTML` usages depend on trusted/sanitized question text.
  - SROI custom question rendering must be sanitized.

---

## 12. Success Metrics

- Company user can create a project, assign enumerators, receive submissions, review them, and export results without manual database intervention.
- Company user can enable SROI, select a SROI template, customize project SROI questions, activate form, and collect SROI submissions.
- Admin can create and publish a reusable SROI template.
- Enumerator can complete a survey in the field with respondent data, stakeholder, answers, photo, and GPS evidence in under 5 minutes after opening a project.
- Enumerator can fill SROI text and number questions successfully on mobile.
- Project dashboards accurately reflect approved/submitted counts according to screen rules.
- SROI analytics can show submission count, stakeholder distribution, and numeric answer aggregation.
- SROI export generates dynamic columns based on project SROI questions.
- Admin can identify active companies, active projects, pending submissions, SROI submissions, and top provinces from dashboard without exports.
- Authorization tests prove users cannot access another company's projects/submissions/forms.
- Core feature test suite passes in CI.

---

## 13. Risks and Open Issues

- Authorization gaps can expose cross-role or cross-company data if not fixed before production use.
- SROI dynamic forms can become too long or difficult to use if section navigation is not designed well.
- SROI calculations may create expectation mismatch if users expect complete financial SROI ratio calculation in the initial release.
- Company customization may create inconsistent data across projects; export and analytics must handle dynamic questions carefully.
- Duplicate submission behavior currently returns existing data silently; UX may need explicit feedback.
- Large analytics pages may slow down as submission volume grows.
- Large SROI exports may require chunking/streaming optimization.
- Generated/public build artifacts and Android build artifacts should be reviewed for repository hygiene.
- Sanitization is important because custom question text may be entered by company users.

---

## 14. Recommended Roadmap

## Phase 1: Stabilization

- Enforce role middleware.
- Add policy/company scoping for project, submission, template, SROI form, and enumerator operations.
- Fix failing tests and database-driver-specific SQL.
- Patch dependency advisories.
- Add tests for role access and cross-company isolation.
- Ensure all dynamic question rendering is sanitized.

## Phase 2: SROI Foundation

- Add SROI template management for admin.
- Add SROI template sections/questions.
- Add project SROI form generation by copying selected template.
- Add project SROI section/question customization for company.
- Add respondent stakeholder field.
- Add `project_sroi_form_id` to submissions.
- Add SROI answer storage with `value_text` and `value_number`.
- Add unit hints for number questions.

## Phase 3: Survey and Review Hardening

- Improve duplicate respondent UX.
- Validate enumerator assignment before survey access/submission.
- Validate active project SROI form before SROI survey submission.
- Clean up old uploaded photos on replacement.
- Add browser/mobile tests for IKM/SLOI/SROI survey flow.
- Add submission review detail for SROI answers.

## Phase 4: Analytics and Reporting

- Optimize dashboard/project analytics queries.
- Add SROI response summary and numeric aggregation.
- Add stakeholder filter for SROI analytics.
- Add richer export filters and audit trails.
- Add formal report generation if required.
- Evaluate full SROI financial calculation model as a future enhancement.

## Phase 5: Operations

- Add CI for tests, lint, build, and composer audit.
- Document deployment, environment variables, storage links, queues, and scheduled jobs.
- Add monitoring/logging expectations for production.
- Add admin documentation for creating SROI templates.
- Add company documentation for customizing project SROI forms.

---

## 15. Appendix: Example SROI Questionnaire Structure

Example SROI sections:

1. Pengetahuan Perusahaan
   - Apakah Anda menggunakan produk ASTRA?

2. Pengetahuan Program
   - Apakah Anda mengetahui Program Bantuan DSA ASTRA?
   - Sejauh mana keterlibatan dan peran Anda dalam Program Bantuan DSA ASTRA?
   - Aktivitas apa saja yang Anda jalani dalam Program Bantuan DSA ASTRA?
   - Dukungan atau bantuan apa saja yang diterima dalam Program Bantuan DSA ASTRA?

3. Pengetahuan Kelompok
   - Bagaimana latar belakang kelompok dapat berdiri hingga saat ini?
   - Bagaimana struktur dalam kelompok?
   - Apa saja produk yang dibuat dalam kelompok ini?

4. Bidang Kewirausahaan
   - Penghematan Anggaran Alat Usaha
     - Biaya sebelum adanya program
     - Biaya setelah adanya program
     - Jumlah yang dihemat
   - Peningkatan Pengetahuan
   - Peningkatan Pendapatan
     - Pendapatan sebelum program
     - Pendapatan setelah program
   - Lapangan pekerjaan baru
   - Outcome lainnya

5. Bidang Kesehatan
   - Penghematan Pengadaan Sarana Prasarana
   - Penghematan Vitamin dan Obat-obatan
   - Penghematan PMT
   - Peningkatan Pengetahuan
   - Outcome lainnya

6. Bidang Lingkungan
   - Penghematan Sarana Prasarana
   - Peningkatan Pengetahuan
   - Peningkatan Pendapatan
   - Lapangan pekerjaan baru
   - Outcome lainnya

7. Bidang Pendidikan
   - Penghematan Sarana Prasarana
   - Peningkatan Pengetahuan
   - Lapangan pekerjaan baru
   - Outcome lainnya

8. Outcome Lain
   - Penghematan biaya hadiah Proklim
   - Penghematan biaya pameran
   - Penghematan biaya desain kemasan
   - Seberapa penting adanya program DSA? Skala 1-10
   - Seberapa puas dengan adanya program DSA? Skala 1-10

---

## 16. Appendix: SROI Data Model Summary

SROI master template:

```text
sroi_templates
  -> sroi_template_sections
      -> sroi_template_questions
```

Project-specific SROI form:

```text
project_sroi_forms
  -> project_sroi_sections
      -> project_sroi_questions
```

Survey result:

```text
respondents
submissions
submission_sroi_answers
```

Copy rule:

```text
sroi_templates
  -> copied to project_sroi_forms

sroi_template_sections
  -> copied to project_sroi_sections

sroi_template_questions
  -> copied to project_sroi_questions
```

Answer rule:

```text
answer_type = text
  -> submission_sroi_answers.value_text

answer_type = number
  -> submission_sroi_answers.value_number

answer_type = null or is_group = true
  -> no direct answer required
```

<?php

namespace App\Http\Controllers;

use App\Http\Requests\Submission\BulkUpdateStatusRequest;
use App\Models\Submission;
use App\Models\SubmissionTimeline;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    /**
     * Bulk update submission statuses and record timeline entries.
     */
    public function bulkUpdateStatus(BulkUpdateStatusRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();

        DB::transaction(function () use ($validated, $user) {
            $submissions = Submission::where('company_id', $user->company_id)
                ->whereIn('id', $validated['submission_ids'])
                ->get();

            foreach ($submissions as $submission) {
                $submission->update(['status' => $validated['status']]);

                SubmissionTimeline::create([
                    'submission_id' => $submission->id,
                    'action' => $validated['status'],
                    'decided_at' => now(),
                    'decided_by' => $user->id,
                    'notes' => $validated['notes'] ?? null,
                ]);
            }
        });

        $count = count($validated['submission_ids']);
        $statusLabel = match ($validated['status']) {
            'approved' => 'disetujui',
            'rejected' => 'ditolak',
            'submitted' => 'dikembalikan ke submitted',
        };

        return redirect()->back()->with('success', "{$count} submission berhasil {$statusLabel}.");
    }
}

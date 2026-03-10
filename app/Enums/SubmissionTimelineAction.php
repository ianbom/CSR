<?php

namespace App\Enums;

enum SubmissionTimelineAction: string
{
    case Submitted = 'submitted';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Revised = 'revised';
}

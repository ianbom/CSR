import {
    DemographicItem,
    RespondentProfileCard,
    ReviewFooter,
    ReviewItem,
    ReviewPageHeader,
    ReviewProgressBar,
    ReviewSection,
    VerifiedBadge,
    WarningBox,
} from '@/Components/Enumerator';
import EnumeratorLayout from '@/Layouts/EnumeratorLayout';
import { Head, router } from '@inertiajs/react';

export default function ReviewSurvey() {
    // Mock handlers
    const handleEdit = (section: string) => {
        console.log(`Edit ${section}`);
        // router.visit(route('enumerator.survey.edit', { section }));
    };

    const handleBack = () => {
        // router.visit(route('enumerator.survey.last-step'));
        window.history.back();
    };

    const handleSaveDraft = () => {
        console.log('Save Draft');
        alert('Draft saved successfully!');
    };

    const handleSubmit = () => {
        if (
            confirm(
                'Are you sure you want to submit this survey? This action cannot be undone.',
            )
        ) {
            console.log('Submit Final Survey');
            alert('Survey submitted successfully!');
            router.visit(route('enumerator.dashboard'));
        }
    };

    return (
        <EnumeratorLayout>
            <Head title="Final Survey Review" />

            <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-4 py-6 md:px-8 lg:px-0">
                {/* Progress Bar */}
                <ReviewProgressBar percentage={100} />

                {/* Page Heading */}
                <ReviewPageHeader
                    title="Review & Submit"
                    subtitle="Survey ID: #12345 — Final Validation Step"
                />

                {/* Respondent Profile Card */}
                <RespondentProfileCard
                    name="John Doe"
                    id="987654321"
                    location="Sector 4, North District"
                    interviewDate="Oct 24, 10:42 AM"
                    imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBwwE0BERxEh3AgbHPydoIU4mxdCB6AQRWX26RjdPXTI3LxWNcq8MTe_BGYEzUmCqmxUbyrw4TS2kHXudo3Of-RcyQoWSCpHl2W4_5tDooAWZNejW4m40E0BNW2_-Hdeh3CwSCUeQpc8SEBzCQIGtzM0qUP9JZ79IbqwsJ_AWVgy9TI9iYowKPOL5-H-xm-METe4xkA2QQbvF31SH6e7Ein_nFBr629oCG3w-Z24j1z-wgAaCQps8BuKNR_WUKx5fwmZ51HAK5IJfQ"
                    onEdit={() => handleEdit('profile')}
                />

                {/* Housing Details Section */}
                <ReviewSection title="Housing Details" icon="home">
                    <ReviewItem
                        label="Dwelling Type"
                        value="Multi-story Apartment Complex"
                        onEdit={() => handleEdit('housing')}
                    />
                    <ReviewItem
                        label="Ownership Status"
                        value="Rented (Private Landlord)"
                        onEdit={() => handleEdit('housing')}
                    />
                    <ReviewItem
                        label="Number of Rooms"
                        value="3 Bedrooms, 1 Living Room"
                        onEdit={() => handleEdit('housing')}
                    />
                    <ReviewItem
                        label="Sanitation Facilities"
                        value="Private flush toilet connected to sewer"
                        onEdit={() => handleEdit('housing')}
                    />
                </ReviewSection>

                {/* Demographics Section */}
                <ReviewSection
                    title="Demographics"
                    icon="diversity_3"
                    variant="grid"
                >
                    <DemographicItem
                        label="Head of Household Age"
                        value="34 Years"
                        onEdit={() => handleEdit('demographics')}
                    />
                    <DemographicItem
                        label="Total Members"
                        value="4 (2 Adults, 2 Children)"
                        onEdit={() => handleEdit('demographics')}
                    />
                    <DemographicItem
                        label="Primary Language"
                        value="English / Spanish"
                        onEdit={() => handleEdit('demographics')}
                    />
                    <DemographicItem
                        label="Highest Education"
                        value="Bachelor's Degree"
                        onEdit={() => handleEdit('demographics')}
                    />
                </ReviewSection>

                {/* Economic Status Section */}
                <ReviewSection title="Economic Status" icon="payments">
                    <ReviewItem
                        label="Employment Status"
                        value="Employed Full-Time"
                        badge={<VerifiedBadge />}
                        onEdit={() => handleEdit('economic')}
                    />
                    <ReviewItem
                        label="Annual Income Range"
                        value="$45,000 - $60,000"
                        onEdit={() => handleEdit('economic')}
                    />
                </ReviewSection>

                {/* Warning Box */}
                <WarningBox
                    title="Submission is Final"
                    message="Please verify all information above. Once submitted, this survey record will be locked and cannot be altered by the field enumerator."
                />
            </div>

            {/* Fixed Action Footer */}
            <ReviewFooter
                onBack={handleBack}
                onSaveDraft={handleSaveDraft}
                onSubmit={handleSubmit}
            />
        </EnumeratorLayout>
    );
}

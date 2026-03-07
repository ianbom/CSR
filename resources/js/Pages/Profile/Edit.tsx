import AppLayout from '@/Layouts/AppLayout';
import { Company, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdateCompanyForm from './Partials/UpdateCompanyForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
    company,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; company?: Company | null }>) {
    const user = usePage().props.auth.user;

    return (
        <AppLayout
            breadcrumb={{
                parent: 'Profile',
                current: 'Edit',
            }}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {user.role === 'company' && company && (
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateCompanyForm
                                company={company}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    )}

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

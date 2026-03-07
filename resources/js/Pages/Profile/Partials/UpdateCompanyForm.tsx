import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Company } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateCompanyForm({
    company,
    status,
    className = '',
}: {
    company: Company;
    status?: string;
    className?: string;
}) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: company.name ?? '',
            legal_name: company.legal_name ?? '',
            email: company.email ?? '',
            phone: company.phone ?? '',
            address: company.address ?? '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update-company'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informasi Perusahaan
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi perusahaan Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="company_name" value="Nama Perusahaan" />

                    <TextInput
                        id="company_name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="legal_name" value="Nama Legal" />

                    <TextInput
                        id="legal_name"
                        className="mt-1 block w-full"
                        value={data.legal_name}
                        onChange={(e) => setData('legal_name', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.legal_name} />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="company_email" value="Email Perusahaan" />

                        <TextInput
                            id="company_email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="company_phone" value="Telepon Perusahaan" />

                        <TextInput
                            id="company_phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />

                        <InputError className="mt-2" message={errors.phone} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="company_address" value="Alamat" />

                    <textarea
                        id="company_address"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={3}
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.address} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>

                    <Transition
                        show={recentlySuccessful || status === 'company-updated'}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

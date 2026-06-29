import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Building2, CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import { FormEventHandler } from 'react';

type CompanyProps = {
    id: number;
    name: string;
    legal_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    status: string;
};

export default function UpdateCompanyInformationForm({
    company,
}: {
    company: CompanyProps;
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

    const inputClass =
        'block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100';

    const textareaClass =
        'block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100';

    return (
        <form onSubmit={submit} className="space-y-5">
            {/* Company Name */}
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700"
                >
                    Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Nama perusahaan"
                        className={inputClass}
                    />
                </div>
                <InputError className="mt-1.5" message={errors.name} />
            </div>

            {/* Legal Name */}
            <div>
                <label
                    htmlFor="legal_name"
                    className="block text-sm font-medium text-slate-700"
                >
                    Nama Legal Perusahaan
                </label>
                <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        id="legal_name"
                        type="text"
                        value={data.legal_name}
                        onChange={(e) => setData('legal_name', e.target.value)}
                        placeholder="PT. Nama Perusahaan Lengkap"
                        className={inputClass}
                    />
                </div>
                <InputError className="mt-1.5" message={errors.legal_name} />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="company_email"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Email Perusahaan
                    </label>
                    <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="company_email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="company@example.com"
                            className={inputClass}
                        />
                    </div>
                    <InputError className="mt-1.5" message={errors.email} />
                </div>

                <div>
                    <label
                        htmlFor="company_phone"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Telepon Perusahaan
                    </label>
                    <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="company_phone"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="+62 21 1234 5678"
                            className={inputClass}
                        />
                    </div>
                    <InputError className="mt-1.5" message={errors.phone} />
                </div>
            </div>

            {/* Address */}
            <div>
                <label
                    htmlFor="address"
                    className="block text-sm font-medium text-slate-700"
                >
                    Alamat Perusahaan
                </label>
                <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        rows={3}
                        placeholder="Alamat lengkap perusahaan"
                        className={`${textareaClass} pl-10`}
                    />
                </div>
                <InputError className="mt-1.5" message={errors.address} />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
                >
                    {processing && (
                        <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    )}
                    Simpan Perubahan
                </button>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out duration-300"
                    enterFrom="opacity-0 translate-y-1"
                    leave="transition ease-in-out duration-300"
                    leaveTo="opacity-0"
                >
                    <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Tersimpan!
                    </div>
                </Transition>
            </div>
        </form>
    );
}

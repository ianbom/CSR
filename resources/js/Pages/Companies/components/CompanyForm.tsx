import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export interface CompanyFormValues {
    name: string;
    legal_name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
}

interface Props {
    data: CompanyFormValues;
    setData: (field: keyof CompanyFormValues, value: string) => void;
    errors: Partial<Record<keyof CompanyFormValues, string>>;
}

export default function CompanyForm({ data, setData, errors }: Props) {
    return (
        <div className="space-y-4">
            <div>
                <InputLabel htmlFor="name" value="Nama Perusahaan" />
                <TextInput
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel
                    htmlFor="legal_name"
                    value="Nama Legal (Opsional)"
                />
                <TextInput
                    id="legal_name"
                    className="mt-1 block w-full"
                    value={data.legal_name}
                    onChange={(e) => setData('legal_name', e.target.value)}
                />
                <InputError message={errors.legal_name} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="email" value="Email (Opsional)" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="phone"
                        value="No. Telepon (Opsional)"
                    />
                    <TextInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setData('phone', val);
                        }}
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="address" value="Alamat (Opsional)" />
                <textarea
                    id="address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    rows={3}
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                />
                <InputError message={errors.address} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="status" value="Status" />
                <select
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    required
                >
                    <option value="active">Aktif</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                </select>
                <InputError message={errors.status} className="mt-2" />
            </div>
        </div>
    );
}

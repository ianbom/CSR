import {
    AssessmentTypeCard,
    FormInput,
    FormTextarea,
    Icon,
    StepProgress,
} from '@/Components/Company';
import { createProjectData } from '@/data';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Types
interface Province {
    id: number;
    code: string;
    name: string;
}

interface City {
    id: number;
    code: string;
    name: string;
    province_id: number;
}

interface District {
    id: number;
    code: string;
    name: string;
    city_id: number;
}

interface SelectedLocation {
    province: Province | null;
    city: City | null;
    district: District | null;
}

interface PageProps {
    provinces: Province[];
}

// Menggunakan data dari JSON
const assessmentTypes = createProjectData.assessmentTypes;
const formSteps = createProjectData.formSteps;

export default function CreateProject() {
    const { provinces } = usePage<PageProps>().props;

    // Form state menggunakan Inertia useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        target_ikm_count: 0,
        target_sloi_count: 0,
        start_date: '',
        end_date: '',
        enable_ikm: false,
        enable_sloi: false,
        enable_sroi: false,
        ikm_template_id: null as number | null,
        sloi_template_id: null as number | null,
        district_ids: [] as number[],
    });

    // Area selection state
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({
        province: null,
        city: null,
        district: null,
    });
    const [selectedLocations, setSelectedLocations] = useState<
        Array<{
            id: number;
            province: Province;
            city: City;
            district: District;
        }>
    >([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    // Fetch cities when province changes
    useEffect(() => {
        if (selectedLocation.province) {
            setLoadingCities(true);
            setCities([]);
            setDistricts([]);
            setSelectedLocation((prev) => ({
                ...prev,
                city: null,
                district: null,
            }));

            fetch(
                `/api/area/cities?province_id=${selectedLocation.province.id}`,
            )
                .then((res) => res.json())
                .then((data) => {
                    setCities(data);
                    setLoadingCities(false);
                })
                .catch(() => setLoadingCities(false));
        }
    }, [selectedLocation.province]);

    // Fetch districts when city changes
    useEffect(() => {
        if (selectedLocation.city) {
            setLoadingDistricts(true);
            setDistricts([]);
            setSelectedLocation((prev) => ({ ...prev, district: null }));

            fetch(`/api/area/districts?city_id=${selectedLocation.city.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setDistricts(data);
                    setLoadingDistricts(false);
                })
                .catch(() => setLoadingDistricts(false));
        }
    }, [selectedLocation.city]);

    // Update district_ids when selectedLocations changes
    useEffect(() => {
        setData(
            'district_ids',
            selectedLocations.map((loc) => loc.district.id),
        );
    }, [selectedLocations]);

    const handleAssessmentTypeChange = (typeId: string, checked: boolean) => {
        if (typeId === 'ikm') {
            setData('enable_ikm', checked);
        } else if (typeId === 'sloi') {
            setData('enable_sloi', checked);
        } else if (typeId === 'sroi') {
            setData('enable_sroi', checked);
        }
    };

    const handleProvinceChange = (provinceId: string) => {
        const province = provinces.find((p) => p.id === parseInt(provinceId));
        setSelectedLocation({
            province: province || null,
            city: null,
            district: null,
        });
    };

    const handleCityChange = (cityId: string) => {
        const city = cities.find((c) => c.id === parseInt(cityId));
        setSelectedLocation((prev) => ({
            ...prev,
            city: city || null,
            district: null,
        }));
    };

    const handleDistrictChange = (districtId: string) => {
        const district = districts.find((d) => d.id === parseInt(districtId));
        setSelectedLocation((prev) => ({
            ...prev,
            district: district || null,
        }));
    };

    const addLocation = () => {
        if (
            selectedLocation.province &&
            selectedLocation.city &&
            selectedLocation.district
        ) {
            // Check if already added
            const exists = selectedLocations.some(
                (loc) => loc.district.id === selectedLocation.district!.id,
            );

            if (!exists) {
                setSelectedLocations((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        province: selectedLocation.province!,
                        city: selectedLocation.city!,
                        district: selectedLocation.district!,
                    },
                ]);

                // Reset selection
                setSelectedLocation({
                    province: null,
                    city: null,
                    district: null,
                });
                setCities([]);
                setDistricts([]);
            }
        }
    };

    const removeLocation = (id: number) => {
        setSelectedLocations((prev) => prev.filter((loc) => loc.id !== id));
    };

    const handleSubmit = () => {
        post('/company/projects', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleCancel = () => {
        router.visit('/company/projects');
    };

    return (
        <CompanyLayout
            breadcrumb={{ parent: 'Manajemen Proyek', current: 'Buat Proyek' }}
        >
            <Head title="Buat Proyek Baru" />

            <div className="mx-auto max-w-4xl px-8 py-10">
                {/* Header Halaman */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Buat Proyek Baru
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Mulai penilaian dampak Anda dengan mengisi detail
                        penting di bawah ini.
                    </p>
                </div>

                {/* Progress Tracker */}
                <StepProgress
                    currentStep={1}
                    totalSteps={3}
                    steps={formSteps}
                />

                {/* Form Section */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="space-y-8 p-8">
                        {/* Nama Proyek */}
                        <FormInput
                            label="Nama Proyek"
                            required
                            placeholder="contoh: Penilaian Dampak CSR 2024"
                            value={data.name}
                            onChange={(value) => setData('name', value)}
                            error={errors.name}
                        />

                        {/* Deskripsi */}
                        <FormTextarea
                            label="Deskripsi Proyek"
                            placeholder="Jelaskan secara singkat tujuan dan konteks proyek penilaian ini..."
                            value={data.description}
                            onChange={(value) => setData('description', value)}
                            error={errors.description}
                        />

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Target Responden IKM */}
                            <FormInput
                                label="Target Responden IKM"
                                type="number"
                                value={data.target_ikm_count.toString()}
                                onChange={(value) =>
                                    setData(
                                        'target_ikm_count',
                                        parseInt(value) || 0,
                                    )
                                }
                                helpText="Jumlah responden IKM yang diharapkan"
                                error={errors.target_ikm_count}
                            />

                            {/* Target Responden SLOI */}
                            <FormInput
                                label="Target Responden SLOI"
                                type="number"
                                value={data.target_sloi_count.toString()}
                                onChange={(value) =>
                                    setData(
                                        'target_sloi_count',
                                        parseInt(value) || 0,
                                    )
                                }
                                helpText="Jumlah responden SLOI yang diharapkan"
                                error={errors.target_sloi_count}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Tanggal Mulai */}
                            <FormInput
                                label="Tanggal Mulai"
                                type="date"
                                value={data.start_date}
                                onChange={(value) =>
                                    setData('start_date', value)
                                }
                                error={errors.start_date}
                            />

                            {/* Tanggal Selesai */}
                            <FormInput
                                label="Tanggal Selesai"
                                type="date"
                                value={data.end_date}
                                onChange={(value) => setData('end_date', value)}
                                error={errors.end_date}
                            />
                        </div>

                        {/* Lokasi Proyek */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-900">
                                Lokasi Proyek{' '}
                                <span className="text-red-500">*</span>
                                <span className="ml-1 font-normal text-slate-400">
                                    (Pilih kecamatan)
                                </span>
                            </label>

                            {/* Area Selection */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                {/* Province */}
                                <div>
                                    <select
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={
                                            selectedLocation.province?.id || ''
                                        }
                                        onChange={(e) =>
                                            handleProvinceChange(e.target.value)
                                        }
                                    >
                                        <option value="">Pilih Provinsi</option>
                                        {provinces.map((province) => (
                                            <option
                                                key={province.id}
                                                value={province.id}
                                            >
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <select
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100"
                                        value={selectedLocation.city?.id || ''}
                                        onChange={(e) =>
                                            handleCityChange(e.target.value)
                                        }
                                        disabled={
                                            !selectedLocation.province ||
                                            loadingCities
                                        }
                                    >
                                        <option value="">
                                            {loadingCities
                                                ? 'Memuat...'
                                                : 'Pilih Kota/Kabupaten'}
                                        </option>
                                        {cities.map((city) => (
                                            <option
                                                key={city.id}
                                                value={city.id}
                                            >
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* District */}
                                <div>
                                    <select
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100"
                                        value={
                                            selectedLocation.district?.id || ''
                                        }
                                        onChange={(e) =>
                                            handleDistrictChange(e.target.value)
                                        }
                                        disabled={
                                            !selectedLocation.city ||
                                            loadingDistricts
                                        }
                                    >
                                        <option value="">
                                            {loadingDistricts
                                                ? 'Memuat...'
                                                : 'Pilih Kecamatan'}
                                        </option>
                                        {districts.map((district) => (
                                            <option
                                                key={district.id}
                                                value={district.id}
                                            >
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Add Button */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={addLocation}
                                        disabled={!selectedLocation.district}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-btn px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-btn-hover disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        <Icon name="add" className="text-sm" />
                                        Tambah
                                    </button>
                                </div>
                            </div>

                            {/* Selected Locations */}
                            {selectedLocations.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium text-slate-700">
                                        Lokasi terpilih (
                                        {selectedLocations.length}
                                        ):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedLocations.map((loc) => (
                                            <div
                                                key={loc.id}
                                                className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm"
                                            >
                                                <span className="text-primary">
                                                    {loc.district.name},{' '}
                                                    {loc.city.name},{' '}
                                                    {loc.province.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeLocation(loc.id)
                                                    }
                                                    className="text-primary hover:text-red-500"
                                                >
                                                    <Icon
                                                        name="close"
                                                        className="text-sm"
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {errors.district_ids && (
                                <p className="text-sm text-red-500">
                                    {errors.district_ids}
                                </p>
                            )}
                        </div>

                        {/* Tipe Penilaian */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-900">
                                Tipe Penilaian{' '}
                                <span className="ml-1 font-normal text-slate-400">
                                    (Pilih satu atau lebih)
                                </span>
                            </label>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {assessmentTypes.map((type) => (
                                    <AssessmentTypeCard
                                        key={type.id}
                                        id={type.id}
                                        icon={type.icon}
                                        title={type.title}
                                        description={type.description}
                                        checked={
                                            type.id === 'ikm'
                                                ? data.enable_ikm
                                                : type.id === 'sloi'
                                                  ? data.enable_sloi
                                                  : data.enable_sroi
                                        }
                                        onChange={(checked) =>
                                            handleAssessmentTypeChange(
                                                type.id,
                                                checked,
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-8 py-6">
                        <button
                            onClick={handleCancel}
                            className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                        >
                            Batal
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-slate-400">
                                Semua progress disimpan sebagai draft
                            </span>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="flex items-center gap-2 rounded-lg bg-primary-btn px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-btn/20 transition-all hover:bg-primary-btn-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    'Menyimpan...'
                                ) : (
                                    <>
                                        Simpan Proyek
                                        <Icon name="save" className="text-sm" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <p className="mt-8 text-center text-xs text-slate-400">
                    Butuh bantuan menyiapkan proyek?{' '}
                    <Link
                        href="#"
                        className="font-bold text-primary hover:underline"
                    >
                        Baca panduan kami
                    </Link>{' '}
                    atau{' '}
                    <Link
                        href="#"
                        className="font-bold text-primary hover:underline"
                    >
                        Hubungi Dukungan
                    </Link>
                </p>
            </div>
        </CompanyLayout>
    );
}

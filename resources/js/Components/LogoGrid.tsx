const allLogos = [
    '1. Pertamina.png',
    '3. Pelindo.png',
    '5. Pegadaian.png',
    '7. Biofarma Group.png',
    '8. Hutama Karya.png',
    '9. Jasa Marga.png',
    '10. Danareksa.png',
    '11. Kilang Pertamina Internasional.png',
    '12. Petrokimia Gresik.jpg',
    '13. Elnusa.png',
    '14. Yayasan BUMN.png',
    '17. Pertamina Gas.png',
    '18. Mandiri Taspen.png',
    '19. Petrogas.png',
    '20. Energi Mega Persada.webp',
    '21. Pama Persada.png',
    '22. Jamkrindo.png',
    '25. IndonesiaRe.png',
    '27. Jasa Raharja.png',
    '29. Waskita.png',
    'Angkasa Pura II.png',
    'BNSP.png',
    'Baitulmaal Muamalat.png',
    'Berkah Mesin Angkat.jpg',
    'Cempaka Foundation.png',
    'ENRG.webp',
    'Hasnur Centre.png',
    'Hoshizora Foundation.webp',
    'Intim Mining Sentosa.jpeg',
    'Kalla.jpg',
    'Krakatau Sarana Infrastruktur.png',
    'LOGO-PG-AGRO.jpeg',
    'Laznas IZI.png',
    'Logo BAG.jpg',
    'Logo-REI-80x320-4.png',
    'LogoPLNIP.png',
    'Logo_PT_ANJ.png',
    'Lotte-Chemical-Titan.png',
    'Merdeka Tsingshan Indonesia.png',
    'Mitra Berdaya Edukasi.png',
    'PLN Energi Primer Indonesia.png',
    'PLN Icon Plus.png',
    'PT-Dizamatra-Powerindo-02.jpg',
    'Pertamina Gas Negara.png',
    'Pertamina Patra Niaga.png',
    'Pupuk Kaltim.png',
    'Rainforest Alliance.png',
    'ansaf-logo.png',
    'cropped-ASA-Media-logo-10.png',
    'cropped-LOGO-YBM-BRILIAN-FIX-LAST-01.png',
    'human initiative.png',
    'inalum.png',
    'ipcc-logo-2.png',
    'logo-pertagas.png',
    'logo_OK_harita_2.png',
    'logo_gam_bg.png',
    'logo_ttl.png',
    'mineral alam abadi.png',
    'pt_berdikari_persero_logo.jpg',
    'pt_phoenix_resources_international_logo.jpg',
    'pt_trimata_benua_logo.jpg',
    'ptperusahaan_perdagangan_indonesia_persero__logo.jpg',
    'rumahzakat.webp',
    'scm-logo.jpg',
    'sosltice_banner.webp',
    'Logo J Resources.avif',
    '1702351325383.jpg',
    '1744301641123.jpg',
    '1758697093964.jpg',
    'WhatsApp_Image_2022-08-08_at_10.50.19-removebg-preview.png',
    'logo.png',
    'img-main-logo.png',
    'ASDP_logo_2023.svg',
];

const chunkSize = Math.ceil(allLogos.length / 4);
const rows = [
    allLogos.slice(0, chunkSize),
    allLogos.slice(chunkSize, chunkSize * 2),
    allLogos.slice(chunkSize * 2, chunkSize * 3),
    allLogos.slice(chunkSize * 3),
];

const speeds = ['60s', '70s', '55s', '65s'];

export default function LogoGrid() {
    return (
        <section className="mt-16 w-full border-t border-[#f0f4f2] bg-white py-16">
            <h3 className="mb-10 text-center text-2xl font-bold uppercase tracking-widest">
                Dipercaya oleh Perusahaan
            </h3>

            <div className="relative w-full overflow-hidden">
                {/* Fade edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

                <div className="flex flex-col gap-12">
                    {rows.map((rowLogos, rowIndex) => {
                        const isReverse = rowIndex % 2 === 1;
                        const speed = speeds[rowIndex];

                        return (
                            <div
                                key={rowIndex}
                                className="marquee-track flex w-max"
                                style={{
                                    animationDuration: speed,
                                    animationDirection: isReverse
                                        ? 'reverse'
                                        : 'normal',
                                }}
                            >
                                {[...rowLogos, ...rowLogos].map(
                                    (logo, index) => (
                                        <div
                                            key={index}
                                            className="mx-6 flex h-12 flex-shrink-0 items-center justify-center transition-all duration-300"
                                        >
                                            <img
                                                src={`/img/mitra-baru/${encodeURIComponent(logo)}`}
                                                alt={logo
                                                    .replace(/\.[^.]+$/, '')
                                                    .replace(/^\d+\.\s*/, '')}
                                                className="h-full w-auto object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track {
                    animation: marquee 30s linear infinite;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}

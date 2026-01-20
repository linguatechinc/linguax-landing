
import React from 'react';
import { useTranslation } from 'react-i18next';

const companies = [
    'TechCorp',
    'Innovate Inc.',
    'QuantumLeap',
    'NextGen Solutions',
    'Apex Enterprises',
    'Stellar Dynamics'
];

const TrustedBy: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wider">
                    {t('trustedBy.title')}
                </h2>
                <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
                    {companies.map((company) => (
                        <div key={company} className="col-span-1 flex justify-center items-center">
                            <span className="text-gray-400 font-bold text-xl filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
                                {company}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;
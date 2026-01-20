
import React from 'react';
import { useTranslation } from 'react-i18next';

const HowItWorks: React.FC = () => {
    const { t } = useTranslation();

    const steps = [
        {
            number: '01',
            title: t('howItWorks.step1.title'),
            description: t('howItWorks.step1.description')
        },
        {
            number: '02',
            title: t('howItWorks.step2.title'),
            description: t('howItWorks.step2.description')
        },
        {
            number: '03',
            title: t('howItWorks.step3.title'),
            description: t('howItWorks.step3.description')
        }
    ];

    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{t('howItWorks.title')}</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        {t('howItWorks.subtitle')}
                    </p>
                </div>
                <div className="mt-16 relative">
                     <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent hidden md:block" aria-hidden="true"></div>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start">
                                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-blue-500">{step.number}</span>
                                </div>
                                <h3 className="mt-4 text-2xl font-bold text-white">{step.title}</h3>
                                <p className="mt-2 text-base text-gray-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
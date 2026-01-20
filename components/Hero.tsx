
import React from 'react';
import { useTranslation } from 'react-i18next';

const VoiceWave: React.FC = () => (
    <div className="relative w-full max-w-2xl mx-auto h-48 flex items-center justify-center">
        <div className="absolute w-full h-px bg-violet-500/30 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0">
            <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
            </defs>
            <path
                d="M 0 100 C 50 50, 150 150, 200 100 S 250 50, 300 100 S 350 150, 400 100 S 450 50, 500 100 S 550 150, 600 100 S 650 50, 700 100 S 750 150, 800 100"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="2"
                className="opacity-70 animate-[wave_6s_linear_infinite]"
            >
            </path>
             <path
                d="M 0 100 C 50 150, 150 50, 200 100 S 250 150, 300 100 S 350 50, 400 100 S 450 150, 500 100 S 550 50, 600 100 S 650 150, 700 100 S 750 50, 800 100"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="1"
                className="opacity-40 animate-[wave_8s_linear_infinite_reverse]"
            >
            </path>
        </svg>
        <style>{`
            @keyframes wave {
                from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
                to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
            }
        `}</style>
    </div>
);

interface HeroProps {
    onOpenModal: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
    const { t } = useTranslation();

    return (
        <section className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">
                    {t('hero.title')}
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
                    {t('hero.subtitle')}
                </p>
                <div className="mt-10 flex justify-center">
                    <button
                        onClick={onOpenModal}
                        className="bg-violet-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all duration-300 transform hover:scale-105"
                    >
                        {t('hero.cta')}
                    </button>
                </div>
                <div className="mt-15">
                    <VoiceWave />
                </div>
            </div>
        </section>
    );
};

export default Hero;
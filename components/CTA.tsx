
import React from 'react';

const CTA: React.FC = () => {
    return (
        <section className="py-24 bg-[#0A0A12]/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    ¿Listo para redefinir la comunicación de su empresa?
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-400">
                    Hable con un especialista para descubrir cómo LinguaX puede impactar su ROI y llevar a su equipo al siguiente nivel.
                </p>
                <div className="mt-10">
                    <a
                        href="https://wa.me/34613476568?text=Hola,%20me%20gustaría%20solicitar%20una%20demo%20de%20LinguaX."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-violet-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Agendar Demo Estratégica
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTA;
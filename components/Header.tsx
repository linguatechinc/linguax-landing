
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-between items-center">
                    <div className="text-3xl font-extrabold tracking-tight">
                        Lingua<span className="text-violet-500">X</span>
                    </div>
                     <a
                        href="https://wa.me/34613476568?text=Hola,%20me%20gustaría%20solicitar%20una%20demo%20de%20LinguaX."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-block bg-transparent border border-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                    >
                        Contactar
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
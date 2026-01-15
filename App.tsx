
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';

const App: React.FC = () => {
    return (
        <div className="bg-[#05050A] text-white overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-violet-900/40 rounded-full filter blur-[150px] opacity-60"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-900/40 rounded-full filter blur-[150px] opacity-60"></div>
            </div>
            <div className="relative z-10">
                <Header />
                <main>
                    <Hero />
                    <TrustedBy />
                    <Features />
                    <HowItWorks />
                    <CTA />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;

import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        className={className}
        viewBox="0 0 36 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LinguaX Logo"
    >
        <defs>
            <linearGradient id="logoGradient" x1="4" y1="12" x2="32" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6"/>
                <stop offset="1" stopColor="#3B82F6"/>
            </linearGradient>
        </defs>
        <path 
            d="M4 4V20H12" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M4 12C12 4, 24 20, 32 12" 
            stroke="url(#logoGradient)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
        />
    </svg>
);

export default Logo;

import React from 'react';

const NeoPanel = ({ children, className = '', reverseColor = false, disableHover = false }) => {
    const panelClass = reverseColor ? 'neo-panel-reverse' : 'neo-panel';
    // If hover is disabled, we strip out the transition and hover translation classes
    // The base neo-panel class has hover effects configured in CSS, so we override inline if disabled.

    return (
        <div
            className={`${panelClass} ${className} relative overflow-hidden`}
            style={disableHover ? { transform: 'none' } : {}}
        >
            {/* Subtle grid background pattern typical in neo-brutalism */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            ></div>

            <div className="relative z-10 w-full h-full p-4 md:p-6">
                {children}
            </div>
        </div>
    );
};

export default NeoPanel;

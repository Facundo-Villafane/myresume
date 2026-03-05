import React from 'react';

const NeoProjectCard = ({ children, title, className = '' }) => {
    return (
        <div className={`neo-panel p-0 flex flex-col bg-neo-bg ${className}`}>

            {/* Title Header Block */}
            <div className="bg-neo-accent border-b-2 border-neo-border p-2">
                {title && (
                    <h2 className="text-neo-bg font-black text-sm md:text-base uppercase tracking-tighter truncate leading-none">
                        {title}
                    </h2>
                )}
            </div>

            {/* Screen/Content Area */}
            <div className="relative flex-grow bg-neo-panel p-2 overflow-y-auto text-white font-mono">
                {children}
            </div>

        </div>
    );
};

export default NeoProjectCard;

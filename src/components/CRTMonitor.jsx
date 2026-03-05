import React from 'react';
import { motion } from 'framer-motion';

const CRTMonitor = ({ children, title, className = '' }) => {
    return (
        <div className={`p-4 bg-metal-base rounded-2xl shadow-panel-outset border-2 border-metal-dark flex flex-col ${className}`}>
            {/* Title / Brand */}
            {title && (
                <div className="text-center text-xs text-gray-400 font-bold tracking-widest uppercase mb-3">
                    {title}
                </div>
            )}

            {/* Screen Bezel */}
            <div className="relative flex-grow bg-black rounded-xl p-2 shadow-panel-inset border-[6px] border-[#1a1c20]">

                {/* The Screen itself */}
                <div className="relative w-full h-full bg-[#0a100d] rounded-lg overflow-hidden flex flex-col filter contrast-125 brightness-110">

                    {/* Content layer */}
                    <div className="relative z-10 p-4 w-full h-full overflow-y-auto text-phosphor-green font-mono shadow-crt-glow">
                        {children}
                    </div>

                    {/* Scanlines overlay */}
                    <div className="absolute inset-0 crt-scanlines z-20 pointer-events-none opacity-[0.15]"></div>

                    {/* Vignette effect */}
                    <div className="absolute inset-0 z-30 pointer-events-none" style={{
                        background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.85) 100%)'
                    }}></div>

                    {/* Slight flickering for CRT realism */}
                    <motion.div
                        className="absolute inset-0 z-40 bg-white pointer-events-none"
                        animate={{ opacity: [0.01, 0.03, 0.01, 0.02, 0.01] }}
                        transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                        style={{ mixBlendMode: 'overlay' }}
                    />

                    {/* Curved glass reflection */}
                    <div
                        className="absolute inset-0 z-50 pointer-events-none rounded-lg"
                        style={{
                            background: 'linear-gradient(105deg, rgba(255,255,255,0.06) 0%, transparent 40%)'
                        }}
                    />
                </div>
            </div>

            {/* Monitor Controls (Knobs / Buttons) */}
            <div className="mt-4 flex justify-end items-center gap-3 px-2">
                <div className="w-3 h-3 rounded-full bg-metal-light shadow-panel-outset cursor-pointer active:shadow-panel-inset"></div>
                <div className="w-3 h-3 rounded-full bg-metal-light shadow-panel-outset cursor-pointer active:shadow-panel-inset"></div>
                <div className="w-4 h-4 rounded-full bg-metal-dark shadow-panel-inset relative ml-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-led-green led-glow-green"></div>
                </div>
            </div>
        </div>
    );
};

export default CRTMonitor;

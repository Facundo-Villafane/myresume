import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InteractiveKnob = ({ onChange, initialValue = 0 }) => {
    const [rotation, setRotation] = useState(initialValue);

    const handleClick = () => {
        // Simple toggle for aesthetic purposes, rotating 45deg each click
        const newRotation = rotation + 45;
        setRotation(newRotation);
        if (onChange) onChange(newRotation);
    };

    return (
        <div className="relative w-12 h-12 rounded-full bg-metal-base shadow-[inset_1px_1px_5px_rgba(0,0,0,0.5),0_0_0_2px_#1b1e22] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.05)] pointer-events-none"></div>

            {/* Ticks around the knob */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-[2px] h-1.5 bg-black/60 rounded-full"
                    style={{ transform: `rotate(${i * 45}deg) translateY(-8px)` }}
                />
            ))}

            {/* The rotating knob */}
            <motion.div
                className="w-8 h-8 rounded-full bg-metal-dark shadow-panel-outset relative cursor-pointer active:scale-95"
                animate={{ rotate: rotation }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={handleClick}
                style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #3b424d, #1b1e22)' }}
            >
                {/* Indicator dot */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]"></div>
                {/* Ribbed texture */}
                <div className="absolute inset-x-1 inset-y-1 rounded-full border border-black/30 pointer-events-none" style={{
                    background: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(0,0,0,0.2) 10deg 20deg)'
                }}></div>
            </motion.div>
        </div>
    );
};

export default InteractiveKnob;

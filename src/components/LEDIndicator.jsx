import React from 'react';

const LEDIndicator = ({ color = 'green', on = true, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const getStyle = () => {
        if (!on) return 'bg-metal-dark shadow-panel-inset';
        switch (color) {
            case 'red': return 'bg-led-red led-glow-red';
            case 'yellow': return 'bg-led-yellow led-glow-yellow';
            case 'green':
            default: return 'bg-led-green led-glow-green';
        }
    };

    return (
        <div className={`rounded-full border border-black/60 shadow-md ${sizeClasses[size]} ${getStyle()} ${className}`} />
    );
};

export default LEDIndicator;

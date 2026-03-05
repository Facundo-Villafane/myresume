import React from 'react';

const SkeuoPanel = ({ children, className = '', inset = false }) => {
  return (
    <div
      className={`
        bg-metal-base rounded-lg border border-metal-light relative
        ${inset ? 'shadow-panel-inset' : 'shadow-panel-outset'}
        ${className}
      `}
    >
      {/* Decorative Screws/Rivets */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-metal-dark shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.1)]">
        <div className="w-full h-[1px] bg-black/60 absolute top-1/2 left-0 transform -translate-y-1/2 rotate-45"></div>
      </div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-metal-dark shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.1)]">
        <div className="w-full h-[1px] bg-black/60 absolute top-1/2 left-0 transform -translate-y-1/2 -rotate-12"></div>
      </div>
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-metal-dark shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.1)]">
        <div className="w-full h-[1px] bg-black/60 absolute top-1/2 left-0 transform -translate-y-1/2 rotate-90"></div>
      </div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-metal-dark shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.1)]">
        <div className="w-full h-[1px] bg-black/60 absolute top-1/2 left-0 transform -translate-y-1/2 rotate-[120deg]"></div>
      </div>

      <div className="p-4 relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default SkeuoPanel;

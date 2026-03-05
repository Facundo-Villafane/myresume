import React from 'react';

const Cartridge = ({ title, company, duration, location, type = "EXP" }) => {
    return (
        <div className="flex border-2 border-neo-border bg-neo-panel neo-shadow-hover hover:translate-x-1 hover:-translate-y-1 transition-transform mb-3 w-full max-w-3xl">

            {/* Heavy left accent block */}
            <div className="w-8 md:w-10 bg-neo-accent border-r-2 border-neo-border flex items-center justify-center p-1">
                <span className="text-neo-bg font-black text-xs md:text-sm -rotate-90 tracking-widest">{type}</span>
            </div>

            {/* Content Area */}
            <div className="flex-grow p-2 md:p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                        <h3 className="text-white font-black text-sm md:text-base uppercase leading-none mb-1 neo-text-shadow">
                            {title}
                        </h3>
                        <p className="text-neo-accent font-bold text-xs uppercase tracking-widest">{company}</p>
                    </div>

                    {/* Brutalist Date Badge */}
                    <div className="border border-neo-border bg-black px-1.5 py-0.5 flex-shrink-0">
                        <span className="text-white text-[10px] md:text-xs font-mono font-bold uppercase">{duration}</span>
                    </div>
                </div>

                {location && (
                    <div className="mt-2 text-gray-400 font-mono text-[10px] md:text-xs uppercase tracking-wider">
                        [{location}]
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cartridge;


import React from 'react';
import { AiSamarthLogo, LOGO_CSF, LOGO_CHRYSALIS, LOGO_IITM, LOGO_WSAI } from './Branding';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 h-14 md:h-16 flex-none z-30 relative shadow-sm shrink-0">
      <div className="max-w-7xl mx-auto px-2 md:px-4 h-full flex items-center justify-between gap-1 md:gap-4">
        
        {/* Main Brand */}
        <div className="flex items-center shrink-0">
           <div className="h-6 xs:h-7 md:h-10 w-auto" title="AI Samarth Home">
              <AiSamarthLogo />
           </div>
        </div>
        
        {/* Partner Logos - All 4 logos visible on all screens */}
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-6">
           <img src={LOGO_CSF} alt="CSF" className="h-3.5 xs:h-5 md:h-8 lg:h-9 object-contain" />
           
           <div className="h-3 md:h-6 w-px bg-slate-200"></div>
           
           <img src={LOGO_CHRYSALIS} alt="Chrysalis" className="h-3 xs:h-4 md:h-6 lg:h-8 object-contain" />
           
           <div className="h-3 md:h-6 w-px bg-slate-200"></div>
           
           <img src={LOGO_IITM} alt="IIT Madras" className="h-3.5 xs:h-5 md:h-8 lg:h-9 object-contain" />
           
           <div className="h-3 md:h-6 w-px bg-slate-200"></div>
           
           <img src={LOGO_WSAI} alt="WSAI" className="h-3 xs:h-4 md:h-6 lg:h-7 object-contain" />
        </div>

      </div>
    </header>
  );
};

import React from 'react';
import { Printer } from 'lucide-react';

const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <button 
      onClick={handlePrint}
      className="text-[10px] uppercase font-mono text-gray-500 hover:text-[#00f0ff] flex items-center gap-1 transition-colors"
      title="Print Protocol"
    >
      <Printer className="w-3 h-3" /> Print / Save PDF
    </button>
  );
};

export default PrintButton;

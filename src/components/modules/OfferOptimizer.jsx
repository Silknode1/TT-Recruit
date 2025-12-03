import React, { useState, useMemo } from 'react';
import { Cpu, ChevronUp, ChevronDown } from 'lucide-react';
import ThreePieChart from '../3d/ThreePieChart';

const OfferOptimizer = () => {
  const [values, setValues] = useState({ base: 180000, equity: 400000, signOn: 25000, bonus: 15 });

  const chartData = useMemo(() => {
      const year1Equity = values.equity / 4;
      const year1Bonus = values.base * (values.bonus / 100);
      return {
          "Base Salary": values.base,
          "Yearly Equity": year1Equity,
          "Sign-On": values.signOn,
          "Yearly Bonus": year1Bonus
      };
  }, [values.base, values.equity, values.signOn, values.bonus]);

  const totalYear1 = values.base + (values.equity / 4) + values.signOn + (values.base * (values.bonus / 100));

  const update = (key, delta) => setValues(prev => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  
  const handleInputChange = (key, valueStr) => {
    const numericValue = parseInt(valueStr.replace(/[^0-9]/g, ''), 10);
    setValues(prev => ({
        ...prev,
        [key]: isNaN(numericValue) ? 0 : numericValue
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 h-full animate-in fade-in duration-500">
        <div className="flex flex-col gap-6">
            <div className="bg-[#0d0d0d] border border-[#222] p-6 h-full flex flex-col justify-center">
                <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Compensation Configuration
                </h2>
                <div className="space-y-8">
                    {[
                        { key: 'base', label: 'Base Salary', step: 1000 },
                        { key: 'equity', label: 'Total Equity (4yr)', step: 5000 },
                        { key: 'signOn', label: 'Sign-On Bonus', step: 1000 },
                    ].map((field) => (
                        <div key={field.key} className="flex items-center justify-between group">
                            <label className="text-xs uppercase text-gray-500 font-mono w-32">{field.label}</label>
                            <div className="flex items-center gap-2 flex-1">
                                <button onClick={() => update(field.key, -field.step)} className="bg-[#111] text-gray-400 hover:text-white p-2 border border-[#333] hover:border-[#00f0ff] transition-colors"><ChevronDown className="w-3 h-3"/></button>
                                <input 
                                    type="text" 
                                    value={values[field.key].toLocaleString()} 
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    className="flex-1 bg-[#050505] border border-[#222] p-2 text-right text-white font-mono outline-none focus:border-[#00f0ff] transition-colors"
                                />
                                <button onClick={() => update(field.key, field.step)} className="bg-[#111] text-gray-400 hover:text-white p-2 border border-[#333] hover:border-[#00f0ff] transition-colors"><ChevronUp className="w-3 h-3"/></button>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-between group">
                            <label className="text-xs uppercase text-gray-500 font-mono w-32">Annual Bonus %</label>
                            <div className="flex items-center gap-2 flex-1">
                                <button onClick={() => update('bonus', -1)} className="bg-[#111] text-gray-400 hover:text-white p-2 border border-[#333] hover:border-[#00f0ff]"><ChevronDown className="w-3 h-3"/></button>
                                <input 
                                    type="text" 
                                    value={values.bonus} 
                                    onChange={(e) => handleInputChange('bonus', e.target.value)}
                                    className="flex-1 bg-[#050505] border border-[#222] p-2 text-right text-white font-mono outline-none focus:border-[#00f0ff] transition-colors"
                                />
                                <button onClick={() => update('bonus', 1)} className="bg-[#111] text-gray-400 hover:text-white p-2 border border-[#333] hover:border-[#00f0ff]"><ChevronUp className="w-3 h-3"/></button>
                            </div>
                        </div>
                </div>
                
                <div className="mt-12 border-t border-[#222] pt-6">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-500 text-xs font-mono uppercase">Total Year 1 Comp</span>
                        <span className="text-3xl text-[#00f0ff] font-bold font-mono tracking-tighter">
                            ${totalYear1.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-[#0d0d0d] border border-[#222] p-6 relative flex flex-col justify-center"> 
            <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="w-2 h-2 bg-[#00f0ff] rounded-full inline-block animate-pulse"></span>
                <span className="text-[10px] text-gray-500 uppercase font-mono">Visualization Module Active</span>
            </div>
            
            <div className="w-full flex justify-center py-8"> 
                <ThreePieChart data={chartData} />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-auto">
                <div className="text-center p-2 border border-[#222]">
                    <div className="text-[10px] text-gray-500 uppercase font-mono">Market P50</div>
                    <div className="text-white font-mono">$380,000</div>
                </div>
                <div className="text-center p-2 border border-[#222]">
                    <div className="text-[10px] text-gray-500 uppercase font-mono">Delta</div>
                    <div className="text-green-500 font-mono">+{(totalYear1 - 380000) > 0 ? '+' : ''}${(totalYear1 - 380000).toLocaleString()}</div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default OfferOptimizer;

import React, { useState } from 'react';
import { Loader2, MessageSquare, Sliders, CheckSquare } from 'lucide-react';
import PrintButton from '../PrintButton';
import { callGemini } from '../../utils/geminiApi';

const CommunicationBuilder = ({ setActiveTab }) => {
    const [context, setContext] = useState('');
    const [tone, setTone] = useState(50);
    const [witty, setWitty] = useState(false);
    const [output, setOutput] = useState('');
    const [generating, setGenerating] = useState(false);

    const generateEmail = async () => {
        setGenerating(true);
        const toneDesc = tone < 30 ? "Very Casual, almost slack-like" : tone > 70 ? "Highly Formal and Corporate" : "Balanced Professional";
        const witDesc = witty ? "Include clever, subtle wit/humor." : "No humor. Strictly business.";
        
        const sys = `Write a recruiting email/message. Tone: ${toneDesc}. Style: ${witDesc}. Keep it concise.`;
        try {
            const res = await callGemini(context, sys);
            setOutput(res);
        } catch(e) { 
            if (e.message === "MISSING_KEY") {
                alert("ACCESS DENIED: Please enter your API Key in System Settings.");
                setActiveTab('settings');
            } else {
                setOutput(e.message);
            }
        }
        setGenerating(false);
    };

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="bg-[#0d0d0d] border border-[#222] p-6 flex flex-col gap-6">
                <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Message Parameters
                </h2>
                
                <textarea 
                    value={context} onChange={e => setContext(e.target.value)}
                    className="flex-1 bg-[#080808] border border-[#333] p-4 text-sm text-white font-mono focus:border-[#00f0ff] outline-none resize-none"
                    placeholder="Describe the message (e.g. 'Cold outreach to a Sr. Engineer at NVIDIA about a remote role...')"
                />
                
                <div className="space-y-4 bg-[#111] p-4 border border-[#222]">
                    <div>
                        <div className="flex justify-between text-[10px] uppercase font-mono text-gray-500 mb-2">
                            <span>Casual</span>
                            <span className="text-[#00f0ff]">Tone: {tone}%</span>
                            <span>Formal</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" value={tone} onChange={e => setTone(e.target.value)}
                            className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                        />
                    </div>
                    
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border ${witty ? 'bg-[#00f0ff] border-[#00f0ff]' : 'border-gray-500'} flex items-center justify-center transition-colors`}>
                            {witty && <CheckSquare className="w-3 h-3 text-black" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={witty} onChange={() => setWitty(!witty)} />
                        <span className="text-xs uppercase font-mono text-gray-400 group-hover:text-white">Enable Witty/Clever Remarks</span>
                    </label>
                </div>

                <button onClick={generateEmail} disabled={generating} className="bg-[#00f0ff] text-black font-bold uppercase text-sm py-3 hover:bg-white transition-all tracking-widest">
                    {generating ? 'Synthesizing...' : 'Generate Communication'}
                </button>
            </div>

            <div className="bg-[#0d0d0d] border border-[#222] p-6 relative">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Output Preview
                    </h2>
                    {output && <PrintButton />}
                 </div>
                <div className="h-[calc(100%-2rem)] bg-[#050505] p-6 border border-[#222] font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar">
                    {output || <span className="opacity-30 italic">Ready for input...</span>}
                </div>
            </div>
        </div>
    );
};

export default CommunicationBuilder;

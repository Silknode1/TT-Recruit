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
        } catch (e) {
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
            <div className="bg-[#0d0d0d] border border-[#333] p-6 flex flex-col gap-6 group hover:border-[#00f0ff]/30 transition-colors">
                <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Message Parameters
                </h2>

                <textarea
                    value={context} onChange={e => setContext(e.target.value)}
                    className="flex-1 bg-[#050505] border border-[#333] p-4 text-sm text-white font-mono focus:border-[#00f0ff] outline-none resize-none transition-all placeholder:text-gray-700 leading-relaxed"
                    placeholder="// Describe message context (e.g. 'Cold outreach to a Sr. Engineer at NVIDIA about a remote role...')"
                />

                <div className="space-y-4 bg-[#050505] p-4 border border-[#333]">
                    <div>
                        <div className="flex justify-between text-[10px] uppercase font-mono text-[#888] mb-3">
                            <span>Casual</span>
                            <span className="text-[#00f0ff]">Tone: {tone}%</span>
                            <span>Formal</span>
                        </div>
                        <input
                            type="range" min="0" max="100" value={tone} onChange={e => setTone(e.target.value)}
                            className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group/check">
                        <div className={`w-4 h-4 border ${witty ? 'bg-[#00f0ff] border-[#00f0ff]' : 'border-[#333] bg-[#111]'} flex items-center justify-center transition-colors`}>
                            {witty && <CheckSquare className="w-3 h-3 text-black" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={witty} onChange={() => setWitty(!witty)} />
                        <span className="text-xs uppercase font-mono text-gray-400 group-hover/check:text-white transition-colors">Enable Witty/Clever Remarks</span>
                    </label>
                </div>

                <button
                    onClick={generateEmail}
                    disabled={generating}
                    className="bg-[#111] border border-[#333] text-[#00f0ff] font-bold uppercase text-xs py-4 hover:bg-[#00f0ff] hover:text-black transition-all tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {generating ? <Loader2 className="animate-spin w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    {generating ? 'Synthesizing...' : 'Generate Communication'}
                </button>
            </div>

            <div className="bg-[#0d0d0d] border border-[#333] p-1 flex flex-col relative group hover:border-[#00f0ff]/30 transition-colors">
                <div className="bg-[#111] px-4 py-3 border-b border-[#333] flex justify-between items-center">
                    <h2 className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Output Preview
                    </h2>
                    {output && <PrintButton />}
                </div>
                <div className="flex-1 bg-[#050505] p-6 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar">
                    {output || <div className="flex flex-col items-center justify-center h-full text-[#333] gap-2">
                        <MessageSquare className="w-8 h-8 opacity-20" />
                        <span className="text-xs uppercase tracking-widest">Ready for input</span>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default CommunicationBuilder;

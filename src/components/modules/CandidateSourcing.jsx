import React, { useState } from 'react';
import { Loader2, Search, Code } from 'lucide-react';
import { callGemini } from '../../utils/geminiApi';

const CandidateSourcing = ({ setActiveTab }) => {
    const [queryData, setQueryData] = useState({ role: '', stack: '' });
    const [matrix, setMatrix] = useState(null);
    const [loading, setLoading] = useState(false);
    const [boolInput, setBoolInput] = useState('');
    const [boolOutput, setBoolOutput] = useState('');
    const [boolLoading, setBoolLoading] = useState(false);

    const generateMatrix = async () => {
        setLoading(true);
        const sys = "Generate a JSON-like structure (but just Markdown text) of sourcing channels. List 3 specific Communities (Github repos, subreddits, forums) and 3 Boolean Strings. Tone: Data-only.";
        const prompt = `Role: ${queryData.role}, Stack: ${queryData.stack}. Create a Search Matrix.`;
        try {
            const res = await callGemini(prompt, sys);
            setMatrix(res);
        } catch(e) { 
            if (e.message === "MISSING_KEY") {
                alert("ACCESS DENIED: Please enter your API Key in System Settings.");
                setActiveTab('settings');
            } else {
                setMatrix('Error: ' + e.message);
            }
        }
        setLoading(false);
    };

    const generateBoolean = async () => {
        if (!boolInput) return;
        setBoolLoading(true);
        const sys = "You are a Boolean Search Logic compiler. Convert the user's natural language description into a complex, error-free Boolean string for LinkedIn Recruiter and Google X-Ray. Use standard operators: AND, OR, NOT, (). Group synonymous terms in parentheses. Output ONLY the boolean string, nothing else.";
        try {
            const res = await callGemini(boolInput, sys);
            setBoolOutput(res);
        } catch(e) { 
            if (e.message === "MISSING_KEY") {
                alert("ACCESS DENIED: Please enter your API Key in System Settings.");
                setActiveTab('settings');
            } else {
                setBoolOutput('Error: ' + e.message);
            }
        }
        setBoolLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="bg-[#0d0d0d] border border-[#222] p-6 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="text-[10px] uppercase text-gray-500 font-mono">Target Role</label>
                    <input 
                        value={queryData.role} onChange={e => setQueryData({...queryData, role: e.target.value})}
                        className="w-full bg-[#050505] border border-[#333] p-2 text-sm text-white font-mono focus:border-[#00f0ff] outline-none" 
                        placeholder="e.g. Kernel Engineer"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-[10px] uppercase text-gray-500 font-mono">Core Stack</label>
                    <input 
                        value={queryData.stack} onChange={e => setQueryData({...queryData, stack: e.target.value})}
                        className="w-full bg-[#050505] border border-[#333] p-2 text-sm text-white font-mono focus:border-[#00f0ff] outline-none" 
                        placeholder="e.g. Rust, Linux, eBPF"
                    />
                </div>
                <button onClick={generateMatrix} disabled={loading} className="bg-[#00f0ff] text-black font-bold uppercase text-xs px-6 py-3 hover:bg-white transition-colors">
                    {loading ? <Loader2 className="animate-spin w-4 h-4"/> : 'Scan Matrix'}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#050505] border border-[#222] relative p-6 overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 bg-[#00f0ff] text-black text-[10px] font-bold px-2 py-1 font-mono uppercase">Search Matrix Result</div>
                    <div className="mt-6 font-mono text-sm text-gray-300 whitespace-pre-wrap flex-1 overflow-y-auto custom-scrollbar">
                        {matrix ? matrix : <div className="flex items-center justify-center h-full text-gray-600 uppercase tracking-widest">No Matrix Generated</div>}
                    </div>
                </div>

                <div className="bg-[#0d0d0d] border border-[#222] p-6 flex flex-col">
                     <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Code className="w-4 h-4" /> Boolean Architect
                    </h2>
                    <textarea 
                        value={boolInput}
                        onChange={(e) => setBoolInput(e.target.value)}
                        placeholder="Describe your ideal candidate in plain English (e.g. 'Java devs in Berlin who know Payments but NOT crypto...')"
                        className="w-full h-24 bg-[#080808] border border-[#333] p-3 text-xs font-mono text-white mb-4 focus:border-[#00f0ff] outline-none resize-none"
                    />
                    <button 
                        onClick={generateBoolean}
                        disabled={boolLoading}
                        className="w-full bg-[#111] border border-[#333] hover:border-[#00f0ff] text-[#00f0ff] py-2 text-xs font-bold uppercase tracking-widest mb-4 transition-all"
                    >
                        {boolLoading ? 'Compiling Logic...' : 'Compile Boolean String'}
                    </button>
                    
                    <div className="flex-1 bg-[#050505] border border-[#222] p-4 relative group">
                        <span className="absolute top-2 right-2 text-[10px] text-gray-600 uppercase">Output</span>
                        <div className="font-mono text-xs text-green-500 break-words">
                            {boolOutput || <span className="text-gray-700 italic">Ready to compile...</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateSourcing;

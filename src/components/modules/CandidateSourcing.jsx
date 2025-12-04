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
        } catch (e) {
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
        } catch (e) {
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
            <div className="bg-[#0d0d0d] border border-[#333] p-6 flex gap-4 items-end group hover:border-[#00f0ff]/30 transition-colors">
                <div className="flex-1">
                    <label className="text-[10px] uppercase text-[#888] font-mono mb-2 block">Target Role</label>
                    <input
                        value={queryData.role} onChange={e => setQueryData({ ...queryData, role: e.target.value })}
                        className="w-full bg-[#050505] border border-[#333] p-3 text-sm text-white font-mono focus:border-[#00f0ff] outline-none transition-all placeholder:text-gray-700"
                        placeholder="e.g. Kernel Engineer"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-[10px] uppercase text-[#888] font-mono mb-2 block">Core Stack</label>
                    <input
                        value={queryData.stack} onChange={e => setQueryData({ ...queryData, stack: e.target.value })}
                        className="w-full bg-[#050505] border border-[#333] p-3 text-sm text-white font-mono focus:border-[#00f0ff] outline-none transition-all placeholder:text-gray-700"
                        placeholder="e.g. Rust, Linux, eBPF"
                    />
                </div>
                <button
                    onClick={generateMatrix}
                    disabled={loading}
                    className="bg-[#111] border border-[#333] text-[#00f0ff] font-bold uppercase text-xs px-8 py-3.5 hover:bg-[#00f0ff] hover:text-black transition-all tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                    {loading ? 'Scanning...' : 'Scan Matrix'}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0d0d0d] border border-[#333] relative p-1 overflow-hidden flex flex-col group hover:border-[#00f0ff]/30 transition-colors">
                    <div className="bg-[#111] px-4 py-2 border-b border-[#333] flex justify-between items-center">
                        <span className="text-xs font-mono uppercase text-[#00f0ff] tracking-widest flex items-center gap-2">
                            <Search className="w-3 h-3" /> Search Matrix Result
                        </span>
                    </div>
                    <div className="flex-1 bg-[#050505] p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap overflow-y-auto custom-scrollbar leading-relaxed">
                        {matrix ? matrix : <div className="flex flex-col items-center justify-center h-full text-[#333] gap-2">
                            <Search className="w-8 h-8 opacity-20" />
                            <span className="text-xs uppercase tracking-widest">Awaiting Parameters</span>
                        </div>}
                    </div>
                </div>

                <div className="bg-[#0d0d0d] border border-[#333] p-6 flex flex-col group hover:border-[#00f0ff]/30 transition-colors">
                    <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Code className="w-4 h-4" /> Boolean Architect
                    </h2>
                    <textarea
                        value={boolInput}
                        onChange={(e) => setBoolInput(e.target.value)}
                        placeholder="// Describe ideal candidate logic here..."
                        className="w-full h-32 bg-[#050505] border border-[#333] p-4 text-xs font-mono text-gray-300 mb-4 focus:border-[#00f0ff] outline-none resize-none transition-all placeholder:text-gray-700 leading-relaxed"
                    />
                    <button
                        onClick={generateBoolean}
                        disabled={boolLoading}
                        className="w-full bg-[#111] border border-[#333] hover:border-[#00f0ff] text-[#00f0ff] py-3 text-xs font-bold uppercase tracking-widest mb-6 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {boolLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code className="w-4 h-4" />}
                        {boolLoading ? 'Compiling Logic...' : 'Compile Boolean String'}
                    </button>

                    <div className="flex-1 bg-[#050505] border border-[#333] p-4 relative group">
                        <span className="absolute top-0 right-0 bg-[#111] border-l border-b border-[#333] px-2 py-1 text-[10px] text-[#888] uppercase font-mono">Output Stream</span>
                        <div className="font-mono text-xs text-green-500 break-words pt-4">
                            {boolOutput || <span className="text-[#333] italic">Ready to compile...</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateSourcing;

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Terminal, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { callGemini } from '../../utils/geminiApi';

const InterviewAnalyzer = ({ setActiveTab }) => {
    const [notes, setNotes] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const responseRef = useRef(null);

    // Matrix-style streaming effect
    useEffect(() => {
        if (!analysis) {
            setDisplayedText('');
            return;
        }

        let i = 0;
        const speed = 5; // ms per char
        const interval = setInterval(() => {
            setDisplayedText(analysis.substring(0, i));
            i++;
            if (i > analysis.length) clearInterval(interval);

            // Auto-scroll to bottom
            if (responseRef.current) {
                responseRef.current.scrollTop = responseRef.current.scrollHeight;
            }
        }, speed);

        return () => clearInterval(interval);
    }, [analysis]);

    const analyze = async () => {
        if (!notes.trim()) return;
        setIsAnalyzing(true);
        setAnalysis('');

        const systemPrompt = `
            You are a critical, no-nonsense technical recruiter coach. 
            Analyze the provided interview notes.
            Output your response in a structured, terminal-like format with these sections:
            
            [STATUS]: (PASS / FAIL / WARN) based on the notes.
            
            [COVERAGE_ANALYSIS]
            - List what was covered well.
            - List CRITICAL MISSING AREAS.
            
            [RED_FLAGS]
            - Identify any potential red flags or inconsistencies.
            
            [RECOMMENDED_PROBES]
            - Generate 3-5 specific, deep-dive technical follow-up questions to address the missing areas.
            
            Style: Technical, concise, professional. No fluff.
        `;

        try {
            const result = await callGemini(notes, systemPrompt);
            setAnalysis(result);
        } catch (e) {
            if (e.message === "MISSING_KEY") {
                alert("ACCESS DENIED: Please enter your API Key in System Settings.");
                if (setActiveTab) setActiveTab('settings');
            } else {
                setAnalysis(`[ERROR]: Analysis sequence failed.\nDetails: ${e.message}`);
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in duration-500">
            {/* Input Section */}
            <div className="flex-1 bg-[#0d0d0d] border border-[#333] flex flex-col group hover:border-[#00f0ff]/30 transition-colors">
                <div className="bg-[#111] px-4 py-3 border-b border-[#333] flex justify-between items-center">
                    <span className="text-xs font-mono uppercase text-[#00f0ff] tracking-widest flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> Input Stream // Raw Notes
                    </span>
                    {isAnalyzing && <Loader2 className="w-3 h-3 animate-spin text-[#00f0ff]" />}
                </div>
                <textarea
                    className="flex-1 bg-[#050505] text-gray-300 font-mono text-xs p-4 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                    placeholder="// PASTE RAW INTERVIEW NOTES HERE FOR ANALYSIS..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    spellCheck="false"
                />
                <button
                    onClick={analyze}
                    disabled={isAnalyzing || !notes.trim()}
                    className="bg-[#111] hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] font-bold uppercase text-xs py-4 border-t border-[#333] transition-all tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? <><Loader2 className="w-3 h-3 animate-spin" /> Processing Signal...</> : <><Zap className="w-3 h-3" /> Initiate Analysis</>}
                </button>
            </div>

            {/* Output Section */}
            <div className="flex-1 bg-[#0d0d0d] border border-[#333] flex flex-col relative overflow-hidden">
                <div className="bg-[#111] px-4 py-3 border-b border-[#333] flex justify-between items-center">
                    <span className="text-xs font-mono uppercase text-green-500 tracking-widest flex items-center gap-2">
                        <ArrowRight className="w-3 h-3" /> Output Stream // Feedback
                    </span>
                </div>

                <div
                    ref={responseRef}
                    className="flex-1 bg-[#050505] p-6 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed text-green-500/90 whitespace-pre-wrap"
                >
                    {displayedText || (
                        <div className="h-full flex flex-col items-center justify-center text-[#333] opacity-50">
                            <AlertTriangle className="w-8 h-8 mb-2" />
                            <span>AWAITING DATA STREAM</span>
                        </div>
                    )}
                </div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-1 w-full animate-scanline opacity-20" />
            </div>
        </div>
    );
};

export default InterviewAnalyzer;

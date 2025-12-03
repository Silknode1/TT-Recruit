import React, { useState } from 'react';
import { Loader2, Zap, Scale, FileText } from 'lucide-react';
import PrintButton from '../PrintButton';
import { callGemini } from '../../utils/geminiApi';

const OfferJustification = ({ setActiveTab }) => {
    const [inputs, setInputs] = useState({
        resume: '',
        jobDesc: '',
        scorecards: '',
        strategicNotes: ''
    });
    const [justification, setJustification] = useState('');
    const [generating, setGenerating] = useState(false);

    const generateMemo = async () => {
        setGenerating(true);
        const systemPrompt = `You are a Strategic Talent Advisor. Write a compelling "Offer Justification".
        
        TONE & STYLE:
        - Professional but accessible (15% less formal than a stiff executive memo). 
        - Easy to read, clear, and direct.
        - Refer to candidates by FIRST NAME ONLY. Never use "Dr." or "Ph.D." titles.
        
        GOAL:
        - Clearly explain why this specific role is defined the way it is.
        - Show why this candidate is a good fit.
        - Explain how any technical roadblocks/gaps (like specific coding syntax or tools) will be managed and why they won't be a big deal when they start.

        PROCESS:
        1. ANALYZE: Candidate Resume vs Job Description vs Scorecards.
        2. REFRAME: If there's a disconnect (e.g., Architect applying for RTL role), explain why their actual skills are what the business needs right now.
        3. SYNTHESIZE: Combine notes into a cohesive argument.
        
        Output Format:
        [Headline]
        [Paragraph 1: The Role & Business Need]
        [Paragraph 2: Why [First Name] is the Right Fit]
        [Paragraph 3: Managing Gaps & Risk Mitigation]
        [Final Recommendation]`;

        const userPrompt = `
        CANDIDATE RESUME:
        ${inputs.resume}

        JOB DESCRIPTION:
        ${inputs.jobDesc}

        INTERVIEW SCORECARDS:
        ${inputs.scorecards}

        STRATEGIC NOTES/IMPORTANCE:
        ${inputs.strategicNotes}
        `;

        try {
            const text = await callGemini(userPrompt, systemPrompt);
            setJustification(text);
        } catch(e) {
            if (e.message === "MISSING_KEY") {
                alert("ACCESS DENIED: Please enter your API Key in System Settings.");
                setActiveTab('settings');
            } else {
                setJustification("Error: " + e.message);
            }
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full animate-in fade-in duration-500">
            <div className="bg-[#0d0d0d] border border-[#222] p-6 flex flex-col h-full overflow-hidden">
                <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Justification Matrix
                </h2>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1">Candidate Resume / Summary</label>
                        <textarea 
                            value={inputs.resume} 
                            onChange={e => setInputs({...inputs, resume: e.target.value})} 
                            className="w-full bg-[#151515] border border-[#444] p-3 text-xs text-white focus:border-[#00f0ff] focus:bg-[#222] outline-none font-mono h-32 resize-none transition-colors" 
                            placeholder="Paste resume text here..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1">Job Description</label>
                        <textarea 
                            value={inputs.jobDesc} 
                            onChange={e => setInputs({...inputs, jobDesc: e.target.value})} 
                            className="w-full bg-[#151515] border border-[#444] p-3 text-xs text-white focus:border-[#00f0ff] focus:bg-[#222] outline-none font-mono h-32 resize-none transition-colors" 
                            placeholder="Paste JD here..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1">Interview Scorecards</label>
                        <textarea 
                            value={inputs.scorecards} 
                            onChange={e => setInputs({...inputs, scorecards: e.target.value})} 
                            className="w-full bg-[#151515] border border-[#444] p-3 text-xs text-white focus:border-[#00f0ff] focus:bg-[#222] outline-none font-mono h-32 resize-none transition-colors" 
                            placeholder="Paste feedback notes here..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1">Strategic Context / Notes</label>
                        <textarea 
                            value={inputs.strategicNotes} 
                            onChange={e => setInputs({...inputs, strategicNotes: e.target.value})} 
                            className="w-full bg-[#151515] border border-[#444] p-3 text-xs text-white focus:border-[#00f0ff] focus:bg-[#222] outline-none font-mono h-24 resize-none transition-colors" 
                            placeholder="Why is this role critical? What is the business gap?"
                        />
                    </div>
                </div>

                <button 
                    onClick={generateMemo}
                    disabled={generating}
                    className="mt-4 w-full bg-[#111] border border-[#00f0ff] text-[#00f0ff] py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#00f0ff] hover:text-black transition-all flex items-center justify-center gap-2"
                >
                    {generating ? <Loader2 className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    {generating ? 'Synthesizing...' : 'Generate Offer Justification'}
                </button>
            </div>

            <div className="bg-[#0d0d0d] border border-[#222] p-6 relative flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Offer Justification
                    </h2>
                    {justification && <PrintButton />}
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-6 border border-[#222] font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap selection:bg-[#00f0ff] selection:text-black">
                    {justification || <div className="flex flex-col items-center justify-center h-full text-gray-600 italic gap-2">
                        <Scale className="w-8 h-8 opacity-20"/>
                        <span>Awaiting tactical inputs...</span>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default OfferJustification;

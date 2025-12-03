import React, { useState, useEffect } from 'react';
import { Loader2, Users } from 'lucide-react';
import PrintButton from '../PrintButton';
import { callGemini } from '../../utils/geminiApi';
import { db, appId } from '../../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const InterviewAnalyzer = ({ user, setActiveTab }) => {
    const [notes, setNotes] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [streamedText, setStreamedText] = useState('');

    useEffect(() => {
        if (!analysis) return;
        let i = 0;
        setStreamedText('');
        const interval = setInterval(() => {
            setStreamedText(prev => prev + analysis.charAt(i));
            i++;
            if (i >= analysis.length) clearInterval(interval);
        }, 10); 
        return () => clearInterval(interval);
    }, [analysis]);

    const analyze = async () => {
        if (!notes.trim()) return;
        setIsAnalyzing(true);
        setAnalysis('');
        setStreamedText('');
        
        const systemPrompt = "You are a serious, professional technical recruiter coach. Analyze the interview notes. 1. Affirm what was covered well. 2. Identify missing areas based on the context. 3. Suggest specific technical follow-up questions. Tone: Professional, constructive, no humor/wit.";
        const userPrompt = `Analyze these interview notes:\n\n${notes}`;

        try {
            const result = await callGemini(userPrompt, systemPrompt);
            setAnalysis(result);
            
            if (user && db) {
                 await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'interview_notes'), {
                    notes,
                    analysis: result,
                    timestamp: serverTimestamp()
                });
            }
        } catch (e) {
            if (e.message === "MISSING_KEY") {
                alert("ACCESS DENIED: Please enter your API Key in System Settings.");
                setActiveTab('settings');
            } else {
                setAnalysis("Error: " + e.message);
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in duration-500">
            <div className="flex-1 bg-[#0d0d0d] border border-[#222] p-1 flex flex-col group hover:border-[#333] transition-colors">
                <div className="bg-[#111] px-4 py-2 border-b border-[#222] flex justify-between items-center">
                    <span className="text-xs font-mono uppercase text-[#00f0ff] tracking-widest">Input Stream // Raw Notes</span>
                    {isAnalyzing && <Loader2 className="w-3 h-3 animate-spin text-[#00f0ff]" />}
                </div>
                <textarea 
                    className="flex-1 bg-[#080808] text-gray-300 font-mono text-xs p-4 focus:outline-none resize-none custom-scrollbar"
                    placeholder="PASTE RAW INTERVIEW NOTES HERE..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />
                <button 
                    onClick={analyze}
                    disabled={isAnalyzing}
                    className="bg-[#111] hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] font-bold uppercase text-xs py-3 border-t border-[#222] transition-all tracking-widest"
                >
                    {isAnalyzing ? 'Processing Signal...' : 'Initiate Analysis'}
                </button>
            </div>

            <div className="flex-1 bg-[#0d0d0d] border border-[#222] p-1 flex flex-col relative overflow-hidden">
                 <div className="bg-[#111] px-4 py-2 border-b border-[#222] flex justify-between items-center">
                    <span className="text-xs font-mono uppercase text-green-500 tracking-widest">Output Stream // Feedback</span>
                    {streamedText && <PrintButton />}
                </div>
                <div className="flex-1 bg-[#050505] p-4 overflow-y-auto custom-scrollbar">
                    <div className="font-mono text-xs leading-relaxed text-green-500/90 whitespace-pre-wrap">
                        {streamedText || <span className="opacity-30">Waiting for data stream...</span>}
                    </div>
                </div>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-1 w-full animate-scanline opacity-20" />
            </div>
        </div>
    );
};

export default InterviewAnalyzer;

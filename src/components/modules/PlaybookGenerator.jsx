import React, { useState } from 'react';
import { Loader2, Zap, BookOpen, Terminal } from 'lucide-react';
import PrintButton from '../PrintButton';
import { callGemini } from '../../utils/geminiApi';
import { db, appId } from '../../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const PlaybookGenerator = ({ user, setActiveTab }) => {
  const [formData, setFormData] = useState({ role: '', company: '', industry: '', stack: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    const systemPrompt = "You are a world-class technical recruiter. Output in Markdown.";
    const userPrompt = `Create a Tenstorrent-style Recruiting Playbook for: ${formData.role}, ${formData.company}, ${formData.industry}. Stack: ${formData.stack}. JD: ${formData.description}. Include Mission, Profile, Targets (3 tiers), Questions, Sourcing, Boolean.`;

    try {
      const text = await callGemini(userPrompt, systemPrompt);
      setResult(text);
      
      if (user && db) {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'playbooks'), {
            role: formData.role,
            content: text,
            timestamp: serverTimestamp()
        });
      }

    } catch (e) {
      if (e.message === "MISSING_KEY") {
          alert("ACCESS DENIED: Please enter your API Key in System Settings.");
          setActiveTab('settings');
      } else {
          setResult(`Error: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full animate-in fade-in duration-500">
      <div className="bg-[#0d0d0d] border border-[#222] p-6 relative overflow-hidden group">
        <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Technical/Sourcing Guide
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1">Target Role</label>
              <input 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
                className="w-full bg-[#151515] border border-[#444] p-2 text-sm text-white focus:border-[#00f0ff] focus:bg-[#222] outline-none font-mono transition-colors hover:border-[#666]" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1">Target Company</label>
              <input 
                value={formData.company} 
                onChange={e => setFormData({...formData, company: e.target.value})} 
                className="w-full bg-[#151515] border border-[#444] p-2 text-sm text-white focus:border-[#00f0ff] focus:bg-[#222] outline-none font-mono transition-colors hover:border-[#666]" 
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1">Tech Stack</label>
            <input 
                value={formData.stack} 
                onChange={e => setFormData({...formData, stack: e.target.value})} 
                className="w-full bg-[#151515] border border-[#444] p-2 text-sm text-white focus:border-[#00f0ff] focus:bg-[#222] outline-none font-mono transition-colors hover:border-[#666]" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-mono mb-1">Mission Context</label>
            <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full bg-[#151515] border border-[#444] p-2 text-sm text-white focus:border-[#00f0ff] focus:bg-[#222] outline-none font-mono h-24 resize-none transition-colors hover:border-[#666]" 
            />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#111] border border-[#00f0ff] text-[#00f0ff] py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#00f0ff] hover:text-black transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
            {loading ? 'Initializing Core...' : 'Generate Playbook'}
          </button>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-[#222] p-6 relative flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Tactical Output
            </h2>
            {result && <PrintButton />}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-4 border border-[#222] font-mono text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {result || <div className="text-gray-600 italic text-center mt-20">Awaiting input parameters for tactical analysis...</div>}
        </div>
      </div>
    </div>
  );
};

export default PlaybookGenerator;

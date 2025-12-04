import React, { useState } from 'react';
import { BookOpen, Search, MessageSquare, Loader2, Copy, Check, ChevronRight, Target, Crosshair, Zap } from 'lucide-react';
import { callGemini } from '../../utils/geminiApi';
import { useApiKey } from '../../hooks/useApiKey';

const PlaybookGenerator = () => {
  const [formData, setFormData] = useState({ role: '', company: '', focus: '' });
  const [loading, setLoading] = useState(false);
  const [playbook, setPlaybook] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [copied, setCopied] = useState(null);
  const hasKey = useApiKey();

  const handleGenerate = async () => {
    if (!formData.role || !formData.company) return;
    setLoading(true);
    setPlaybook(null);

    const prompt = `
      Generate a recruiting playbook for:
      Role: ${formData.role}
      Company: ${formData.company}
      Focus Area: ${formData.focus || 'General'}

      Output strictly valid JSON with this structure:
      {
        "roleAnalysis": {
          "summary": "2 sentence role overview",
          "mustHaves": ["skill 1", "skill 2", "skill 3"],
          "niceToHaves": ["skill 1", "skill 2"],
          "redFlags": ["flag 1", "flag 2"]
        },
        "sourcing": {
          "keywords": ["kw1", "kw2", "kw3"],
          "booleanStrings": ["string 1", "string 2"],
          "targetCompanies": ["comp 1", "comp 2", "comp 3"]
        },
        "outreach": {
          "hook": "One sentence personalized hook",
          "emailSubject": "Compelling subject line",
          "emailBody": "Short 3-4 sentence outreach email"
        }
      }
    `;

    try {
      const response = await callGemini(prompt, "You are an expert technical recruiter. Output ONLY valid JSON.");
      const cleanJson = response.replace(/```json|```/g, '').trim();
      setPlaybook(JSON.parse(cleanJson));
    } catch (error) {
      console.error("Playbook Gen Error:", error);
      alert(error.message === "MISSING_KEY" ? "Please configure API Key in Settings." : "Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Input Section */}
      <div className="bg-[#0d0d0d] border border-[#333] p-6">
        <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Tactical Playbook Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#888] font-mono">Target Role</label>
            <input
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Senior Systems Engineer"
              className="w-full bg-[#050505] border border-[#333] p-2 text-white font-mono text-sm focus:border-[#00f0ff] outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#888] font-mono">Company Context</label>
            <input
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Tenstorrent"
              className="w-full bg-[#050505] border border-[#333] p-2 text-white font-mono text-sm focus:border-[#00f0ff] outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-[#888] font-mono">Focus Area (Optional)</label>
            <input
              value={formData.focus}
              onChange={e => setFormData({ ...formData, focus: e.target.value })}
              placeholder="e.g. Performance Analysis"
              className="w-full bg-[#050505] border border-[#333] p-2 text-white font-mono text-sm focus:border-[#00f0ff] outline-none transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !formData.role || !formData.company}
          className="w-full bg-[#111] border border-[#333] text-[#00f0ff] py-2 font-mono uppercase tracking-widest hover:bg-[#00f0ff] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Initializing Tactical Analysis...</> : <><Zap className="w-4 h-4" /> Generate Playbook</>}
        </button>
      </div>

      {/* Results Section */}
      {playbook && (
        <div className="flex-1 bg-[#0d0d0d] border border-[#333] flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#333]">
            {[
              { id: 'analysis', label: 'Role Analysis', icon: Target },
              { id: 'sourcing', label: 'Sourcing Strategy', icon: Search },
              { id: 'outreach', label: 'Outreach Hooks', icon: MessageSquare },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors
                  ${activeTab === tab.id ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-b-2 border-[#00f0ff]' : 'text-[#888] hover:text-white hover:bg-[#111]'}`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {activeTab === 'analysis' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="p-4 bg-[#050505] border border-[#333] border-l-2 border-l-[#00f0ff]">
                  <h3 className="text-[#00f0ff] font-mono text-xs uppercase mb-2">Executive Summary</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{playbook.roleAnalysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-[#888] font-mono text-xs uppercase mb-3 flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Must Haves</h3>
                    <ul className="space-y-2">
                      {playbook.roleAnalysis.mustHaves.map((item, i) => (
                        <li key={i} className="text-sm text-white flex items-start gap-2">
                          <span className="text-[#333] mt-1">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#888] font-mono text-xs uppercase mb-3 flex items-center gap-2"><Crosshair className="w-3 h-3 text-yellow-500" /> Red Flags</h3>
                    <ul className="space-y-2">
                      {playbook.roleAnalysis.redFlags.map((item, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-[#333] mt-1">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sourcing' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-[#00f0ff] font-mono text-xs uppercase mb-3">Boolean Strings</h3>
                  <div className="space-y-3">
                    {playbook.sourcing.booleanStrings.map((str, i) => (
                      <div key={i} className="group relative bg-[#050505] border border-[#333] p-3 hover:border-[#00f0ff]/50 transition-colors">
                        <code className="text-xs text-green-400 font-mono break-all">{str}</code>
                        <button
                          onClick={() => copyToClipboard(str, `bool-${i}`)}
                          className="absolute top-2 right-2 p-1.5 bg-[#111] border border-[#333] text-gray-400 hover:text-white hover:border-[#00f0ff] transition-all opacity-0 group-hover:opacity-100"
                        >
                          {copied === `bool-${i}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[#888] font-mono text-xs uppercase mb-3">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {playbook.sourcing.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-[#111] border border-[#333] text-xs text-gray-300 font-mono">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#888] font-mono text-xs uppercase mb-3">Target Companies</h3>
                    <div className="flex flex-wrap gap-2">
                      {playbook.sourcing.targetCompanies.map((co, i) => (
                        <span key={i} className="px-2 py-1 bg-[#111] border border-[#333] text-xs text-[#00f0ff] font-mono">{co}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'outreach' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="p-4 bg-[#050505] border border-[#333]">
                  <h3 className="text-[#00f0ff] font-mono text-xs uppercase mb-2">The Hook</h3>
                  <p className="text-white text-sm italic border-l-2 border-[#333] pl-3 py-1">"{playbook.outreach.hook}"</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[#888] font-mono text-xs uppercase">Draft Email</h3>
                    <button
                      onClick={() => copyToClipboard(`Subject: ${playbook.outreach.emailSubject}\n\n${playbook.outreach.emailBody}`, 'email')}
                      className="flex items-center gap-1 text-[10px] uppercase font-mono text-[#00f0ff] hover:text-white transition-colors"
                    >
                      {copied === 'email' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy All
                    </button>
                  </div>
                  <div className="bg-[#050505] border border-[#333] p-4 space-y-4">
                    <div>
                      <span className="text-gray-500 text-xs font-mono uppercase mr-2">Subject:</span>
                      <span className="text-white text-sm font-medium">{playbook.outreach.emailSubject}</span>
                    </div>
                    <div className="h-px bg-[#222] w-full" />
                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {playbook.outreach.emailBody}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaybookGenerator;

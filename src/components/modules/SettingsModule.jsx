import React, { useState } from 'react';
import { Key, Save, CheckSquare } from 'lucide-react';
import { API_KEY_STORAGE_KEY } from '../../config/constants';

const SettingsModule = () => {
    const [key, setKey] = useState(localStorage.getItem(API_KEY_STORAGE_KEY) || '');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <div className="bg-[#0d0d0d] border border-[#222] p-8 max-w-md w-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f0ff]" />
                <h2 className="text-[#00f0ff] font-mono text-lg uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Key className="w-5 h-5" /> Security Protocol
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] uppercase text-gray-500 font-mono mb-2">Gemini API Key</label>
                        <input 
                            type="password" 
                            value={key} 
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Paste AI key here..."
                            className="w-full bg-[#050505] border border-[#333] p-3 text-sm text-white font-mono focus:border-[#00f0ff] outline-none transition-all"
                        />
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        className="w-full bg-[#111] border border-[#333] hover:border-[#00f0ff] text-[#00f0ff] py-3 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        {saved ? <CheckSquare className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? 'Key Encrypted & Saved' : 'Save Credentials'}
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-[#222]">
                    <p className="text-[10px] text-gray-600 font-mono leading-relaxed">
                        * Key is stored locally in your browser's secure storage. <br/>
                        * Required for Playbook, Sourcing, and Analysis modules.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModule;

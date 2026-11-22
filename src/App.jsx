import React, { useState } from 'react';
import ThreeBackground from './components/3d/ThreeBackground';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/modules/Dashboard';
import PlaybookGenerator from './components/modules/PlaybookGenerator';
import OfferOptimizer from './components/modules/OfferOptimizer';
import OfferJustification from './components/modules/OfferJustification';
import InterviewAnalyzer from './components/modules/InterviewAnalyzer';
import CandidateSourcing from './components/modules/CandidateSourcing';
import CommunicationBuilder from './components/modules/CommunicationBuilder';
import SettingsModule from './components/modules/SettingsModule';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    const contentMap = {
      dashboard: <Dashboard setActiveTab={setActiveTab} />,
      playbook: <PlaybookGenerator setActiveTab={setActiveTab} />,
      offer: <OfferOptimizer />,
      justification: <OfferJustification setActiveTab={setActiveTab} />,
      interview: <InterviewAnalyzer setActiveTab={setActiveTab} />,
      sourcing: <CandidateSourcing setActiveTab={setActiveTab} />,
      comm: <CommunicationBuilder setActiveTab={setActiveTab} />,
      settings: <SettingsModule />
    };
    return contentMap[activeTab] || contentMap.dashboard;
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#00f0ff] selection:text-black">
      <ThreeBackground />
      
      <div className="relative z-10 flex h-full w-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <header className="h-16 border-b border-[#222] flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-sm z-20">
            <div className="flex items-center gap-4">
                <div className="h-2 w-2 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_10px_#00f0ff]" />
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                    {activeTab === 'dashboard' ? 'System Overview' : activeTab.replace('-', ' ')}
                </h2>
            </div>
            <div className="flex items-center gap-4">
                 <div className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2">
                    <span className="hidden md:inline">Local session</span>
                    <span className="text-[#00f0ff] border border-[#00f0ff]/30 px-2 py-0.5 rounded-full bg-[#00f0ff]/10">Online</span>
                 </div>
                 <div className="w-8 h-8 bg-[#111] border border-[#333] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-300">TR</span>
                 </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6 relative">
             <div className="max-w-7xl mx-auto h-full">
                {renderContent()}
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { LayoutDashboard, BookOpen, Search, Users, Cpu, Scale, MessageSquare } from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
    const modules = [
        { id: 'playbook', title: 'Playbook Generator', subtitle: 'Automated role research & tactical sourcing strategies', icon: BookOpen },
        { id: 'sourcing', title: 'Candidate Sourcing', subtitle: 'Search Matrix: Deep Web & Boolean Generation', icon: Search },
        { id: 'interview', title: 'Interview Analyzer', subtitle: 'Signal Detection, Affirmations & Follow-up Coaching', icon: Users },
        { id: 'offer', title: 'Compensation Calc', subtitle: 'Real-time Offer Modeling & Closing Intelligence', icon: Cpu },
        { id: 'justification', title: 'Offer Justification', subtitle: 'Data-driven Business Case Generation', icon: Scale },
        { id: 'comm', title: 'Comms Builder', subtitle: 'Strategic Outreach with Tone Tuner', icon: MessageSquare },
    ];
    
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
                {modules.map(m => (
                    <button 
                        key={m.id} 
                        onClick={() => setActiveTab(m.id)}
                        className="relative group bg-[#0d0d0d] border border-[#222] hover:border-[#444] hover:shadow-[0_0_20px_-10px_rgba(255,255,255,0.1)] transition-all duration-300 p-8 flex flex-col items-center justify-center text-center h-64 overflow-hidden"
                    >
                        <div className="absolute top-2 left-2 w-1 h-1 bg-[#333] rounded-full" />
                        <div className="absolute top-2 right-2 w-1 h-1 bg-[#333] rounded-full" />
                        <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#333] rounded-full" />
                        <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#333] rounded-full" />

                        <div className="p-4 rounded-full bg-[#111] border border-[#222] mb-4 group-hover:border-[#00f0ff] transition-colors duration-300 relative z-10">
                            <m.icon className="w-8 h-8 text-gray-400 group-hover:text-white" />
                        </div>
                        
                        <h3 className="text-white font-bold tracking-widest uppercase mb-2 text-sm relative z-10">{m.title}</h3>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider max-w-[200px] leading-relaxed relative z-10">
                            {m.subtitle}
                        </p>

                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-0 group-hover:opacity-50 transition-opacity" />
                        
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" 
                             style={{backgroundImage: 'radial-gradient(#222 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;

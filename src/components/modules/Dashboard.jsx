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
                        className="relative group bg-[#0a0a0a] border border-[#222] hover:border-[#00f0ff]/50 transition-all duration-300 p-0 flex flex-col h-64 overflow-hidden"
                    >
                        {/* Hardware Module Header */}
                        <div className="w-full h-8 bg-[#111] border-b border-[#222] flex items-center justify-between px-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#333] group-hover:bg-[#00f0ff] transition-colors" />
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Mod. {m.id.substring(0, 3).toUpperCase()}</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-[#222]" />
                                <div className="w-1 h-1 bg-[#222]" />
                                <div className="w-1 h-1 bg-[#222]" />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                            <div className="p-4 rounded-sm bg-[#0d0d0d] border border-[#222] mb-5 group-hover:border-[#00f0ff]/30 group-hover:shadow-[0_0_15px_-5px_#00f0ff] transition-all duration-300">
                                <m.icon className="w-8 h-8 text-gray-400 group-hover:text-[#00f0ff] transition-colors" />
                            </div>

                            <h3 className="text-white font-bold tracking-[0.15em] uppercase mb-3 text-sm">{m.title}</h3>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider text-center max-w-[240px] leading-relaxed">
                                {m.subtitle}
                            </p>
                        </div>

                        {/* Tech Accents */}
                        <div className="absolute top-12 left-0 w-1 h-4 bg-[#222]" />
                        <div className="absolute top-12 right-0 w-1 h-4 bg-[#222]" />
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#222] group-hover:bg-[#00f0ff] transition-colors duration-500" />

                        {/* Corner Brackets */}
                        <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-[#333]" />
                        <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-[#333]" />

                        {/* Hover Grid Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #00f0ff 25%, #00f0ff 26%, transparent 27%, transparent 74%, #00f0ff 75%, #00f0ff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #00f0ff 25%, #00f0ff 26%, transparent 27%, transparent 74%, #00f0ff 75%, #00f0ff 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;

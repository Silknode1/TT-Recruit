import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckSquare, Plus, Wand2, Trash2, Loader2, Terminal, Settings, LayoutDashboard, Cpu, Scale, Search, Users, BookOpen, MessageSquare, Activity, Briefcase, UserPlus } from 'lucide-react';
import { callGemini } from '../../utils/geminiApi';
import { useApiKey } from '../../hooks/useApiKey';
import { useLocalTasks } from '../../hooks/useLocalTasks';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [pomodoro, setPomodoro] = useState({ active: false, timeLeft: 25 * 60 });
  const { tasks, addTasks, toggleTask: toggleById, deleteTask } = useLocalTasks();
  const [newTask, setNewTask] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const hasKey = useApiKey();

  useEffect(() => {
    let interval = null;
    if (pomodoro.active && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoro.timeLeft === 0) {
      setPomodoro(prev => ({ ...prev, active: false }));
    }
    return () => clearInterval(interval);
  }, [pomodoro.active, pomodoro.timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addTask = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newTask.trim()) {
      addTasks([newTask.trim()]);
      setNewTask('');
    }
  };

  const smartAddTask = async () => {
    if (!newTask.trim()) return;
    setIsMagicLoading(true);
    const originalTask = newTask;
    setNewTask('Analysing task structure...');

    try {
      const sys = "Break down the recruiting task into 3-4 concise, actionable sub-steps. Output ONLY the steps, one per line. No numbering.";
      const resp = await callGemini(originalTask, sys);
      const steps = resp.split('\n').filter(line => line.trim().length > 0);

      addTasks(steps.map(step => step.replace(/^-\s*/, '').trim()).filter(Boolean));
      setNewTask('');
    } catch (e) {
      if (e.message === "MISSING_KEY") {
        alert("Please configure API Key in Settings.");
        setActiveTab('settings');
      }
      setNewTask(originalTask);
    } finally {
      setIsMagicLoading(false);
    }
  };

  const toggleTask = (task) => toggleById(task.id);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'offer', label: 'Compensation Calc', icon: Cpu },
    { id: 'justification', label: 'Offer Justification', icon: Scale },
    { id: 'sourcing', label: 'Candidate Sourcing', icon: Search },
    { id: 'interview', label: 'Interview Analyzer', icon: Users },
    { id: 'playbook', label: 'Playbook Generator', icon: BookOpen },
    { id: 'comm', label: 'Comms Builder', icon: MessageSquare },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-[#0a0a0a] border-r border-[#222] flex flex-col h-full relative z-10 shadow-2xl flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-[#222]">
        <h1 className="text-lg font-bold tracking-[0.2em] text-white flex items-center gap-2">
          <Terminal className="text-[#00f0ff] w-4 h-4" />
          TT-RECRUIT
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-[#00f0ff] shadow-[0_0_5px_#00f0ff]' : 'bg-red-500'}`} />
          <p className="text-[9px] text-[#666] font-mono uppercase tracking-widest">
            {hasKey ? 'System Online' : 'Key Required'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider transition-all duration-200 border-l-2
              ${activeTab === item.id
                ? 'bg-[#111] text-[#00f0ff] border-[#00f0ff] shadow-[inset_10px_0_20px_-10px_rgba(0,240,255,0.1)]'
                : 'text-gray-500 border-transparent hover:text-white hover:bg-[#0f0f0f]'}`}
          >
            <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${activeTab === item.id ? 'drop-shadow-[0_0_5px_#00f0ff]' : ''}`} />
            <span className="text-left flex-1 truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section: Search & Metrics */}
      <div className="border-t border-[#222] bg-[#0c0c0c] flex flex-col">
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 w-3 h-3 text-gray-500" />
            <input
              placeholder="SEARCH CANDIDATES..."
              className="w-full bg-[#050505] border border-[#222] text-[10px] font-mono py-1.5 pl-7 pr-2 text-white focus:border-[#00f0ff] outline-none rounded-sm placeholder:text-gray-700"
            />
          </div>
        </div>

        {/* Focus Toolbar (Fixed Bottom) */}
        <div className="p-3 bg-[#050505] border-t border-[#222] flex flex-col gap-2">
          {/* Task List */}
          {tasks.length > 0 && (
            <ul className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
              {tasks.map(task => (
                <li key={task.id} className="group flex items-center gap-2 text-[10px] font-mono">
                  <button
                    onClick={() => toggleTask(task)}
                    aria-label={task.completed ? 'Mark task not done' : 'Mark task done'}
                    className={task.completed ? 'text-[#00f0ff]' : 'text-gray-600 hover:text-[#00f0ff]'}
                  >
                    <CheckSquare className="w-3 h-3" />
                  </button>
                  <span className={`flex-1 truncate ${task.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                    className="text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Quick Task Input */}
          <div className="relative flex items-center gap-1">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={addTask}
              disabled={isMagicLoading}
              placeholder="QUICK TASK..."
              className="w-full bg-[#0a0a0a] border border-[#222] text-[10px] font-mono py-1.5 pl-2 pr-12 text-white focus:border-[#00f0ff] outline-none rounded-sm disabled:opacity-50 placeholder:text-gray-700"
            />
            <div className="absolute right-1 flex items-center gap-1">
              <button
                onClick={smartAddTask}
                disabled={isMagicLoading || !newTask.trim()}
                title="Magic Breakdown"
                className="text-gray-500 hover:text-[#00f0ff] disabled:opacity-30"
              >
                {isMagicLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              </button>
              <button onClick={addTask} className="text-gray-500 hover:text-[#00f0ff]">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Timer & Task Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPomodoro(p => ({ ...p, active: !p.active }))}
                className={`p-1.5 rounded transition-colors ${pomodoro.active ? 'text-[#00f0ff] bg-[#00f0ff]/10' : 'text-gray-500 hover:text-white'}`}
              >
                {pomodoro.active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <span className="text-xs font-mono font-bold text-gray-300 tracking-widest">
                {formatTime(pomodoro.timeLeft)}
              </span>
              <button
                onClick={() => setPomodoro(p => ({ ...p, active: false, timeLeft: 25 * 60 }))}
                className="p-1 text-gray-500 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500 font-mono uppercase">
                {tasks.filter(t => !t.completed).length} Tasks
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

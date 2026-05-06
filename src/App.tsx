import { useState, useRef } from "react";
import { BTree } from "./utils/BTree";
import Controls from "./components/Controls";
import TreeView from "./components/TreeView";
import StepPanel from "./components/StepPanel";
import { motion, AnimatePresence } from "framer-motion";
import Docs from "./components/Docs";

export default function App() {
  const [steps, setSteps] = useState<any[]>([]);
  const [current, setCurrent] = useState(-1);
  const [view, setView] = useState<'simulator' | 'docs'>('simulator');
  const treeInstance = useRef(new BTree(2));

  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col selection:bg-sky-500/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-slate-800/50 glass-panel z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('simulator')}>
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-lg shadow-sky-500/20" />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="gradient-text">B-Tree</span> Visualizer
          </h1>
        </div>
        <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
          <button 
            onClick={() => setView(view === 'simulator' ? 'docs' : 'simulator')}
            className={`transition-colors flex items-center gap-1.5 ${view === 'docs' ? 'text-sky-400' : 'hover:text-sky-400'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${view === 'docs' ? 'bg-sky-400' : 'bg-slate-700'}`} />
            {view === 'docs' ? 'Back to Simulator' : 'Documentation'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <AnimatePresence mode="wait">
          {view === 'simulator' ? (
            <motion.div 
              key="simulator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex overflow-hidden relative"
            >
              {/* Left Sidebar */}
              <aside className="w-72 border-r border-slate-800/50 glass-panel p-6 z-10 flex flex-col overflow-hidden">
                <Controls 
                  setSteps={setSteps} 
                  setCurrent={setCurrent} 
                  treeInstance={treeInstance}
                />
              </aside>

              {/* Stage */}
              <section className="flex-1 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    <TreeView tree={current >= 0 ? steps[current] : null} />
                  </motion.div>
                </AnimatePresence>
                
                {/* Bottom Step Panel */}
                {steps.length > 0 && (
                  <footer className="absolute bottom-0 left-0 right-0 h-14 border-t border-slate-800/50 glass-panel z-10">
                    <StepPanel 
                      steps={steps} 
                      current={current} 
                      setCurrent={setCurrent} 
                    />
                  </footer>
                )}
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="docs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex overflow-hidden"
            >
              <Docs onBack={() => setView('simulator')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Credit Badge */}
      <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2">
        <a 
          href="https://github.com/votruongvan/b-tree" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 glass-panel border border-slate-800/50 rounded-full hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
          title="GitHub Repo"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
        <a 
          href="https://www.linkedin.com/in/truogvanzz/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 glass-panel border border-slate-800/50 rounded-full hover:bg-slate-800/50 transition-all group"
        >
          <span className="text-[10px] text-slate-500 font-medium group-hover:text-slate-300">by</span>
          <span className="text-[11px] font-bold text-sky-400 group-hover:text-sky-300">truongvanzz</span>
          <svg className="w-3 h-3 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
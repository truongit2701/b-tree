import React, { useState, useRef } from "react";
import { BTree } from "../utils/BTree";
import { BPlusTree } from "../utils/BPlusTree";

interface ControlsProps {
  setSteps: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  treeInstance: React.MutableRefObject<BTree>;
  bPlusInstance: React.MutableRefObject<BPlusTree>;
}

export default function Controls({ setSteps, setCurrent, treeInstance, bPlusInstance }: ControlsProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const updateLogs = () => {
    const combinedLogs = [
      ...treeInstance.current.logs.map(l => ({ ...l, type: 'B' })),
      ...bPlusInstance.current.logs.map(l => ({ ...l, type: 'B+' }))
    ].sort((a, b) => a.id.localeCompare(b.id)); // Simple sort by ID/Time
    setLogs(combinedLogs);
  };

  const handleInsert = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue) return;

    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    treeInstance.current.clearLogs();
    bPlusInstance.current.clearLogs();
    
    treeInstance.current.insert(val);
    bPlusInstance.current.insert(val);

    const snapshot = {
      btree: JSON.parse(JSON.stringify(treeInstance.current.getSnapshot())),
      bplus: JSON.parse(JSON.stringify(bPlusInstance.current.getSnapshot()))
    };
    
    setSteps(prev => [...prev, snapshot]);
    setCurrent(prev => prev + 1);
    setInputValue("");
    updateLogs();
    inputRef.current?.focus();
  };

  const handleRandom = () => {
    const val = Math.floor(Math.random() * 100);
    setInputValue(val.toString());
    setTimeout(() => handleInsert(), 100);
  };

  const handleClear = () => {
    treeInstance.current = new BTree(2);
    bPlusInstance.current = new BPlusTree(2);
    treeInstance.current.clearLogs();
    bPlusInstance.current.clearLogs();
    setSteps([]);
    setCurrent(-1);
    setLogs([]);
  };

  const handleSearch = () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    treeInstance.current.clearLogs();
    bPlusInstance.current.clearLogs();

    const pathB = treeInstance.current.getSearchPath(treeInstance.current.root, val);
    const pathBPlus = bPlusInstance.current.getSearchPath(bPlusInstance.current.root, val);

    treeInstance.current.search(treeInstance.current.root, val);
    bPlusInstance.current.search(bPlusInstance.current.root, val);

    const snapshot = {
      btree: JSON.parse(JSON.stringify(treeInstance.current.getSnapshot(treeInstance.current.root, val, pathB))),
      bplus: JSON.parse(JSON.stringify(bPlusInstance.current.getSnapshot(bPlusInstance.current.root, val, pathBPlus)))
    };
    
    setSteps(prev => [...prev, snapshot]);
    setCurrent(prev => prev + 1);
    updateLogs();
  };

  const handleDelete = () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    treeInstance.current.clearLogs();
    bPlusInstance.current.clearLogs();

    treeInstance.current.delete(val);
    bPlusInstance.current.delete(val);

    const snapshot = {
      btree: JSON.parse(JSON.stringify(treeInstance.current.getSnapshot())),
      bplus: JSON.parse(JSON.stringify(bPlusInstance.current.getSnapshot()))
    };
    
    setSteps(prev => [...prev, snapshot]);
    setCurrent(prev => prev + 1);
    setInputValue("");
    updateLogs();
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex-none space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Value Control
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="number"
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                placeholder="Enter number..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleInsert()}
                className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors shadow-lg shadow-sky-900/20"
              >
                Insert
              </button>
              <button
                onClick={handleSearch}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors shadow-lg shadow-emerald-900/20"
              >
                Find
              </button>
              <button
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors shadow-lg shadow-rose-900/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleRandom}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg text-xs font-medium transition-colors border border-slate-700"
          >
            <span>🎲</span> Random
          </button>
          <button
            onClick={handleClear}
            className="flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-red-900/20 hover:text-red-400 text-slate-400 p-2 rounded-lg text-xs font-medium transition-colors border border-slate-700/50"
          >
            <span>🗑️</span> Clear
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 space-y-2">
        <h3 className="flex-none text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Operation Logs</span>
          {logs.length > 0 && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Live</span>}
        </h3>
        <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-inner">
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-8">
                <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center">
                  <span className="text-xs">?</span>
                </div>
                <p className="text-[10px] font-medium italic">No logs yet...</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="space-y-1 group">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${log.type === 'B' ? 'bg-sky-500/20 text-sky-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {log.type}
                    </span>
                    <span className="text-[9px] font-mono text-slate-600 bg-slate-950 px-1 rounded border border-slate-800">
                      {log.timestamp}
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-800/50 group-last:hidden" />
                  </div>
                  <p className={`text-[11px] leading-relaxed pl-1 border-l ${log.type === 'B' ? 'text-slate-300 border-sky-500/30' : 'text-slate-300 border-indigo-500/30'}`}>
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex-none p-4 bg-sky-500/5 rounded-xl border border-sky-500/10 space-y-2">
        <p className="text-[10px] text-sky-400 font-semibold">
          B-Tree Configuration (t = 2)
        </p>
        <div className="text-[10px] text-sky-300/80 leading-relaxed space-y-1">
          <p>• Max keys: <span className="text-white">3</span> | Min keys: <span className="text-white">1</span></p>
          <p>• Max child: <span className="text-white">4</span> | Min child: <span className="text-white">2</span></p>
        </div>
      </div>
    </div>
  );
}
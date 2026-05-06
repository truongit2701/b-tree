import React from 'react';
import { motion } from "framer-motion";

export default function StepPanel({ steps, current, setCurrent }) {
  return (
    <div className="h-full flex items-center px-6 gap-3 overflow-x-auto no-scrollbar">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2 whitespace-nowrap">
        History
      </span>
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrent(i)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all border ${
              i === current
                ? "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20"
                : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600 hover:bg-slate-800"
            }`}
          >
            {i + 1}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
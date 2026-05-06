import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DocsProps {
  onBack: () => void;
}

const content = {
  en: {
    back: "Back to Simulator",
    title: "Documentation",
    subtitle: "A comprehensive guide to understanding the internal mechanics, algorithms, and visualization logic behind B-Tree Pro.",
    sections: [
      {
        id: "01",
        title: "Introduction",
        color: "sky",
        text: [
          "A B-Tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.",
          "Unlike binary search trees, B-Trees are optimized for systems that read and write large blocks of data. It is commonly used in databases and file systems."
        ]
      },
      {
        id: "02",
        title: "Operation Guide",
        color: "emerald",
        items: [
          {
            title: "Insert",
            desc: "When a node reaches 3 keys, it splits. The middle key moves up to the parent, and the remaining keys form two new nodes."
          },
          {
            title: "Find",
            desc: "Searches through nodes. The visualizer highlights the path in emerald green to show the logarithmic traversal flow."
          },
          {
            title: "Delete",
            desc: "Removes a value. If a node becomes too small, it will borrow from siblings or merge with them to maintain balance."
          }
        ]
      },
      {
        id: "03",
        title: "The B-Tree Rules",
        color: "indigo",
        rulesTitle: "Minimum Degree (t = 2)",
        maxKeys: "Max Keys per Node",
        minKeys: "Min Keys per Node",
        footer: "© 2026 B-Tree Visualizer Pro. Designed for computer science education."
      }
    ]
  },
  vi: {
    back: "Quay lại bộ giả lập",
    title: "Tài liệu hướng dẫn",
    subtitle: "Hướng dẫn toàn diện để hiểu về cơ chế nội bộ, thuật toán và logic trực quan hóa đằng sau B-Tree Pro.",
    sections: [
      {
        id: "01",
        title: "Giới thiệu",
        color: "sky",
        text: [
          "B-Tree là một cấu trúc dữ liệu cây tự cân bằng, duy trì dữ liệu đã sắp xếp và cho phép tìm kiếm, truy cập tuần tự, chèn và xóa trong thời gian logarit.",
          "Khác với cây tìm kiếm nhị phân, B-Tree được tối ưu hóa cho các hệ thống đọc và ghi các khối dữ liệu lớn. Nó thường được sử dụng trong các cơ sở dữ liệu và hệ thống tệp."
        ]
      },
      {
        id: "02",
        title: "Hướng dẫn vận hành",
        color: "emerald",
        items: [
          {
            title: "Chèn (Insert)",
            desc: "Khi một node đạt đến 3 khóa, nó sẽ bị chia tách. Khóa ở giữa sẽ được đẩy lên node cha, và các khóa còn lại tạo thành hai node mới."
          },
          {
            title: "Tìm kiếm (Find)",
            desc: "Tìm kiếm qua các node. Bộ trực quan hóa sẽ làm nổi bật đường đi bằng màu xanh lục bảo để hiển thị luồng duyệt logarit."
          },
          {
            title: "Xóa (Delete)",
            desc: "Loại bỏ một giá trị. Nếu một node trở nên quá nhỏ, nó sẽ mượn khóa từ các node anh em hoặc gộp với chúng để duy trì sự cân bằng."
          }
        ]
      },
      {
        id: "03",
        title: "Quy tắc B-Tree",
        color: "indigo",
        rulesTitle: "Bậc tối thiểu (t = 2)",
        maxKeys: "Khóa tối đa mỗi Node",
        minKeys: "Khóa tối thiểu mỗi Node",
        footer: "© 2026 B-Tree Visualizer Pro. Thiết kế cho mục đích giáo dục khoa học máy tính."
      }
    ]
  }
};

export default function Docs({ onBack }: DocsProps) {
  const [lang, setLang] = useState<"en" | "vi">("en");
  const t = content[lang];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 selection:bg-sky-500/30 relative custom-scrollbar">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto p-8 lg:p-16 space-y-20 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-2 text-sm font-medium transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> {t.back}
            </button>
            
            {/* Language Switcher */}
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button 
                onClick={() => setLang("vi")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === "vi" ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-500 hover:text-slate-300"}`}
              >
                TIẾNG VIỆT
              </button>
              <button 
                onClick={() => setLang("en")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === "en" ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-500 hover:text-slate-300"}`}
              >
                ENGLISH
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-5xl font-extrabold tracking-tight">
                <span className="gradient-text">B-Tree</span> {t.title}
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mt-4">
                {t.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-20"
          >
            {/* Section: Introduction */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 text-sm font-mono`}>
                  {t.sections[0].id}
                </span>
                {t.sections[0].title}
              </h2>
              <div className="glass-panel rounded-2xl p-8 space-y-4 leading-relaxed border border-slate-800/50 bg-slate-900/20">
                {t.sections[0].text?.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Section: Operation Guide */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-mono`}>
                  {t.sections[1].id}
                </span>
                {t.sections[1].title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.sections[1].items?.map((item, i) => (
                  <div key={i} className="glass-panel p-6 rounded-xl border border-slate-800/50 hover:border-sky-500/30 transition-colors bg-slate-900/20">
                    <h3 className={`font-bold ${i === 0 ? "text-sky-400" : i === 1 ? "text-emerald-400" : "text-rose-400"} mb-3 flex items-center gap-2`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-sky-400" : i === 1 ? "bg-emerald-400" : "bg-rose-400"}`} /> 
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Algorithms */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-mono`}>
                  {t.sections[2].id}
                </span>
                {t.sections[2].title}
              </h2>
              <div className="space-y-4">
                <div className="glass-panel rounded-2xl p-8 border border-slate-800/50 bg-slate-900/20">
                  <h3 className="text-lg font-bold mb-4 text-indigo-300">{t.sections[2].rulesTitle}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.sections[2].maxKeys}</p>
                      <p className="text-xl font-mono text-white">2t - 1 = 3</p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.sections[2].minKeys}</p>
                      <p className="text-xl font-mono text-white">t - 1 = 1</p>
                    </div>
                  </div>
                </div>
                <div className="p-8 text-center text-slate-500 text-sm">
                  <p>{t.sections[2].footer}</p>
                </div>
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

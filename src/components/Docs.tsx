import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DocsProps {
  onBack: () => void;
}

const content = {
  en: {
    back: "Back to Simulator",
    title: "The B-Tree Engine",
    subtitle: "Understanding why B-Trees power the world's most critical data systems.",
    sections: [
      {
        id: "WHY",
        title: "The Problem: Why B-Trees?",
        color: "rose",
        text: [
          "Imagine a database with billions of records. If we use a Binary Search Tree (BST), the tree becomes extremely deep. Searching a value might require 30-50 'jumps' between nodes.",
          "On a computer, data is stored on Disks (HDD/SSD). Every jump between nodes is a 'Disk Read'. Disk reads are 100,000x slower than RAM operations.",
          "B-Trees solve this by being 'Short and Wide'. By storing hundreds of keys in a single node, we can access millions of records in just 3 or 4 disk reads."
        ]
      },
      {
        id: "VS",
        title: "B-Tree vs B+ Tree",
        color: "sky",
        comparison: [
          {
            feature: "Data Storage",
            btree: "Keys and values in all nodes.",
            bplus: "Values only in leaf nodes. Internal nodes only have routing keys."
          },
          {
            feature: "Range Query",
            btree: "Requires multiple tree traversals.",
            bplus: "Very fast. Leaf nodes are linked together like a list."
          },
          {
            feature: "Internal Node Size",
            btree: "Larger (contains data).",
            bplus: "Smaller (no data), so we can fit more keys per node."
          }
        ]
      },
      {
        id: "APPS",
        title: "Real-world Applications",
        color: "emerald",
        apps: [
          { name: "Databases", desc: "MySQL (InnoDB), PostgreSQL, and MongoDB use B-Trees/B+ Trees for primary indexing." },
          { name: "File Systems", desc: "NTFS (Windows), APFS (Mac), and Ext4 (Linux) use them to manage large file directories." },
          { name: "Search Engines", desc: "Used in massive search indexes to find keywords across billions of documents." }
        ]
      },
      {
        id: "PROS",
        title: "Pros & Cons",
        color: "indigo",
        pros: ["Logarithmic performance (O(log n)) for all operations.", "Optimized for block-storage (Disks/SSD).", "Stays balanced automatically."],
        cons: ["Complex implementation compared to BST.", "Requires more memory per node."]
      },
      {
        id: "EXAMPLE",
        title: "Practical Scenario: The Salary Search",
        color: "amber",
        text: [
          "Scenario: You have a table of Employees and you want to find everyone earning between $3,000 and $5,000.",
          "In a B-Tree: The database must find each salary individually or use complex recursive traversals because data is scattered across all levels of the tree.",
          "In a B+ Tree: The database finds the $3,000 leaf node once, then simply follows the 'Next' arrows at the bottom layer to collect everyone up to $5,000. This is incredibly fast for reports and lists."
        ]
      },
      {
        id: "ANALOGY",
        title: "The Library Analogy",
        color: "amber",
        text: [
          "B-Tree is like a Library. Instead of looking through books one by one (Binary Tree), you go to a Floor (Node), then to a Section (Key Range), then to a Shelf (Child Node).",
          "You reach your book much faster because every 'stop' narrows down the search by a massive factor."
        ]
      }
    ]
  },
  vi: {
    back: "Quay lại bộ giả lập",
    title: "Cỗ máy B-Tree",
    subtitle: "Tại sao B-Tree lại là 'trái tim' của các hệ thống dữ liệu quan trọng nhất thế giới.",
    sections: [
      {
        id: "WHY",
        title: "Vấn đề: Tại sao cần B-Tree?",
        color: "rose",
        text: [
          "Hãy tưởng tượng một cơ sở dữ liệu với hàng tỷ bản ghi. Nếu dùng Cây Nhị Phân (BST), cây sẽ rất sâu. Tìm một giá trị có thể mất 30-50 lần 'nhảy' giữa các node.",
          "Dữ liệu được lưu trên Đĩa (HDD/SSD). Mỗi lần nhảy giữa các node là một lần 'Đọc đĩa'. Đọc đĩa chậm hơn 100.000 lần so với thao tác trên RAM.",
          "B-Tree giải quyết bằng cách làm cây 'Thấp và Rộng'. Bằng cách lưu hàng trăm khóa trong 1 node, ta có thể truy cập hàng triệu bản ghi chỉ sau 3-4 lần đọc đĩa."
        ]
      },
      {
        id: "VS",
        title: "B-Tree vs B+ Tree",
        color: "sky",
        comparison: [
          {
            feature: "Lưu trữ dữ liệu",
            btree: "Khóa và dữ liệu lưu ở mọi node.",
            bplus: "Dữ liệu chỉ lưu ở node lá. Node trung gian chỉ chứa khóa điều hướng."
          },
          {
            feature: "Truy vấn theo khoảng",
            btree: "Chậm. Phải duyệt cây nhiều lần.",
            bplus: "Rất nhanh. Các node lá nối với nhau như một danh sách."
          },
          {
            feature: "Kích thước Node",
            btree: "Lớn (vì chứa cả dữ liệu).",
            bplus: "Nhỏ (không chứa dữ liệu), giúp chứa được nhiều khóa hơn trên 1 node."
          }
        ]
      },
      {
        id: "APPS",
        title: "Ứng dụng thực tế",
        color: "emerald",
        apps: [
          { name: "Cơ sở dữ liệu", desc: "MySQL (InnoDB), PostgreSQL, và MongoDB dùng B-Tree/B+ Tree để đánh chỉ mục (index)." },
          { name: "Hệ thống tệp", desc: "NTFS (Windows), APFS (Mac), và Ext4 (Linux) dùng chúng để quản lý danh mục tệp khổng lồ." },
          { name: "Công cụ tìm kiếm", desc: "Dùng để tổ chức chỉ mục từ khóa trên hàng tỷ tài liệu." }
        ]
      },
      {
        id: "PROS",
        title: "Ưu & Nhược điểm",
        color: "indigo",
        pros: ["Hiệu suất logarit (O(log n)) cho mọi thao tác.", "Tối ưu cho lưu trữ khối (Ổ cứng/SSD).", "Luôn tự động giữ cân bằng."],
        cons: ["Cài đặt phức tạp hơn nhiều so với cây nhị phân.", "Tốn nhiều bộ nhớ hơn cho mỗi node."]
      },
      {
        id: "EXAMPLE",
        title: "Kịch bản thực tế: Tìm kiếm theo khoảng",
        color: "amber",
        text: [
          "Kịch bản: Bạn có danh sách Nhân viên và muốn tìm tất cả những người có mức lương từ 10 triệu đến 20 triệu.",
          "Với B-Tree: Hệ thống phải tìm từng mức lương một hoặc thực hiện duyệt đệ quy phức tạp vì dữ liệu nằm rải rác ở nhiều tầng khác nhau.",
          "Với B+ Tree: Hệ thống chỉ cần tìm đến node lá chứa mức lương 10 triệu một lần duy nhất, sau đó chỉ việc đi theo các 'mũi tên nối' ở tầng đáy để lấy tất cả đến 20 triệu. Điều này cực kỳ nhanh cho các báo cáo và danh sách."
        ]
      },
      {
        id: "ANALOGY",
        title: "Ví dụ dễ hiểu: Thư viện",
        color: "amber",
        text: [
          "B-Tree giống như một Thư viện. Thay vì tìm từng cuốn sách (Cây nhị phân), bạn đi đến Tầng (Node), rồi đến Khu vực (Key Range), rồi đến Kệ sách (Child Node).",
          "Bạn tìm thấy sách nhanh hơn nhiều vì mỗi 'điểm dừng' thu hẹp phạm vi tìm kiếm đi rất nhiều lần."
        ]
      }
    ]
  }
};

export default function Docs({ onBack }: DocsProps) {
  const [lang, setLang] = useState<"en" | "vi">("vi");
  const t = content[lang];

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      rose: "bg-rose-500/20 text-rose-400",
      sky: "bg-sky-500/20 text-sky-400",
      emerald: "bg-emerald-500/20 text-emerald-400",
      indigo: "bg-indigo-500/20 text-indigo-400",
      amber: "bg-amber-500/20 text-amber-400"
    };
    return map[color] || map.sky;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 selection:bg-sky-500/30 relative custom-scrollbar">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto p-8 lg:p-16 space-y-20 relative z-10">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="text-sky-400 hover:text-sky-300 flex items-center gap-2 text-sm font-medium transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> {t.back}
            </button>
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-lg">
              {["vi", "en"].map((l) => (
                <button key={l} onClick={() => setLang(l as "en" | "vi")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === l ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-500 hover:text-slate-300"}`}>
                  {l === "vi" ? "TIẾNG VIỆT" : "ENGLISH"}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={lang} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <h1 className="text-5xl font-extrabold tracking-tight"><span className="gradient-text">B-Tree</span> {t.title}</h1>
              <p className="text-slate-400 text-lg max-w-3xl leading-relaxed mt-4">{t.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-16">
            {t.sections.map((section) => (
              <section key={section.id} className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-mono ${getColorClass(section.color)}`}>
                    {section.id}
                  </span>
                  {section.title}
                </h2>
                
                {section.text && (
                  <div className="glass-panel rounded-2xl p-8 space-y-4 leading-relaxed border border-slate-800/50 bg-slate-900/20 text-slate-300">
                    {section.text.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                )}

                {section.comparison && (
                  <div className="overflow-hidden rounded-2xl border border-slate-800/50 glass-panel">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-900/50 text-slate-400 text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Feature</th>
                          <th className="px-6 py-4">B-Tree</th>
                          <th className="px-6 py-4">B+ Tree</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {section.comparison.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                            <td className="px-6 py-4 font-bold text-sky-400">{row.feature}</td>
                            <td className="px-6 py-4 text-slate-300">{row.btree}</td>
                            <td className="px-6 py-4 text-slate-300">{row.bplus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.apps && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {section.apps.map((app, i) => (
                      <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-800/50 hover:border-emerald-500/30 transition-all group">
                        <h3 className="font-bold text-emerald-400 mb-2 group-hover:scale-105 transition-transform">{app.name}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{app.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.pros && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-8 rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
                      <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">✓ Pros</h3>
                      <ul className="space-y-2 text-sm text-slate-400">
                        {section.pros.map((p, i) => <li key={i} className="flex gap-2"><span>•</span>{p}</li>)}
                      </ul>
                    </div>
                    <div className="glass-panel p-8 rounded-2xl border border-rose-500/10 bg-rose-500/5">
                      <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2">✗ Cons</h3>
                      <ul className="space-y-2 text-sm text-slate-400">
                        {section.cons?.map((c, i) => <li key={i} className="flex gap-2"><span>•</span>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </section>
            ))}
            
            <footer className="pt-10 border-t border-slate-800/50 text-center text-slate-500 text-xs">
              <p>© 2026 B-Tree Visualizer Pro. Designed with ❤️ for Developers.</p>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

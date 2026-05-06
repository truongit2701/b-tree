# B-Tree Visualizer Pro 🚀

A high-performance, interactive B-Tree visualization tool built with React and TypeScript. This project helps students and developers understand the internal mechanics of B-Trees through real-time animations and detailed operation logs.

![B-Tree Visualization](https://img.shields.io/badge/B--Tree-Visualizer-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

## ✨ Features

- **Interactive Operations**: Perform `Insert`, `Search`, and `Delete` operations on a B-Tree (Minimum Degree $t=2$).
- **Live Operation Logs**: Step-by-step technical logs explaining every internal action (Splitting nodes, promoting keys, merging nodes, borrowing from siblings).
- **Intelligent Path Visualization**: Search operations highlight the exact traversal path from the root to the target key.
- **Dynamic Layout**: A robust recursive layout algorithm that prevents node overlapping and adapts to any tree structure.
- **Premium Aesthetics**: Dark mode interface with glassmorphism effects, smooth spring animations, and glow highlights.
- **Step-by-Step History**: Review previous states of the tree using the history panel.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript (Type-safe operations)
- **Bundler**: Vite
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **Algorithm**: Standard B-Tree ($t=2$) logic implemented from scratch.

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run development server**:
   ```bash
   npm run dev
   ```
4. **Open the app**: Navigate to `http://localhost:5173`

## 📖 B-Tree Rules ($t=2$)

- Each node (except root) must have at least $t-1 = 1$ key.
- Each node can have at most $2t-1 = 3$ keys.
- A non-leaf node with $n$ keys has $n+1$ children.
- All leaves are at the same depth.
- Nodes are split when they exceed 3 keys.

---
Developed with ❤️ by [Your Name/Team]

import { motion } from "framer-motion";

const NODE_WIDTH_PER_KEY = 45;
const NODE_HEIGHT = 40;
const LEVEL_SPACING = 100;
const HORIZONTAL_SPACING = 40;

const getSubtreeWidth = (node: any): number => {
  const nodeWidth = Math.max(60, node.keys.length * NODE_WIDTH_PER_KEY);
  if (!node.children || node.children.length === 0) {
    return nodeWidth + HORIZONTAL_SPACING;
  }
  
  const childrenWidth = node.children.reduce((acc: number, child: any) => acc + getSubtreeWidth(child), 0);
  return Math.max(nodeWidth + HORIZONTAL_SPACING, childrenWidth);
};

interface TreeNodeProps {
  node: any;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

const TreeNode = ({ node, x, y, parentX, parentY }: TreeNodeProps) => {
  const nodeWidth = Math.max(60, node.keys.length * NODE_WIDTH_PER_KEY);
  
  // Calculate starting X for children to center them under this node
  const totalSubtreeWidth = getSubtreeWidth(node) - HORIZONTAL_SPACING;
  let currentX = x + (nodeWidth / 2) - (totalSubtreeWidth / 2);

  return (
    <g>
      {/* Connector from parent */}
      {parentX !== undefined && (
        <motion.line
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: node.isInPath ? 0.8 : 0.4,
            stroke: node.isInPath 
              ? (node.isBPlus ? "#818cf8" : "#10b981") 
              : (node.isBPlus ? "#6366f1" : "#38bdf8")
          }}
          transition={{ duration: 0.8 }}
          x1={parentX}
          y1={parentY}
          x2={x + nodeWidth / 2}
          y2={y}
          strokeWidth={node.isInPath ? "3" : "2"}
          strokeDasharray={node.isInPath ? "none" : "4 2"}
        />
      )}

      {/* Node Box */}
      <motion.g
        layout
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          filter: node.isInPath 
            ? (node.isBPlus ? "drop-shadow(0 0 12px rgba(129, 140, 248, 0.6))" : "drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))") 
            : "drop-shadow(0 0 8px rgba(14, 165, 233, 0.2))"
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <motion.rect
          layout
          x={x}
          y={y}
          width={nodeWidth}
          height={NODE_HEIGHT}
          rx={8}
          animate={node.isInPath ? {
            strokeWidth: [2, 5, 2],
            transition: { repeat: Infinity, duration: 2 }
          } : { strokeWidth: 2 }}
          className={`fill-slate-900/90 stroke-2 transition-colors duration-500 ${
            node.isInPath 
              ? (node.isBPlus ? "stroke-indigo-400" : "stroke-emerald-400") 
              : (node.isBPlus ? "stroke-indigo-500/30" : "stroke-sky-500/30")
          }`}
        />
        
        {/* Keys */}
        {node.keys.map((keyObj: any, i: number) => (
          <g key={`${keyObj.value}-${i}`}>
            {keyObj.isTarget && (
              <motion.rect
                layoutId="search-highlight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                x={x + i * NODE_WIDTH_PER_KEY + 4}
                y={y + 4}
                width={NODE_WIDTH_PER_KEY - 8}
                height={NODE_HEIGHT - 8}
                rx={4}
                className="fill-emerald-500/30 stroke-emerald-400 stroke-1"
              />
            )}
            <text
              x={x + i * NODE_WIDTH_PER_KEY + NODE_WIDTH_PER_KEY / 2}
              y={y + NODE_HEIGHT / 2 + 5}
              textAnchor="middle"
              className={`${keyObj.isTarget ? 'fill-emerald-300 font-bold' : 'fill-slate-100 font-bold'} text-sm select-none transition-colors duration-300`}
            >
              {keyObj.value}
            </text>
            {/* Divider lines between keys */}
            {i < node.keys.length - 1 && (
              <line
                x1={x + (i + 1) * NODE_WIDTH_PER_KEY}
                y1={y + 8}
                x2={x + (i + 1) * NODE_WIDTH_PER_KEY}
                y2={y + NODE_HEIGHT - 8}
                stroke={node.isInPath ? "rgba(16, 185, 129, 0.2)" : "rgba(14, 165, 233, 0.2)"}
                strokeWidth="1"
              />
            )}
          </g>
        ))}
      </motion.g>

      {/* Render Children */}
      {node.children && node.children.map((child: any, i: number) => {
        const childSubtreeWidth = getSubtreeWidth(child);
        const childX = currentX + (childSubtreeWidth / 2) - (Math.max(60, child.keys.length * NODE_WIDTH_PER_KEY) / 2);
        
        // Calculate parent anchor point (between keys)
        // In a B-Tree, child i is between key i-1 and key i
        const anchorX = x + i * NODE_WIDTH_PER_KEY;
        
        const result = (
          <TreeNode
            key={`${child.keys.map((k: any) => k.value).join("-")}-${i}`}
            node={child}
            x={childX}
            y={y + LEVEL_SPACING}
            parentX={anchorX}
            parentY={y + NODE_HEIGHT}
          />
        );
        currentX += childSubtreeWidth;
        return result;
      })}
    </g>
  );
};

interface TreeViewProps {
  tree: any;
}

export default function TreeView({ tree }: TreeViewProps) {
  if (!tree) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center animate-pulse">
           <span className="text-2xl">?</span>
        </div>
        <p className="font-medium text-slate-400">Start by inserting a value</p>
      </div>
    );
  }

  // Calculate total width to center the tree
  const totalWidth = getSubtreeWidth(tree);
  const viewportWidth = Math.max(1000, totalWidth + 100);

  return (
    <div className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing scrollbar-hide">
      <svg 
        width={viewportWidth} 
        height="800" 
        viewBox={`0 0 ${viewportWidth} 800`}
        className="mx-auto"
      >
        <TreeNode 
          node={tree} 
          x={(viewportWidth / 2) - (Math.max(60, tree.keys.length * NODE_WIDTH_PER_KEY) / 2)} 
          y={60} 
        />
      </svg>
    </div>
  );
}
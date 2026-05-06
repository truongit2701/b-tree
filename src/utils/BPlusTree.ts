export class BPlusTreeNode {
  t: number;
  keys: number[];
  children: BPlusTreeNode[];
  isLeaf: boolean;
  next: BPlusTreeNode | null = null; // Linked list of leaf nodes

  constructor(t: number, isLeaf: boolean = true) {
    this.t = t;
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}

export interface BPlusTreeLog {
  id: string;
  timestamp: string;
  message: string;
}

export interface SnapshotNode {
  keys: { value: number; isTarget: boolean; isPath: boolean }[];
  isLeaf: boolean;
  isInPath: boolean;
  children: SnapshotNode[];
  isBPlus?: boolean;
}

export class BPlusTree {
  root: BPlusTreeNode;
  t: number;
  logs: BPlusTreeLog[];

  constructor(t: number) {
    this.root = new BPlusTreeNode(t, true);
    this.t = t;
    this.logs = [];
  }

  addLog(msg: string) {
    this.logs.push({
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString(),
      message: msg
    });
  }

  clearLogs() {
    this.logs = [];
  }

  getSnapshot(node: BPlusTreeNode = this.root, targetValue: number | null = null, path: BPlusTreeNode[] = []): SnapshotNode | null {
    if (!node) return null;
    const isInPath = path.includes(node);
    
    return {
      keys: node.keys.map(k => ({ 
        value: k, 
        isTarget: k === targetValue,
        isPath: isInPath
      })),
      isLeaf: node.isLeaf,
      isInPath: isInPath,
      children: node.children ? node.children.map((child) => this.getSnapshot(child, targetValue, path)!) : [],
      isBPlus: true
    };
  }

  getSearchPath(x: BPlusTreeNode, k: number, path: BPlusTreeNode[] = []): BPlusTreeNode[] {
    path.push(x);
    let i = 0;
    while (i < x.keys.length && k >= x.keys[i]) {
      i++;
    }
    if (x.isLeaf) return path;
    
    // In B+ Tree, even if found in internal node, we MUST go down to leaf
    // because all data is in leaves.
    // If k is found in internal node, it means we go to children[i]
    return this.getSearchPath(x.children[i], k, path);
  }

  insert(k: number) {
    this.addLog(`[B+] Inserting ${k}`);
    let root = this.root;
    if (root.keys.length === 2 * this.t - 1) {
      let s = new BPlusTreeNode(this.t, false);
      this.root = s;
      s.children.push(root);
      this.splitChild(s, 0, root);
      this.insertNonFull(s, k);
    } else {
      this.insertNonFull(root, k);
    }
  }

  splitChild(x: BPlusTreeNode, i: number, y: BPlusTreeNode) {
    let t = this.t;
    let z = new BPlusTreeNode(t, y.isLeaf);
    
    if (y.isLeaf) {
      // Leaf split: keep middle key in right node
      for (let j = 0; j < t; j++) {
        z.keys.push(y.keys[j + t - 1]);
      }
      y.keys.length = t - 1;
      
      // Linked list maintenance
      z.next = y.next;
      y.next = z;
      
      const promotedKey = z.keys[0];
      this.addLog(`[B+] Split leaf. Promoted ${promotedKey} to parent (keeping copy in leaf).`);
      x.keys.splice(i, 0, promotedKey);
      x.children.splice(i + 1, 0, z);
    } else {
      // Internal split: standard B-Tree split
      const middleKey = y.keys[t - 1];
      for (let j = 0; j < t - 1; j++) {
        z.keys.push(y.keys[j + t]);
      }
      for (let j = 0; j < t; j++) {
        z.children.push(y.children[j + t]);
      }
      y.keys.length = t - 1;
      y.children.length = t;
      
      this.addLog(`[B+] Split internal. Promoted ${middleKey} to parent.`);
      x.keys.splice(i, 0, middleKey);
      x.children.splice(i + 1, 0, z);
    }
  }

  insertNonFull(x: BPlusTreeNode, k: number) {
    let i = x.keys.length - 1;
    if (x.isLeaf) {
      while (i >= 0 && x.keys[i] > k) {
        i--;
      }
      if (x.keys[i] === k) {
        this.addLog(`[B+] ${k} already exists in leaf.`);
        return;
      }
      x.keys.splice(i + 1, 0, k);
    } else {
      while (i >= 0 && x.keys[i] > k) {
        i--;
      }
      i++;
      if (x.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(x, i, x.children[i]);
        if (x.keys[i] <= k) {
          i++;
        }
      }
      this.insertNonFull(x.children[i], k);
    }
  }

  search(x: BPlusTreeNode, k: number): { node: BPlusTreeNode; index: number } | null {
    let i = 0;
    while (i < x.keys.length && k >= x.keys[i]) {
      i++;
    }
    if (x.isLeaf) {
      // Find exact match in leaf
      let idx = x.keys.indexOf(k);
      if (idx !== -1) {
        this.addLog(`[B+] Found ${k} in leaf node.`);
        return { node: x, index: idx };
      }
      this.addLog(`[B+] ${k} not found in leaf.`);
      return null;
    }
    return this.search(x.children[i], k);
  }

  // Simplified Delete for Visualization (Redirecting to leaf and removing)
  // Real B+ Tree delete is complex, here we do basic rebalancing
  delete(k: number) {
    this.addLog(`[B+] Deleting ${k}`);
    this.deleteRecursive(this.root, k);
    if (this.root.keys.length === 0 && !this.root.isLeaf) {
      this.root = this.root.children[0];
    }
  }

  deleteRecursive(x: BPlusTreeNode, k: number) {
    let t = this.t;
    let i = 0;
    while (i < x.keys.length && k >= x.keys[i]) {
      i++;
    }

    if (x.isLeaf) {
      let idx = x.keys.indexOf(k);
      if (idx !== -1) {
        x.keys.splice(idx, 1);
        // If the key was the first key of leaf, we might need to update parent separators
        // but for visualization, we'll keep it simple or the separator logic will be complex.
      }
      return;
    }

    // Go down
    if (x.children[i].keys.length < t) {
      this.fill(x, i);
      // Re-calculate i after rebalancing
      i = 0;
      while (i < x.keys.length && k >= x.keys[i]) {
        i++;
      }
    }
    this.deleteRecursive(x.children[i], k);
  }

  fill(x: BPlusTreeNode, i: number) {
    let t = this.t;
    if (i !== 0 && x.children[i - 1].keys.length >= t) {
      this.borrowFromPrev(x, i);
    } else if (i !== x.keys.length && x.children[i + 1].keys.length >= t) {
      this.borrowFromNext(x, i);
    } else {
      if (i !== x.keys.length) {
        this.merge(x, i, x.children[i], x.children[i + 1]);
      } else {
        this.merge(x, i - 1, x.children[i - 1], x.children[i]);
      }
    }
  }

  borrowFromPrev(x: BPlusTreeNode, i: number) {
    let child = x.children[i];
    let sibling = x.children[i - 1];
    if (child.isLeaf) {
      child.keys.unshift(sibling.keys.pop()!);
      x.keys[i - 1] = child.keys[0];
    } else {
      child.keys.unshift(x.keys[i - 1]);
      x.keys[i - 1] = sibling.keys.pop()!;
      child.children.unshift(sibling.children.pop()!);
    }
  }

  borrowFromNext(x: BPlusTreeNode, i: number) {
    let child = x.children[i];
    let sibling = x.children[i + 1];
    if (child.isLeaf) {
      child.keys.push(sibling.keys.shift()!);
      x.keys[i] = sibling.keys[0];
    } else {
      child.keys.push(x.keys[i]);
      x.keys[i] = sibling.keys.shift()!;
      child.children.push(sibling.children.shift()!);
    }
  }

  merge(x: BPlusTreeNode, i: number, y: BPlusTreeNode, z: BPlusTreeNode) {
    if (y.isLeaf) {
      for (let k of z.keys) y.keys.push(k);
      y.next = z.next;
    } else {
      y.keys.push(x.keys[i]);
      for (let k of z.keys) y.keys.push(k);
      for (let c of z.children) y.children.push(c);
    }
    x.keys.splice(i, 1);
    x.children.splice(i + 1, 1);
  }
}

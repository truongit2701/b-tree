export class BTreeNode {
  constructor(t, isLeaf = true) {
    this.t = t; // Minimum degree
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}

export class BTree {
  constructor(t) {
    this.root = new BTreeNode(t, true);
    this.t = t;
    this.logs = [];
  }

  addLog(msg) {
    this.logs.push({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message: msg
    });
  }

  clearLogs() {
    this.logs = [];
  }

  // Get a deep copy of the current tree for visualization
  getSnapshot(node = this.root, targetValue = null, path = []) {
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
      children: node.children ? node.children.map((child) => this.getSnapshot(child, targetValue, path)) : [],
    };
  }

  getSearchPath(x, k, path = []) {
    path.push(x);
    let i = 0;
    while (i < x.keys.length && k > x.keys[i]) {
      i++;
    }
    if (i < x.keys.length && k === x.keys[i]) {
      return path;
    }
    if (x.isLeaf) {
      return path;
    }
    return this.getSearchPath(x.children[i], k, path);
  }

  insert(k) {
    this.addLog(`Inserting value: ${k}`);
    let root = this.root;
    if (root.keys.length === 2 * this.t - 1) {
      this.addLog(`Root is full (max keys = ${2 * this.t - 1}). Splitting root...`);
      let s = new BTreeNode(this.t, false);
      this.root = s;
      s.children.push(root);
      this.splitChild(s, 0, root);
      this.insertNonFull(s, k);
    } else {
      this.insertNonFull(root, k);
    }
  }

  splitChild(x, i, y) {
    let t = this.t;
    let z = new BTreeNode(t, y.isLeaf);
    const middleKey = y.keys[t - 1];
    
    this.addLog(`Splitting node [${y.keys.join(", ")}]. Promoting middle key ${middleKey} to parent.`);
    
    // z gets the last t-1 keys of y
    for (let j = 0; j < t - 1; j++) {
      z.keys.push(y.keys[j + t]);
    }
    
    // If y is not a leaf, z gets the last t children of y
    if (!y.isLeaf) {
      for (let j = 0; j < t; j++) {
        z.children.push(y.children[j + t]);
      }
    }

    // y keeps only the first t-1 keys
    y.keys.length = t - 1;
    
    // y keeps only the first t children
    if (!y.isLeaf) {
      y.children.length = t;
    }

    // Insert z into x's children
    x.children.splice(i + 1, 0, z);
    
    // Insert middle key into x's keys
    x.keys.splice(i, 0, middleKey);
  }

  insertNonFull(x, k) {
    let i = x.keys.length - 1;

    if (x.isLeaf) {
      // Find position for new key and shift existing keys
      while (i >= 0 && x.keys[i] > k) {
        i--;
      }
      x.keys.splice(i + 1, 0, k);
    } else {
      // Find the child which is going to have the new key
      while (i >= 0 && x.keys[i] > k) {
        i--;
      }
      i++;
      
      // If the child is full, split it
      if (x.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(x, i, x.children[i]);
        
        // After split, the middle key of children[i] moves up and
        // children[i] is split into two. See which of the two
        // is going to have the new key
        if (x.keys[i] < k) {
          i++;
        }
      }
      this.insertNonFull(x.children[i], k);
    }
  }

  search(x, k) {
    let i = 0;
    while (i < x.keys.length && k > x.keys[i]) {
      i++;
    }
    this.addLog(`Searching in node [${x.keys.join(", ")}]. Comparing ${k} with keys...`);
    
    if (i < x.keys.length && k === x.keys[i]) {
      this.addLog(`Found ${k} at index ${i}!`);
      return { node: x, index: i };
    }
    if (x.isLeaf) {
      this.addLog(`${k} not found in this leaf node.`);
      return null;
    }
    this.addLog(`${k} is ${k < x.keys[i] ? "smaller than" : "larger than"} key at index ${i}. Moving to child ${i}.`);
    return this.search(x.children[i], k);
  }

  delete(k) {
    this.addLog(`Deleting value: ${k}`);
    this.deleteRecursive(this.root, k);
    if (this.root.keys.length === 0 && !this.root.isLeaf) {
      this.addLog(`Root is empty, replacing with its only child.`);
      this.root = this.root.children[0];
    }
  }

  deleteRecursive(x, k) {
    let t = this.t;
    let i = 0;
    while (i < x.keys.length && k > x.keys[i]) {
      i++;
    }

    if (i < x.keys.length && k === x.keys[i]) {
      if (x.isLeaf) {
        // Case 1: Key is in leaf node
        x.keys.splice(i, 1);
      } else {
        // Case 2: Key is in internal node
        let y = x.children[i];
        let z = x.children[i + 1];
        if (y.keys.length >= t) {
          let pred = this.getPredecessor(y);
          x.keys[i] = pred;
          this.deleteRecursive(y, pred);
        } else if (z.keys.length >= t) {
          let succ = this.getSuccessor(z);
          x.keys[i] = succ;
          this.deleteRecursive(z, succ);
        } else {
          this.merge(x, i, y, z);
          this.deleteRecursive(y, k);
        }
      }
    } else {
      // Case 3: Key is not in current node
      if (x.isLeaf) return; // Key not present

      let flag = (i === x.keys.length);
      if (x.children[i].keys.length < t) {
        this.fill(x, i);
      }

      if (flag && i > x.keys.length) {
        this.deleteRecursive(x.children[i - 1], k);
      } else {
        this.deleteRecursive(x.children[i], k);
      }
    }
  }

  getPredecessor(x) {
    while (!x.isLeaf) {
      x = x.children[x.keys.length];
    }
    return x.keys[x.keys.length - 1];
  }

  getSuccessor(x) {
    while (!x.isLeaf) {
      x = x.children[0];
    }
    return x.keys[0];
  }

  fill(x, i) {
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

  borrowFromPrev(x, i) {
    let child = x.children[i];
    let sibling = x.children[i - 1];

    child.keys.splice(0, 0, x.keys[i - 1]);
    if (!child.isLeaf) {
      child.children.splice(0, 0, sibling.children.pop());
    }
    x.keys[i - 1] = sibling.keys.pop();
  }

  borrowFromNext(x, i) {
    let child = x.children[i];
    let sibling = x.children[i + 1];

    child.keys.push(x.keys[i]);
    if (!child.isLeaf) {
      child.children.push(sibling.children.shift());
    }
    x.keys[i] = sibling.keys.shift();
  }

  merge(x, i, y, z) {
    y.keys.push(x.keys[i]);
    for (let j = 0; j < z.keys.length; j++) {
      y.keys.push(z.keys[j]);
    }
    if (!y.isLeaf) {
      for (let j = 0; j < z.children.length; j++) {
        y.children.push(z.children[j]);
      }
    }
    x.keys.splice(i, 1);
    x.children.splice(i + 1, 1);
  }
}

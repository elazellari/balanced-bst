class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(sortedArray, 0, sortedArray.length - 1);
  }

  buildTree(array, start, end) {
    if (start > end) {
      return null;
    }

    let mid = Math.floor((start + end) / 2);

    let root = new Node(array[mid]);

    root.left = this.buildTree(array, start, mid - 1);
    root.right = this.buildTree(array, mid + 1, end);

    return root;
  }

  insert(root, value) {
    if (root === null) {
      return new Node(value);
    }

    if (root.data === value) {
      return root;
    }
    if (value < root.data) {
      root.left = this.insert(root.left, value);
    } else if (value > root.data) {
      root.right = this.insert(root.right, value);
    }
    return root;
  }

  insertValue(value) {
    this.root = this.insert(this.root, value);
  }

  findNext(curr) {
    curr = curr.right;

    while (curr !== null && curr.left !== null) {
      curr = curr.left;
    }
    return curr;
  }

  deleteItem(root, value) {
    if (root === null) {
      return root;
    }

    if (root.data > value) {
      root.left = this.deleteItem(root.left, value);
    } else if (root.data < value) {
      root.right = this.deleteItem(root.right, value);
    } else {
      if (root.left === null) {
        return root.right;
      }

      if (root.right === null) {
        return root.left;
      }

      let next = this.findNext(root);
      root.data = next.value;
      root.right = this.deleteItem(root.right, next.value);
    }
    return root;
  }

  find(root, value) {
    if (root === null) {
      return null;
    }

    if (root.data === value) {
      return root;
    } else if (root.data < value) {
      return this.find(root.left, value);
    } else {
      return this.find(root.right, value);
    }
  }

  findValue(value) {
    return this.find(this.root, value);
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("Need Callback function");
    }

    const queue = [];
    if (this.root) queue.push(this.root);

    while (queue.length > 0) {
      const current = queue.shift();
      callback(current);

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  inOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("Type of callback is not function");
    }

    function traverse(node) {
      if (node === null) return;

      traverse(node.left);
      callback(node);
      traverse(node.right);
    }
    traverse(this.root);
  }

  preOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("Type of callback is not function");
    }

    function traverse(node) {
      if (node === null) return;

      callback(node);
      traverse(node.left);
      traverse(node.right);
    }
    traverse(this.root);
  }

  postOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("Type of callback is not function");
    }
    function traverse(node) {
      if (node === null) return;

      traverse(node.left);
      traverse(node.right);
      callback(node);
    }
    traverse(this.root);
  }

  getHeight(node) {
    if (node === null) return -1;

    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  height(value) {
    const node = this.find(this.root, value);

    if (node === null) return -1;

    return this.getHeight(node);
  }

  getDepth(root, node) {
    if (root === null) return -1;

    if (root === node) {
      return 0;
    }
    let leftDepth = this.getDepth(root.left, node);
    if (leftDepth !== -1) return leftDepth + 1;
    let rightDepth = this.getDepth(root.right, node);
    if (rightDepth !== -1) return rightDepth + 1;

    return -1;
  }

  depth(value) {
    const node = this.find(this.root, value);
    if (node === null) return -1;
    return this.getDepth(this.root, node);
  }

  isBalanced(root) {
    if (root === null) return true;

    let leftHeight = this.getHeight(root.left);
    let rightHeight = this.getHeight(root.right);

    if (Math.abs(leftHeight - rightHeight) > 1) return false;

    return this.isBalanced(root.left) && this.isBalanced(root.right);
  }

  inOrder(node, sorted) {
    if (node === null) return;

    this.inOrder(node.left, sorted);
    sorted.push(node.data);
    this.inOrder(node.right, sorted);
  }

  rebalance() {
    const sortedValues = [];

    this.inOrder(this.root, sortedValues);

    this.root = this.buildTree(sortedValues, 0, sortedValues.length - 1);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function randomArray(size) {
  let arr = [];

  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 100) + 1);
  }

  return arr;
}

let arr = randomArray(15);

let tree = new Tree(arr);

console.log("Initial random array: ", arr);
console.log("Tree created");
console.log("Is tree balanced ? ", tree.isBalanced(tree.root));
console.log(
  "Level-order: ",
  tree.levelOrderForEach((node) => console.log(node.data))
);
console.log(
  "In order: ",
  tree.inOrderForEach((node) => console.log(node.data))
);
console.log(
  "Pre order: ",
  tree.preOrderForEach((node) => console.log(node.data))
);
console.log(
  "Post order: ",
  tree.postOrderForEach((node) => console.log(node.data))
);
tree.insertValue(150);
tree.insertValue(200);
tree.insertValue(250);
tree.insertValue(400);

console.log("Is tree balanced ? ", tree.isBalanced(tree.root));

tree.rebalance();

console.log("Tree rebalanced");
console.log("Is tree balanced ? ", tree.isBalanced(tree.root));

console.log(
  "Level-order: ",
  tree.levelOrderForEach((node) => console.log(node.data))
);
console.log(
  "In order: ",
  tree.inOrderForEach((node) => console.log(node.data))
);
console.log(
  "Pre order: ",
  tree.preOrderForEach((node) => console.log(node.data))
);
console.log(
  "Post order: ",
  tree.postOrderForEach((node) => console.log(node.data))
);

console.log(prettyPrint(tree.root));

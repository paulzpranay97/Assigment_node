// traversal output :  L,F,G,B,H,I,C,J,D,K,E,A

// run the command "node qus_one.js" in terminal to show the output
class treeNode {
    constructor(value) {
        this.value = value; 
        this.children = []; 
    }
}

let root = new treeNode('A');
// 1st level
let nodeB = new treeNode('B');
let nodeC = new treeNode('C');
let nodeD = new treeNode('D');
let nodeE = new treeNode('E');

// 2nd level 
let nodeF = new treeNode('F');
let nodeG = new treeNode('G');
let nodeH = new treeNode('H');
let nodeI = new treeNode('I');
let nodeJ = new treeNode('J');
let nodeK = new treeNode('K');

// Level 3 node
let nodeL = new treeNode('L');

// Node A
root.children.push(nodeB, nodeC, nodeD, nodeE);

// Node B
nodeB.children.push(nodeF, nodeG);

// Node C
nodeC.children.push(nodeH, nodeI);

// Node D
nodeD.children.push(nodeJ);

// Node E
nodeE.children.push(nodeK);

// Node F
nodeF.children.push(nodeL);

// Function for traversal
function traversal(node) {
    let result = [];

    function traverse(node) {
        if (!node) return;


        for (let i = 0; i < node.children.length; i++) {
            traverse(node.children[i]);
        }

        result.push(node.value);
    }

    traverse(node);

    console.log('traversal output : ' , result.join(','));
}

traversal(root);

//THE IMPORT WONT WORK FUCK
//import tree
//import {Node, Tree} from 'treeDataStruct';

//GLOBAL VAR
var gBoard = [];
for (var i = 0; i <= 2; i++) {
  gBoard[i] = [];
}

function readBoard() {
	gBoard[0][0] = document.getElementById("0").innerHTML; 
	gBoard[0][1] = document.getElementById("1").innerHTML; 
	gBoard[0][2] = document.getElementById("2").innerHTML; 
	gBoard[1][0] = document.getElementById("3").innerHTML; 
	gBoard[1][1] = document.getElementById("4").innerHTML; 
	gBoard[1][2] = document.getElementById("5").innerHTML; 
	gBoard[2][0] = document.getElementById("6").innerHTML; 
	gBoard[2][1] = document.getElementById("7").innerHTML; 
	gBoard[2][2] = document.getElementById("8").innerHTML; 
}

function applyBoard() {
	change(0,gBoard[0][0]);
	change(1,gBoard[0][1]);
	change(2,gBoard[0][2]);
	change(3,gBoard[1][0]);
	change(4,gBoard[1][1]);
	change(5,gBoard[1][2]);
	change(6,gBoard[2][0]);
	change(7,gBoard[2][1]);
	change(8,gBoard[2][2]);
}

function change(id, data) {
	document.getElementById(id).innerHTML = data;
}

function resetGame() {
	for (var i=0;i<=8;i++) {
		change(i,"");
	}
}

function test() {
	var tree = new Tree("yes");
	change(0,tree._root.data);
}

function log(data) {
  document.getElementById("msg").innerHTML += "<br>" + data;
}

//------------------------------------------------------------------------ imported from google script, might need to be reworked
function takeTurn() {

  readBoard();
  
  //new tree, assign board and data to the root node
  var tree = new Tree(0);
  tree._root.board = gBoard;
  tree._root.data = whoWon(tree._root.board);
  tree._root.id = toID(tree._root.board);
  //construct a tree for each possible move, stop if anyone has won
  makeTree(tree._root);
}

//this is fucked, i shoudl rewrite everything
function makeTree(node) {
  function createNewNode(node) {
    if (node.data === 0) {
      log("Creating children for node" )
      for (var i=0;i<=2;i++) {
        for (var j=0;j<=2;j++) {
          log("calling assignNewNode(" + i + j + ")" + "by node with id : " + node.id);
          
          if (node.board[i][j] != "X" && node.board[i][j] != "O") {
          
            log("creating new node, depth : " + node.getDepth() + ", id : " + node.id);
            
            var nNode = new Node("xxx");
            nNode.parent = node;
            nNode.board = node.board;
            
            if (node.getDepth()%2 == 1) {
              nNode.board[i][j] = "X";
            } else {
              nNode.board[i][j] = "O";
            }
            
            nNode.id= toID(nNode.board);
            nNode.data = whoWon(nNode.board);
            
            log("winner ? : " + nNode.data);
            
            for (var ix=0;ix<=2;ix++) {
                log("." + nNode.board[ix][0] + "|" + "." + nNode.board[ix][1] + "|" + "." + nNode.board[ix][2]);
            }

            node.children.push(nNode);
            
            log("calling makeTree");
            createNewNode(nNode);
            log("called makeTree");
        } else {log("space taken at : " + i + "," + j)}

        }
      } 
    }
  } createNewNode(node);
}

function assignNewNode(node, i,j) {

}
//takes in a board and returns a unique id for that board
//to be reworked, the id isnt unique rn
function toID(xBoard) { 
  var id = "";
  for (i = 0; i<=2;i++) {
    for (j =0; j<=2; j++) {
      id += "[" + i + j + "." + xBoard[i][j] + "]";
    }
  }
  return id;
}  

//takes a board, checks if anyone has won,
//returns a 0 if noone won yet, -1 if AI (x) won, 1 if player (o) won
//holy shit is this inelegant
function whoWon(hBoard) {
  var result = 0;
  if (hBoard[0][0] == "X" && hBoard[0][1] == "X" && hBoard[0][2] == "X") {result = -1;}
  if (hBoard[1][0] == "X" && hBoard[1][1] == "X" && hBoard[1][2] == "X") {result = -1;}
  if (hBoard[2][0] == "X" && hBoard[2][1] == "X" && hBoard[2][2] == "X") {result = -1;}
  if (hBoard[0][0] == "X" && hBoard[1][0] == "X" && hBoard[2][0] == "X") {result = -1;}
  if (hBoard[0][1] == "X" && hBoard[1][1] == "X" && hBoard[2][1] == "X") {result = -1;}
  if (hBoard[0][2] == "X" && hBoard[1][1] == "X" && hBoard[2][2] == "X") {result = -1;}
  if (hBoard[0][0] == "X" && hBoard[1][1] == "X" && hBoard[2][2] == "X") {result = -1;}
  if (hBoard[0][2] == "X" && hBoard[1][1] == "X" && hBoard[2][0] == "X") {result = -1;}
  
  if (hBoard[0][0] == "O" && hBoard[0][1] == "O" && hBoard[0][2] == "O") {result = 1;}
  if (hBoard[1][0] == "O" && hBoard[1][1] == "O" && hBoard[1][2] == "O") {result = 1;}
  if (hBoard[2][0] == "O" && hBoard[2][1] == "O" && hBoard[2][2] == "O") {result = 1;}
  if (hBoard[0][0] == "O" && hBoard[1][0] == "O" && hBoard[2][0] == "O") {result = 1;}
  if (hBoard[0][1] == "O" && hBoard[1][1] == "O" && hBoard[2][1] == "O") {result = 1;}
  if (hBoard[0][2] == "O" && hBoard[1][1] == "O" && hBoard[2][2] == "O") {result = 1;}
  if (hBoard[0][0] == "O" && hBoard[1][1] == "O" && hBoard[2][2] == "O") {result = 1;}
  if (hBoard[0][2] == "O" && hBoard[1][1] == "O" && hBoard[2][0] == "O") {result = 1;}
  
  //msgRange.getCell(1,1).setValue("whoWon result : " + result);
  return result;
  
}
 

//-------------------------------------------------------------------------------------------------------
//TREE DATA STRUCTURE START
//-------------------------------------------------------------------------------------------------------
// Tree data struct, Node constructor
function Node(data) {
  this.data = data;
  this.parent = null;
  this.children = [];
  this.id = undefined;
  this.board = undefined;
}

// Tree data struct, Tree constructor
function Tree(data) {
  var node = new Node(data);
  this._root = node;
}

Node.prototype.getDepth = function () {
  var depth = 0,
      currentNode = this;
  while(currentNode.parent) {
    depth++;
    currentNode = currentNode.parent;
  }
  return depth;
};
  
//Tree data struct, traverse Depth first function
Tree.prototype.traverseDF = function(callback) {
  function recurse(currentNode) {
    for (var i = 0, length = currentNode.children.length; i < length; i++) {
      recurse(currentNode.children[i]);
    }
    callback(currentNode);
  }
  recurse(this._root);
};

//Tree data struct, traverse Breadth first function
Tree.prototype.traverseBF = function(callback) {
  var queue = new Queue();
  queue.enqueue(this._root);
  currentNode = queue.dequeue();
  
  while (currentNode) {
    for (var i = 0, length = currentNode.children.length; i<length;i++) {
      queue.enqueue(currentNode.children[i]);
    }
    
    callback(currentNode);
    currentNode = queue.dequeue();
  }
};

//Queue constructor
//doc : https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
function Queue() {
  this.data = [];
}
//adds an entry the end of the queue
Queue.prototype.enqueue = function(record) {
  this.data.unshift(record);
};
//removes and return the first entry in the queue
Queue.prototype.dequeue = function() {
  return this.data.pop();
};
//Returns the first entry in the queue
Queue.prototype.first = function() {
  return this.data[0];
};
//Returns the last entry in the queue
Queue.prototype.last = function () {
  return this.data[this.data.length -1];
};
//Returns the size of the queue
Queue.prototype.size = function() {
  return this.data.length;
};

//Contains prototype
Tree.prototype.contains = function (callback, traversal) {
  traversal.call(this, callback);
};

//Add a node prototype
Tree.prototype.treeAdd = function (data, toData, traversal) {
  var child = new Node(data),
      parent = null,
      callback = function (node) {
        if (node.data === toData) {
          parent = node;
        }
      };
  this.contains(callback, traversal);
  if (parent) {
    parent.children.push(child);
    child.parent = parent;
  } else {
    throw new Error('Cant add node to non existent parent');
  }
};

//removes and return a node and deletes all its children
Tree.prototype.remove = function (data, fromData, traversal) {
  var tree = this,
      chilToRemove = null,
      parent = null,
      index,
      callback = function(node) {
        if (node.data === fromData) {
          parent = node;
        }
      };
  
  this.contains(callback, traversal);
  
  if (parent) {
    index = findIndex(parent.children, data);
    
    if (index === undefined) {
      throw new Error('Cant remove a node that doesnt exist')
    } else {
      childToRemove = parent.children.splice(index,1);
    }
  } else {
    throw new Error("Cant find parent from which to remove node")
  }
  
  return childToRemove;
};

//helper function, takes in an array and data, and spits out the last entry to match the data
function findIndex(arr, data) {
  var index = undefined;
  for (i = 0; i < arr.length; i++) {
    if (arr[i].data === data) {
      index = i;
    }
  }
  if (index != undefined) {
    return index;
  } else {
    throw new Error ('findIndex(): Cant find data in array');
  }
}



//-------------------------------------------------------------------------------------------------------
//TREE DATA STRUCTURE END
//-------------------------------------------------------------------------------------------------------
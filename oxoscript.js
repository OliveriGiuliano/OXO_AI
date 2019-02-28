//Notes:
//the current log function is really slow if theres a lot of logging to do
//you cant array_copy = array, this will just make a reference to the SAME object


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

function tabClick(ind) {
  change(ind,"O");
  takeTurn();
}

function log(data) {
  document.getElementById("msg").innerHTML += "<br>" + data;
}

//------------------------------------------------------------------------ imported from google script, might need to be reworked
function takeTurn() {

  readBoard();

  if (whoWon(gBoard) == 0) {
    //new tree, assign board and data to the root node
    var tree = new Tree(0);
    tree._root.board = copyBoard(gBoard);
    tree._root.data = whoWon(tree._root.board);
    tree._root.id = toID(tree._root.board);

    //construct a tree for each possible move, stop if anyone has won
    makeChildrenNodes(tree._root);
    //minimax
    tree.traverseDF(function (node) {
      node.data = minimax(node);
    });

    var bc = tree._root.children[bestChild(tree._root)];
    gBoard = bc.board;
    applyBoard();

  }

  readBoard();
  if (whoWon(gBoard) == -1) {
    log("YOU LOST");
  } else if (whoWon(gBoard) == 1) {
    log("YOU WON");
  }

}

function bestChild(node) {
  var value;
  var ind;
  if (node.children.length > 0) {
    if (node.getDepth() % 2){
      value = -999;
      for (var i =0; i < node.children.length;i++) {
        if (value < node.children[i].data) {
          value = node.children[i].data;
          ind = i;
        }
      }
    } else {
      value = 999;
      for (var i =0; i < node.children.length;i++) {
        if (value > node.children[i].data) {
          value = node.children[i].data;
          ind = i;
        }
      }
    }
    return ind;
  } else {
    throw new Error ("No child! bestChild")
  }
}

function minimax(node){
  var value;
  if (node.children.length > 0) {
    if (node.getDepth() % 2){
      value = -999;
      for (var i =0; i < node.children.length;i++) {
        value = Math.max(value,node.children[i].data);
      }
    } else {
      value = 999;
      for (var i =0; i < node.children.length;i++) {
        value = Math.min(value,node.children[i].data);
      }
    }
    return value;
  } else {
    return node.data;
  }
}

function makeTree(node) {
  node.children.forEach(makeChildrenNodes);
}

function makeChildrenNodes(node) {
  //if the board of the current node has no winner
  if (whoWon(node.board) === 0 && node.getDepth() < 9) {
    //for every free space on the board
    for (var i=0; i<=2;i++) {
      for (var j=0;j<=2;j++) {
        if (node.board[i][j] != "X" && node.board[i][j] != "O") {
          //create a new node with the free space as either a X or a O
          var nNode = undefined;
          nNode = new Node("xxx");
          nNode.parent = node;
          nNode.board = copyBoard(node.board);
          var turn;
          if (nNode.getDepth()%2 == 1) {
            turn = "X";
          } else {
            turn = "O";
          }
          nNode.board[i][j] = turn;
          nNode.data = whoWon(nNode.board);
          nNode.id = toID(nNode.board);
          node.children.push(nNode);

          makeChildrenNodes(nNode);
        }
      }
    }
  }
}

//creates and return a copy of an array
function copyBoard(board) {
  var nBoard = [];
  for (var k = 0; k <= 2; k++) {
    nBoard[k] = [];
  }
  for (var i=0;i<=2;i++) {
    for (var j=0;j<=2;j++) {
      nBoard[i][j] = board[i][j];
    }
  }
  return nBoard;
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
  if (hBoard[0][2] == "X" && hBoard[1][2] == "X" && hBoard[2][2] == "X") {result = -1;}
  if (hBoard[0][0] == "X" && hBoard[1][1] == "X" && hBoard[2][2] == "X") {result = -1;}
  if (hBoard[0][2] == "X" && hBoard[1][1] == "X" && hBoard[2][0] == "X") {result = -1;}

  if (hBoard[0][0] == "O" && hBoard[0][1] == "O" && hBoard[0][2] == "O") {result = 1;}
  if (hBoard[1][0] == "O" && hBoard[1][1] == "O" && hBoard[1][2] == "O") {result = 1;}
  if (hBoard[2][0] == "O" && hBoard[2][1] == "O" && hBoard[2][2] == "O") {result = 1;}
  if (hBoard[0][0] == "O" && hBoard[1][0] == "O" && hBoard[2][0] == "O") {result = 1;}
  if (hBoard[0][1] == "O" && hBoard[1][1] == "O" && hBoard[2][1] == "O") {result = 1;}
  if (hBoard[0][2] == "O" && hBoard[1][2] == "O" && hBoard[2][2] == "O") {result = 1;}
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

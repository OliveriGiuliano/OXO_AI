//-------------------------------------------------------------------------------------------------------
//TREE DATA STRUCTURE START
//-------------------------------------------------------------------------------------------------------

export {Node, Tree};

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
}
  
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
}
//removes and return the first entry in the queue
Queue.prototype.dequeue = function() {
  return this.data.pop();
}
//Returns the first entry in the queue
Queue.prototype.first = function() {
  return this.data[0];
}
//Returns the last entry in the queue
Queue.prototype.last = function () {
  return this.data[this.data.length -1];
}
//Returns the size of the queue
Queue.prototype.size = function() {
  return this.data.length;
}

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
    //I tried to use the builtin array.findIndex method but it doesnt seem to be implemented in google script
    /*index = parent.children.findIndex(function (currentData){
      return (currentData === data);
    });*/
    
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
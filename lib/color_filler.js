var colors = require('./colors');

function ColorFiller(currentBlock, pattern) {
  this.pattern = pattern;
  this.currentBlock = currentBlock;
  this.isCurrentConnection = isCurrentConnection;
  this.eachConnectionBlock = eachConnectionBlock;
}

function isCurrentConnection(currentBlock, pattern){
  var result;
  var connections = pattern.connections;
  connections.forEach(function(connection){
    if (currentBlock.x === connection.x && currentBlock.y === connection.y){
      result = true;
    }
  });
  return result;
}

ColorFiller.prototype.expandColor = function(currentBlock, context, compColor, userColor, game){
  calculateColorValues(game, userColor);
  var parent = currentBlock.parent;
  var child = currentBlock.child;
  var currentGreyParent = parent && parent.color === colors.board;
  var currentGreyChild = child && child.color === colors.board;

  if (isCurrentConnection(currentBlock, this.pattern, context)){
    this.fillDoubleBlock(currentBlock, context, this.pattern, compColor, userColor, game);
  }
  if (currentGreyParent){
    currentBlock.changeNeighborColor(parent);
    fillInNeighborBlock.call(this, parent, currentBlock, context, compColor, userColor, game);
  }
  if(currentGreyChild){
    currentBlock.changeNeighborColor(child);
    fillInNeighborBlock.call(this, child, currentBlock, context, compColor, userColor, game);
  }
};

function fillInNeighborBlock(neighbor, currentBlock, context, compColor, userColor, game){
  neighbor.draw(neighbor.color, context);
  setTimeout(this.expandColor.bind(this), 70, neighbor, context, compColor, userColor, game);
}

ColorFiller.prototype.fillDoubleBlock = function(currentBlock, context, pattern, compColor, userColor, game){
  var eachBlock = eachConnectionBlock(currentBlock, pattern);
  if (eachBlock[0].color !== eachBlock[1].color) {
    var copyBlockArray = eachBlock.filter(function(block){
      return currentBlock.color !== block.color;
    });
    var copyBlock = copyBlockArray[0];
    colorDoubleBlockCorrectly.call(this, copyBlock, currentBlock, context, compColor, userColor, game);
  }
};

function colorDoubleBlockCorrectly(doubleBlock, currentBlock, context, compColor, userColor, game){
  currentBlock.changeNeighborColor(doubleBlock);
  doubleBlock.draw(doubleBlock.color, context);
  this.expandColor(doubleBlock, context, compColor, userColor, game);
}

function eachConnectionBlock(currentBlock, pattern){
  var blocks = [];
  pattern.segments.forEach(function(segment){
    blocks.push(segment.find(currentBlock));
  });
  blocks = [].concat.apply([], blocks);
  return blocks;
}

function calculateColorValues(game, userColor){
  var blocks = game.board.allBlocks();
  var compBlocks = game.board.compBlocks;
  var compColor1 = compBlocks[0].color;
  var compColor2 = compBlocks[1].color;
  var compCount1 = 0;
  var compCount2 = 0;
  var userCount = 0;
  blocks.forEach(function(block){
    if (block.color === userColor){ userCount += 1;}
    if (block.color === compColor1){ compCount1 += 1;}
    if (block.color === compColor2){ compCount2 += 1;}
  });
  drawScoreCounters(game, compBlocks[0].color, 10, compCount1/blocks.length);
  drawScoreCounters(game, compBlocks[1].color, 30, compCount2/blocks.length);
  drawScoreCounters(game, userColor, 50, userCount/blocks.length);
  game.checkAndTriggerGameOverSequence([userCount, compCount1, compCount2]);
}

function drawScoreCounters(game, color, y, percent){
  game.fillContext.beginPath();
  game.fillContext.fillStyle = color;
  game.fillContext.rect(0, y, Math.round(game.fillCanvas.width*(percent)), 10);
  game.fillContext.fill();
}

module.exports = ColorFiller;

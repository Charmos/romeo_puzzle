(function() {
  'use strict';
  var TILE_SIZE = 150;
  var stage = new Konva.Stage({
    container: 'stage',
    width: 450,
    height: 450
  });
  // puts images into an array to iterate when rendered to layer
  var grid = [
    {x: 0, y: 0, src: '0.png'},
    {x: 150, y: 0, src: '1.png'},
    {x: 300, y: 0, src: '2.png'},
    {x: 0, y: 150, src: '3.png'},
    {x: 150, y: 150, src: '4.png'},
    {x: 300, y: 150, src: '5.png'},
    {x: 0, y: 300, src: '6.png'},
    {x: 150, y: 300, src: '7.png'},
  ];
  var shuffleButton = document.getElementById('shuffleButton');
  var restoreButton = document.getElementById('restoreButton');
  var layer = new Konva.Layer();

  function getTop(x, y, tiles) {
    if(y === 0) {
      console.log('TOP');
      return false;
    }

    var topY = y - 150;

    var filter = tiles.filter(function(tile){
      return tile.attrs.x === x && tile.attrs.y === topY;
    }).shift();


    if(filter) {
      return false;
    }

    return true;

  }

  function getBottom(x, y, tiles) {
    if(y === 300) {
      console.log('BOTTOM');
      return false;
    }

    var bottomY = y + 150;

    var filter = tiles.filter(function(tile){
      return tile.attrs.x === x && tile.attrs.y === bottomY;
    }).shift();

    console.log(filter);

    if(filter) {
      return false;
    }

    return true;
  }

  function getLeft(x, y, tiles) {
    if(x === 0) {
      console.log('LEFT');
      return false;
    }

    var leftX = x - 150;

    var filter = tiles.filter(function(tile){
      return tile.attrs.x === leftX && tile.attrs.y === y;
    }).shift();

    console.log(filter);

    if(filter) {
      return false;
    }

    return true;
  }

  function getRight(x, y, tiles) {
    if(x === 300) {
      console.log('RIGHT');
      return false;
    }

    var rightX = x + 150;

    var filter = tiles.filter(function(tile){
      return tile.attrs.x === rightX && tile.attrs.y === y;
    }).shift();

    console.log(filter);

    if(filter) {
      return false;
    }

    return true;
  }

  /*
    Fisher-Yates shuffling algorithm taken from http://stackoverflow.com/a/2450976
  */
  function shuffle(array) {
    console.log(array);
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function shufflePuzzle(puzzle) {
    var tiles = puzzle.children;
    var shuffleArray = shuffle(tiles.map(function(tile) {
      return {
        x: tile.attrs.x,
        y: tile.attrs.y
      };
    }));

    tiles.forEach(function(tile){
      var shuffleItem = shuffleArray.shift();
      tile.setAttrs({
        x: shuffleItem.x,
        y: shuffleItem.y,
      })
    });

    layer.draw();
  }

  function restorePuzzle(grid, tiles, layer) {
    tiles.forEach(function(tile){
      var src = tile.attrs.src;
      console.dir(tile);
      console.debug(src);
      var gridItem = grid.filter(function(item) {
        return item.src === src;
      }).shift();

      if(gridItem) {
        tile.setAttrs({
          x: gridItem.x,
          y: gridItem.y
        });
      }
    });
    layer.draw();
  }

  shuffleButton.addEventListener('click', function() {
    shufflePuzzle(layer);
  });

  restoreButton.addEventListener('click', function() {
    restorePuzzle(grid, layer.children, layer);
  });

  function moveTile(tile, tiles, layer) {
    var x = tile.attrs.x;
    var y = tile.attrs.y;
    var top = getTop(x, y, tiles);
    var bottom = getBottom(x, y, tiles);
    var left = getLeft(x, y, tiles);
    var right = getRight(x, y, tiles);

    console.log('top: ' + top + '; bottom: ' + bottom + ';left: ' + left + '; right: ' + right);

    if(bottom) { // no tile below the clicked tile
      y+=TILE_SIZE;
    }
    if(top) { // no tile below the clicked tile
       y-=TILE_SIZE;
    }
    if(left) { // no tile below the clicked tile
       x-=TILE_SIZE;
    }
    if(right) { // no tile below the clicked tile
       x+=TILE_SIZE;
    }

    (new Konva.Tween({
      node: tile,
      duration: 0.3,
      x: x,
      y: y
    })).play();

    layer.draw();
  }

  grid.forEach(function(tile) {
    var src = 'img/' + tile.src;

    Konva.Image.fromURL(src, function(image) {

      image.setAttrs({
        width: TILE_SIZE,
        height: TILE_SIZE,
        x: tile.x,
        y: tile.y,
        strokeWidth: 0,
        src: tile.src
      });

      image.on('click', function(event){
        var tile = event.target;
        var tiles = layer.children;

        moveTile(tile, tiles, layer);

      });

      layer.add(image);
      layer.draw();
    });
  });

  stage.add(layer);

}());

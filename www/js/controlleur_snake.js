
angular.module('starter.controllers', [])

  .controller('gameCtrl', function($scope, $timeout, $window) {
    $scope.score = 0;
    $scope.niveaux = 0;
    var canvas = 20;

    var directions = { left: 37, up: 38,right: 39,down: 40 };

    var color = { GAME_OVER: '#02111b',FRUIT: '#ffff', SNAKE_HEAD: '#ed9e3e',SNAKE_BODY: '#ed9e3e',
      CANVAS: '#37474f'
    };

    /*serpent*/
    var snake = {
      direction: directions.right,
      parts: [{x: -1,y: -1}]
    };
    var interval, tempDirection, isGameOver;

    /*Design du canvas*/
    function setupBoard() {
      $scope.board = [];
      for (var i = 0; i < canvas; i++) {
        $scope.board[i] = [];
        for (var j = 0; j < canvas; j++) {
          $scope.board[i][j] = false;
        }
      }
    }

    setupBoard();

    /*Le jeux commence: Click*/
    $scope.start = function() {
      $scope.score = 0;
      snake = {direction: directions.left, parts: []};
      tempDirection = directions.left;
      isGameOver = false;
      interval = 150;

      for (var i = 0; i < 5; i++) {
        snake.parts.push({x: 10 + i, y: 10});
      }
      resetFruit();
      refresh();
    };
    /*Le styles des elements*/
    $scope.colorElements = function(col, row) {
      if (isGameOver)  {
        return color.GAME_OVER;
      } else if (fruit.x == row && fruit.y == col) {
        return color.FRUIT;
      } else if (snake.parts[0].x == row && snake.parts[0].y == col) {
        return color.SNAKE_HEAD;
      } else if ($scope.board[col][row] === true) {
        return color.SNAKE_BODY;
      }
      return color.CANVAS;
    };

    /*Initialisation des elements*/
    function refresh() {
      var newHead = getNewHead();
      /*Si il y a de collision entre lui même ou avec la borne refresh canvas*/
      if (boardCollision(newHead) || selfCollision(newHead)) {
        return gameOver();
      } else if (fruitCollision(newHead)) {
        eatFruit();
      }
      
      var corpSerpent = snake.parts.pop();
      $scope.board[corpSerpent.y][corpSerpent.x] = false;
      
      snake.parts.unshift(newHead);
      $scope.board[newHead.y][newHead.x] = true;

      snake.direction = tempDirection;
      $timeout(refresh, interval);
    }

    function getNewHead() {
      var newHead = angular.copy(snake.parts[0]);

      if (tempDirection === directions.left) {
          newHead.x -= 1;
      } else if (tempDirection === directions.right) {
          newHead.x += 1;
      } else if (tempDirection === directions.up) {
          newHead.y -= 1;
      } else if (tempDirection === directions.down) {
          newHead.y += 1;
      }
      return newHead;
    }
    /*Collisions du serpent*/
    /*Collision avec le mur*/
    function boardCollision(part) {
      return part.x === canvas || part.x === -1 || part.y === canvas || part.y === -1;
    }
     /*Collision avec lui même*/
    function selfCollision(part) {
      return $scope.board[part.y][part.x] === true;
    }
    /*Collision avec un fruit*/
    function fruitCollision(part) {
      return part.x === fruit.x && part.y === fruit.y;
    }

    /*Fruit*/

    var fruit = { x: -1, y: -1 };
    /*Position random d'une fruit*/
    function resetFruit() {
      var x = Math.floor(Math.random() * canvas);
      var y = Math.floor(Math.random() * canvas);

      if ($scope.board[y][x] === true) {
        return resetFruit();
      }
      fruit = {x: x, y: y};
    }

    function eatFruit() {
      $scope.score++;
      
      var corps = angular.copy(snake.parts[snake.parts.length-1]);
      snake.parts.push(corps);
      resetFruit();

      if ($scope.score % 5 === 0) {
        interval -= 20;
        $scope.niveaux++;
      }
    }

    function gameOver() {
      isGameOver = true;
      $timeout(function() {
        isGameOver = false;
      },500);

      setupBoard();
    }


    /*Direction avec le Clavier*/
    $window.addEventListener("keyup", function(e) {
      if (e.keyCode == directions.left && snake.direction !== directions.right) {
        tempDirection = directions.left;
      } else if (e.keyCode == directions.up && snake.direction !== directions.down) {
        tempDirection = directions.up;
      } else if (e.keyCode == directions.right && snake.direction !== directions.left) {
        tempDirection = directions.right;
      } else if (e.keyCode == directions.down && snake.direction !== directions.up) {
        tempDirection = directions.down;
      }
    });

    

  });
angular.module('starter')
.service('fruit', function() {
	var fruit = { x: -1, y: -1 };

	scope.fruitCollision = function (part) {
      return part.x === fruit.x && part.y === fruit.y;
    }

    /*Fruit*/
    scope.resetFruit = function () {
      var x = Math.floor(Math.random() * canvas);
      var y = Math.floor(Math.random() * canvas);

      if ($scope.board[y][x] === true) {
        return resetFruit();
      }
      fruit = {x: x, y: y};
    }
    scope.eatFruit = function () {
      $scope.score++;

      var tail = angular.copy(snake.parts[snake.parts.length-1]);
      snake.parts.push(tail);
      resetFruit();

      if ($scope.score % 5 === 0) {
        interval -= 15;
      }
    }
}
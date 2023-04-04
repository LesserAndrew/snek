const letterCoordinates = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
const numberCoordinates = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let movingLeft = false;
let movingUp = false;
let movingRight = false;
let movingDown = false;

let pendingLeft = false;
let pendingUp = false;
let pendingRight = false;
let pendingDown = false;

let tailSegments = [];
let tailLength = 3;

let currentScore = 0;

let currentGame;

let flickering = false;

setInterval(function() {
	if(flickering) {
		$('#snakeGame').removeClass('flicker');
		flickering = false;
	} else {
		let flicker = Math.round(Math.random() * 10);
		if(flicker === 0) {
			$('#snakeGame').addClass('flicker');
			flickering = true;
		}
	}
}, 50);

$(document).ready(function() {
	renderSnakeGrid();
	renderStats();
	placeApple();
	$(document).keydown(function(e) {
		handleKeyPress(e.keyCode);
		if(!currentGame){
			startGame();
		}
	});
});

startGame = function() {
	currentGame = setInterval(changeFrame, 250);
}

resetGame = function() {
	$('#snakeGrid').html('');
	clearInterval(currentGame);
	currentGame = undefined;
	tailSegments = [];
	tailLength = 3;
	currentScore = 0;
	renderSnakeGrid();
	renderStats();
	placeApple();
}

renderSnakeGrid = function() {
	let htmlToInsert = '';

	$(letterCoordinates).each(function() {
		let letter = this;
		$(numberCoordinates).each(function() {
			let number = this;
			
			$('#snakeGrid').append(`<div class="default" id="${letter}${number}"></div>`);
		});
	});

	setCellType('e5', 'snakeHead');
}

setCellType = function(coordinates, type) {
	$('#' + coordinates).removeClass();
	$('#' + coordinates).addClass(type);
}

getCellType = function(coordinates) {
	return $('#' + coordinates)[0].className;
}

getRandomCell = function() {
	letterCoordinateIndex = Math.round((Math.random() * 8));
	letterCoordinate = letterCoordinates[letterCoordinateIndex];
	numberCoordinate = Math.round((Math.random() * 8) + 1);
	return letterCoordinate + numberCoordinate;
}

placeApple = function() {
	let cell = getRandomCell();
	while(getCellType(cell) !== 'default') {
		cell = getRandomCell();
	}
	setCellType(cell, 'apple');
}

handleKeyPress = function(keyCode) {
	switch(keyCode) {
		case 37:
			//left
			if(movingRight) return;
			pendingLeft = true;
			pendingUp = false;
			pendingDown = false;
			break;
		case 38:
			//up
			if(movingDown) return;
			pendingUp = true;
			pendingRight = false;
			pendingLeft = false;
			break;
		case 39:
			//right
			if(movingLeft) return;
			pendingRight = true;
			pendingUp = false;
			pendingDown = false;
			break;
		case 40:
			//down
			if(movingUp) return;
			pendingDown = true;
			pendingRight = false;
			pendingLeft = false;
			break;
	}
}

getNextLetterCoordinate = function(coordinate) {
	let letter = coordinate.charAt(0);
	if(letter === 'i') {
		return 'a';
	} else {
		return String.fromCharCode(letter.charCodeAt(0) + 1);
	}
}

getLastLetterCoordinate = function(coordinate) {
	let letter = coordinate.charAt(0);
	if(letter === 'a') {
		return 'i';
	} else {
		return String.fromCharCode(letter.charCodeAt(0) - 1);
	}
}

getNextNumberCoordinate = function(coordinate) {
	let number = parseInt(coordinate.charAt(1));
	if(number === 9) {
		return 1;
	} else {
		return number + 1;
	}
}

getLastNumberCoordinate = function(coordinate) {
	let number = parseInt(coordinate.charAt(1));
	if(number === 1) {
		return 9;
	} else {
		return number - 1;
	}
}

moveSnake = function() {
	if(pendingLeft || pendingRight || pendingUp || pendingDown) {
		movingLeft = false;
		movingRight = false;
		movingUp = false;
		movingDown = false;
		if(pendingLeft) {
			movingLeft = true;
			pendingLeft = false;
		}
		if(pendingRight) {
			movingRight = true;
			pendingRight = false;
		}
		if(pendingUp) {
			movingUp = true;
			pendingUp = false;
		}
		if(pendingDown) {
			movingDown = true;
			pendingDown = false;
		}
	}
	let snakeHead = $('.snakeHead');
	let coordinates = snakeHead.attr('id');
	setCellType(coordinates, 'wall');
	tailSegments.push(coordinates);
	if(tailSegments.length > tailLength) {
		setCellType(tailSegments.shift(), 'default');
	}
	let letterCoordinate = coordinates.charAt(0);
	let numberCoordinate = coordinates.charAt(1);
	if(movingDown || movingUp) {
		if(movingUp) {
			letterCoordinate = getLastLetterCoordinate(coordinates);
		} else {
			letterCoordinate = getNextLetterCoordinate(coordinates);
		}
	} else if(movingLeft || movingRight) {
		if(movingLeft) {
			numberCoordinate = getLastNumberCoordinate(coordinates);
		} else {
			numberCoordinate = getNextNumberCoordinate(coordinates);
		}
	}
	let newCoord = letterCoordinate + numberCoordinate;
	switch(getCellType(newCoord)) {
		case 'apple':
			tailLength++;
			currentScore++;
			renderStats();
			placeApple();
			break;
		case 'wall':
			clearInterval(currentGame);
			break;
	}
	setCellType(newCoord, 'snakeHead');
}

renderStats = function() {
	$('#currentScore').html(currentScore);
	$('#currentLength').html(tailLength);
}

changeFrame = function() {
	moveSnake();
}
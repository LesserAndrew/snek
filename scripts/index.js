let gridSize = 0;
let currentMap = 'default';

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
	
	let parsedMap = parseMap();

	let letter = 'a';
	$(parsedMap).each(function() {
		let row = this;
		let number = 1;
		$(row).each(function() {
			let cell = this;
			$('#snakeGrid').append(`<div class="${types[cell]}" id="${letter}${number}"></div>`);
			if(number > gridSize) {
				gridSize = number;
			}
			number++;
		});
		letter = String.fromCharCode(letter.charCodeAt(0) + 1);
	});

	setCellType('h8', 'snakeHead');
}

parseMap = function() {
	let mapData = maps[currentMap];
	let resultMap = [];
	let lastLetter;
	let lastItem;
	let currentRow = 0;
	
	$(mapData).each(function() {
		let currentLine = this;
		resultMap[currentRow] = [];;
		lastLetter = undefined;
		lastItem = undefined;
		
		for (let i = 0; i < currentLine.length; i++) {
			let currentChar = currentLine[i];
			let number = parseInt(currentChar);
			
			if(!isNaN(number)) {
				if(typeof lastItem === 'number') {
					number += (lastItem * 10) - lastItem;
				}
				
				lastItem = number;
				
				while(number--) {
					if(lastLetter) {
						resultMap[currentRow].push(lastLetter);
					} else {
						resultMap[currentRow] = resultMap[currentRow - 1];
						currentRow++;
					}
				}
			} else {
				resultMap[currentRow].push(currentChar);
				lastItem = currentChar;
				lastLetter = currentChar;
			}
		}
		
		if(resultMap[currentRow]) {
			currentRow++;
		}
	});
	return resultMap;
}

setCellType = function(coordinates, type) {
	$('#' + coordinates).removeClass();
	$('#' + coordinates).addClass(type);
}

getCellType = function(coordinates) {
	return $('#' + coordinates)[0].className;
}

getRandomCell = function() {
	letterCoordinateIndex = Math.round((Math.random() * (gridSize - 1)) + 1);
	letterCoordinate = String.fromCharCode(letterCoordinateIndex + 96);
	numberCoordinate = Math.round((Math.random() * (gridSize - 1)) + 1);
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
	if(letter === String.fromCharCode(gridSize + 96)) {
		return 'a';
	} else {
		return String.fromCharCode(letter.charCodeAt(0) + 1);
	}
}

getLastLetterCoordinate = function(coordinate) {
	let letter = coordinate.charAt(0);
	if(letter === 'a') {
		return String.fromCharCode(gridSize + 96);
	} else {
		return String.fromCharCode(letter.charCodeAt(0) - 1);
	}
}

getNextNumberCoordinate = function(coordinate) {
	let number = parseInt(coordinate.substring(1));
	if(number === gridSize) {
		return 1;
	} else {
		return number + 1;
	}
}

getLastNumberCoordinate = function(coordinate) {
	let number = parseInt(coordinate.substring(1));
	if(number === 1) {
		return gridSize;
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
	let numberCoordinate = coordinates.substring(1);
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
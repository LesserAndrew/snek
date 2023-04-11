let gridSize = 0;
let currentMap = 'default';
let highscore = parseInt(localStorage.getItem('default') || '0');

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
	$('.creator').addClass('hidden');
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
	movingLeft = false;
	movingUp = false;
	movingRight = false;
	movingDown = false;
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

setMapType = function(mapType, elem) {
	currentMap = mapType;
	refreshHighscore();
	resetGame();
	$('#mapSelection .selected').removeClass('selected');
	$(elem).addClass('selected');
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
}

refreshHighscore = function() {
	highscore = parseInt(localStorage.getItem(currentMap) || '0');
}

saveHighscore = function() {
	localStorage.setItem(currentMap, highscore);
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
	let newCoord = getNextCoordinate(coordinates);
	while(getCellType(newCoord) === 'empty') {
		newCoord = getNextCoordinate(newCoord);
	}
	switch(getCellType(newCoord)) {
		case 'apple':
			tailLength++;
			currentScore++;
			if(currentScore > highscore) {
				highscore = currentScore;
				saveHighscore();
				refreshHighscore();
			}
			renderStats();
			placeApple();
			break;
		case 'wall':
			clearInterval(currentGame);
			break;
	}
	setCellType(newCoord, 'snakeHead');
}

getNextCoordinate = function(coordinates) {
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
	return letterCoordinate + numberCoordinate;
}

renderStats = function() {
	$('#currentScore').html(currentScore);
	$('#currentLength').html(tailLength);
	$('#currentHighscore').html(highscore);
}

changeFrame = function() {
	moveSnake();
}

// Map Creator

let tileType;

enterMapCreator = function() {
	setMapType('custom', $('#mapSelection div:first-child')[0]);
	$('.game').addClass('hidden');
	$('.creator').removeClass('hidden');
	$('#snakeGrid div').click(function(event) {
		changeTileType(event.target.id);
	});
}

exitMapCreator = function() {
	setMapType('default', $('#mapSelection div:first-child')[0]);
	$('.game').removeClass('hidden');
	$('.creator').addClass('hidden');
	$('#snakeGrid div').off('click');
}

creatorResetGame = function() {
	resetGame();
	$('#snakeGrid div').click(function(event) {
		changeTileType(event.target.id);
	});
}

exportMap = function() {
	$('#importExportTextbox').val(JSON.stringify(maps.custom));
}

importMap = function() {
	maps.custom = JSON.parse($('#importExportTextbox').val());
	setMapType('custom', $('#mapSelection div:first-child')[0]);
	$('#importExportTextbox').val('')
}

setTileTypeSelected = function(type) {
	tileType = type;
	$('.tile').removeClass('selected');
	$('.tile.' + type).addClass('selected');
}

changeTileType = function(coordinates) {
	if(tileType) {
		let tileTypeLetter = '';
		switch(tileType) {
			case 'default':
				tileTypeLetter = 'o';
				break;
			case 'snakeHead':
				tileTypeLetter = 's';
				let snakeHeadCoordinates = $('.snakeHead').not('.tile').attr('id');
				let letterCoordinate = snakeHeadCoordinates.charAt(0);
				let letterIndex = letterCoordinate.charCodeAt(0) - 97;
				let numberCoordinate = parseInt(snakeHeadCoordinates.substring(1)) - 1;
				$('#' + snakeHeadCoordinates).addClass('default');
				maps.custom[letterIndex] = replaceCharAt(maps.custom[letterIndex], 'o', numberCoordinate);
				$('.snakeHead').not('.tile').removeClass('snakeHead');
				break;
			case 'wall':
				tileTypeLetter = 'x';
				break;
			case 'empty':
				tileTypeLetter = 'e';
				break;
		}
		let letterIndex = coordinates.charCodeAt(0) - 97;
		let number = parseInt(coordinates.substring(1)) - 1;
		let regenerateApple = getCellType(coordinates) === 'apple';
		maps.custom[letterIndex] = replaceCharAt(maps.custom[letterIndex], tileTypeLetter, number);
		setCellType(coordinates, tileType);
		if(regenerateApple) {
			placeApple();
		}
	}	
}

replaceCharAt = function(original, character, index) {
	return original.substring(0, index) + character + original.substring(index + character.length);
}
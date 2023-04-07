let types = {o: 'default', x: 'wall', s: 'snakeHead'};

let maps = {
	default: [
		'o14',
		'6',
		'o6so6',
		'o14',
		'6'
	],
	walledEdge: [
		'x14',
		'xo12x',
		'5',
		'xo5so5x',
		'xo12x',
		'5',
		'x14'
	],
	walledCorners: [
		'x2o8x2',
		'xo12x',
		'1',
		'o14',
		'3',
		'o6so6',
		'o14',
		'3',
		'xo12x',
		'1',
		'x2o8x2',
	],
	cross: [
		'o14',
		'1',
		'o5xoxo5',
		'3',
		'ox5ox5o',
		'o6so6',
		'ox5ox5o',
		'o5xoxo5',
		'3',
		'o14',
		'1'
	],
	tunnels: [
		'o14',
		'xoxoxoxoxoxoxox',
		'5',
		'xoxoxoxsxoxoxox',
		'xoxoxoxoxoxoxox',
		'5',
		'o14'
	],
	edges: [
		'o6so6',
		'o14',
		'o1x10o1',
		'10',
		'o14',
		'1'
	],
	blocks: [
		'o14',
		'2',
		'o2x2o2x2o2',
		'2',
		'o14',
		'o6so6',
		'o14',
		'o2x2o2x2o2',
		'2',
		'o14',
		'2'
	],
	plus: [
		'o6xo6',
		'6',
		'x14',
		'o6xo6',
		'2',
		'o2so2xo6',
		'o6xo6',
		'2',
	],
	windmill: [
		'o7xo5',
		'5',
		'x8o5',
		'o5x2o5',
		'o5x8',
		'o5xo7',
		'1',
		'o2so1xo7',
		'o5xo7',
		'2',
	]
}
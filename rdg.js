// constants
var BLOCK_SIZE = 10;
var MAP_WIDTH = 40;
var MAP_HEIGHT = 40;

// global dungeon data structure
var map = [];

var map_txt = 
    "0 0 0 0 0 0 0 0 0\n" +
    "0 1 0 1 0 1 0 1 0\n" +
    "0 1 1 1 0 1 0 1 0\n" +
    "0 1 1 1 1 1 0 1 0\n" +
    "0 1 0 1 0 1 0 1 0\n" +
    "0 1 0 1 1 1 1 1 0\n" +
    "0 1 0 1 0 1 0 1 0\n" +
    "0 0 0 0 0 0 0 0 0"

var temp_map_array = map_txt.split("\n");

for (var i = 0; i < temp_map_array.length; i++) {
    map[i] = temp_map_array[i].split(" ");
}

function paintMap() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#110000";

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] == 0) {
		ctx.fillStyle = "#110000";
                ctx.fillRect(j * BLOCK_SIZE, 
                             i * BLOCK_SIZE,
                             BLOCK_SIZE, 
                             BLOCK_SIZE);
            } else if (map[i][j] == 2) {
		// refactor, same code above
		ctx.fillStyle = "#FF0000";
                ctx.fillRect(j * BLOCK_SIZE, 
                             i * BLOCK_SIZE,
                             BLOCK_SIZE, 
                             BLOCK_SIZE);
	    }
        }
    }
}

function generateMap() {
    // reset map
    map = [];
    counter = 0;

    for (var i = 0; i < MAP_HEIGHT; i++) {
	map[i] = [];
	counter++;
        for (var j = 0; j < MAP_WIDTH; j++) {
	    map[i][j] = counter % 2;
	    counter++;
        }
    }

    var horizontal_split = true; // flip for vertical split
    var split_pos = 0;
    // first partitioning
    horizontal_split = Math.round(Math.random());
    
    // set split_pos randomly to somewhere between 30-70% of either
    // map width or height, depending on horizontal_split value
    if (horizontal_split) {
	split_pos = getRandomInt(MAP_HEIGHT * 0.20,
				 MAP_HEIGHT * 0.80);
	for (var i = 0; i < map[split_pos].length; i++) {
	    map[split_pos][i] = 2;
	}
    } else {
	split_pos = getRandomInt(MAP_WIDTH * 0.20,
				 MAP_WIDTH * 0.80);
	for (var i = 0; i < map.length; i++) {
	    map[i][split_pos] = 2;
	}
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init() {
    // .. to do something eventually
    generateMap();
    paintMap();
}

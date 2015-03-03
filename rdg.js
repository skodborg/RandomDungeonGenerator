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

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {

	    // shift on map-entry color based on value
            var entry = map[i][j];
            if (entry == 0) { ctx.fillStyle = "#CCCCCC"; }
            else if (entry == 2) { ctx.fillStyle = "#FF0000"; }
            else { ctx.fillStyle = "#FFFFFF"; }

            ctx.fillRect(j * BLOCK_SIZE, 
                         i * BLOCK_SIZE,
                         BLOCK_SIZE, 
                         BLOCK_SIZE);

        }
    }
}

function generateMap() {
    // reset map
    map = [];
    var counter = 0;

    // paint map background grey/white checkered
    for (var i = 0; i < MAP_HEIGHT; i++) {
        map[i] = [];
        counter++;
        for (var j = 0; j < MAP_WIDTH; j++) {
            map[i][j] = counter % 2;
            counter++;
        }
    }

    // first partitioning
    var horizontal_split = 1; // flip for vertical split
    var split_pos = 0;

    horizontal_split = Math.round(Math.random());
    
    // set split_pos randomly to somewhere between 20-80% of either
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


    // flip split-direction
    horizontal_split = (horizontal_split+1) % 2;

    // choose the bigger room

    // split once again

    // repeat * 3?

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init() {
    // .. to do something eventually
    generateMap();
    paintMap();
}

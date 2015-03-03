// constants
var BLOCK_SIZE = 10;

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
    ctx.fillStyle = "#FF0000";

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] == 0) {
                ctx.fillRect(j * BLOCK_SIZE, 
                             i * BLOCK_SIZE,
                             BLOCK_SIZE, 
                             BLOCK_SIZE);
            }
        }
    }
}

function init() {
    // .. to do something eventually
    paintMap();
}

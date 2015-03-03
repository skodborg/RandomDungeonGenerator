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
    var spaces_upper_left_corners = [[0,0]]; // whenever a split occurs,
    // the upper left corner is
    // recorded here

    horizontal_split = Math.round(Math.random());
    
    // set split_pos randomly to somewhere between 20-80% of either
    // map width or height, depending on horizontal_split value
    if (horizontal_split) {
        split_pos = getRandomInt(MAP_HEIGHT * 0.20,
                                 MAP_HEIGHT * 0.80);

        // record the upper left corner of the new box after splitting
        spaces_upper_left_corners.push([split_pos+1, 0]);

        // update map matrix to reflect split
        for (var i = 0; i < map[split_pos].length; i++) {
            map[split_pos][i] = 2;
        }
    } else {
        split_pos = getRandomInt(MAP_WIDTH * 0.20,
                                 MAP_WIDTH * 0.80);

        // record the upper left corner of the new box after splitting
        spaces_upper_left_corners.push([0, split_pos+1]);

        // update map matrix to reflect split
        for (var i = 0; i < map.length; i++) {
            map[i][split_pos] = 2;
        }
    }

    // flip split-direction
    horizontal_split = (horizontal_split+1) % 2;

    // choose the bigger space
    // - check the area of each of the boxes defined by splits,
    //   starting from the corners given in spaces_upper_left_corners
    var spaces = []; // elements: [row,col,width,height,area]
    
    spaces_upper_left_corners.forEach(function(curr_corner) {
        
        var corner_row = curr_corner[0];
        var corner_col = curr_corner[1];
        var area_found = false;

        for (var i = corner_row; i < MAP_HEIGHT; i++) {
            if (!area_found) {
                if (map[i][corner_col] == 2 || i == MAP_HEIGHT - 1) {
                    // horizontal split found

                    // off-by-1 at map end
                    if (i == MAP_HEIGHT - 1) { i++; } 

                    var curr_space_height = i - corner_row;

                    for (var j = corner_col; j < MAP_WIDTH; j++) {
                        if (!area_found) {
                            if (map[i-1][j] == 2 || j == MAP_WIDTH - 1) {
                                // vertical split found

                                // off-by-1 at map end
                                if (j == MAP_WIDTH - 1) { j++; } 

                                area_found = true;
                                var curr_space_width = j - corner_col; 
                                var curr_area = curr_space_width * 
                                    curr_space_height;
                                spaces.push([corner_row, 
					     corner_col, 
					     curr_space_width,
					     curr_space_height,
					     curr_area]);
                            }
                        }
                    }
                }
            }
        }
    });

    var biggest_space = [0,0,0,0,0];
    spaces.forEach(function(s) {
	var area_index = 4;
	if (s[area_index] > biggest_space[area_index]) {
	    biggest_space = s;
	}
    });

    // split once again

    if (horizontal_split) {
	// relative to biggest space
        split_pos = getRandomInt(MAP_HEIGHT * 0.20,
                                 MAP_HEIGHT * 0.80);

	// relative to whole map matrix
	split_pos_row = biggest_space[0] + split_pos + 1;

        // record the upper left corner of the new box after splitting
        spaces_upper_left_corners.push([split_pos_row,
					biggest_space[1]]);

        // update map matrix to reflect split
        for (var i = biggest_space[1]; i < biggest_space[1] + biggest_space[2]; i++) {
            map[split_pos_row][i] = 2;
        }
    } else {
	// relative to biggest space
        split_pos = getRandomInt(MAP_WIDTH * 0.20,
                                 MAP_WIDTH * 0.80);

	// relative to whole map matrix
	split_pos_col = biggest_space[1] + split_pos + 1;

        // record the upper left corner of the new box after splitting
        spaces_upper_left_corners.push([biggest_space[0], 
					split_pos_col]);

        // update map matrix to reflect split
        for (var i = biggest_space[0]; i < biggest_space[0] + biggest_space[3]; i++) {
            map[i][split_pos_col] = 2;
        }
    }

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

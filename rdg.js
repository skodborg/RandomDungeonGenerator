// constants
var BLOCK_SIZE = 10;
var MAP_WIDTH = 40;
var MAP_HEIGHT = 40;

// global dungeon data structure
var map = [];

// use generateFixedMap() to generate below map represented in string
var map_txt = 
    "0 0 0 0 0 0 0 0 0\n" +
    "0 1 0 1 0 1 0 1 0\n" +
    "0 1 1 1 0 1 0 1 0\n" +
    "0 1 1 1 1 1 0 1 0\n" +
    "0 1 0 1 0 1 0 1 0\n" +
    "0 1 0 1 1 1 1 1 0\n" +
    "0 1 0 1 0 1 0 1 0\n" +
    "0 0 0 0 0 0 0 0 0"


function init() {
    // .. to do something eventually
    generateMap();
    paintMap();
}

function paintMap() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {

            // switch on map-entry color based on value
            var entry = map[i][j];
            switch(entry) {
            case 0:
                ctx.fillStyle = "#CCCCCC"; // 0: grey
                break;
            case 1:
                ctx.fillStyle = "#FFFFFF"; // 1: white
                break;
            case 2:
                ctx.fillStyle = "#FF0000"; // 2: red
                break;
            case 3:
                ctx.fillStyle = "#0000FF"; // 2: blue
                break;
            default: // 1
                ctx.fillStyle = "#000000"; // default: black
            }

            ctx.fillRect(j * BLOCK_SIZE, 
                         i * BLOCK_SIZE,
                         BLOCK_SIZE, 
                         BLOCK_SIZE);
        }
    }
}

function generateFixedMap() {
    var temp_map_array = map_txt.split("\n");

    for (var i = 0; i < temp_map_array.length; i++) {
        map[i] = temp_map_array[i].split(" ");
    }    
}

function generateMap() {

    map = []; // reset
    var spaces = []; // elements: [row,col,width,height,area]
    var spaces_upper_left_corners = [[0,0]];

    init_map(); // MAP_WIDTH * MAP_HEIGHT
    split_map(6); // 6 splits; 7 rooms
    generateRooms();

    function generateRooms() {

	var rooms = []; // elements: [row,col,width,height]
        update_spaces();

        spaces.forEach(function(space) {
	    var r_space = space[0];
	    var c_space = space[1];
	    var w_space = space[2];
	    var h_space = space[3];

	    // room: 50% of width of space
	    //       50% of height of space
	    // placed at upper left corner of space
	    var w_room = w_space * 0.5;
	    var h_room = h_space * 0.5;
	    var r_room = r_space;
	    var c_room = c_space;

	    rooms.push([r_room, c_room, w_room, h_room]);
        });

	// update map to include created rooms
	rooms.forEach(function(r) {
	    var r_rm = r[0];
	    var c_rm = r[1];
	    var w_rm = r[2];
	    var h_rm = r[3];
	    for(var i = r_rm; i < (r_rm + h_rm); i++) {
		for (var j = c_rm; j < (c_rm + w_rm); j++) {
		    map[i][j] = 3;
		}
	    }
	});
    }

    // iterates the upper-left-corners to determine spaces and fill
    // the 'spaces'-array
    function update_spaces() {
        // clear spaces before refilling
        spaces = [];

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
    }

    function split_map(nr_splits) {

        var split_pos = 0;

        for (var i = 0; i < nr_splits; i++) {
            do_split();
        }

        function do_split() {
            update_spaces();

            // find biggest current space in map
            var biggest_space = [0,0,0,0,0];
            spaces.forEach(function(s) {
                var area_index = 4;
                if (s[area_index] > biggest_space[area_index]) {
                    biggest_space = s;
                }
            });

            // decide direction
            var r_biggest = biggest_space[0];
            var c_biggest = biggest_space[1];
            var w_biggest = biggest_space[2];
            var h_biggest = biggest_space[3];
            horizontal_split = (w_biggest < h_biggest) ? 1 : 0;

            // split biggest space
            if (horizontal_split) {
                // relative to biggest space
                split_pos = getRandomInt(h_biggest * 0.30,
                                         h_biggest * 0.70);

                // relative to whole map matrix
                split_pos_row = r_biggest + split_pos + 1;

                // record the upper left corner of the new box after splitting
                spaces_upper_left_corners.push([split_pos_row,
                                                c_biggest]);

                // update map matrix to reflect split
                for (var i = c_biggest; i < c_biggest + w_biggest; i++) {
                    map[split_pos_row - 1][i] = 2;
                }
            } else {
                // relative to biggest space
                split_pos = getRandomInt(w_biggest * 0.30,
                                         w_biggest * 0.70);

                // relative to whole map matrix
                split_pos_col = c_biggest + split_pos + 1;

                // record the upper left corner of the new box after splitting
                spaces_upper_left_corners.push([r_biggest, 
                                                split_pos_col]);

                // update map matrix to reflect split
                for (var i = r_biggest; i < r_biggest + h_biggest; i++) {
                    map[i][split_pos_col - 1] = 2;
                }
            }

        }
    }

    // initializes map with defined dimensions, and paints map
    // background grey/white checkered
    function init_map() {
        var counter = 0;
        for (var i = 0; i < MAP_HEIGHT; i++) {
            map[i] = [];
            counter++;
            for (var j = 0; j < MAP_WIDTH; j++) {
                map[i][j] = counter % 2;
                counter++;
            }
        }
    }
}

function getRandomInt(min, max) {
    var cmin = Math.ceil(min);
    var fmax = Math.floor(max);
    return Math.floor(Math.random() * (fmax - cmin + 1)) + cmin;
}


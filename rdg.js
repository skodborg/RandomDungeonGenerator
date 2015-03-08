window.onload = init;

// constants
var BLOCK_SIZE = 10;
var MAP_WIDTH = 0;  // initialized in init() when html has loaded
var MAP_HEIGHT = 0; // initialized in init() when html has loaded

var SPLIT_TYPE = 2;
var ROOM_TYPE = 3;
var DOOR_TYPE = 4;
var CORRIDOR_TYPE = 5;

// global dungeon data structure
var global_map = [];

// use generateFixedMap() to generate below map represented in string
var map_txt = 
    "1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n" + 
    "1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n" + 
    "1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 4 3 3 3 3 3 3 1 0 1 0 4 3 3 3 3 3 1 0 1 0 1 0\n" + 
    "0 1 4 3 3 3 3 3 3 3 3 3 0 1 0 1 0 3 3 3 3 3 3 3 0 1 0 1 3 3 3 3 3 3 0 1 0 1 0 1\n" + 
    "1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0 1 3 3 3 3 3 3 3 1 0 1 0 3 3 3 3 3 3 1 0 1 0 1 0\n" + 
    "0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1 0 3 3 3 3 3 3 3 0 1 0 1 3 3 3 3 3 3 0 1 0 1 0 1\n" + 
    "1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0 1 3 3 3 3 3 3 3 1 0 1 0 3 3 3 3 3 3 1 0 1 0 1 0\n" + 
    "0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1 0 3 3 3 3 3 3 3 0 1 0 1 3 3 3 3 3 3 0 1 0 1 0 1\n" + 
    "1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0 1 3 3 3 3 3 3 3 1 0 1 0 3 3 3 3 3 3 1 0 1 0 1 0\n" + 
    "0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1 0 3 3 3 3 3 3 3 0 1 0 1 3 3 3 3 3 3 0 1 0 1 0 1\n" + 
    "1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0 1 3 3 3 3 3 3 3 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1 0 3 3 3 3 3 3 3 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n" + 
    "1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0 1 3 3 3 3 3 3 3 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n" + 
    "1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n" + 
    "1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1 0 1 0 1 0 1 0 1 0 1 4 3 3 3 3 3 3 3 3 3 0 1 0 1\n" + 
    "1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0\n" + 
    "0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1\n" + 
    "1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0\n" + 
    "0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1\n" + 
    "1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 3 3 3 3 3 3 3 3 3 3 1 0 1 0\n" + 
    "0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 3 3 3 3 3 3 3 3 3 3 0 1 0 1\n" + 
    "1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 0 4 3 3 3 3 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n" + 
    "1 0 1 3 3 3 3 3 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 0 3 3 3 3 3 0 1 0 1 0 1 0 4 3 3 3 3 3 3 3 1 0 1 0 4 3 3 3 3 3 3 3 3 3 1 0 1\n" + 
    "1 0 1 3 3 3 3 3 1 0 1 0 1 0 1 3 3 3 3 3 3 3 3 0 1 0 1 3 3 3 3 3 3 3 3 3 3 0 1 0\n" + 
    "0 1 0 3 3 3 3 3 0 1 0 1 0 1 0 3 3 3 3 3 3 3 3 1 0 1 0 3 3 3 3 3 3 3 3 3 3 1 0 1\n" + 
    "1 0 1 3 3 3 3 3 1 0 1 0 1 0 1 3 3 3 3 3 3 3 3 0 1 0 1 3 3 3 3 3 3 3 3 3 3 0 1 0\n" + 
    "0 1 0 3 3 3 3 3 0 1 0 1 0 1 0 3 3 3 3 3 3 3 3 1 0 1 0 3 3 3 3 3 3 3 3 3 3 1 0 1\n" + 
    "1 0 1 3 3 3 3 3 1 0 1 0 1 0 1 3 3 3 3 3 3 3 3 0 1 0 1 3 3 3 3 3 3 3 3 3 3 0 1 0\n" + 
    "0 1 0 3 3 3 3 3 0 1 0 1 0 1 0 3 3 3 3 3 3 3 3 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n" + 
    "1 0 1 3 3 3 3 3 1 0 1 0 1 0 1 3 3 3 3 3 3 3 3 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 0 3 3 3 3 3 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n" + 
    "1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0\n" + 
    "0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1\n";


function init() {
    // initialize map size constants according to canvas
    MAP_HEIGHT = 
        document.getElementById("canvas").getAttribute("height") / BLOCK_SIZE;
    MAP_WIDTH = 
        document.getElementById("canvas").getAttribute("width") / BLOCK_SIZE;

    // generateFixedMap();
    generateMap();
    paintMap();
}

function paintMap() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    for (var i = 0; i < global_map.length; i++) {
        for (var j = 0; j < global_map[i].length; j++) {

            // switch on map-entry color based on value
            var entry = global_map[i][j];
            switch(entry) {
            case 0:
                ctx.fillStyle = "#CCCCCC"; // 0: grey
                break;
            case 1:
                ctx.fillStyle = "#FFFFFF"; // 1: white
                break;
            case SPLIT_TYPE:
                ctx.fillStyle = "#FF0000"; // 2: red
                break;
            case ROOM_TYPE:
                ctx.fillStyle = "#0000FF"; // 3: blue
                break;
            case DOOR_TYPE:
                ctx.fillStyle = "#00FF00"; // 4: green
                break;
            case CORRIDOR_TYPE:
                ctx.fillStyle = "#FF00FF"; // 5: magenta
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

// element : [row,col,width,height,type]
function paintOntoMap(elements) {
    elements.forEach(function(elem) {
        var elem_r = elem[0];
        var elem_c = elem[1];
        var elem_w = elem[2];
        var elem_h = elem[3];
        var elem_type = elem[4];
        for(var i = 0; i < elem_h; i++) {
            for(var j = 0; j < elem_w; j++) {
                global_map[elem_r+i][elem_c+j] = elem_type;
            }
        }
    });
    paintMap();
}

function generateFixedMap() {
    var temp_map_array = map_txt.split("\n");

    for (var i = 0; i < temp_map_array.length; i++) {
        global_map[i] = temp_map_array[i].split(" ").map(
            function(i) { return parseInt(i,10) }
        );
    }
}

function generateMap() {

    init_map(); // MAP_WIDTH * MAP_HEIGHT
    var rooms = generateRooms();
    generateCorridors(rooms);

    function generateCorridors(rooms) {

        // clone global_map to avoid drawing on it
        var tmp_map = cloneMap(global_map);

        var room1 = rooms[0];
        var doors1 = room1[5];
        var door1 = doors1[0];

        var room2 = rooms[1];
        var doors2 = room2[5];
        var door2 = doors2[0];

        var corridor_coords = [];
        corridor_coords.push(door1);

        create_corridor();

	// update global_map to reflect generated corridors
	global_map = tmp_map;

        function create_corridor() {

            // pull current and surrounding coordinates
            var curr_coord = corridor_coords[corridor_coords.length-1];

            var temp = get_coords_of_surrounding(curr_coord);
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].equals(door2)) {
                    return;
                }
            }

            temp = filter_valid_fields(temp);
            temp = add_manhattan_heuristics(temp, door2);

            // determine best next step, based on heuristics
            var heuristic_idx = 2;
            var best_next_coord = temp[0];
            for (var i = 0; i < temp.length; i++) {
                if (best_next_coord[heuristic_idx] > temp[i][heuristic_idx]) {
                    best_next_coord = temp[i];
                }
            }
            tmp_map[best_next_coord[0]][best_next_coord[1]] = CORRIDOR_TYPE;
            corridor_coords.push(best_next_coord);

            // call recursively
            create_corridor();
        }

        // determine heuristically estimated distance from every coordinate in
        // coords_array to target_coord, and return new array with all the 
	// coordinates and their heuristic-value
        // heuristic-value 
        function add_manhattan_heuristics(coords_array, target_coord) {
            var result = [];
            var target_row = target_coord[0];
            var target_col = target_coord[1];

            for (var i = 0; i < coords_array.length; i++) {
                var ci = coords_array[i];
                var ci_row = ci[0];
                var ci_col = ci[1];
                var heuristic_val = 
                    Math.abs(target_row - ci_row) +
                    Math.abs(target_col - ci_col);

                result.push([ci_row, ci_col, heuristic_val]);
            }

            return result;
        }

	// return a new array of all the fields in coords_array that are
	// valid to possibly walk (no room-wall, no unintended door etc.)
        function filter_valid_fields(coords_array) {
            var result = [];
            for (var i = 0; i < coords_array.length; i++) {
                var ci = coords_array[i];
                var entry = tmp_map[ci[0]][ci[1]];
                switch(entry) {
                case ROOM_TYPE:
                    // filter; do not include
                    break;
                case DOOR_TYPE:
                    break;
                case CORRIDOR_TYPE:
                    // Check that we have not crossed our own way!
                    // We should never tread the same corridor field twice 
                    // on our way from A to B
		    // - compare current valid fields with previous fields
		    //   on this same route; invalidate if already walked upon
                    var ci_r = ci[0];
                    var ci_c = ci[1];

                    var contained = false;
                    for (var j = 0; j < corridor_coords.length; j++) {
                        var corr_c = corridor_coords[j];
			var corr_cRow = corr_c[0];
			var corr_cCol = corr_c[1];
                        if (corr_cRow == ci_r &&
                            corr_cCol == ci_c) {
                            contained = true;
                        }
                    }
                    if (!contained) { result.push(ci); }
                    break;

                default:
                    result.push(ci);
                }
            }
            return result;
        }

	// returns a list of N,S,E,W coordinates, relative to center_coords
        function get_coords_of_surrounding(center_coords) {
            var r = center_coords[0];
            var c = center_coords[1];
            return [[r-1, c],
                    [r+1, c],
                    [r, c-1],
                    [r, c+1]];
        }
    }

    function generateRooms() {

        var rooms = []; // elements: [row,col,width,height,area]
        var spaces = []; // elements: [row,col,width,height,area]
        var spaces_upper_left_corners = [[0,0]]; // state updated in split_map()

        // clone global_map to avoid drawing splits on it
        var tmp_map = cloneMap(global_map);

        // reduce tmp_map by 4 rows and 4 columns to make sure rooms
        // are created with distance 2 to the map edges, to still allow for a 
        // corridor to run along the edges at all times
        var corridor_margin = 2;
        tmp_map = copyMap(tmp_map, 
                          1, 
                          tmp_map.length - (2 * corridor_margin));

        split_map(6, tmp_map); // 6 splits; 7 rooms
        update_spaces(tmp_map); // updates 'spaces'-array based on splits
        create_rooms(); // fills 'rooms'-array
        create_doors_in_rooms(rooms);

        // update global_map to include created rooms, correcting for the
        // skewing of the tmp_map to leave room at the edges of the
        // map for eventual corridors (addition of corridor_margin)
        rooms.forEach(function(r) {

            var cm = corridor_margin;

            // correcting room & door coordinates to recover from the
            // skewing of the tmp_map relative to global_map, related
            // to the corridor-margin around the edges of the map
            r[0] += cm;
            r[1] += cm;

            var r_rm = r[0];
            var c_rm = r[1];
            var w_rm = r[2];
            var h_rm = r[3];
            var doors_rm = r[5];
            // include room 'body' on map
            for(var i = r_rm; i < (r_rm + h_rm); i++) {
                for (var j = c_rm; j < (c_rm + w_rm); j++) {
                    global_map[i][j] = ROOM_TYPE;
                }
            }
            // include room doors on map
            doors_rm.forEach(function(door) {
                // adding cm to correct state of door-coord for corridor_margin
                var door_r = door[0] += cm;
                var door_c = door[1] += cm;
                global_map[door_r][door_c] = DOOR_TYPE;
            });
        });

        // return 'rooms'-array
        return rooms;

        
        // modifies rooms in given array to include doors, by pushing
        // a list of doors on each room-specification-array
        // result: list with room-elements: 
        //         [row,col,width,height,area,[doors-list]]
        // where [doors-list] contains elements:
        //          [[door1_row, door2_col], [door2_row, door2_col], ...]
        function create_doors_in_rooms(rooms_array) {
            rooms_array.forEach(function(room) {
                var ul_r = room[0];
                var ul_c = room[1];
		var room_w = room[2];
		var room_h = room[3];

		// decide which of the four walls to place door upon
		// North:1, East:2, South:3, West:4
		var wall = getRandomInt(1,4);
		
		switch(wall) {
		case 1:
		    ul_c += getRandomInt(0, room_w-1);
		    break;
		case 2:
		    ul_r += getRandomInt(0, room_h-1);
		    break;
		case 3:
		    // ul_r += room_h-1;
		    ul_c += getRandomInt(0, room_w-1);
		    break;
		case 4:
		    ul_c += room_w-1;
		    ul_r += getRandomInt(0, room_h-1);;
		    break;
		default:
		    // upper left corner; ul_r and ul_c are left unmodified
		    break;
		}
		
                var room_doors = [];
                // create a room in upper-left corner of each room
                room_doors.push([ul_r, ul_c]);

                // push the list of doors on the room-specification
                room.push(room_doors);
            });
        }

        // create rooms based on spaces
        function create_rooms() {
            spaces.forEach(function(space) {
                var r_space = space[0];
                var c_space = space[1];
                var w_space = space[2];
                var h_space = space[3];

                // room: 30-70% of width of space
                //       100%-width% of height of space
                var rand_pct_w = getRandomInt(5, 8) / 10;
                // var rand_pct_h = 1-rand_pct_w;
                var rand_pct_h = getRandomInt(5, 8) / 10;
                // correcting javascript floating point weirdness
                rand_pct_h = Math.round(rand_pct_h * 10) / 10;

                var w_room = Math.round(w_space * rand_pct_w);
                var h_room = Math.round(h_space * rand_pct_h);

                // room coordinates: 10-90% (random) of the slack on each
                //   axis is added to the coordinate of the upper left
                //   corner of the space to determine the coordinate of
                //   the room
                var horizontal_slack = w_space - w_room;
                var vertical_slack = h_space - h_room;

                var rand_pct_hrz = getRandomInt(1, 9) / 10;
                // var rand_pct_vrt = 1 - rand_pct_hrz;
                var rand_pct_vrt = getRandomInt(1, 9) / 10;
                // correcting javascript floating point weirdness
                rand_pct_vrt = Math.round(rand_pct_vrt * 10) / 10;

                var r_room = Math.round(r_space + (vertical_slack *
                                                   rand_pct_vrt));
                var c_room = Math.round(c_space + (horizontal_slack *
                                                   rand_pct_hrz));

                rooms.push([r_room, c_room, w_room, h_room, (w_room * h_room)]);
            });
        }

        // iterates the upper-left-corners to determine spaces and fill
        // the 'spaces'-array
        function update_spaces(arg_map) {
            // clear spaces before refilling
            spaces = [];

            arg_map_height = arg_map.length;
            arg_map_width = arg_map[0].length;

            spaces_upper_left_corners.forEach(function(curr_corner) {
                var corner_row = curr_corner[0];
                var corner_col = curr_corner[1];
                var area_found = false;

                for (var i = corner_row; i < arg_map_height; i++) {
                    if (!area_found) {
                        if (arg_map[i][corner_col] == SPLIT_TYPE 
                            || i == arg_map_height - 1) {
                            // horizontal split found

                            // off-by-1 at map end
                            if (i == arg_map_height - 1) { i++; } 

                            var curr_space_height = i - corner_row;

                            for (var j = corner_col; j < arg_map_width; j++) {
                                if (!area_found) {
                                    if (arg_map[i-1][j] == SPLIT_TYPE
                                        || j == arg_map_width - 1) {
                                        // vertical split found

                                        // off-by-1 at map end
                                        if (j == arg_map_width - 1) { j++; } 

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

        function split_map(nr_splits, map_to_split) {

            var split_pos = 0;

            for (var i = 0; i < nr_splits; i++) {
                do_split();
            }

            function do_split() {
                update_spaces(map_to_split);

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
                        map_to_split[split_pos_row - 1][i] = SPLIT_TYPE;
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
                        map_to_split[i][split_pos_col - 1] = SPLIT_TYPE;
                    }
                }

            }
        }
    }

    // initializes map with defined dimensions, and paints map
    // background grey/white checkered
    function init_map() {
        var counter = 0;
        for (var i = 0; i < MAP_HEIGHT; i++) {
            global_map[i] = [];
            counter++;
            for (var j = 0; j < MAP_WIDTH; j++) {
                global_map[i][j] = counter % 2;
                counter++;
            }
        }
    }
}

function cloneMap(map) {
    return copyMap(map);
}

// returns a copy of the map (or a quadratic sub-part of the map
// defined by lower- and upper-bounds given, inclusive; not 0-indexed!)
// lower_bound: defines the row and(!) column of the upper left corner 
//              of the resulting sub-map
// upper_bound: defines the row and(!) column of the lower right corner
//              of the resulting sub-map
// default (whole map): lower_bound: 1
//                      upper_bound: map.length
function copyMap(map, lower_bound, upper_bound) {
    // set default values if no args are given
    lower_bound = typeof lower_bound !== 'undefined' ? lower_bound : 1;
    upper_bound = typeof upper_bound !== 'undefined' ? upper_bound : map.length;

    var newMap = [];
    for(var i = lower_bound-1; i < upper_bound; i++) {
        newMap.push(map[i].slice(lower_bound-1, upper_bound));
    }
    return newMap;
}

function getRandomInt(min, max) {
    var cmin = Math.ceil(min);
    var fmax = Math.floor(max);
    return Math.floor(Math.random() * (fmax - cmin + 1)) + cmin;
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
    if (!array)
        return false;
    if (this.length != array.length)
        return false;

    // iterate through content
    var l = this.length;
    for (var i = 0; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            return false;   
        }           
    }       
    return true;
}  

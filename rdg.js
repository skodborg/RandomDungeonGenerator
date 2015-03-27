window.onload = init;

// constants
var BLOCK_SIZE = 1;
var MAP_WIDTH = 0;  // initialized in init() when html has loaded
var MAP_HEIGHT = 0; // initialized in init() when html has loaded

var SPLIT_TYPE = 2;
var ROOM_TYPE = 3;
var DOOR_TYPE = 4;
var CORRIDOR_TYPE = 5;

var OFF_BY_1 = 1;

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
                ctx.fillStyle = "#994C00"; // 3: brown
                break;
            case DOOR_TYPE:
                ctx.fillStyle = "#FF0000"; // 4: orange
                break;
            case CORRIDOR_TYPE:
                ctx.fillStyle = "#CC0000"; // 5: dark red
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
    generateMaze();
    connectRoomsWithMaze(global_map);

    function connectRoomsWithMaze(arg_map) {

        var attempts = 0;
        var door_placed = false;

        rooms.forEach(function(room) {
            // repeat until a door in the room was successfully placed
            // or 10 attempts has been made
            attempts = 0;
            door_placed = false;

            while (!door_placed && attempts < 10) {
                door_placed = place_door_helper(room, arg_map);
                attempts++;
            }
        });

        function place_door_helper(room, arg_map) {
            var ul_r = room[0];
            var ul_c = room[1];
            var room_w = room[2];
            var room_h = room[3];

            // bailout in case of too small rooms (too many splits or
            // too big blocks)
            if (room_w <= 0 || room_h <= 0) return true;

            // decide which of the four walls to place door upon
            // North:1, East:2, South:3, West:4
            var wall = getRandomInt(1,4);

            var NO_DOOR_IN_CORNER = 1;
            var possible_doors = [];

            switch(wall) {
            case 1:
                for (var i = 0; i < room_w; i++) {
                    if (arg_map[ul_r - 2][ul_c+i] == CORRIDOR_TYPE) {
                        possible_doors.push([(ul_r-1), (ul_c+i)]);
                    }
                }
                break;
            case 2:
                for (var i = 0; i < room_h; i++) {
                    if (ul_c+room_w+1 >= MAP_WIDTH) continue; // off map
                    if (arg_map[ul_r+i][ul_c+room_w+1] == CORRIDOR_TYPE) {
                        possible_doors.push([(ul_r+i), (ul_c+room_w)]);
                    }
                }
                break;
            case 3:
                for (var i = 0; i < room_w; i++) {
                    if (ul_r+room_h+1 >= MAP_HEIGHT) continue; // off map
                    if (arg_map[ul_r+room_h+1][ul_c+i] == CORRIDOR_TYPE) {
                        possible_doors.push([(ul_r+room_h), (ul_c+i)]);
                    }
                }
                break;

            case 4:
                for (var i = 0; i < room_h; i++) {
                    if (arg_map[ul_r+i][ul_c-2] == CORRIDOR_TYPE) {
                        possible_doors.push([(ul_r+i), (ul_c-1)]);
                    }
                }
                break;
            default:
                break;
            }

            if (possible_doors.length == 0) return false;
            var rnd = getRandomInt(0, possible_doors.length-1);
            var chosen_door = possible_doors[rnd];

            arg_map[chosen_door[0]][chosen_door[1]] = DOOR_TYPE;
            return true;
        }
    }


    function generateMaze() {
        
        var coords_stack = [];
        var fields_to_check = [];
        var step_size = 2;

        // fill coords_stack with all even coordinates to check
        for (var c = 1; c < MAP_WIDTH; c += step_size) {
            for (var r = 1; r < MAP_HEIGHT; r += step_size) {
                coords_stack.push([r,c]);
            }
        }
        coords_stack = filter_valid_fields(coords_stack, global_map);
        coords_stack.shuffle();

        dfs_nonrecursive(coords_stack.pop(), global_map);

        function dfs_nonrecursive(start_coord, arg_map) {
            var fields_to_check = [];
            var stepping_from = [];
            fields_to_check.push(start_coord);
            stepping_from.push(start_coord);

            while(fields_to_check.length > 0) {
                var coor = fields_to_check.pop();
                var from = stepping_from.pop();
                var cr = coor[0];
                var cc = coor[1];

                var valid_neighbours = [];
                valid_neighbours = filter_valid_fields(get_coords_of_surrounding(coor),
                                                       arg_map);

                // if multiple neighbours, make sure to exhaust
                if (valid_neighbours.length > 1) {
                    fields_to_check.push(coor);
                    stepping_from.push(coor);
                }

                // if no neighbours for current node, break this loop iteration
                if (valid_neighbours.length == 0) {
                    continue;
                }

                var rand_neighbour_idx = getRandomInt(0, valid_neighbours.length-1);
                var rand_neighbour = valid_neighbours[rand_neighbour_idx];

                paint_step(from, rand_neighbour, arg_map);
                
                // update stacks to reflect stepping in a direction
                fields_to_check.push(rand_neighbour);
                stepping_from.push(rand_neighbour);
            }
        }

        function paint_step(from, to, arg_map) {
            var step_size = 2;

            var r_from = from[0];
            var c_from = from[1];
            var r_to = to[0];
            var c_to = to[1];

            if (r_to - r_from == step_size) {
                // stepped south
                arg_map[r_from][c_from] = CORRIDOR_TYPE;
                arg_map[r_from+1][c_from] = CORRIDOR_TYPE;
                arg_map[r_from+2][c_from] = CORRIDOR_TYPE;
            }
            else if (r_from - r_to == step_size) {
                // stepped north
                arg_map[r_from][c_from] = CORRIDOR_TYPE;
                arg_map[r_from-1][c_from] = CORRIDOR_TYPE;
                arg_map[r_from-2][c_from] = CORRIDOR_TYPE;
            }
            else if (c_to - c_from == step_size) {
                // stepped east
                arg_map[r_from][c_from] = CORRIDOR_TYPE;
                arg_map[r_from][c_from+1] = CORRIDOR_TYPE;
                arg_map[r_from][c_from+2] = CORRIDOR_TYPE;
            }
            else if (c_from - c_to == step_size) {
                // stepped west
                arg_map[r_from][c_from] = CORRIDOR_TYPE;
                arg_map[r_from][c_from-1] = CORRIDOR_TYPE;
                arg_map[r_from][c_from-2] = CORRIDOR_TYPE;
            }
            else {
                console.log("ERROR: Something went wrong while stepping "+
                            "in dfs when creating maze");
            }
        }

        // returns a list of N,S,E,W coordinates, relative to center_coord
        function get_coords_of_surrounding(center_coord) {
            var r = center_coord[0];
            var c = center_coord[1];
            var result_coords = [];

            if (r > 1) { result_coords.push([r-2, c]); }
            if (r < MAP_WIDTH-2) { result_coords.push([r+2, c]); }
            if (c > 1) { result_coords.push([r, c-2]); }
            if (c < MAP_HEIGHT-2) { result_coords.push([r, c+2]); }

            return result_coords;
        }

        // return a new array of all the fields in coords_array that are
        // valid to possibly walk (no room-wall, no corridor etc.)
        function filter_valid_fields(coords_array, arg_map) {
            var result = [];
            for (var i = 0; i < coords_array.length; i++) {
                var ci = coords_array[i];
                var entry = arg_map[ci[0]][ci[1]];
                switch(entry) {
                case ROOM_TYPE:
                    // filter; do not include
                    break;
                case DOOR_TYPE:
                    break;
                case CORRIDOR_TYPE:
                    break;
                default:
                    result.push(ci);
                }
            }
            return result;
        }
    }

    function generateRooms() {

        var rooms = []; // elements: [row,col,width,height,area]
        var spaces = []; // elements: [row,col,width,height,area]
        var spaces_upper_left_corners = [[0,0]]; // state updated in split_map()

        // reduce tmp_map by 4 rows and 4 columns to make sure rooms
        // are created with distance 2 to the map edges, to still allow for a 
        // corridor to run along the edges at all times
        var corridor_margin = 2;
        var tmp_map = copyMap(global_map, 
                              1, 
                              global_map.length - (2 * corridor_margin));

        split_map(1000, tmp_map);
        update_spaces(tmp_map); // updates 'spaces'-array based on splits
        create_rooms(); // fills 'rooms'-array

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

                var NO_DOOR_IN_CORNER = 1;

                switch(wall) {
                case 1:
                    ul_c += getRandomInt(NO_DOOR_IN_CORNER, 
                                         room_w - NO_DOOR_IN_CORNER - OFF_BY_1);
                    break;
                case 2:
                    ul_r += getRandomInt(NO_DOOR_IN_CORNER, 
                                         room_h - NO_DOOR_IN_CORNER - OFF_BY_1);
                    break;
                case 3:
                    ul_r += room_h - OFF_BY_1;
                    ul_c += getRandomInt(NO_DOOR_IN_CORNER, 
                                         room_w - NO_DOOR_IN_CORNER - OFF_BY_1);
                    break;
                case 4:
                    ul_c += room_w - OFF_BY_1;
                    ul_r += getRandomInt(NO_DOOR_IN_CORNER, 
                                         room_h - NO_DOOR_IN_CORNER - OFF_BY_1);
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

                // room: 40-70% of width of space
                //       40-70% of height of space
                var rand_pct_w = getRandomInt(4, 7) / 10;
                var rand_pct_h = getRandomInt(4, 7) / 10;
                // correcting javascript floating point weirdness
                rand_pct_h = Math.round(rand_pct_h * 10) / 10;

                var w_room = Math.round(w_space * rand_pct_w);
                var h_room = Math.round(h_space * rand_pct_h);

                // room coordinates: 10-90% (random) of the slack on each
                //   axis is added to the coordinate of the upper left
                //   corner of the space to determine the coordinate of
                //   the room
                var EDGE_MARGIN = 2;
                var horizontal_slack = w_space - w_room - EDGE_MARGIN;
                var vertical_slack = h_space - h_room - EDGE_MARGIN;

                // correct room width and height to be an odd size
                // - increase/decrease by 1 if not, based on slack values
                if (w_room % 2 != 1) {
                    if (horizontal_slack >= w_room) {
                        w_room++;
                    } else {
                        w_room--;
                    }
                }
                if (h_room % 2 != 1) {
                    if (vertical_slack >= h_room) {
                        h_room++;
                    } else {
                        h_room--;
                    }
                }


                var rand_pct_hrz = getRandomInt(1, 9) / 10; // 10-90%
                var rand_pct_vrt = getRandomInt(1, 9) / 10;


                var AVOID_EDGE = 1;
                var r_room = Math.round(r_space + AVOID_EDGE + 
                                        (vertical_slack *
                                         rand_pct_vrt));
                var c_room = Math.round(c_space + AVOID_EDGE + 
                                        (horizontal_slack *
                                         rand_pct_hrz));

                // make sure all rooms are placed with an upper-left corner
                // on an odd coordinate: (r,c) both being odd numbers
                if (r_room % 2 != 1) { r_room++; }
                if (c_room % 2 != 1) { c_room++; }

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
        var row_init = 0;
        var counter = row_init;
        for (var i = 0; i < MAP_HEIGHT; i++) {
            global_map[i] = [];
            counter = row_init;
            for (var j = 0; j < MAP_WIDTH; j++) {
                global_map[i][j] = counter % 2;
                counter++;
            }
            row_init = row_init+1 % 2;
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

Array.prototype.shuffle = function() {
    for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
}

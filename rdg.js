window.onload = init;

// constants
var BLOCK_SIZE = 10;
var MAP_WIDTH = 0;  // initialized in init() when html has loaded
var MAP_HEIGHT = 0; // initialized in init() when html has loaded

// global dungeon data structure
var global_map = [];

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
    // initialize map size constants according to canvas
    MAP_HEIGHT = 
        document.getElementById("canvas").getAttribute("height") / BLOCK_SIZE;
    MAP_WIDTH = 
        document.getElementById("canvas").getAttribute("width") / BLOCK_SIZE;

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
            case 2:
                ctx.fillStyle = "#FF0000"; // 2: red
                break;
            case 3:
                ctx.fillStyle = "#0000FF"; // 3: blue
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
        map[i] = temp_map_array[i].split(" ");
    }    
}

function generateMap() {

    init_map(); // MAP_WIDTH * MAP_HEIGHT
    generateRooms();

    function generateRooms() {

        var rooms = []; // elements: [row,col,width,height,area]
        var spaces = []; // elements: [row,col,width,height,area]
        var spaces_upper_left_corners = [[0,0]]; // state updated in split_map()

        // clone global_map to avoid drawing splits on it
        var tmp_map = cloneMap(global_map);

        split_map(7, tmp_map); // 6 splits; 7 rooms
        update_spaces(tmp_map); // updates 'spaces'-array based on splits
        create_rooms(); // fills 'rooms'-array

        // update global_map to include created rooms
        rooms.forEach(function(r) {
            var r_rm = r[0];
            var c_rm = r[1];
            var w_rm = r[2];
            var h_rm = r[3];
            for(var i = r_rm; i < (r_rm + h_rm); i++) {
                for (var j = c_rm; j < (c_rm + w_rm); j++) {
                    global_map[i][j] = 3;
                }
            }
        });

        // create rooms based on spaces
        function create_rooms() {
            spaces.forEach(function(space) {
                var r_space = space[0];
                var c_space = space[1];
                var w_space = space[2];
                var h_space = space[3];

                // room: 30-70% of width of space
                //       100%-width% of height of space
                var rand_pct_w = getRandomInt(3, 7) / 10;
                // var rand_pct_h = 1-rand_pct_w;
                var rand_pct_h = getRandomInt(3, 7) / 10;
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

            spaces_upper_left_corners.forEach(function(curr_corner) {
                var corner_row = curr_corner[0];
                var corner_col = curr_corner[1];
                var area_found = false;

                for (var i = corner_row; i < MAP_HEIGHT; i++) {
                    if (!area_found) {
                        if (arg_map[i][corner_col] == 2 
                            || i == MAP_HEIGHT - 1) {
                            // horizontal split found

                            // off-by-1 at map end
                            if (i == MAP_HEIGHT - 1) { i++; } 

                            var curr_space_height = i - corner_row;

                            for (var j = corner_col; j < MAP_WIDTH; j++) {
                                if (!area_found) {
                                    if (arg_map[i-1][j] == 2
                                        || j == MAP_WIDTH - 1) {
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
                        map_to_split[split_pos_row - 1][i] = 2;
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
                        map_to_split[i][split_pos_col - 1] = 2;
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


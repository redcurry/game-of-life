var grid = [];

var WIDTH = 300;
var HEIGHT = 150;

var CELL_R = 2

//var RULES = {born: [2], survives: [3, 4]};
//var RULES = {born: [3], survives: [2, 3]};
var RULES = {born: [1, 2], survives: [1]};

var DELAY = 100;

var COLOR_BG = "black";
var COLOR_FG = "green";

var TYPE = "hex"; // "hex" or "rect"

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

function init() {
    initializeGridSingle();
    window.requestAnimationFrame(updateGrid);
}

function initializeGrid() {
    for (var i = 0; i < WIDTH; i++) {
        grid[i] = []
        for (var j = 0; j < HEIGHT; j++) {
            grid[i][j] = {alive: Math.random() < 0.5};
        }
    }
}

function initializeGridSingle() {
    for (var i = 0; i < WIDTH; i++) {
        grid[i] = []
        for (var j = 0; j < HEIGHT; j++) {
            grid[i][j] = {alive: false};
        }
    }

    grid[Math.floor(WIDTH / 2)][Math.floor(HEIGHT / 2)].alive = true;
}

function updateGrid() {
    var newGrid = []
    for (var i = 0; i < WIDTH; i++) {
        newGrid[i] = []
        for (var j = 0; j < HEIGHT; j++) {
            var nc = 0;

            if (TYPE == "hex") {
                nc = neighborCountHex(grid, i, j);
            }
            else {
                nc = neighborCount(grid, i, j);
            }

            newGrid[i][j] = {alive: grid[i][j].alive};

            if (grid[i][j].alive) {
                newGrid[i][j].alive =
                    RULES.survives.indexOf(nc) != -1;
            }
            else {
                newGrid[i][j].alive =
                    RULES.born.indexOf(nc) != -1;
            }
        }
    }

    grid = newGrid;
    drawGrid();

    sleep(DELAY);

    window.requestAnimationFrame(updateGrid);
}

function neighborCount(grid, i, j) {
    var neighborCount = 0;
    for (var a = -1; a <= 1; a++) {
        for (var b = -1; b <= 1; b++) {
            if (a == 0 && b == 0)
                continue;
            if (i + a < 0 || i + a >= WIDTH)
                continue;
            if (j + b < 0 || j + b >= HEIGHT)
                continue;
            if (grid[i + a][j + b].alive) {
                neighborCount++
            }
        }
    }
    return neighborCount;
}

function neighborCountHex(grid, i, j) {
    var neighbors = [
        [i, j - 1], [i, j + 1],
        [i - 1, j], [i + 1, j],
    ]

    if (j % 2 == 1) {
        neighbors[4] = [i + 1, j - 1];
        neighbors[5] = [i + 1, j + 1];
    }
    else {
        neighbors[4] = [i - 1, j - 1];
        neighbors[5] = [i - 1, j + 1];
    }

    var neighbors = neighbors.filter(
            function(x) { return x[0] >= 0 && x[0] < WIDTH &&
                                 x[1] >= 0 && x[1] < HEIGHT &&
                                 grid[x[0]][x[1]].alive; });

    return neighbors.length;
}

function sleep(milliseconds) {
      var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                          break;
                              }
                  }
}

function drawGrid() {
    context.fillStyle = COLOR_BG;
    context.fillRect(0, 0,
            WIDTH * 2 * CELL_R + CELL_R, HEIGHT * 2 * CELL_R + CELL_R);
    context.fillStyle = COLOR_FG;

    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            if (grid[i][j].alive) {
                if (TYPE == "hex") {
                    drawCellAsCircle(context, i, j);
                }
                else {
                    drawCellAsRect(context, i, j);
                }
            }
        }
    }
}

function drawCellAsRect(context, i, j) {
    context.beginPath();
    context.arc(i * 2 * CELL_R + CELL_R,
                j * 2 * CELL_R + CELL_R,
                CELL_R,
                0, 2 * Math.PI);
    context.fill();
}

function drawCellAsCircle(context, i, j) {
    context.beginPath();
    if (j % 2 == 0) {
        context.arc(i * 2 * CELL_R + CELL_R,
                    j * 2 * CELL_R + CELL_R - (2 - CELL_R * Math.sqrt(2)),
                    CELL_R,
                    0, 2 * Math.PI);
    }
    else {
        context.arc(i * 2 * CELL_R + CELL_R + CELL_R,
                    j * 2 * CELL_R + CELL_R - (2 - CELL_R * Math.sqrt(2)),
                    CELL_R,
                    0, 2 * Math.PI);
    }
    context.fill();
}

init();

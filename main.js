var grid = [];

var WIDTH = 200;
var HEIGHT = 100;

var CELL_WIDTH = 5
var CELL_HEIGHT = 5

var RULES = {born: [3], survives: [2, 3]};

var DELAY = 100;

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

function init() {
    initializeGrid();
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

function updateGrid() {
    var newGrid = []
    for (var i = 0; i < WIDTH; i++) {
        newGrid[i] = []
        for (var j = 0; j < HEIGHT; j++) {
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

            newGrid[i][j] = {alive: grid[i][j].alive};

            if (grid[i][j].alive) {
                newGrid[i][j].alive =
                    RULES.survives.indexOf(neighborCount) != -1;
            }
            else {
                newGrid[i][j].alive =
                    RULES.born.indexOf(neighborCount) != -1;
            }
        }
    }

    grid = newGrid;
    drawGrid();

    sleep(DELAY);

    window.requestAnimationFrame(updateGrid);
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
    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            if (grid[i][j].alive) {
                context.fillStyle = "black"
            }
            else {
                context.fillStyle = "white"
            }
            context.fillRect(
                i * CELL_WIDTH + i,
                j * CELL_HEIGHT + j, CELL_WIDTH, CELL_HEIGHT);
        }
    }
}

init();

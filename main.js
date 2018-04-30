var grid = [];

var WIDTH = 300;
var HEIGHT = 300;

var CELL_R = 2

var RULES = {born: [1, 2], survives: [2, 4]};

var COLOR_BG = "black";
var COLOR_FG = "white";

var isColored = true; // works only for "hex"
var COLORS = ["#d4dcff", "#7d83ff", "#007fff", "#1affd5"];
var color_i = -1;
var floodMap = {}

var type = "hex"; // "hex" or "rect"

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

var delay = 500;
var isPaused = false;

var then = Date.now();

function main() {
    addEventListeners();
    initGridWithSingleCell();
    updateAndDrawGrid();
    animate();
}

function addEventListeners() {
    var squareRadio = document.getElementById("squareRadio");
    squareRadio.checked = (type == "rect") ? true : false;
    squareRadio.addEventListener("change", function() {
        if (squareRadio.checked) {
            type = "rect";
        } else {
            type = "hex";
        }
        drawGrid();
    });

    var hexRadio = document.getElementById("hexRadio");
    hexRadio.checked = (type == "hex") ? true : false;
    hexRadio.addEventListener("change", function() {
        if (hexRadio.checked) {
            type = "hex";
        } else {
            type = "rect";
        }
        drawGrid();
    });

    var resetSingleButton = document.getElementById("resetSingleButton");
    resetSingleButton.addEventListener("click", function() {
        initGridWithSingleCell();
        drawGrid();
    });

    var resetRandomButton = document.getElementById("resetRandomButton");
    resetRandomButton.addEventListener("click", function() {
        initGridWithRandomCells();
        drawGrid();
    });

    var delaySlider = document.getElementById("delaySlider");
    var delayLabel = document.getElementById("delayLabel");
    delaySlider.value = delay;
    delayLabel.innerText = delay + " ms";
    delaySlider.addEventListener("input", function() {
        delay = delaySlider.value;
        delayLabel.innerText = delay + " ms";
    });

    var startAndPauseButton = document.getElementById("startAndPauseButton");
    startAndPauseButton.addEventListener("click", function() {
        if (startAndPauseButton.value == "Play") {
            isPaused = false;
            animate();
            startAndPauseButton.value = "Pause";
        } else {
            isPaused = true;
            startAndPauseButton.value = "Play";
        }
    });

    var nextGenerationButton = document.getElementById("nextGenerationButton");
    nextGenerationButton.addEventListener("click", function() {
        if (isPaused) {
            updateAndDrawGrid();
        }
    });

    for (var i = 0; i <= 6; i++) {
        var bornCheckbox = document.getElementById("born" + i + "Checkbox");
        bornCheckbox.checked = RULES.born.indexOf(i) != -1;
        bornCheckbox.addEventListener("change", function(e) {
            var checkbox = e.target;
            var n = parseInt(checkbox.value, 10);
            var index = RULES.born.indexOf(n);
            if (checkbox.checked && index == -1) {
                RULES.born.push(n);
            } else if (!checkbox.checked && index != -1) {
                RULES.born.splice(index, 1);
            }
        });
    }

    for (var i = 0; i <= 6; i++) {
        var survivesCheckbox = document.getElementById("survives" + i + "Checkbox");
        survivesCheckbox.checked = RULES.survives.indexOf(i) != -1;
        survivesCheckbox.addEventListener("change", function(e) {
            var checkbox = e.target;
            var n = parseInt(checkbox.value, 10);
            var index = RULES.survives.indexOf(n);
            if (checkbox.checked && index == -1) {
                RULES.survives.push(n);
            } else if (!checkbox.checked && index != -1) {
                RULES.survives.splice(index, 1);
            }
        });
    }
}

function initGridWithRandomCells() {
    grid = []
    for (var i = 0; i < WIDTH; i++) {
        grid[i] = []
        for (var j = 0; j < HEIGHT; j++) {
            grid[i][j] = {alive: Math.random() < 0.5};
        }
    }
}

function initGridWithSingleCell() {
    grid = []
    for (var i = 0; i < WIDTH; i++) {
        grid[i] = []
        for (var j = 0; j < HEIGHT; j++) {
            grid[i][j] = {alive: false, color: COLOR_FG};
        }
    }

    grid[Math.floor(WIDTH / 2)][Math.floor(HEIGHT / 2)].alive = true;
}

function animate() {
    var now = Date.now();
    var elapsed = now - then;

    if (elapsed > delay) {
        updateAndDrawGrid();
        then = now;
    }

    if (!isPaused) {
        window.requestAnimationFrame(animate);
    }
}

function updateAndDrawGrid() {
    updateGrid();
    drawGrid();
}

function updateGrid() {
    var newGrid = []

    for (var i = 0; i < WIDTH; i++) {
        newGrid[i] = []

        for (var j = 0; j < HEIGHT; j++) {
            var nc = 0;

            if (type == "hex") {
                nc = neighborCountHex(grid, i, j);
            }
            else {
                nc = neighborCount(grid, i, j);
            }

            newGrid[i][j] = {alive: false, color: COLOR_FG};

            if (grid[i][j].alive) {
                newGrid[i][j].alive = RULES.survives.indexOf(nc) != -1;
            }
            else {
                newGrid[i][j].alive = RULES.born.indexOf(nc) != -1;
            }
        }
    }

    grid = newGrid;
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
    var neighbors = liveNeighborsHex(grid, i, j);
    return neighbors.length;
}

function liveNeighborsHex(grid, i, j) {
    var neighbors = [
        [i, j - 1], [i, j + 1],
        [i - 1, j], [i + 1, j],
    ];

    if (j % 2 == 1) {
        neighbors[4] = [i + 1, j - 1];
        neighbors[5] = [i + 1, j + 1];
    }
    else {
        neighbors[4] = [i - 1, j - 1];
        neighbors[5] = [i - 1, j + 1];
    }

    return neighbors.filter(
        function(x) { return x[0] >= 0 && x[0] < WIDTH &&
                             x[1] >= 0 && x[1] < HEIGHT &&
                             grid[x[0]][x[1]].alive; });
}

function drawGrid() {

    if (isColored)
        colorGrid();

    context.fillStyle = COLOR_BG;

    if (type == "rect") {
        context.fillRect(0, 0,
                WIDTH * 2 * CELL_R + CELL_R, HEIGHT * 2 * CELL_R + CELL_R);
    } else {
        context.fillRect(0, 0,
                WIDTH * 2 * CELL_R + CELL_R,
                HEIGHT * Math.sqrt(3) * CELL_R + CELL_R);
    }

    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            if (grid[i][j].alive) {
                context.fillStyle = grid[i][j].color;

                if (type == "hex") {
                    drawCellAsCircle(context, i, j);
                    drawNeighborConnectors(context, i, j);
                }
                else {
                    drawCellAsRect(context, i, j);
                }
            }
        }
    }
}

function drawNeighborConnectors(context, i, j) {
    xy = coords(i, j);

    neighbors = liveNeighborsHex(grid, i, j);
    for (var n = 0; n < neighbors.length; n++)
    {
        neighbor = neighbors[n];
        n_xy = coords(neighbor[0], neighbor[1]);
        angle = getAngle(xy, n_xy);
        context.translate(xy.x, xy.y);
        context.rotate(angle);
        context.fillRect(0, -CELL_R, 2 * CELL_R, 2 * CELL_R);
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

function getAngle(xy1, xy2) {
    d_xy = { x: (xy2.x - xy1.x), y: (xy2.y - xy1.y) };
    return Math.atan2(d_xy.y, d_xy.x);
}

function coords(i, j) {
    if (j % 2 == 0) {
        nx = i * 2 * CELL_R + CELL_R;
        ny = j * Math.sqrt(3) * CELL_R + CELL_R;
        return { x: nx, y: ny };
    }
    else {
        nx = i * 2 * CELL_R + CELL_R + CELL_R;
        ny = j * Math.sqrt(3) * CELL_R + CELL_R;
        return { x: nx, y: ny };
    }
}

function colorGrid() {
    while (notAllFilled()) {
        nextFloodFill();
    }
}

function notAllFilled() {
    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            if (grid[i][j].alive && grid[i][j].color == COLOR_FG) {
                return true;
            }
        }
    }

    return false;
}

function nextFloodFill() {
    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            if (grid[i][j].alive && grid[i][j].color == COLOR_FG) {
                n = floodfill(i, j, COLOR_FG, "temp");
                if (floodMap.hasOwnProperty(n)) {
                    var color = floodMap[n];
                } else {
                    var color = nextColor();
                    floodMap[n] = color;
                }
                floodfill(i, j, "temp", color);
                return;
            }
        }
    }
}

function floodfill(i, j, targetColor, replacementColor) {
    q = [];
    count = 0;

    grid[i][j].color = replacementColor;
    q.push([i, j]);
    count++;

    while (q.length != 0) {
        n = q.shift();
        neighbors = liveNeighborsHex(grid, n[0], n[1]);
        for (ii = 0; ii < neighbors.length; ii++) {
            nn = neighbors[ii];
            if (grid[nn[0]][nn[1]].color == targetColor) {
                grid[nn[0]][nn[1]].color = replacementColor;
                q.push(nn);
                count++;
            }
        }
    }

    return count;
}

function nextColor() {
    color_i++;
    if (color_i == COLORS.length) {
        color_i = 0;
    }
    return COLORS[color_i];
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
                    j * Math.sqrt(3) * CELL_R + CELL_R,
                    CELL_R,
                    0, 2 * Math.PI);
    }
    else {
        context.arc(i * 2 * CELL_R + CELL_R + CELL_R,
                    j * Math.sqrt(3) * CELL_R + CELL_R,
                    CELL_R,
                    0, 2 * Math.PI);
    }
    context.fill();
}

main();

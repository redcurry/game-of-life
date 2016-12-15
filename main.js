var grid = [];

var WIDTH = 300;
var HEIGHT = 300;

var CELL_R = 2

var RULES = {born: [1, 2], survives: [2, 4]};

var COLOR_BG = "black";
var COLOR_FG = "green";

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

    for (var i = 1; i <= 6; i++) {
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

    for (var i = 1; i <= 6; i++) {
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
            grid[i][j] = {alive: false};
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

            newGrid[i][j] = {alive: false};

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

function drawGrid() {
    context.fillStyle = COLOR_BG;

    if (type == "rect") {
        context.fillRect(0, 0,
                WIDTH * 2 * CELL_R + CELL_R, HEIGHT * 2 * CELL_R + CELL_R);
    } else {
        context.fillRect(0, 0,
                WIDTH * 2 * CELL_R + CELL_R,
                HEIGHT * Math.sqrt(3) * CELL_R + CELL_R);
    }

    context.fillStyle = COLOR_FG;

    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            if (grid[i][j].alive) {
                if (type == "hex") {
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

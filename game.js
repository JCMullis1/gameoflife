const gridContainer = document.getElementById("grid-container");
const counterEl = document.getElementById("counter-el");
const startBtn = document.getElementById("start-btn");
const toggle = document.querySelector(".toggle input");

toggle.addEventListener("click", () => {
    const onOff = toggle.parentNode.querySelector(".onoff");
    onOff.textContent = toggle.checked ? "ON" : "OFF";
});

let counter = 0;
let sizeValue = Number(document.getElementById("size-el").value);

const aliveDead = {
    0: "dead",
    1: "alive",
};

let gameState = false;

const matrixMaker = function () {
    let matrix = [];
    for (let i = 0; i < sizeValue; i++) {
        matrix.push([]);
    }
    return matrix;
};

const Game = {
    // this is the problem this function right here, the one below me, the one south of this message, fix this pretty please
    searchCell: (matrix, x, y) => {
        let liveCells = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (x + i === x && y + j === y) {
                    continue;
                } else {
                    try {
                        if (matrix[x + i][y + j] === 1) {
                            liveCells += 1;
                        } else {
                            continue;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
        }
        return liveCells;
    },

    generation: (matrix) => {
        counter += 1;
        counterEl.innerText = counter;

        let liveCount = 0;
        let nextGen = "";
        let newMatrix = matrixMaker();

        for (let i = 0; i < sizeValue; i++) {
            for (let j = 0; j < sizeValue; j++) {
                if (matrix[i][j] === 1) {
                    liveCount = Game.searchCell(matrix, i, j);
                    console.log(liveCount);
                    if (liveCount === 2 || liveCount === 3) {
                        newMatrix[i].push(1);
                        console.log("I survived");
                    } else {
                        newMatrix[i].push(0);
                        console.log("I died");
                    }
                } else {
                    liveCount = Game.searchCell(matrix, i, j);
                    console.log(liveCount);
                    if (liveCount === 3) {
                        newMatrix[i].push(1);
                        console.log("I am now alive");
                    } else {
                        newMatrix[i].push(0);
                        console.log("I'm still dead");
                    }
                }
                nextGen += `
                <p class="${aliveDead[newMatrix[i][j]]}"> </p>
                `;
            }
        }
        gridContainer.innerHTML = nextGen;
        matrix = newMatrix;
        if (gameState) {
            setTimeout(() => {
                Game.generation(matrix);
            }, 200);
        }
    },
};

const startGame = () => {
    let gameMatrix = matrixMaker();
    let gridUpdate = "";
    sizeValue = Number(document.getElementById("size-el").value);
    document.querySelector(
        "div"
    ).style.gridTemplateColumns = `repeat(${sizeValue}, 3rem)`;

    for (let i = 0; i < sizeValue; i++) {
        for (let j = 0; j < sizeValue; j++) {
            gameMatrix[i].push(Math.floor(Math.random() * 2));
            gridUpdate += `
            <p class="${aliveDead[gameMatrix[i][j]]}"> </p>
            `;
        }
    }
    gridContainer.innerHTML = gridUpdate;
    Game.generation(gameMatrix);
};

startBtn.addEventListener("click", () => {
    if (gameState) {
        gameState = false;
        startBtn.innerHTML = "START GAME";
    } else {
        counter = 0;
        gameState = true;
        startBtn.innerHTML = "END GAME";
        startGame();
    }
});

let rows, cols, mines;
let mineBoard, visited;

function startGame() {
    const difficulty = document.getElementById("difficulty").value;
    setDifficulty(difficulty);
    resetGame();
}

function setDifficulty(level) {
    if (level === "easy") {
        rows = 8;
        cols = 8;
        mines = 10;
    } else if (level === "medium") {
        rows = 12;
        cols = 12;
        mines = 20;
    } else if (level === "hard") {
        rows = 16;
        cols = 16;
        mines = 40;
    }
    mineBoard = Array.from(Array(rows), () => Array(cols).fill(0));
    visited = [];
}

document.addEventListener("DOMContentLoaded", function() {
    setDifficulty("medium");
    createMines();
    setValues();
    createButtons();
});

function createMines() {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        if (mineBoard[row][col] === 0) {
            mineBoard[row][col] = -1;
            minesPlaced++;
        }
    }
}

function setValues() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (mineBoard[r][c] === -1) continue;
            mineBoard[r][c] = countMines(r, c);
        }
    }
}

function countMines(r, c) {
    let mineCount = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            let newR = r + dr;
            let newC = c + dc;
            if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && mineBoard[newR][newC] === -1) {
                mineCount++;
            }
        }
    }
    return mineCount;
}

function createButtons() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    gameBoard.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("button");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("click", () => {
                if (!cell.classList.contains("flag")) {
                    revealCell(r, c, cell);
                }
            });

            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                toggleFlag(cell);
            });

            gameBoard.appendChild(cell);
        }
    }
}

function toggleFlag(cell) {
    if (cell.disabled) return;

    if (cell.classList.contains("flag")) {
        cell.classList.remove("flag");
        cell.textContent = "";
    } else {
        cell.classList.add("flag");
        cell.textContent = "🚩";
    }
}

function revealCell(r, c, cell) {
    if (visited.includes(`${r},${c}`)) return;
    visited.push(`${r},${c}`);
    
    if (mineBoard[r][c] === -1) {
        cell.classList.add("mine");
        cell.textContent = "💣";
        showModal("Game Over");
    } else {
        cell.classList.add("safe");
        cell.textContent = mineBoard[r][c] > 0 ? mineBoard[r][c] : "";
        cell.disabled = true;
        
        if (mineBoard[r][c] === 0) revealNeighbors(r, c);
        checkWin();
    }
}

function revealNeighbors(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let newR = r + dr;
            let newC = c + dc;
            if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                const cell = document.querySelector(`.cell[data-row="${newR}"][data-col="${newC}"]`);
                if (cell && !cell.disabled) revealCell(newR, newC, cell);
            }
        }
    }
}

function checkWin() {
    if (visited.length + mines === rows * cols) {
        showModal("Congratulations! You've cleared the board.");
    }
}

function showModal(message) {
    document.getElementById("result-message").textContent = message;
    document.getElementById("result-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("result-modal").style.display = "none";
    resetGame();
}

function resetGame() {
    mineBoard = Array.from(Array(rows), () => Array(cols).fill(0));
    visited = [];
    createMines();
    setValues();
    createButtons();
}

document.getElementById("reset-button").addEventListener("click", resetGame);
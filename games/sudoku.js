const GRID_SIZE = 9;
let board = [];
let solvedBoard = [];
let errors = 0;


function generateEmptyBoard() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function isValid(board, row, col, num) {
  for (let i = 0; i < GRID_SIZE; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}

function fillBoard(board) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 0) {
        const nums = Array.from({ length: GRID_SIZE }, (_, k) => k + 1).sort(() => Math.random() - 0.5);
        for (let num of nums) {
          if (isValid(board, i, j, num)) {
            board[i][j] = num;
            if (fillBoard(board)) return true;
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function removeNumbers(board, attempts = 30) {
  while (attempts > 0) {
    let row = Math.floor(Math.random() * GRID_SIZE);
    let col = Math.floor(Math.random() * GRID_SIZE);
    while (board[row][col] === 0) {
      row = Math.floor(Math.random() * GRID_SIZE);
      col = Math.floor(Math.random() * GRID_SIZE);
    }
    board[row][col] = 0;
    attempts--;
  }
}

function generateBoard() {
  board = generateEmptyBoard();
  fillBoard(board);
  solvedBoard = JSON.parse(JSON.stringify(board));
  removeNumbers(board);
}

function createGrid() {
  const grid = document.getElementById("sudoku-grid");
  grid.innerHTML = '';
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement("input");
      cell.type = "text";
      cell.classList.add("cell");
      cell.maxLength = 1;
      cell.dataset.row = i;
      cell.dataset.col = j;

      if (board[i][j] !== 0) {
        cell.value = board[i][j];
        cell.classList.add("readonly");
        cell.disabled = true;
      } else {
        cell.addEventListener("input", (e) => checkInput(e, i, j));
      }
      grid.appendChild(cell);
    }
  }
}

function checkInput(event, row, col) {
  const value = event.target.value;
  event.target.classList.remove("valid", "invalid");
  if (!/^[1-9]$/.test(value)) {
    event.target.value = '';
    return;
  }

  const num = parseInt(value);
  if (num === solvedBoard[row][col]) {
    event.target.classList.add("valid");
    event.target.disabled = true;
  } else {
    event.target.classList.add("invalid");
    errors++;
    if (errors >= 3) {
      showModal("You made 3 mistakes. Game over!");
      resetGame();
    }
  }
  checkWin();
}

function checkWin() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cellValue = document.querySelector(`[data-row="${i}"][data-col="${j}"]`).value;
      if (parseInt(cellValue) !== solvedBoard[i][j]) {
        return;
      }
    }
  }
  showModal("Congratulations. You Win!");
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
  errors = 0;
  generateBoard();
  createGrid();
}

document.getElementById("reset-button").addEventListener("click", resetGame);


generateBoard();
createGrid();

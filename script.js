const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('game-status');
const restartButton = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let difficulty = "easy";

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick() {
    const cellIndex = this.getAttribute('data-index');
    if (board[cellIndex] !== "" || !gameActive || currentPlayer === "O") return;

    makeMove(cellIndex, "X");
    if (!gameActive) return;

    currentPlayer = "O";
    setTimeout(aiMove, 500); // AI move delay
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].style.color = player === "X" ? "#ff6f61" : "#4c8bf5";
    checkWinner();
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function restartGame() {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.color = "";
    });
}

function aiMove() {
    switch (difficulty) {
        case "easy":
            easyAiMove();
            break;
        case "medium":
            mediumAiMove();
            break;
        case "hard":
            hardAiMove();
            break;
    }
    currentPlayer = "X";
}

function easyAiMove() {
    let availableCells = board.map((value, index) => value === "" ? index : null).filter(index => index !== null);
    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomIndex, "O");
}

function mediumAiMove() {
    if (Math.random() > 0.2) {
        easyAiMove();
    } else {
        hardAiMove();
    }
}

function hardAiMove() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        if (board[a] === "O" && board[b] === "O" && board[c] === "") return makeMove(c, "O");
        if (board[a] === "O" && board[c] === "O" && board[b] === "") return makeMove(b, "O");
        if (board[b] === "O" && board[c] === "O" && board[a] === "") return makeMove(a, "O");

        if (board[a] === "X" && board[b] === "X" && board[c] === "") return makeMove(c, "O");
        if (board[a] === "X" && board[c] === "X" && board[b] === "") return makeMove(b, "O");
        if (board[b] === "X" && board[c] === "X" && board[a] === "") return makeMove(a, "O");
    }

    easyAiMove();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
difficultySelect.addEventListener('change', (e) => difficulty = e.target.value);

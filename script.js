const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // اللاعب البشري X والذكاء الاصطناعي O
let isRunning = true;
let scoreX = 0;
let scoreO = 0;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartBtn.addEventListener('click', restartGame);
    statusText.textContent = "Your Turn (X)";
}

function cellClicked() {
    const cellIndex = this.getAttribute('data-index');

    // لا تعمل الكبسة إذا كانت الخلية مشغولة أو ليس دور اللاعب
    if (board[cellIndex] !== "" || !isRunning || currentPlayer !== "X") {
        return;
    }

    // دور اللاعب البشري
    updateCell(this, cellIndex, "X");

    if (checkWinner(board, "X")) {
        statusText.textContent = "You Win! 🎉";
        scoreX++;
        scoreXEl.textContent = scoreX;
        isRunning = false;
    } else if (!board.includes("")) {
        statusText.textContent = "Draw! 🤝";
        isRunning = false;
    } else {
        currentPlayer = "O";
        statusText.textContent = "AI is thinking... 🤖";
        
        // لعب الذكاء الاصطناعي بعد تأخير بسيط ليشعر المستخدم باللعب الطبيعي
        setTimeout(makeAIMove, 400);
    }
}

function updateCell(cell, index, player) {
    board[index] = player;
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

// ===============================================
// خوارزمية الذكاء الاصطناعي (AI - Minimax Algorithm)
// ===============================================
function makeAIMove() {
    if (!isRunning) return;

    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
        updateCell(cell, bestMove, "O");

        if (checkWinner(board, "O")) {
            statusText.textContent = "AI Wins! 🤖";
            scoreO++;
            scoreOEl.textContent = scoreO;
            isRunning = false;
        } else if (!board.includes("")) {
            statusText.textContent = "Draw! 🤝";
            isRunning = false;
        } else {
            currentPlayer = "X";
            statusText.textContent = "Your Turn (X)";
        }
    }
}

function minimax(tempBoard, depth, isMaximizing) {
    if (checkWinner(tempBoard, "O")) return 10 - depth;
    if (checkWinner(tempBoard, "X")) return depth - 10;
    if (!tempBoard.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < tempBoard.length; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = "O";
                let score = minimax(tempBoard, depth + 1, false);
                tempBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < tempBoard.length; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = "X";
                let score = minimax(tempBoard, depth + 1, true);
                tempBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(currentBoard, player) {
    return winConditions.some(condition => {
        return condition.every(index => currentBoard[index] === player);
    });
}

function restartGame() {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = "Your Turn (X)";
    isRunning = true;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
}
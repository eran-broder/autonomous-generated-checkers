import { GameState, Position, Piece } from './types';
import { initializeBoard, getPossibleMoves, isValidMove } from './game';

const gameState: GameState = {
    board: initializeBoard(),
    currentPlayer: 'black',
    selectedPiece: null,
    possibleMoves: []
};

// Add styles
const style = document.createElement('style');
style.textContent = `
    #board {
        display: grid;
        grid-template-columns: repeat(8, 50px);
        grid-template-rows: repeat(8, 50px);
        gap: 0;
        width: 400px;
        height: 400px;
        border: 2px solid #333;
        margin: 20px auto;
    }
    .cell {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .black-cell { background-color: #769656; }
    .white-cell { background-color: #eeeed2; }
    .piece {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #fff;
    }
    .black-piece { background-color: #000; }
    .white-piece { background-color: #fff; }
    .selected { background-color: #baca44; }
    .possible-move { background-color: #f7f769; }
    .king::after {
        content: '♕';
        font-size: 30px;
        position: relative;
        top: -8px;
    }
    .black-piece.king::after { color: #fff; }
    .white-piece.king::after { color: #000; }
`;
document.head.appendChild(style);
function createBoard() {
    const boardElement = document.getElementById('board');
    if (!boardElement) return;
    
    boardElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(row + col) % 2 === 0 ? 'white-cell' : 'black-cell'}`;
            cell.dataset.row = row.toString();
            cell.dataset.col = col.toString();
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
    updateBoard();
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell') as NodeListOf<HTMLDivElement>;
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('selected', 'possible-move');
        
        const row = parseInt(cell.dataset.row || '0');
        const col = parseInt(cell.dataset.col || '0');
        const piece = gameState.board[row][col];
        
        if (piece) {
            const pieceElement = document.createElement('div');
            pieceElement.className = `piece ${piece.color}-piece`;
            if (piece.type === 'king') {
                pieceElement.classList.add('king');
            }
            cell.appendChild(pieceElement);
        }
    });

    if (gameState.selectedPiece) {
        const selectedCell = document.querySelector(
            `[data-row="${gameState.selectedPiece.position.row}"][data-col="${gameState.selectedPiece.position.col}"]`
        ) as HTMLDivElement;
        if (selectedCell) {
            selectedCell.classList.add('selected');
        }

        gameState.possibleMoves.forEach(move => {
            const moveCell = document.querySelector(
                `[data-row="${move.row}"][data-col="${move.col}"]`
            ) as HTMLDivElement;
            if (moveCell) {
                moveCell.classList.add('possible-move');
            }
        });
    }
}


function handleCellClick(event: MouseEvent) {
    const cell = event.currentTarget as HTMLDivElement;
    const row = parseInt(cell.dataset.row || '0');
    const col = parseInt(cell.dataset.col || '0');
    const clickedPiece = gameState.board[row][col];

    if (gameState.selectedPiece) {
        const move = gameState.possibleMoves.find(m => m.row === row && m.col === col);
        
        if (move) {
            // Execute move
            const from = gameState.selectedPiece.position;
            gameState.board[row][col] = gameState.selectedPiece;
            gameState.board[from.row][from.col] = null;
            gameState.board[row][col]!.position = { row, col };

            // Handle captures
            if (Math.abs(row - from.row) === 2) {
                const jumpedRow = from.row + (row - from.row)/2;
                const jumpedCol = from.col + (col - from.col)/2;
                gameState.board[jumpedRow][jumpedCol] = null;
            }

            // King promotion
            if (gameState.board[row][col]?.type === 'normal') {
                if ((gameState.board[row][col]?.color === 'black' && row === 7) ||
                    (gameState.board[row][col]?.color === 'white' && row === 0)) {
                    gameState.board[row][col]!.type = 'king';
                }
            }

            gameState.currentPlayer = gameState.currentPlayer === 'black' ? 'white' : 'black';
            gameState.selectedPiece = null;
            gameState.possibleMoves = [];
        } else {
            gameState.selectedPiece = null;
            gameState.possibleMoves = [];
            
            if (clickedPiece?.color === gameState.currentPlayer) {
                gameState.selectedPiece = clickedPiece;
                gameState.possibleMoves = getPossibleMoves(gameState, { row, col });
            }
        }
    } else {
        if (clickedPiece?.color === gameState.currentPlayer) {
            gameState.selectedPiece = clickedPiece;
            gameState.possibleMoves = getPossibleMoves(gameState, { row, col });
        }
    }
    
    updateBoard();
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    createBoard();
});
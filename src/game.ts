import { Position, Piece, GameState } from './types';

export function initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place black pieces
    for(let row = 0; row < 3; row++) {
        for(let col = 0; col < 8; col++) {
            if((row + col) % 2 === 1) {
                board[row][col] = {
                    type: 'normal',
                    color: 'black',
                    position: {row, col}
                };
            }
        }
    }
    
    // Place white pieces
    for(let row = 5; row < 8; row++) {
        for(let col = 0; col < 8; col++) {
            if((row + col) % 2 === 1) {
                board[row][col] = {
                    type: 'normal',
                    color: 'white',
                    position: {row, col}
                };
            }
        }
    }
    
    return board;
}

export function isValidMove(
    gameState: GameState,
    from: Position,
    to: Position
): boolean {
    const piece = gameState.board[from.row][from.col];
    if (!piece) return false;
    if (piece.color !== gameState.currentPlayer) return false;
    
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);
    
    if (piece.type !== 'king') {
        if (piece.color === 'black' && rowDiff <= 0) return false;
        if (piece.color === 'white' && rowDiff >= 0) return false;
    }
    
    if (colDiff !== Math.abs(rowDiff)) return false;
    if (Math.abs(rowDiff) > 2) return false;
    if (gameState.board[to.row][to.col] !== null) return false;
    
    if (Math.abs(rowDiff) === 2) {
        const jumpedRow = from.row + rowDiff/2;
        const jumpedCol = from.col + (to.col - from.col)/2;
        const jumpedPiece = gameState.board[jumpedRow][jumpedCol];
        
        return jumpedPiece !== null && jumpedPiece.color !== piece.color;
    }
    
    return Math.abs(rowDiff) === 1;
}

export function getPossibleMoves(
    gameState: GameState,
    position: Position
): Position[] {
    const piece = gameState.board[position.row][position.col];
    if (!piece || piece.color !== gameState.currentPlayer) return [];
    
    const possibleMoves: Position[] = [];
    const directions = piece.type === 'king' ? [-1, 1] : 
                     piece.color === 'black' ? [1] : [-1];
    
    for (const rowDir of directions) {
        for (const colDir of [-1, 1]) {
            // Check simple move
            const simpleMove: Position = {
                row: position.row + rowDir,
                col: position.col + colDir
            };
            if (simpleMove.row >= 0 && simpleMove.row < 8 && 
                simpleMove.col >= 0 && simpleMove.col < 8 &&
                isValidMove(gameState, position, simpleMove)) {
                possibleMoves.push(simpleMove);
            }
            
            // Check jump move
            const jumpMove: Position = {
                row: position.row + rowDir * 2,
                col: position.col + colDir * 2
            };
            if (jumpMove.row >= 0 && jumpMove.row < 8 && 
                jumpMove.col >= 0 && jumpMove.col < 8 &&
                isValidMove(gameState, position, jumpMove)) {
                possibleMoves.push(jumpMove);
            }
        }
    }
    
    return possibleMoves;
}
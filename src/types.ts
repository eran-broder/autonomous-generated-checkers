export interface Position {
    row: number;
    col: number;
}

export interface Piece {
    type: 'normal' | 'king';
    color: 'black' | 'white';
    position: Position;
}

export interface GameState {
    board: (Piece | null)[][];
    currentPlayer: 'black' | 'white';
    selectedPiece: Piece | null;
    possibleMoves: Position[];
}
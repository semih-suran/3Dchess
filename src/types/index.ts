import { Square, Piece as ChessJSPiece, Move } from 'chess.js';

export type Player = 'w' | 'b';

export interface Piece extends ChessJSPiece {
  square: Square;
}

export interface ChessMove extends Move {}

export interface TimeControl {
  minutes: number;
  increment: number;
}

export interface GameState {
  fen: string;
  history: ChessMove[];
  isGameOver: boolean;
  status: string;
  turn: Player;
  selectedSquare: Square | null;
  legalMoves: ChessMove[];
}

export interface UseChessGameResult extends GameState {
  players: Record<Player, { timeLeft: number }>;
  pgn: string;
  selectSquare: (square: Square | null) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  undo: () => void;
  reset: () => void;
}

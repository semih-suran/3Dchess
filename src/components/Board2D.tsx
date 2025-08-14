import React from 'react';
import { useChessGame } from '@/hooks/useChessGame';
import type { Square } from 'chess.js';

// A simple 2D fallback for devices that don't support WebGL.
export const Board2D = ({
  game,
}: {
  game: ReturnType<typeof useChessGame>;
}) => {
  const { fen, selectedSquare, legalMoves, selectSquare, makeMove } = game;
  const board = new (require('chess.js').Chess)(fen).board();

  const handleSquareClick = (square: Square) => {
    if (selectedSquare) {
      const isLegal = legalMoves.some((m) => m.to === square);
      if (isLegal) {
        makeMove(selectedSquare, square);
      } else {
        selectSquare(square);
      }
    } else {
      selectSquare(square);
    }
  };

  const getPieceSymbol = (piece: { type: string; color: string } | null) => {
    if (!piece) return '';
    const symbols: { [key: string]: string } = {
      p: '♙',
      r: '♖',
      n: '♘',
      b: '♗',
      q: '♕',
      k: '♔',
    };
    const symbol = symbols[piece.type];
    return piece.color === 'w' ? symbol : symbol.toLowerCase();
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-ui-background">
      <div className="grid h-[90vmin] w-[90vmin] grid-cols-8 grid-rows-8 border-2 border-ui-panel shadow-2xl">
        {board.flat().map((piece, index) => {
          const col = index % 8;
          const row = 7 - Math.floor(index / 8);
          const squareName =
            `${String.fromCharCode('a'.charCodeAt(0) + col)}${row + 1}` as Square;
          const isLight = (row + col) % 2 !== 0;
          const isSelected = selectedSquare === squareName;
          const isLegalMove = legalMoves.some((m) => m.to === squareName);

          return (
            <div
              key={squareName}
              onClick={() => handleSquareClick(squareName)}
              className={`flex cursor-pointer items-center justify-center text-5xl ${isLight ? 'bg-board-light' : 'bg-board-dark'} ${isSelected ? 'bg-yellow-400/70' : ''} `}
            >
              {isLegalMove && (
                <div className="h-1/2 w-1/2 rounded-full bg-green-600/50" />
              )}
              {piece && (
                <span
                  className={`relative z-10 ${piece.color === 'w' ? 'text-white' : 'text-black'}`}
                >
                  {getPieceSymbol(piece)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

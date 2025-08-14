import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { GameState, ChessMove, UseChessGameResult, Player, TimeControl, Square } from '@/types';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const useChessGame = (initialTimeControl: TimeControl = { minutes: 5, increment: 3 }): UseChessGameResult => {
  const [game, setGame] = useState(new Chess());
  const [gameState, setGameState] = useState<GameState>({
    fen: game.fen(),
    history: [],
    isGameOver: false,
    status: '',
    turn: 'w',
    selectedSquare: null,
    legalMoves: [],
  });
  const [players, setPlayers] = useState<Record<Player, { timeLeft: number }>>({
    w: { timeLeft: initialTimeControl.minutes * 60 },
    b: { timeLeft: initialTimeControl.minutes * 60 },
  });
  const [activePlayer, setActivePlayer] = useState<Player>('w');

  const updateGameState = useCallback((currentGame: Chess, status?: string) => {
    const isGameOver = currentGame.isGameOver();
    let gameStatus = status || '';
    if (isGameOver) {
      if (currentGame.isCheckmate()) gameStatus = `Checkmate! ${currentGame.turn() === 'w' ? 'Black' : 'White'} wins.`;
      else if (currentGame.isDraw()) gameStatus = 'Draw!';
      else if (currentGame.isStalemate()) gameStatus = 'Stalemate!';
      else if (currentGame.isThreefoldRepetition()) gameStatus = 'Draw by threefold repetition!';
    } else if (currentGame.isCheck()) {
      gameStatus = 'Check!';
    }
    
    setGameState({
      fen: currentGame.fen(),
      history: currentGame.history({ verbose: true }),
      isGameOver,
      status: gameStatus,
      turn: currentGame.turn() as Player,
      selectedSquare: null,
      legalMoves: [],
    });
    setActivePlayer(currentGame.turn() as Player);
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameState.isGameOver) return;

    const timer = setInterval(() => {
      setPlayers(prev => {
        const newTime = Math.max(0, prev[activePlayer].timeLeft - 1);
        if (newTime === 0) {
          const newGame = new Chess();
          newGame.loadPgn(game.pgn());
          newGame.move('resign'); // A way to end game on time out
          updateGameState(newGame, 'Time out!');
        }
        return {
          ...prev,
          [activePlayer]: { timeLeft: newTime },
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activePlayer, gameState.isGameOver, game, updateGameState]);


  const selectSquare = useCallback((square: Square | null) => {
    if (gameState.isGameOver) return;
    if (square === null) {
      setGameState(prev => ({ ...prev, selectedSquare: null, legalMoves: [] }));
      return;
    }

    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) {
      if (gameState.selectedSquare && gameState.legalMoves.some(m => m.to === square)) {
        makeMove(gameState.selectedSquare, square);
      } else {
        setGameState(prev => ({ ...prev, selectedSquare: null, legalMoves: [] }));
      }
      return;
    }
    
    const moves = game.moves({ square, verbose: true });
    setGameState(prev => ({ ...prev, selectedSquare: square, legalMoves: moves }));
  }, [game, gameState.isGameOver, gameState.selectedSquare, gameState.legalMoves]);

  const makeMove = useCallback((from: string, to: string, promotion: string = 'q') => {
    if (gameState.isGameOver) return false;
    
    // Create a new game instance from the PGN to preserve history
    const newGame = new Chess();
    newGame.loadPgn(game.pgn());
    
    try {
      const moveResult = newGame.move({ from, to, promotion });
      
      if (moveResult) {
        setGame(newGame);
        updateGameState(newGame);
        setPlayers(prev => ({
          ...prev,
          [activePlayer]: { timeLeft: prev[activePlayer].timeLeft + initialTimeControl.increment },
        }));
        return true;
      }
    } catch (e) {
      console.error("Invalid move:", e);
      selectSquare(null);
      return false;
    }
    return false;
  }, [game, gameState.isGameOver, updateGameState, activePlayer, initialTimeControl.increment]);

  const undo = useCallback(() => {
    const newGame = new Chess();
    newGame.loadPgn(game.pgn());
    const move = newGame.undo();
    if (move) {
      setGame(newGame);
      updateGameState(newGame);
    }
  }, [game, updateGameState]);

  const reset = useCallback(() => {
    const newGame = new Chess(INITIAL_FEN);
    setGame(newGame);
    updateGameState(newGame);
    setPlayers({
      w: { timeLeft: initialTimeControl.minutes * 60 },
      b: { timeLeft: initialTimeControl.minutes * 60 },
    });
  }, [initialTimeControl, updateGameState]);

  const pgn = useMemo(() => game.pgn(), [game]);

  return { ...gameState, players, pgn, selectSquare, makeMove, undo, reset };
};

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useChessGame } from '@/hooks/useChessGame';

describe('useChessGame', () => {
  it('should initialize with the starting FEN', () => {
    const { result } = renderHook(() => useChessGame());
    expect(result.current.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  });

  it('should make a legal move (e4)', () => {
    const { result } = renderHook(() => useChessGame());
    
    act(() => {
      result.current.makeMove('e2', 'e4');
    });

    expect(result.current.fen).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
    expect(result.current.turn).toBe('b');
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].san).toBe('e4');
  });

  it('should not make an illegal move', () => {
    const { result } = renderHook(() => useChessGame());
    
    act(() => {
      result.current.makeMove('e2', 'e5'); // Illegal move
    });

    // State should not change
    expect(result.current.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(result.current.turn).toBe('w');
  });

  it('should undo a move', () => {
    const { result } = renderHook(() => useChessGame());
    
    act(() => {
      result.current.makeMove('e2', 'e4');
    });

    expect(result.current.fen).not.toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    act(() => {
      result.current.undo();
    });

    expect(result.current.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(result.current.history).toHaveLength(0);
  });

  it('should detect checkmate', () => {
    const { result } = renderHook(() => useChessGame());
    // Fool's Mate
    act(() => { result.current.makeMove('f2', 'f3'); });
    act(() => { result.current.makeMove('e7', 'e5'); });
    act(() => { result.current.makeMove('g2', 'g4'); });
    act(() => { result.current.makeMove('d8', 'h4'); });

    expect(result.current.isGameOver).toBe(true);
    expect(result.current.status).toContain('Checkmate');
  });
});

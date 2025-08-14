import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Scoreboard } from '@/components/Scoreboard';
import { useChessGame } from '@/hooks/useChessGame';

// Mock the useChessGame hook
vi.mock('@/hooks/useChessGame');

describe('Scoreboard', () => {
  it('renders player timers and initial state', () => {
    const mockGameData = {
      history: [],
      players: {
        w: { timeLeft: 300 },
        b: { timeLeft: 300 },
      },
      turn: 'w',
      status: 'Game in progress',
      pgn: '',
      undo: vi.fn(),
      reset: vi.fn(),
      makeMove: vi.fn(),
      isGameOver: false,
    };
    
    // Tell the mock what to return
    (useChessGame as any).mockReturnValue(mockGameData);

    render(<Scoreboard game={mockGameData as any} />);

    // Check for player names
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();

    // Check for timers
    const timers = screen.getAllByText('05:00');
    expect(timers).toHaveLength(2);

    // Check for buttons
    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('PGN')).toBeInTheDocument();
  });
});

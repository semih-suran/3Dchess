import { useChessGame } from '@/hooks/useChessGame';
import { Timer } from './Timer';
import {
  RotateCcw,
  Download,
  Flag,
  Users,
  Image as ImageIcon,
  X,
} from 'lucide-react';

interface ScoreboardProps {
  game: ReturnType<typeof useChessGame>;
  selectedEnv: string;
  onEnvChange: (env: string) => void;
  onClose: () => void; // New prop for closing on mobile
}

export const Scoreboard = ({
  game,
  selectedEnv,
  onEnvChange,
  onClose,
}: ScoreboardProps) => {
  const {
    history,
    players,
    turn,
    status,
    pgn,
    undo,
    reset,
    makeMove,
    isGameOver,
  } = game;
  const environmentOptions = ['cosy', 'grass', 'interior', 'park', 'snow'];

  const downloadPGN = () => {
    const element = document.createElement('a');
    const file = new Blob([pgn], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `chess_game_${Date.now()}.pgn`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleResign = () => {
    makeMove('resign', 'resign');
  };

  const handleNewGame = () => {
    reset();
  };

  return (
    <div className="pointer-events-auto relative flex h-full w-full flex-col overflow-y-auto bg-ui-panel p-4 text-ui-primary">
      {/* Mobile Close Button */}
      <div className="absolute right-4 top-4 lg:hidden">
        <button
          onClick={onClose}
          className="p-2 text-ui-secondary hover:text-ui-primary"
          aria-label="Close scoreboard"
        >
          <X size={24} />
        </button>
      </div>

      <h2 className="mb-4 border-b border-ui-background pb-2 text-2xl font-bold">
        Chess
      </h2>

      <div className="mb-4 flex items-center justify-between">
        <div
          className={`rounded p-2 transition-colors ${turn === 'w' ? 'bg-green-600/50' : ''}`}
        >
          <h3 className="font-semibold">White</h3>
          <Timer timeLeft={players.w.timeLeft} />
        </div>
        <div
          className={`rounded p-2 transition-colors ${turn === 'b' ? 'bg-green-600/50' : ''}`}
        >
          <h3 className="text-right font-semibold">Black</h3>
          <Timer timeLeft={players.b.timeLeft} />
        </div>
      </div>

      <div className="mb-2 h-8 text-center text-lg font-semibold text-yellow-400">
        {status}
      </div>

      <div className="mb-4 min-h-[100px] flex-grow overflow-y-auto rounded bg-ui-background p-2">
        <ol className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-sm">
          {history
            .reduce((acc, move, i) => {
              if (i % 2 === 0) {
                acc.push([move]);
              } else {
                if (acc.length > 0) acc[acc.length - 1].push(move);
              }
              return acc;
            }, [] as any[][])
            .map((pair, i) => (
              <div key={i} className="contents">
                <span className="text-right text-ui-secondary">{i + 1}.</span>
                <span>{pair[0]?.san}</span>
                <span>{pair[1]?.san}</span>
              </div>
            ))}
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={undo}
          disabled={history.length === 0}
          className="control-btn"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Undo
        </button>
        <button
          onClick={downloadPGN}
          disabled={history.length === 0}
          className="control-btn"
        >
          <Download className="mr-2 h-4 w-4" /> PGN
        </button>
        <button
          onClick={handleResign}
          disabled={isGameOver}
          className="control-btn"
        >
          <Flag className="mr-2 h-4 w-4" /> Resign
        </button>
        <button onClick={handleNewGame} className="control-btn">
          <Users className="mr-2 h-4 w-4" /> New Game
        </button>
      </div>

      <div className="mt-4 border-t border-ui-background pt-4">
        <h3 className="mb-2 flex items-center text-sm font-semibold text-ui-secondary">
          <ImageIcon className="mr-2 h-4 w-4" /> Environment
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {environmentOptions.map((env) => (
            <button
              key={env}
              onClick={() => onEnvChange(env)}
              className={`control-btn text-xs capitalize transition-colors ${selectedEnv === env ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-ui-background'}`}
            >
              {env}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

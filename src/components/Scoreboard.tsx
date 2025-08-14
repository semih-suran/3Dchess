import { useChessGame } from '@/hooks/useChessGame';
import { Timer } from './Timer';
import { RotateCcw, Download, Flag, Users, Image as ImageIcon } from 'lucide-react';

interface ScoreboardProps {
  game: ReturnType<typeof useChessGame>;
  selectedEnv: string;
  onEnvChange: (env: string) => void;
}

export const Scoreboard = ({ game, selectedEnv, onEnvChange }: ScoreboardProps) => {
  const { history, players, turn, status, pgn, undo, reset, makeMove, isGameOver } = game;
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
    <div className="w-full h-full bg-ui-panel text-ui-primary p-4 flex flex-col pointer-events-auto">
      <h2 className="text-2xl font-bold mb-4 border-b border-ui-background pb-2">Chess</h2>
      
      <div className="flex justify-between items-center mb-4">
        <div className={`p-2 rounded transition-colors ${turn === 'w' ? 'bg-green-600/50' : ''}`}>
          <h3 className="font-semibold">White</h3>
          <Timer timeLeft={players.w.timeLeft} />
        </div>
        <div className={`p-2 rounded transition-colors ${turn === 'b' ? 'bg-green-600/50' : ''}`}>
          <h3 className="font-semibold text-right">Black</h3>
          <Timer timeLeft={players.b.timeLeft} />
        </div>
      </div>

      <div className="text-center text-lg font-semibold text-yellow-400 h-8 mb-2">{status}</div>

      <div className="flex-grow bg-ui-background rounded p-2 overflow-y-auto mb-4">
        <ol className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-sm">
          {history.reduce((acc, move, i) => {
            if (i % 2 === 0) {
              acc.push([move]);
            } else {
              if (acc.length > 0) acc[acc.length - 1].push(move);
            }
            return acc;
          }, [] as any[][]).map((pair, i) => (
            <div key={i} className="contents">
              <span className="text-right text-ui-secondary">{i + 1}.</span>
              <span>{pair[0]?.san}</span>
              <span>{pair[1]?.san}</span>
            </div>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={undo} disabled={history.length === 0} className="control-btn"><RotateCcw className="w-4 h-4 mr-2" /> Undo</button>
        <button onClick={downloadPGN} disabled={history.length === 0} className="control-btn"><Download className="w-4 h-4 mr-2" /> PGN</button>
        <button onClick={handleResign} disabled={isGameOver} className="control-btn"><Flag className="w-4 h-4 mr-2" /> Resign</button>
        <button onClick={handleNewGame} className="control-btn"><Users className="w-4 h-4 mr-2" /> New Game</button>
      </div>

      <div className="mt-4 pt-4 border-t border-ui-background">
        <h3 className="flex items-center text-sm font-semibold text-ui-secondary mb-2">
          <ImageIcon className="w-4 h-4 mr-2" /> Environment
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {environmentOptions.map(env => (
            <button
              key={env}
              onClick={() => onEnvChange(env)}
              className={`control-btn text-xs capitalize transition-colors
                ${selectedEnv === env ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-ui-background'}`
              }
            >
              {env}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

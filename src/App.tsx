import { useEffect, useState, Suspense } from 'react';
import { Board3D } from '@/components/Board3D';
import { Board2D } from '@/components/Board2D';
import { Scoreboard } from '@/components/Scoreboard';
import { useChessGame } from '@/hooks/useChessGame';
import { hasWebGL } from '@/lib/webgl-detector';
import { Menu } from 'lucide-react'; // Icon for the menu button

function App() {
  const [is3D, setIs3D] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [environment, setEnvironment] = useState('cosy');
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    setIsClient(true);
    setIs3D(hasWebGL());
  }, []);

  const game = useChessGame();

  const LoadingFallback = () => (
    <div className="flex h-full w-full items-center justify-center bg-ui-background text-ui-primary">
      <p className="animate-pulse text-xl">Loading Photorealistic Chess...</p>
    </div>
  );

  if (!isClient) {
    return <LoadingFallback />;
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-ui-background lg:flex lg:flex-row">
      {/* 3D Scene Layer: takes up remaining space on desktop */}
      <div className="h-full flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          {is3D ? (
            <Board3D game={game} environmentFile={environment} />
          ) : (
            <Board2D game={game} />
          )}
        </Suspense>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="absolute right-4 top-4 z-30 lg:hidden">
        <button
          onClick={() => setIsScoreboardOpen(true)}
          className="pointer-events-auto rounded-full bg-ui-panel/80 p-2 text-ui-primary shadow-lg"
          aria-label="Open scoreboard"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Scoreboard Layer */}
      <div
        className={`absolute right-0 top-0 z-40 h-full w-full max-w-sm transition-transform duration-300 ease-in-out lg:relative lg:w-80 lg:max-w-none lg:flex-shrink-0 ${isScoreboardOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}
      >
        <Scoreboard
          game={game}
          selectedEnv={environment}
          onEnvChange={setEnvironment}
          onClose={() => setIsScoreboardOpen(false)}
        />
      </div>
    </main>
  );
}

export default App;

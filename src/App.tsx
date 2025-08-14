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
    <div className="w-full h-full flex items-center justify-center bg-ui-background text-ui-primary">
      <p className="text-xl animate-pulse">Loading Photorealistic Chess...</p>
    </div>
  );

  if (!isClient) {
    return <LoadingFallback />;
  }

  return (
    <main className="relative w-screen h-screen bg-ui-background overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-10">
        <Suspense fallback={<LoadingFallback />}>
          {is3D ? <Board3D game={game} environmentFile={environment} /> : <Board2D game={game} />}
        </Suspense>
      </div>
      
      {/* Mobile Menu Toggle Button */}
      <div className="absolute top-4 right-4 z-30 lg:hidden">
        <button
          onClick={() => setIsScoreboardOpen(true)}
          className="p-2 bg-ui-panel/80 text-ui-primary rounded-full shadow-lg pointer-events-auto"
          aria-label="Open scoreboard"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Scoreboard Layer */}
      <div
        className={`
          absolute top-0 right-0 h-full w-full max-w-sm z-40
          lg:relative lg:w-80 lg:max-w-none
          transition-transform duration-300 ease-in-out
          ${isScoreboardOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0
        `}
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

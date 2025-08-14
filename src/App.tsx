import { useEffect, useState, Suspense } from 'react';
import { Board3D } from '@/components/Board3D';
import { Board2D } from '@/components/Board2D';
import { Scoreboard } from '@/components/Scoreboard';
import { useChessGame } from '@/hooks/useChessGame';
import { hasWebGL } from '@/lib/webgl-detector';

function App() {
  const [is3D, setIs3D] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [environment, setEnvironment] = useState('cosy'); // Default environment

  useEffect(() => {
    setIsClient(true);
    setIs3D(hasWebGL());
  }, []);

  const game = useChessGame();

  const UILayer = () => (
    <div className="absolute inset-0 grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-[1fr_auto] lg:grid-rows-1 pointer-events-none">
      <div className="col-span-1 lg:col-start-2">
        <Scoreboard
          game={game}
          selectedEnv={environment}
          onEnvChange={setEnvironment}
        />
      </div>
    </div>
  );

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
      <Suspense fallback={<LoadingFallback />}>
        {is3D ? <Board3D game={game} environmentFile={environment} /> : <Board2D game={game} />}
      </Suspense>
      <UILayer />
    </main>
  );
}

export default App;

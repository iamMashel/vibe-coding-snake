import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { Leaderboard } from '@/components/game/Leaderboard';
import { SpectatorView } from '@/components/game/SpectatorView';
import { useSnakeGame } from '@/hooks/useSnakeGame';

function GamePage() {
  const [activeTab, setActiveTab] = useState<string>('play');
  const game = useSnakeGame('pass-through');

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col justify-center min-h-0 container mx-auto px-4">
        {activeTab === 'play' && (
          <div className="w-full flex justify-center items-center h-full">
            <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center w-full max-w-5xl">
              {/* Game Board - Constrained height to prevent scrolling */}
              <div className="order-1 w-full max-w-[65vh] shrink-0">
                <div className="aspect-square w-full shadow-2xl rounded-xl overflow-hidden border border-primary/20 bg-card/10 backdrop-blur-sm relative">
                  <GameBoard gameState={game.gameState} finalScore={game.finalScore} />
                </div>
              </div>

              {/* Controls Sidebar */}
              <div className="order-2 w-full max-w-sm lg:w-[300px]">
                <GameControls
                  gameState={game.gameState}
                  onStart={game.startGame}
                  onPause={game.pauseGame}
                  onResume={game.resumeGame}
                  onReset={game.resetGame}
                  onModeChange={game.setMode}
                  onDirectionChange={game.handleDirectionChange}
                  finalScore={game.finalScore}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="max-w-2xl mx-auto w-full h-[calc(100%-2rem)] overflow-y-auto pr-2">
            <Leaderboard />
          </div>
        )}

        {activeTab === 'spectate' && (
          <div className="max-w-2xl mx-auto w-full h-[calc(100%-2rem)] overflow-y-auto pr-2">
            <SpectatorView />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-2 text-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm border-t border-border mt-auto">
        <p className="font-display">SNAKE GAME</p>
      </footer>
    </div>
  );
}

const Index = () => {
  return (
    <AuthProvider>
      <GamePage />
    </AuthProvider>
  );
};

export default Index;

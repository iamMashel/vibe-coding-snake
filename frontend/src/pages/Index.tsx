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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 container mx-auto px-4 py-4 flex flex-col justify-center min-h-0">
        {activeTab === 'play' && (
          <div className="animate-fade-in w-full">
            <div className="grid lg:grid-cols-[1fr_300px] gap-6 max-w-5xl mx-auto items-center h-full">
              {/* Game Board */}
              <div className="order-1 flex justify-center items-center h-full min-h-0">
                <div className="aspect-square w-full max-w-[min(100%,_70vh)] lg:max-w-none shadow-2xl rounded-xl overflow-hidden border border-primary/20 bg-card/10 backdrop-blur-sm">
                  <GameBoard gameState={game.gameState} />
                </div>
              </div>

              {/* Controls Sidebar */}
              <div className="order-2 w-full max-w-md mx-auto lg:max-w-none">
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
          <div className="max-w-2xl mx-auto w-full animate-fade-in overflow-y-auto max-h-[calc(100vh-200px)]">
            <Leaderboard />
          </div>
        )}

        {activeTab === 'spectate' && (
          <div className="max-w-2xl mx-auto w-full animate-fade-in">
            <SpectatorView />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-3 text-center text-xs text-muted-foreground bg-card/50 backdrop-blur-sm">
        <p className="font-display">SNAKE GAME</p>
        <p className="mt-0.5">Built with ❤️ for multiplayer fun</p>
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

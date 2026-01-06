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
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-4">
        {activeTab === 'play' && (
          <div className="animate-fade-in">
            <div className="grid lg:grid-cols-[1fr_300px] gap-6 max-w-5xl mx-auto">
              {/* Game Board */}
              <div className="order-1">
                <div className="aspect-square max-w-md mx-auto lg:max-w-none">
                  <GameBoard gameState={game.gameState} />
                </div>
              </div>

              {/* Controls Sidebar */}
              <div className="order-2">
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
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Leaderboard />
          </div>
        )}

        {activeTab === 'spectate' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <SpectatorView />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4 text-center text-sm text-muted-foreground">
        <p className="font-display">SNAKE GAME</p>
        <p className="text-xs mt-1">Built with ❤️ for multiplayer fun</p>
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

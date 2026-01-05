import React, { memo } from 'react';
import type { GameState } from '@/types';
import { GRID_SIZE } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  gameState: GameState;
  isSpectator?: boolean;
}

const Cell = memo(({ isSnakeHead, isSnakeBody, isFood }: { 
  isSnakeHead: boolean; 
  isSnakeBody: boolean; 
  isFood: boolean 
}) => {
  if (isSnakeHead) {
    return (
      <div className="w-full h-full rounded-sm snake-segment relative">
        <div className="absolute inset-0.5 bg-primary/30 rounded-sm" />
      </div>
    );
  }
  
  if (isSnakeBody) {
    return (
      <div className="w-full h-full rounded-sm snake-segment opacity-80" />
    );
  }
  
  if (isFood) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-3/4 h-3/4 rounded-full food-item" />
      </div>
    );
  }
  
  return null;
});

Cell.displayName = 'Cell';

export const GameBoard = memo(({ gameState, isSpectator = false }: GameBoardProps) => {
  const { snake, food, status } = gameState;
  
  // Create a map for quick lookup
  const snakeMap = new Map<string, number>();
  snake.forEach((segment, index) => {
    snakeMap.set(`${segment.x},${segment.y}`, index);
  });
  
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const key = `${x},${y}`;
      const snakeIndex = snakeMap.get(key);
      const isSnakeHead = snakeIndex === 0;
      const isSnakeBody = snakeIndex !== undefined && snakeIndex > 0;
      const isFood = food.x === x && food.y === y;
      
      cells.push(
        <div key={key} className="aspect-square">
          <Cell 
            isSnakeHead={isSnakeHead} 
            isSnakeBody={isSnakeBody} 
            isFood={isFood} 
          />
        </div>
      );
    }
  }
  
  return (
    <div className={cn(
      "relative rounded-lg overflow-hidden neon-box",
      isSpectator && "neon-box-accent"
    )}>
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />
      
      {/* Grid */}
      <div 
        className="game-grid bg-grid-bg p-1"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px',
        }}
      >
        {cells}
      </div>
      
      {/* Game over overlay */}
      {status === 'game-over' && !isSpectator && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20 animate-fade-in">
          <div className="text-center">
            <h2 className="font-display text-3xl text-destructive neon-text mb-2">GAME OVER</h2>
            <p className="text-muted-foreground">Press Start to play again</p>
          </div>
        </div>
      )}
      
      {/* Paused overlay */}
      {status === 'paused' && !isSpectator && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20 animate-fade-in">
          <div className="text-center">
            <h2 className="font-display text-3xl text-secondary text-glow-secondary mb-2">PAUSED</h2>
            <p className="text-muted-foreground">Press Resume to continue</p>
          </div>
        </div>
      )}
      
      {/* Idle overlay */}
      {status === 'idle' && !isSpectator && (
        <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="font-display text-2xl text-primary text-glow-primary mb-2">READY</h2>
            <p className="text-muted-foreground">Press Start to begin</p>
          </div>
        </div>
      )}
    </div>
  );
});

GameBoard.displayName = 'GameBoard';

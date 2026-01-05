import React from 'react';
import { Button } from '@/components/ui/button';
import type { GameState, GameMode, Direction } from '@/types';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
  onDirectionChange: (direction: Direction) => void;
  finalScore: number;
}

export function GameControls({
  gameState,
  onStart,
  onPause,
  onResume,
  onReset,
  onModeChange,
  onDirectionChange,
  finalScore,
}: GameControlsProps) {
  const { status, mode, score } = gameState;

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="bg-card rounded-lg p-4 neon-box-secondary">
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Score</p>
          <p className="font-display text-4xl text-secondary text-glow-secondary tabular-nums">{String(score)}</p>
          {mode === 'walls' && (
            <p className="text-xs text-muted-foreground mt-1">1.5x multiplier active</p>
          )}
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-3 font-medium">Game Mode</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'pass-through' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('pass-through')}
            disabled={status === 'playing'}
            className={cn(
              "font-display text-xs",
              mode === 'pass-through' && "neon-box"
            )}
          >
            Pass Through
          </Button>
          <Button
            variant={mode === 'walls' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('walls')}
            disabled={status === 'playing'}
            className={cn(
              "font-display text-xs",
              mode === 'walls' && "neon-box"
            )}
          >
            Walls
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {mode === 'pass-through' 
            ? 'Snake wraps around edges' 
            : 'Hit a wall = Game Over (1.5x score)'}
        </p>
      </div>

      {/* Game Controls */}
      <div className="space-y-2">
        {status === 'idle' && (
          <Button 
            onClick={onStart} 
            className="w-full font-display arcade-button neon-box"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Game
          </Button>
        )}
        
        {status === 'playing' && (
          <Button 
            onClick={onPause} 
            variant="secondary"
            className="w-full font-display arcade-button neon-box-secondary"
            size="lg"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        )}
        
        {status === 'paused' && (
          <Button 
            onClick={onResume} 
            className="w-full font-display arcade-button neon-box"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Resume
          </Button>
        )}
        
        {(status === 'game-over' || status === 'paused') && (
          <Button 
            onClick={onReset} 
            variant="outline"
            className="w-full font-display"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        )}
      </div>

      {/* Mobile D-Pad Controls */}
      <div className="bg-card rounded-lg p-4 border border-border md:hidden">
        <p className="text-sm text-muted-foreground mb-3 text-center">Touch Controls</p>
        <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
          <div />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDirectionChange('UP')}
            disabled={status !== 'playing'}
            className="aspect-square"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
          <div />
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDirectionChange('LEFT')}
            disabled={status !== 'playing'}
            className="aspect-square"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDirectionChange('RIGHT')}
            disabled={status !== 'playing'}
            className="aspect-square"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          
          <div />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDirectionChange('DOWN')}
            disabled={status !== 'playing'}
            className="aspect-square"
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
          <div />
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="hidden md:block text-center text-xs text-muted-foreground">
        <p>Use Arrow Keys or WASD to move</p>
      </div>
    </div>
  );
}

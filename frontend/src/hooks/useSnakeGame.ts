import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameState, Direction, GameMode } from '@/types';
import {
  createInitialState,
  moveSnake,
  changeDirection,
  getFinalScore,
  OPPOSITE_DIRECTIONS,
} from '@/lib/gameLogic';

interface UseSnakeGameReturn {
  gameState: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  setMode: (mode: GameMode) => void;
  handleDirectionChange: (direction: Direction) => void;
  finalScore: number;
}

export function useSnakeGame(initialMode: GameMode = 'pass-through'): UseSnakeGameReturn {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(initialMode));
  const gameLoopRef = useRef<number | null>(null);
  const directionQueueRef = useRef<Direction[]>([]);

  // Process direction queue to handle rapid inputs
  const processDirectionQueue = useCallback(() => {
    if (directionQueueRef.current.length === 0) return;
    
    setGameState(prev => {
      let newState = prev;
      while (directionQueueRef.current.length > 0) {
        const nextDirection = directionQueueRef.current.shift()!;
        const updated = changeDirection(newState, nextDirection);
        if (updated !== newState) {
          newState = updated;
          break;
        }
      }
      return newState;
    });
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameState.status !== 'playing') {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = window.setInterval(() => {
      processDirectionQueue();
      setGameState(prev => moveSnake(prev));
    }, gameState.speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.status, gameState.speed, processDirectionQueue]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') return;

      const keyToDirection: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
        W: 'UP',
        S: 'DOWN',
        A: 'LEFT',
        D: 'RIGHT',
      };

      const direction = keyToDirection[e.key];
      if (direction) {
        e.preventDefault();
        directionQueueRef.current.push(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status]);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
    directionQueueRef.current = [];
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => {
      if (prev.status === 'playing') {
        return { ...prev, status: 'paused' };
      }
      return prev;
    });
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => {
      if (prev.status === 'paused') {
        return { ...prev, status: 'playing' };
      }
      return prev;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState(gameState.mode));
    directionQueueRef.current = [];
  }, [gameState.mode]);

  const setMode = useCallback((mode: GameMode) => {
    setGameState(createInitialState(mode));
    directionQueueRef.current = [];
  }, []);

  const handleDirectionChange = useCallback((direction: Direction) => {
    if (gameState.status === 'playing') {
      directionQueueRef.current.push(direction);
    }
  }, [gameState.status]);

  const finalScore = getFinalScore(gameState);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setMode,
    handleDirectionChange,
    finalScore,
  };
}

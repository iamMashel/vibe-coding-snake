import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  getNextHeadPosition,
  isOutOfBounds,
  checkSelfCollision,
  checkFoodCollision,
  isValidDirectionChange,
  moveSnake,
  changeDirection,
  getScoreMultiplier,
  getFinalScore,
  GRID_SIZE,
  INITIAL_SPEED,
} from '@/lib/gameLogic';
import type { GameState, Position } from '@/types';

describe('Game Logic', () => {
  describe('createInitialState', () => {
    it('creates initial state with correct defaults for pass-through mode', () => {
      const state = createInitialState('pass-through');

      expect(state.mode).toBe('pass-through');
      expect(state.status).toBe('idle');
      expect(state.score).toBe(0);
      expect(state.speed).toBe(INITIAL_SPEED);
      expect(state.snake.length).toBe(3);
      expect(state.direction).toBe('LEFT');
    });

    it('creates initial state with correct defaults for walls mode', () => {
      const state = createInitialState('walls');

      expect(state.mode).toBe('walls');
      expect(state.status).toBe('idle');
    });

    it('places snake in center of grid', () => {
      const state = createInitialState('pass-through');
      const centerX = Math.floor(GRID_SIZE / 2);
      const centerY = Math.floor(GRID_SIZE / 2);

      expect(state.snake[0].x).toBe(centerX);
      expect(state.snake[0].y).toBe(centerY);
    });
  });

  describe('generateFood', () => {
    it('generates food not occupied by snake', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 7, y: 5 },
      ];

      // Generate multiple times to verify randomness doesn't hit snake
      for (let i = 0; i < 100; i++) {
        const food = generateFood(snake);
        const isOnSnake = snake.some(s => s.x === food.x && s.y === food.y);
        expect(isOnSnake).toBe(false);
      }
    });

    it('generates food within grid bounds', () => {
      const snake: Position[] = [{ x: 0, y: 0 }];

      for (let i = 0; i < 100; i++) {
        const food = generateFood(snake);
        expect(food.x).toBeGreaterThanOrEqual(0);
        expect(food.x).toBeLessThan(GRID_SIZE);
        expect(food.y).toBeGreaterThanOrEqual(0);
        expect(food.y).toBeLessThan(GRID_SIZE);
      }
    });
  });

  describe('getNextHeadPosition', () => {
    const head: Position = { x: 10, y: 10 };

    it('moves up correctly', () => {
      const next = getNextHeadPosition(head, 'UP', 'pass-through');
      expect(next).toEqual({ x: 10, y: 9 });
    });

    it('moves down correctly', () => {
      const next = getNextHeadPosition(head, 'DOWN', 'pass-through');
      expect(next).toEqual({ x: 10, y: 11 });
    });

    it('moves left correctly', () => {
      const next = getNextHeadPosition(head, 'LEFT', 'pass-through');
      expect(next).toEqual({ x: 9, y: 10 });
    });

    it('moves right correctly', () => {
      const next = getNextHeadPosition(head, 'RIGHT', 'pass-through');
      expect(next).toEqual({ x: 11, y: 10 });
    });

    it('wraps around in pass-through mode', () => {
      const topEdge: Position = { x: 5, y: 0 };
      const bottomEdge: Position = { x: 5, y: GRID_SIZE - 1 };
      const leftEdge: Position = { x: 0, y: 5 };
      const rightEdge: Position = { x: GRID_SIZE - 1, y: 5 };

      expect(getNextHeadPosition(topEdge, 'UP', 'pass-through')).toEqual({ x: 5, y: GRID_SIZE - 1 });
      expect(getNextHeadPosition(bottomEdge, 'DOWN', 'pass-through')).toEqual({ x: 5, y: 0 });
      expect(getNextHeadPosition(leftEdge, 'LEFT', 'pass-through')).toEqual({ x: GRID_SIZE - 1, y: 5 });
      expect(getNextHeadPosition(rightEdge, 'RIGHT', 'pass-through')).toEqual({ x: 0, y: 5 });
    });

    it('does not wrap in walls mode', () => {
      const topEdge: Position = { x: 5, y: 0 };
      const next = getNextHeadPosition(topEdge, 'UP', 'walls');
      expect(next).toEqual({ x: 5, y: -1 });
    });
  });

  describe('isOutOfBounds', () => {
    it('returns false for positions within grid', () => {
      expect(isOutOfBounds({ x: 0, y: 0 })).toBe(false);
      expect(isOutOfBounds({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 })).toBe(false);
      expect(isOutOfBounds({ x: 10, y: 10 })).toBe(false);
    });

    it('returns true for positions outside grid', () => {
      expect(isOutOfBounds({ x: -1, y: 5 })).toBe(true);
      expect(isOutOfBounds({ x: 5, y: -1 })).toBe(true);
      expect(isOutOfBounds({ x: GRID_SIZE, y: 5 })).toBe(true);
      expect(isOutOfBounds({ x: 5, y: GRID_SIZE })).toBe(true);
    });
  });

  describe('checkSelfCollision', () => {
    it('returns false when no collision', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 7, y: 5 },
      ];
      expect(checkSelfCollision(snake)).toBe(false);
    });

    it('returns true when head collides with body', () => {
      const snake: Position[] = [
        { x: 6, y: 5 }, // Head at same position as body segment
        { x: 6, y: 5 },
        { x: 7, y: 5 },
      ];
      expect(checkSelfCollision(snake)).toBe(true);
    });
  });

  describe('checkFoodCollision', () => {
    it('returns true when head is at food position', () => {
      expect(checkFoodCollision({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(true);
    });

    it('returns false when head is not at food position', () => {
      expect(checkFoodCollision({ x: 5, y: 5 }, { x: 6, y: 5 })).toBe(false);
    });
  });

  describe('isValidDirectionChange', () => {
    it('allows perpendicular direction changes', () => {
      expect(isValidDirectionChange('UP', 'LEFT')).toBe(true);
      expect(isValidDirectionChange('UP', 'RIGHT')).toBe(true);
      expect(isValidDirectionChange('LEFT', 'UP')).toBe(true);
      expect(isValidDirectionChange('LEFT', 'DOWN')).toBe(true);
    });

    it('prevents reversing direction', () => {
      expect(isValidDirectionChange('UP', 'DOWN')).toBe(false);
      expect(isValidDirectionChange('DOWN', 'UP')).toBe(false);
      expect(isValidDirectionChange('LEFT', 'RIGHT')).toBe(false);
      expect(isValidDirectionChange('RIGHT', 'LEFT')).toBe(false);
    });

    it('allows same direction', () => {
      expect(isValidDirectionChange('UP', 'UP')).toBe(true);
      expect(isValidDirectionChange('DOWN', 'DOWN')).toBe(true);
    });
  });

  describe('moveSnake', () => {
    const createPlayingState = (mode: 'pass-through' | 'walls'): GameState => ({
      snake: [
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 12, y: 10 },
      ],
      food: { x: 5, y: 5 },
      direction: 'LEFT',
      score: 0,
      status: 'playing',
      mode,
      speed: INITIAL_SPEED,
    });

    it('does not move when game is not playing', () => {
      const state: GameState = { ...createPlayingState('pass-through'), status: 'idle' };
      const newState = moveSnake(state);
      expect(newState).toBe(state);
    });

    it('moves snake forward in current direction', () => {
      const state = createPlayingState('pass-through');
      const newState = moveSnake(state);

      expect(newState.snake[0]).toEqual({ x: 9, y: 10 });
      expect(newState.snake.length).toBe(3);
      expect(newState.status).toBe('playing');
    });

    it('grows snake when eating food', () => {
      const state: GameState = {
        ...createPlayingState('pass-through'),
        food: { x: 9, y: 10 }, // Food right in front of head
      };

      const newState = moveSnake(state);

      expect(newState.snake.length).toBe(4);
      expect(newState.score).toBe(10);
      expect(newState.food).not.toEqual({ x: 9, y: 10 }); // New food generated
    });

    it('ends game on wall collision in walls mode', () => {
      const state: GameState = {
        ...createPlayingState('walls'),
        snake: [
          { x: 0, y: 10 },
          { x: 1, y: 10 },
          { x: 2, y: 10 },
        ],
        direction: 'LEFT',
      };

      const newState = moveSnake(state);
      expect(newState.status).toBe('game-over');
    });

    it('wraps around in pass-through mode', () => {
      const state: GameState = {
        ...createPlayingState('pass-through'),
        snake: [
          { x: 0, y: 10 },
          { x: 1, y: 10 },
          { x: 2, y: 10 },
        ],
        direction: 'LEFT',
      };

      const newState = moveSnake(state);
      expect(newState.snake[0]).toEqual({ x: GRID_SIZE - 1, y: 10 });
      expect(newState.status).toBe('playing');
    });

    it('ends game on self collision', () => {
      const state: GameState = {
        ...createPlayingState('pass-through'),
        snake: [
          { x: 10, y: 10 },
          { x: 11, y: 10 },
          { x: 11, y: 11 },
          { x: 10, y: 11 },
          { x: 9, y: 11 },
          { x: 9, y: 10 }, // Will collide when moving left
        ],
        direction: 'DOWN', // Will collide with (10, 11) which is a body segment
      };

      const newState = moveSnake(state);
      expect(newState.status).toBe('game-over');
    });
  });

  describe('changeDirection', () => {
    it('changes direction when valid', () => {
      const state = createInitialState('pass-through');
      const newState = changeDirection(state, 'UP');
      expect(newState.direction).toBe('UP');
    });

    it('does not change to opposite direction', () => {
      const state: GameState = { ...createInitialState('pass-through'), direction: 'LEFT' };
      const newState = changeDirection(state, 'RIGHT');
      expect(newState.direction).toBe('LEFT');
    });
  });

  describe('score calculations', () => {
    it('returns correct multiplier for each mode', () => {
      expect(getScoreMultiplier('pass-through')).toBe(1);
      expect(getScoreMultiplier('walls')).toBe(1.5);
    });

    it('calculates final score correctly', () => {
      const passState: GameState = { ...createInitialState('pass-through'), score: 100 };
      const wallsState: GameState = { ...createInitialState('walls'), score: 100 };

      expect(getFinalScore(passState)).toBe(100);
      expect(getFinalScore(wallsState)).toBe(150);
    });
  });
});

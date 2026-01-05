/**
 * Pure game logic functions for the Snake game
 * These are separated for easy testing
 */

import type { Position, Direction, GameState, GameMode } from '@/types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 5;
export const MIN_SPEED = 50;

// Direction vectors
export const DIRECTION_VECTORS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Opposite directions (can't reverse directly)
export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

/**
 * Create initial game state
 */
export function createInitialState(mode: GameMode): GameState {
  const centerX = Math.floor(GRID_SIZE / 2);
  const centerY = Math.floor(GRID_SIZE / 2);
  
  return {
    snake: [
      { x: centerX, y: centerY },
      { x: centerX + 1, y: centerY },
      { x: centerX + 2, y: centerY },
    ],
    food: generateFood([
      { x: centerX, y: centerY },
      { x: centerX + 1, y: centerY },
      { x: centerX + 2, y: centerY },
    ]),
    direction: 'LEFT',
    score: 0,
    status: 'idle',
    mode,
    speed: INITIAL_SPEED,
  };
}

/**
 * Generate food at random position not occupied by snake
 */
export function generateFood(snake: Position[]): Position {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
  
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${food.x},${food.y}`));
  
  return food;
}

/**
 * Calculate next head position based on direction
 */
export function getNextHeadPosition(head: Position, direction: Direction, mode: GameMode): Position {
  const delta = DIRECTION_VECTORS[direction];
  let newX = head.x + delta.x;
  let newY = head.y + delta.y;
  
  if (mode === 'pass-through') {
    // Wrap around edges
    newX = (newX + GRID_SIZE) % GRID_SIZE;
    newY = (newY + GRID_SIZE) % GRID_SIZE;
  }
  
  return { x: newX, y: newY };
}

/**
 * Check if position is out of bounds (only matters in 'walls' mode)
 */
export function isOutOfBounds(position: Position): boolean {
  return position.x < 0 || position.x >= GRID_SIZE || position.y < 0 || position.y >= GRID_SIZE;
}

/**
 * Check if snake collides with itself
 */
export function checkSelfCollision(snake: Position[]): boolean {
  const head = snake[0];
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

/**
 * Check if head is at food position
 */
export function checkFoodCollision(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y;
}

/**
 * Validate direction change (can't reverse directly)
 */
export function isValidDirectionChange(current: Direction, next: Direction): boolean {
  return OPPOSITE_DIRECTIONS[current] !== next;
}

/**
 * Move the snake one step
 * Returns new game state
 */
export function moveSnake(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state;
  }
  
  const head = state.snake[0];
  const newHead = getNextHeadPosition(head, state.direction, state.mode);
  
  // Check wall collision in 'walls' mode
  if (state.mode === 'walls' && isOutOfBounds(newHead)) {
    return { ...state, status: 'game-over' };
  }
  
  // Create new snake with new head
  const newSnake = [newHead, ...state.snake];
  
  // Check self collision (before removing tail)
  if (checkSelfCollision(newSnake.slice(0, -1))) {
    return { ...state, status: 'game-over' };
  }
  
  // Check food collision
  const ateFood = checkFoodCollision(newHead, state.food);
  
  if (ateFood) {
    // Don't remove tail, generate new food
    const newFood = generateFood(newSnake);
    const newSpeed = Math.max(MIN_SPEED, state.speed - SPEED_INCREMENT);
    
    return {
      ...state,
      snake: newSnake,
      food: newFood,
      score: state.score + 10,
      speed: newSpeed,
    };
  } else {
    // Remove tail
    newSnake.pop();
    return {
      ...state,
      snake: newSnake,
    };
  }
}

/**
 * Change direction if valid
 */
export function changeDirection(state: GameState, newDirection: Direction): GameState {
  if (!isValidDirectionChange(state.direction, newDirection)) {
    return state;
  }
  
  return { ...state, direction: newDirection };
}

/**
 * Calculate score multiplier based on mode
 */
export function getScoreMultiplier(mode: GameMode): number {
  return mode === 'walls' ? 1.5 : 1;
}

/**
 * Get final score with multiplier applied
 */
export function getFinalScore(state: GameState): number {
  return Math.floor(state.score * getScoreMultiplier(state.mode));
}

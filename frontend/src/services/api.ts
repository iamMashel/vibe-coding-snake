/**
 * Centralized Mock API Service
 * All backend calls are mocked here for easy replacement with real API later
 */

import type {
  User,
  LoginCredentials,
  SignupCredentials,
  LeaderboardEntry,
  ActivePlayer,
  GameMode,
  ApiResponse,
  GameState,
  Position,
} from '@/types';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage (simulates database)
let mockUsers: User[] = [
  { id: '1', username: 'SnakeMaster', email: 'snake@master.com', createdAt: '2024-01-01' },
  { id: '2', username: 'RetroGamer', email: 'retro@gamer.com', createdAt: '2024-01-05' },
  { id: '3', username: 'NeonViper', email: 'neon@viper.com', createdAt: '2024-01-10' },
];

let mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', rank: 1, username: 'SnakeMaster', score: 2450, mode: 'walls', playedAt: '2024-01-15' },
  { id: '2', rank: 2, username: 'NeonViper', score: 2100, mode: 'pass-through', playedAt: '2024-01-14' },
  { id: '3', rank: 3, username: 'RetroGamer', score: 1850, mode: 'walls', playedAt: '2024-01-13' },
  { id: '4', rank: 4, username: 'PixelPython', score: 1600, mode: 'pass-through', playedAt: '2024-01-12' },
  { id: '5', rank: 5, username: 'ArcadeAce', score: 1400, mode: 'walls', playedAt: '2024-01-11' },
  { id: '6', rank: 6, username: 'ByteBiter', score: 1200, mode: 'pass-through', playedAt: '2024-01-10' },
  { id: '7', rank: 7, username: 'GridGlider', score: 1050, mode: 'walls', playedAt: '2024-01-09' },
  { id: '8', rank: 8, username: 'CoilChamp', score: 900, mode: 'pass-through', playedAt: '2024-01-08' },
  { id: '9', rank: 9, username: 'SlitherStar', score: 750, mode: 'walls', playedAt: '2024-01-07' },
  { id: '10', rank: 10, username: 'TailTwister', score: 600, mode: 'pass-through', playedAt: '2024-01-06' },
];

// Session storage key
const SESSION_KEY = 'snake_game_session';

// Generate random game state for spectator mode
const generateRandomGameState = (mode: GameMode): GameState => {
  const gridSize = 20;
  const snakeLength = Math.floor(Math.random() * 5) + 3;
  const startX = Math.floor(Math.random() * (gridSize - snakeLength - 2)) + 1;
  const startY = Math.floor(Math.random() * (gridSize - 2)) + 1;
  
  const snake: Position[] = [];
  for (let i = 0; i < snakeLength; i++) {
    snake.push({ x: startX + i, y: startY });
  }
  
  return {
    snake,
    food: { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) },
    direction: 'LEFT',
    score: Math.floor(Math.random() * 500) + 50,
    status: 'playing',
    mode,
    speed: 150,
  };
};

// Mock active players for spectator mode
const generateMockActivePlayers = (): ActivePlayer[] => [
  {
    id: 'active-1',
    username: 'LiveSnaker',
    score: 340,
    mode: 'walls',
    gameState: generateRandomGameState('walls'),
    viewers: 12,
  },
  {
    id: 'active-2',
    username: 'ProSlither',
    score: 520,
    mode: 'pass-through',
    gameState: generateRandomGameState('pass-through'),
    viewers: 8,
  },
  {
    id: 'active-3',
    username: 'SnakeNinja',
    score: 180,
    mode: 'walls',
    gameState: generateRandomGameState('walls'),
    viewers: 5,
  },
];

// ============ Auth API ============

export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    await delay(800);
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (user && credentials.password.length >= 6) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return { success: true, data: user };
    }
    
    return { success: false, error: 'Invalid email or password' };
  },

  async signup(credentials: SignupCredentials): Promise<ApiResponse<User>> {
    await delay(1000);
    
    if (mockUsers.some(u => u.email === credentials.email)) {
      return { success: false, error: 'Email already registered' };
    }
    
    if (mockUsers.some(u => u.username === credentials.username)) {
      return { success: false, error: 'Username already taken' };
    }
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      username: credentials.username,
      email: credentials.email,
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    
    return { success: true, data: newUser };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(300);
    localStorage.removeItem(SESSION_KEY);
    return { success: true };
  },

  async getSession(): Promise<ApiResponse<User | null>> {
    await delay(200);
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      return { success: true, data: JSON.parse(stored) };
    }
    return { success: true, data: null };
  },
};

// ============ Leaderboard API ============

export const leaderboardApi = {
  async getLeaderboard(mode?: GameMode): Promise<ApiResponse<LeaderboardEntry[]>> {
    await delay(500);
    
    let entries = [...mockLeaderboard];
    if (mode) {
      entries = entries.filter(e => e.mode === mode);
    }
    
    // Recalculate ranks after filtering
    entries = entries.map((e, i) => ({ ...e, rank: i + 1 }));
    
    return { success: true, data: entries };
  },

  async submitScore(score: number, mode: GameMode, username: string): Promise<ApiResponse<LeaderboardEntry>> {
    await delay(600);
    
    const newEntry: LeaderboardEntry = {
      id: String(mockLeaderboard.length + 1),
      rank: 0,
      username,
      score,
      mode,
      playedAt: new Date().toISOString(),
    };
    
    mockLeaderboard.push(newEntry);
    mockLeaderboard.sort((a, b) => b.score - a.score);
    mockLeaderboard = mockLeaderboard.map((e, i) => ({ ...e, rank: i + 1 }));
    
    const updatedEntry = mockLeaderboard.find(e => e.id === newEntry.id)!;
    
    return { success: true, data: updatedEntry };
  },
};

// ============ Spectator API ============

export const spectatorApi = {
  async getActivePlayers(): Promise<ApiResponse<ActivePlayer[]>> {
    await delay(400);
    return { success: true, data: generateMockActivePlayers() };
  },

  async watchPlayer(playerId: string): Promise<ApiResponse<ActivePlayer>> {
    await delay(200);
    const players = generateMockActivePlayers();
    const player = players.find(p => p.id === playerId);
    
    if (player) {
      return { success: true, data: { ...player, viewers: player.viewers + 1 } };
    }
    
    return { success: false, error: 'Player not found or game ended' };
  },

  async stopWatching(playerId: string): Promise<ApiResponse<null>> {
    await delay(100);
    return { success: true };
  },
};

// ============ Game API ============

export const gameApi = {
  async saveGame(gameState: GameState, userId: string): Promise<ApiResponse<null>> {
    await delay(300);
    // In real implementation, this would persist the game state
    console.log('Game saved for user:', userId, gameState);
    return { success: true };
  },

  async loadGame(userId: string): Promise<ApiResponse<GameState | null>> {
    await delay(300);
    // In real implementation, this would load the saved game
    return { success: true, data: null };
  },
};

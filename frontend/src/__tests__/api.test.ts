import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi, leaderboardApi, spectatorApi, gameApi } from '@/services/api';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('API Service', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('authApi', () => {
    describe('login', () => {
      it('successfully logs in with valid credentials', async () => {
        const result = await authApi.login({
          email: 'snake@master.com',
          password: 'password123',
        });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.username).toBe('SnakeMaster');
      });

      it('fails with invalid email', async () => {
        const result = await authApi.login({
          email: 'invalid@email.com',
          password: 'password123',
        });

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('fails with short password', async () => {
        const result = await authApi.login({
          email: 'snake@master.com',
          password: '12345',
        });

        expect(result.success).toBe(false);
      });

      it('stores session in localStorage on success', async () => {
        await authApi.login({
          email: 'snake@master.com',
          password: 'password123',
        });

        const session = localStorageMock.getItem('snake_game_session');
        expect(session).toBeDefined();
        expect(JSON.parse(session!).username).toBe('SnakeMaster');
      });
    });

    describe('signup', () => {
      it('successfully creates new account', async () => {
        const result = await authApi.signup({
          username: 'NewPlayer',
          email: 'new@player.com',
          password: 'password123',
        });

        expect(result.success).toBe(true);
        expect(result.data?.username).toBe('NewPlayer');
      });

      it('fails with existing email', async () => {
        const result = await authApi.signup({
          username: 'AnotherSnake',
          email: 'snake@master.com',
          password: 'password123',
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain('Email already registered');
      });

      it('fails with existing username', async () => {
        const result = await authApi.signup({
          username: 'SnakeMaster',
          email: 'different@email.com',
          password: 'password123',
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain('Username already taken');
      });
    });

    describe('logout', () => {
      it('clears session from localStorage', async () => {
        // First login
        await authApi.login({
          email: 'snake@master.com',
          password: 'password123',
        });

        expect(localStorageMock.getItem('snake_game_session')).toBeDefined();

        // Then logout
        await authApi.logout();

        expect(localStorageMock.getItem('snake_game_session')).toBeNull();
      });
    });

    describe('getSession', () => {
      it('returns null when no session exists', async () => {
        const result = await authApi.getSession();
        expect(result.success).toBe(true);
        expect(result.data).toBeNull();
      });

      it('returns user when session exists', async () => {
        await authApi.login({
          email: 'snake@master.com',
          password: 'password123',
        });

        const result = await authApi.getSession();
        expect(result.success).toBe(true);
        expect(result.data?.username).toBe('SnakeMaster');
      });
    });
  });

  describe('leaderboardApi', () => {
    describe('getLeaderboard', () => {
      it('returns all entries when no mode filter', async () => {
        const result = await leaderboardApi.getLeaderboard();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data!.length).toBeGreaterThan(0);
      });

      it('filters entries by mode', async () => {
        const result = await leaderboardApi.getLeaderboard('walls');

        expect(result.success).toBe(true);
        result.data?.forEach(entry => {
          expect(entry.mode).toBe('walls');
        });
      });

      it('recalculates ranks after filtering', async () => {
        const result = await leaderboardApi.getLeaderboard('walls');

        expect(result.success).toBe(true);
        expect(result.data![0].rank).toBe(1);
      });
    });

    describe('submitScore', () => {
      it('adds new entry to leaderboard', async () => {
        const beforeResult = await leaderboardApi.getLeaderboard();
        const beforeCount = beforeResult.data!.length;

        const submitResult = await leaderboardApi.submitScore(500, 'walls', 'TestPlayer');

        expect(submitResult.success).toBe(true);
        expect(submitResult.data?.username).toBe('TestPlayer');
        expect(submitResult.data?.score).toBe(500);

        const afterResult = await leaderboardApi.getLeaderboard();
        expect(afterResult.data!.length).toBe(beforeCount + 1);
      });

      it('correctly ranks new entry', async () => {
        const result = await leaderboardApi.submitScore(10000, 'walls', 'TopPlayer');

        expect(result.success).toBe(true);
        expect(result.data?.rank).toBe(1);
      });
    });
  });

  describe('spectatorApi', () => {
    describe('getActivePlayers', () => {
      it('returns list of active players', async () => {
        const result = await spectatorApi.getActivePlayers();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data!.length).toBeGreaterThan(0);
      });

      it('each player has required fields', async () => {
        const result = await spectatorApi.getActivePlayers();

        result.data?.forEach(player => {
          expect(player.id).toBeDefined();
          expect(player.username).toBeDefined();
          expect(player.score).toBeDefined();
          expect(player.mode).toBeDefined();
          expect(player.gameState).toBeDefined();
          expect(player.viewers).toBeDefined();
        });
      });
    });

    describe('watchPlayer', () => {
      it('returns player data on success', async () => {
        const players = await spectatorApi.getActivePlayers();
        const playerId = players.data![0].id;

        const result = await spectatorApi.watchPlayer(playerId);

        expect(result.success).toBe(true);
        expect(result.data?.id).toBe(playerId);
      });

      it('fails for non-existent player', async () => {
        const result = await spectatorApi.watchPlayer('non-existent-id');

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('stopWatching', () => {
      it('succeeds', async () => {
        const result = await spectatorApi.stopWatching('any-id');
        expect(result.success).toBe(true);
      });
    });
  });

  describe('gameApi', () => {
    describe('saveGame', () => {
      it('succeeds', async () => {
        const mockState = {
          snake: [{ x: 10, y: 10 }],
          food: { x: 5, y: 5 },
          direction: 'LEFT' as const,
          score: 100,
          status: 'playing' as const,
          mode: 'pass-through' as const,
          speed: 150,
        };

        const result = await gameApi.saveGame(mockState, 'user-1');
        expect(result.success).toBe(true);
      });
    });

    describe('loadGame', () => {
      it('returns null when no saved game', async () => {
        const result = await gameApi.loadGame('user-1');
        expect(result.success).toBe(true);
        expect(result.data).toBeNull();
      });
    });
  });
});

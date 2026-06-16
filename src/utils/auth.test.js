import { describe, it, expect, beforeEach } from 'vitest';
import {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  isAdmin,
} from './auth.js';
import { getSession, setSession, addUser, getUsers } from './storage.js';

describe('auth.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('logs in with hard-coded admin credentials and returns session', () => {
      const session = login('admin', 'admin123');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin');
      expect(session.username).toBe('admin');
      expect(session.displayName).toBe('Admin');
      expect(session.role).toBe('admin');
    });

    it('persists session to localStorage on successful admin login', () => {
      login('admin', 'admin123');
      const stored = getSession();
      expect(stored).not.toBeNull();
      expect(stored.userId).toBe('admin');
      expect(stored.role).toBe('admin');
    });

    it('returns null for incorrect admin password', () => {
      const session = login('admin', 'wrongpassword');
      expect(session).toBeNull();
    });

    it('logs in with a localStorage user and returns session', () => {
      const user = {
        id: 'user-1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);

      const session = login('testuser', 'password123');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('user-1');
      expect(session.username).toBe('testuser');
      expect(session.displayName).toBe('Test User');
      expect(session.role).toBe('user');
    });

    it('persists session to localStorage on successful user login', () => {
      const user = {
        id: 'user-2',
        displayName: 'Another User',
        username: 'anotheruser',
        password: 'mypass',
        role: 'user',
        createdAt: '2024-02-01T00:00:00.000Z',
      };
      addUser(user);

      login('anotheruser', 'mypass');
      const stored = getSession();
      expect(stored).not.toBeNull();
      expect(stored.userId).toBe('user-2');
      expect(stored.username).toBe('anotheruser');
    });

    it('returns null for incorrect user password', () => {
      const user = {
        id: 'user-1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);

      const session = login('testuser', 'wrongpassword');
      expect(session).toBeNull();
    });

    it('returns null for non-existent username', () => {
      const session = login('nonexistent', 'password');
      expect(session).toBeNull();
    });

    it('does not persist session on failed login', () => {
      const session = login('nonexistent', 'password');
      expect(session).toBeNull();
      expect(getSession()).toBeNull();
    });

    it('logs in with a localStorage admin user', () => {
      const user = {
        id: 'user-admin',
        displayName: 'Custom Admin',
        username: 'customadmin',
        password: 'adminpass',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);

      const session = login('customadmin', 'adminpass');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('user-admin');
      expect(session.role).toBe('admin');
    });

    it('prefers hard-coded admin over localStorage user with same username', () => {
      const user = {
        id: 'user-fake-admin',
        displayName: 'Fake Admin',
        username: 'admin',
        password: 'admin123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);

      const session = login('admin', 'admin123');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin');
      expect(session.role).toBe('admin');
      expect(session.displayName).toBe('Admin');
    });
  });

  // ─── logout ───────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('clears the session from localStorage', () => {
      login('admin', 'admin123');
      expect(getSession()).not.toBeNull();

      logout();
      expect(getSession()).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => logout()).not.toThrow();
    });
  });

  // ─── isAuthenticated ──────────────────────────────────────────────────────

  describe('isAuthenticated', () => {
    it('returns false when no session exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true after successful login', () => {
      login('admin', 'admin123');
      expect(isAuthenticated()).toBe(true);
    });

    it('returns false after logout', () => {
      login('admin', 'admin123');
      logout();
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true for a logged-in regular user', () => {
      const user = {
        id: 'user-1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);
      login('testuser', 'password123');
      expect(isAuthenticated()).toBe(true);
    });

    it('returns false when session has empty userId', () => {
      setSession({
        userId: '',
        username: 'test',
        displayName: 'Test',
        role: 'user',
      });
      expect(isAuthenticated()).toBe(false);
    });

    it('returns false when session has non-string userId', () => {
      setSession({
        userId: 123,
        username: 'test',
        displayName: 'Test',
        role: 'user',
      });
      expect(isAuthenticated()).toBe(false);
    });
  });

  // ─── getCurrentUser ───────────────────────────────────────────────────────

  describe('getCurrentUser', () => {
    it('returns null when no session exists', () => {
      expect(getCurrentUser()).toBeNull();
    });

    it('returns the session object after admin login', () => {
      login('admin', 'admin123');
      const user = getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.userId).toBe('admin');
      expect(user.username).toBe('admin');
      expect(user.displayName).toBe('Admin');
      expect(user.role).toBe('admin');
    });

    it('returns the session object after regular user login', () => {
      const userData = {
        id: 'user-1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(userData);
      login('testuser', 'password123');

      const user = getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.userId).toBe('user-1');
      expect(user.username).toBe('testuser');
      expect(user.displayName).toBe('Test User');
      expect(user.role).toBe('user');
    });

    it('returns null after logout', () => {
      login('admin', 'admin123');
      logout();
      expect(getCurrentUser()).toBeNull();
    });
  });

  // ─── isAdmin ──────────────────────────────────────────────────────────────

  describe('isAdmin', () => {
    it('returns false when no session exists', () => {
      expect(isAdmin()).toBe(false);
    });

    it('returns true for hard-coded admin login', () => {
      login('admin', 'admin123');
      expect(isAdmin()).toBe(true);
    });

    it('returns false for regular user login', () => {
      const user = {
        id: 'user-1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);
      login('testuser', 'password123');
      expect(isAdmin()).toBe(false);
    });

    it('returns true for localStorage admin user login', () => {
      const user = {
        id: 'user-admin',
        displayName: 'Custom Admin',
        username: 'customadmin',
        password: 'adminpass',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);
      login('customadmin', 'adminpass');
      expect(isAdmin()).toBe(true);
    });

    it('returns false after logout', () => {
      login('admin', 'admin123');
      expect(isAdmin()).toBe(true);
      logout();
      expect(isAdmin()).toBe(false);
    });

    it('returns false when session has non-admin role', () => {
      setSession({
        userId: 'user-1',
        username: 'test',
        displayName: 'Test',
        role: 'user',
      });
      expect(isAdmin()).toBe(false);
    });
  });
});
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getSession,
  setSession,
  clearSession,
} from './storage.js';

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ─── Posts ──────────────────────────────────────────────────────────────────

  describe('getPosts', () => {
    it('returns an empty array when no posts exist', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_posts', 'not-json');
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ foo: 'bar' }));
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns stored posts', () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user-1',
          authorName: 'Test User',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
    });
  });

  describe('addPost', () => {
    it('adds a post to an empty posts array', () => {
      const post = {
        id: 'post-1',
        title: 'New Post',
        content: 'New content',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'Test User',
      };
      addPost(post);
      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0]).toEqual(post);
    });

    it('appends a post to existing posts', () => {
      const post1 = {
        id: 'post-1',
        title: 'First Post',
        content: 'First content',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'User One',
      };
      const post2 = {
        id: 'post-2',
        title: 'Second Post',
        content: 'Second content',
        createdAt: '2024-01-02T00:00:00.000Z',
        authorId: 'user-2',
        authorName: 'User Two',
      };
      addPost(post1);
      addPost(post2);
      const posts = getPosts();
      expect(posts).toHaveLength(2);
      expect(posts[0]).toEqual(post1);
      expect(posts[1]).toEqual(post2);
    });
  });

  describe('updatePost', () => {
    it('updates an existing post by id', () => {
      const post = {
        id: 'post-1',
        title: 'Original Title',
        content: 'Original content',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'Test User',
      };
      addPost(post);

      updatePost({
        id: 'post-1',
        title: 'Updated Title',
        content: 'Updated content',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });

      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Updated Title');
      expect(posts[0].content).toBe('Updated content');
      expect(posts[0].updatedAt).toBe('2024-01-02T00:00:00.000Z');
      expect(posts[0].authorId).toBe('user-1');
      expect(posts[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('does nothing when post id does not exist', () => {
      const post = {
        id: 'post-1',
        title: 'Original Title',
        content: 'Original content',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'Test User',
      };
      addPost(post);

      updatePost({
        id: 'non-existent',
        title: 'Updated Title',
      });

      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Original Title');
    });
  });

  describe('deletePost', () => {
    it('deletes a post by id', () => {
      const post1 = {
        id: 'post-1',
        title: 'First',
        content: 'Content 1',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'User One',
      };
      const post2 = {
        id: 'post-2',
        title: 'Second',
        content: 'Content 2',
        createdAt: '2024-01-02T00:00:00.000Z',
        authorId: 'user-2',
        authorName: 'User Two',
      };
      addPost(post1);
      addPost(post2);

      deletePost('post-1');

      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe('post-2');
    });

    it('does nothing when post id does not exist', () => {
      const post = {
        id: 'post-1',
        title: 'First',
        content: 'Content 1',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'User One',
      };
      addPost(post);

      deletePost('non-existent');

      const posts = getPosts();
      expect(posts).toHaveLength(1);
    });
  });

  // ─── Users ──────────────────────────────────────────────────────────────────

  describe('getUsers', () => {
    it('returns an empty array when no users exist', () => {
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_users', '{broken');
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify('string-value'));
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns stored users', () => {
      const mockUsers = [
        {
          id: 'user-1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'password123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));
      const users = getUsers();
      expect(users).toEqual(mockUsers);
    });
  });

  describe('addUser', () => {
    it('adds a user to an empty users array', () => {
      const user = {
        id: 'user-1',
        displayName: 'New User',
        username: 'newuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual(user);
    });

    it('appends a user to existing users', () => {
      const user1 = {
        id: 'user-1',
        displayName: 'User One',
        username: 'userone',
        password: 'pass1',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      const user2 = {
        id: 'user-2',
        displayName: 'User Two',
        username: 'usertwo',
        password: 'pass2',
        role: 'admin',
        createdAt: '2024-01-02T00:00:00.000Z',
      };
      addUser(user1);
      addUser(user2);
      const users = getUsers();
      expect(users).toHaveLength(2);
      expect(users[0]).toEqual(user1);
      expect(users[1]).toEqual(user2);
    });
  });

  describe('updateUser', () => {
    it('updates an existing user by id', () => {
      const user = {
        id: 'user-1',
        displayName: 'Original Name',
        username: 'origuser',
        password: 'pass1',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);

      updateUser({
        id: 'user-1',
        displayName: 'Updated Name',
        role: 'admin',
      });

      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].displayName).toBe('Updated Name');
      expect(users[0].role).toBe('admin');
      expect(users[0].username).toBe('origuser');
    });

    it('does nothing when user id does not exist', () => {
      const user = {
        id: 'user-1',
        displayName: 'Original Name',
        username: 'origuser',
        password: 'pass1',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);

      updateUser({
        id: 'non-existent',
        displayName: 'Updated Name',
      });

      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].displayName).toBe('Original Name');
    });
  });

  describe('deleteUser', () => {
    it('deletes a user by id', () => {
      const user1 = {
        id: 'user-1',
        displayName: 'User One',
        username: 'userone',
        password: 'pass1',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      const user2 = {
        id: 'user-2',
        displayName: 'User Two',
        username: 'usertwo',
        password: 'pass2',
        role: 'user',
        createdAt: '2024-01-02T00:00:00.000Z',
      };
      addUser(user1);
      addUser(user2);

      deleteUser('user-1');

      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('user-2');
    });

    it('does nothing when user id does not exist', () => {
      const user = {
        id: 'user-1',
        displayName: 'User One',
        username: 'userone',
        password: 'pass1',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      addUser(user);

      deleteUser('non-existent');

      const users = getUsers();
      expect(users).toHaveLength(1);
    });
  });

  // ─── Session ────────────────────────────────────────────────────────────────

  describe('getSession', () => {
    it('returns null when no session exists', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_session', 'not-valid-json');
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns the stored session object', () => {
      const mockSession = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));
      const session = getSession();
      expect(session).toEqual(mockSession);
    });
  });

  describe('setSession', () => {
    it('saves a session object to localStorage', () => {
      const session = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      setSession(session);
      const stored = getSession();
      expect(stored).toEqual(session);
    });

    it('overwrites an existing session', () => {
      const session1 = {
        userId: 'user-1',
        username: 'userone',
        displayName: 'User One',
        role: 'user',
      };
      const session2 = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      setSession(session1);
      setSession(session2);
      const stored = getSession();
      expect(stored).toEqual(session2);
    });
  });

  describe('clearSession', () => {
    it('removes the session from localStorage', () => {
      const session = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      setSession(session);
      expect(getSession()).not.toBeNull();

      clearSession();
      expect(getSession()).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });
  });

  // ─── Error handling ─────────────────────────────────────────────────────────

  describe('error handling', () => {
    it('handles localStorage.setItem throwing on addPost', () => {
      const originalSetItem = localStorage.setItem;
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
      };

      const post = {
        id: 'post-1',
        title: 'Test',
        content: 'Content',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'User',
      };

      expect(() => addPost(post)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });

    it('handles localStorage.setItem throwing on setSession', () => {
      const originalSetItem = localStorage.setItem;
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
      };

      const session = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      expect(() => setSession(session)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });

    it('handles localStorage.removeItem throwing on clearSession', () => {
      const originalRemoveItem = localStorage.removeItem;
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.removeItem = () => {
        throw new Error('SecurityError');
      };

      expect(() => clearSession()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      localStorage.removeItem = originalRemoveItem;
      consoleSpy.mockRestore();
    });

    it('handles localStorage.getItem throwing on getPosts', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = () => {
        throw new Error('SecurityError');
      };

      const posts = getPosts();
      expect(posts).toEqual([]);

      localStorage.getItem = originalGetItem;
    });

    it('handles localStorage.getItem throwing on getSession', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = () => {
        throw new Error('SecurityError');
      };

      const session = getSession();
      expect(session).toBeNull();

      localStorage.getItem = originalGetItem;
    });
  });

  // ─── Data integrity ─────────────────────────────────────────────────────────

  describe('data integrity', () => {
    it('posts and users are stored independently', () => {
      const post = {
        id: 'post-1',
        title: 'Test Post',
        content: 'Content',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'User',
      };
      const user = {
        id: 'user-1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'pass',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      addPost(post);
      addUser(user);

      expect(getPosts()).toHaveLength(1);
      expect(getUsers()).toHaveLength(1);

      deletePost('post-1');
      expect(getPosts()).toHaveLength(0);
      expect(getUsers()).toHaveLength(1);
    });

    it('session is stored independently from posts and users', () => {
      const session = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      const post = {
        id: 'post-1',
        title: 'Test',
        content: 'Content',
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: 'user-1',
        authorName: 'Test User',
      };

      setSession(session);
      addPost(post);

      clearSession();
      expect(getSession()).toBeNull();
      expect(getPosts()).toHaveLength(1);
    });

    it('multiple posts maintain correct order after operations', () => {
      const posts = [
        { id: 'p1', title: 'A', content: 'A', createdAt: '2024-01-01T00:00:00.000Z', authorId: 'u1', authorName: 'U1' },
        { id: 'p2', title: 'B', content: 'B', createdAt: '2024-01-02T00:00:00.000Z', authorId: 'u1', authorName: 'U1' },
        { id: 'p3', title: 'C', content: 'C', createdAt: '2024-01-03T00:00:00.000Z', authorId: 'u1', authorName: 'U1' },
      ];

      posts.forEach((p) => addPost(p));
      expect(getPosts()).toHaveLength(3);

      deletePost('p2');
      const remaining = getPosts();
      expect(remaining).toHaveLength(2);
      expect(remaining[0].id).toBe('p1');
      expect(remaining[1].id).toBe('p3');

      updatePost({ id: 'p1', title: 'A Updated' });
      const updated = getPosts();
      expect(updated[0].title).toBe('A Updated');
      expect(updated[1].title).toBe('C');
    });
  });
});
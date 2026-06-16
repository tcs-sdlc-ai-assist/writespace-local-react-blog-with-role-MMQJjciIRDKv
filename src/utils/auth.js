import { getUsers, getSession, setSession, clearSession } from './storage.js';

/**
 * Attempts to log in a user with the given credentials.
 * Checks against a hard-coded admin account first, then localStorage users.
 * On success, writes the session to localStorage and returns the session object.
 * @param {string} username - The username to authenticate.
 * @param {string} password - The password to authenticate.
 * @returns {Object|null} The session object on success, or null on failure.
 */
export function login(username, password) {
  // Check hard-coded admin credentials
  if (username === 'admin' && password === 'admin123') {
    const session = {
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };
    setSession(session);
    return session;
  }

  // Check localStorage users
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return null;
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  setSession(session);
  return session;
}

/**
 * Logs out the current user by clearing the session from localStorage.
 */
export function logout() {
  clearSession();
}

/**
 * Checks whether a valid session exists in localStorage.
 * @returns {boolean} True if a session with a userId exists, false otherwise.
 */
export function isAuthenticated() {
  const session = getSession();
  return session !== null && typeof session.userId === 'string' && session.userId.length > 0;
}

/**
 * Returns the current session object from localStorage.
 * @returns {Object|null} The session object, or null if no session exists.
 */
export function getCurrentUser() {
  return getSession();
}

/**
 * Checks whether the current user has the admin role.
 * @returns {boolean} True if the current user's role is "admin", false otherwise.
 */
export function isAdmin() {
  const session = getSession();
  return session !== null && session.role === 'admin';
}
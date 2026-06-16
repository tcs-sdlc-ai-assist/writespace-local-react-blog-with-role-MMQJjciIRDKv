const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';
const SESSION_KEY = 'writespace_session';

/**
 * Reads and parses a JSON array from localStorage.
 * @param {string} key - The localStorage key.
 * @returns {Array} The parsed array or an empty array on failure.
 */
function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Writes a JSON array to localStorage.
 * @param {string} key - The localStorage key.
 * @param {Array} data - The array to persist.
 */
function writeArray(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to write to localStorage key "${key}":`, error);
  }
}

// ─── Posts ────────────────────────────────────────────────────────────────────

/**
 * Retrieves all posts from localStorage.
 * @returns {Array<Object>} Array of post objects.
 */
export function getPosts() {
  return readArray(POSTS_KEY);
}

/**
 * Adds a new post to localStorage.
 * @param {Object} post - The post object to add.
 * @param {string} post.id - UUID of the post.
 * @param {string} post.title - Title of the post.
 * @param {string} post.content - Content of the post.
 * @param {string} post.createdAt - ISO date string.
 * @param {string} post.authorId - ID of the author.
 * @param {string} post.authorName - Display name of the author.
 */
export function addPost(post) {
  const posts = getPosts();
  posts.push(post);
  writeArray(POSTS_KEY, posts);
}

/**
 * Updates an existing post in localStorage by matching id.
 * @param {Object} updatedPost - The post object with updated fields.
 * @param {string} updatedPost.id - UUID of the post to update.
 */
export function updatePost(updatedPost) {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === updatedPost.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updatedPost };
    writeArray(POSTS_KEY, posts);
  }
}

/**
 * Deletes a post from localStorage by id.
 * @param {string} id - UUID of the post to delete.
 */
export function deletePost(id) {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  writeArray(POSTS_KEY, filtered);
}

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * Retrieves all users from localStorage.
 * @returns {Array<Object>} Array of user objects.
 */
export function getUsers() {
  return readArray(USERS_KEY);
}

/**
 * Adds a new user to localStorage.
 * @param {Object} user - The user object to add.
 * @param {string} user.id - UUID of the user.
 * @param {string} user.displayName - Display name.
 * @param {string} user.username - Unique username.
 * @param {string} user.password - Plain-text password.
 * @param {string} user.role - "admin" or "user".
 * @param {string} user.createdAt - ISO date string.
 */
export function addUser(user) {
  const users = getUsers();
  users.push(user);
  writeArray(USERS_KEY, users);
}

/**
 * Updates an existing user in localStorage by matching id.
 * @param {Object} updatedUser - The user object with updated fields.
 * @param {string} updatedUser.id - UUID of the user to update.
 */
export function updateUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    writeArray(USERS_KEY, users);
  }
}

/**
 * Deletes a user from localStorage by id.
 * @param {string} id - UUID of the user to delete.
 */
export function deleteUser(id) {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  writeArray(USERS_KEY, filtered);
}

// ─── Session ──────────────────────────────────────────────────────────────────

/**
 * Retrieves the current session from localStorage.
 * @returns {Object|null} The session object or null if not set / on error.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Saves a session object to localStorage.
 * @param {Object} session - The session object.
 * @param {string} session.userId - ID of the logged-in user.
 * @param {string} session.username - Username.
 * @param {string} session.displayName - Display name.
 * @param {string} session.role - "admin" or "user".
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Clears the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}
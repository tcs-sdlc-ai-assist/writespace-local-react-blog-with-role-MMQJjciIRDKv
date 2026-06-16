import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/Navbar.jsx';
import UserRow from '../components/UserRow.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getUsers, addUser, deleteUser } from '../utils/storage.js';

/**
 * Admin user management page component.
 * Displays all users in a responsive list with the ability to create and delete users.
 * Hard-coded admin account is included in the display but cannot be deleted.
 * Currently logged-in user cannot delete themselves.
 * Protected by ProtectedRoute with adminOnly flag.
 * @returns {JSX.Element}
 */
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const currentUser = getCurrentUser();

  /**
   * Loads all users from localStorage and prepends the hard-coded admin account.
   */
  function loadUsers() {
    const storedUsers = getUsers();
    const hardCodedAdmin = {
      id: 'admin',
      displayName: 'Admin',
      username: 'admin',
      role: 'admin',
      createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    };
    setUsers([hardCodedAdmin, ...storedUsers]);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Handles form submission for creating a new user.
   * @param {React.FormEvent} e - The form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    // Check against hard-coded admin username
    if (trimmedUsername === 'admin') {
      setError('Username already exists.');
      return;
    }

    // Check against existing localStorage users
    const existingUsers = getUsers();
    const usernameExists = existingUsers.some((u) => u.username === trimmedUsername);

    if (usernameExists) {
      setError('Username already exists.');
      return;
    }

    const newUser = {
      id: uuidv4(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${trimmedDisplayName}" created successfully.`);

    loadUsers();
  }

  /**
   * Handles user deletion with confirmation dialog.
   * @param {string} userId - The ID of the user to delete.
   */
  function handleDelete(userId) {
    const userToDelete = users.find((u) => u.id === userId);

    if (!userToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userToDelete.displayName}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    deleteUser(userId);
    setSuccess(`User "${userToDelete.displayName}" has been deleted.`);
    setError('');

    loadUsers();
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            User Management
          </h1>
          <p className="text-sm text-neutral-600">
            Create, view, and manage platform users.
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 mb-8 animate-fade-in">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Create New User
          </h2>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-danger-50 text-danger-700 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-success-50 text-success-700 text-sm font-medium animate-fade-in">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">
              All Users
            </h2>
            <span className="text-sm text-neutral-500">
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </span>
          </div>

          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-card">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-5">
                <svg
                  className="w-8 h-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No users found
              </h3>
              <p className="text-neutral-500 text-sm max-w-md mx-auto">
                Create a new user using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;
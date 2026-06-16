import PropTypes from 'prop-types';
import { getAvatar } from './Avatar.jsx';

/**
 * Formats an ISO date string into a human-readable format.
 * @param {string} dateString - ISO date string.
 * @returns {string} Formatted date string.
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * User table row/card component for admin user management.
 * Displays user avatar, display name, username, role badge, creation date,
 * and a delete button. Delete is disabled for the hard-coded admin and the
 * currently logged-in user.
 * @param {Object} props
 * @param {Object} props.user - The user object to display.
 * @param {string} props.user.id - UUID of the user.
 * @param {string} props.user.displayName - Display name of the user.
 * @param {string} props.user.username - Username of the user.
 * @param {string} props.user.role - Role of the user ("admin" or "user").
 * @param {string} props.user.createdAt - ISO date string of account creation.
 * @param {Object|null} [props.currentUser] - The current session user object.
 * @param {string} [props.currentUser.userId] - Current user's ID.
 * @param {Function} props.onDelete - Callback invoked with user id when delete is clicked.
 * @returns {JSX.Element}
 */
function UserRow({ user, currentUser, onDelete }) {
  const isHardCodedAdmin = user.id === 'admin';
  const isCurrentUser =
    currentUser && currentUser.userId === user.id;
  const canDelete = !isHardCodedAdmin && !isCurrentUser;

  const isAdmin = user.role === 'admin';

  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 p-5 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-4">
        {getAvatar(user.role)}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-900">
            {user.displayName}
          </span>
          <span className="text-xs text-neutral-500">@{user.username}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isAdmin
              ? 'bg-violet-100 text-violet-700'
              : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {user.role}
        </span>

        <span className="text-xs text-neutral-500 hidden sm:inline">
          {formatDate(user.createdAt)}
        </span>

        {canDelete ? (
          <button
            onClick={() => onDelete(user.id)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-danger-600 hover:bg-danger-50 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            aria-label={`Delete user: ${user.displayName}`}
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        ) : (
          <span className="inline-flex items-center justify-center w-8 h-8" />
        )}
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;
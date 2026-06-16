import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar.jsx';

/**
 * Truncates a string to the specified maximum length, appending ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length before truncation.
 * @returns {string} The truncated text.
 */
function truncate(text, maxLength = 150) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  return text.slice(0, maxLength).trimEnd() + '…';
}

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
 * Determines the author role based on authorId.
 * @param {string} authorId - The author's user ID.
 * @returns {string} "admin" or "user".
 */
function getAuthorRole(authorId) {
  return authorId === 'admin' ? 'admin' : 'user';
}

/**
 * Reusable blog post card component for the blog list grid.
 * Displays post title, content excerpt, creation date, author name with avatar,
 * and role-based accent border. Shows edit icon/link if current user is admin or post owner.
 * Links to ReadBlog page on click.
 * @param {Object} props
 * @param {Object} props.post - The blog post object.
 * @param {string} props.post.id - UUID of the post.
 * @param {string} props.post.title - Title of the post.
 * @param {string} props.post.content - Content of the post.
 * @param {string} props.post.createdAt - ISO date string.
 * @param {string} props.post.authorId - ID of the author.
 * @param {string} props.post.authorName - Display name of the author.
 * @param {Object|null} [props.currentUser] - The current session user object.
 * @param {string} [props.currentUser.userId] - Current user's ID.
 * @param {string} [props.currentUser.role] - Current user's role.
 * @returns {JSX.Element}
 */
function BlogCard({ post, currentUser }) {
  const authorRole = getAuthorRole(post.authorId);
  const isAdminAuthor = authorRole === 'admin';
  const borderClass = isAdminAuthor
    ? 'border-l-4 border-l-violet-400'
    : 'border-l-4 border-l-indigo-400';

  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  return (
    <div
      className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden ${borderClass} animate-fade-in`}
    >
      <Link
        to={`/blogs/${post.id}`}
        className="block p-5 pb-3 hover:bg-neutral-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
          {truncate(post.content, 150)}
        </p>
      </Link>
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getAvatar(authorRole)}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-neutral-700">
              {post.authorName}
            </span>
            <span className="text-xs text-neutral-500">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        {canEdit && (
          <Link
            to={`/blogs/${post.id}/edit`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={`Edit post: ${post.title}`}
            onClick={(e) => e.stopPropagation()}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }),
};

export default BlogCard;
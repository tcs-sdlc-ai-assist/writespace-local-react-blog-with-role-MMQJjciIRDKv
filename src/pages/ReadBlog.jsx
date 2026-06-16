import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, deletePost } from '../utils/storage.js';

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
      month: 'long',
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
 * Single blog post reading page.
 * Displays full post content, author info with avatar, creation date.
 * Shows edit and delete buttons for admin or post owner.
 * Handles missing/invalid post ID with a not-found message.
 * @returns {JSX.Element}
 */
function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);

    if (!found) {
      setNotFound(true);
      return;
    }

    setPost(found);
  }, [id]);

  /**
   * Handles post deletion with confirmation dialog.
   * Removes post from localStorage and redirects to /blogs.
   */
  function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    deletePost(post.id);
    navigate('/blogs', { replace: true });
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center bg-white rounded-xl shadow-card p-8 max-w-md w-full animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger-50 text-danger-600 mb-5">
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
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Post not found
            </h2>
            <p className="text-neutral-500 text-sm mb-6">
              The post you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Back to Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-neutral-500 text-sm animate-fade-in">Loading...</p>
        </main>
      </div>
    );
  }

  const authorRole = getAuthorRole(post.authorId);
  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 animate-fade-in">
          <div className="mb-6">
            <Link
              to="/blogs"
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blogs
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              {getAvatar(authorRole)}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-700">
                  {post.authorName}
                </span>
                <span className="text-xs text-neutral-500">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/blogs/${post.id}/edit`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`Edit post: ${post.title}`}
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
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
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-danger-700 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
                  aria-label={`Delete post: ${post.title}`}
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
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
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-700 text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReadBlog;
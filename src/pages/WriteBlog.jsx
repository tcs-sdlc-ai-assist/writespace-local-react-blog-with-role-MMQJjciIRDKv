import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/Navbar.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, addPost, updatePost } from '../utils/storage.js';

/**
 * Blog post creation and editing form page.
 * At '/blogs/new' for new posts, '/blogs/:id/edit' for editing.
 * Title input and content textarea with character counter.
 * Validates required fields. Create mode generates UUID via uuid library
 * and saves post to localStorage. Edit mode pre-fills form, validates
 * ownership (user can edit own, admin can edit any), and updates post.
 * Cancel button navigates back. Redirects to blog list on save.
 * @returns {JSX.Element}
 */
function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  const MAX_TITLE_LENGTH = 150;
  const MAX_CONTENT_LENGTH = 5000;

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    try {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setError('Post not found.');
        setLoading(false);
        return;
      }

      const canEdit =
        currentUser &&
        (currentUser.role === 'admin' || currentUser.userId === post.authorId);

      if (!canEdit) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    } catch {
      setError('Failed to load post.');
      setLoading(false);
    }
  }, [id, isEditMode, currentUser, navigate]);

  /**
   * Handles form submission for creating or updating a blog post.
   * @param {React.FormEvent} e - The form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required.');
      return;
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setError(`Title must be ${MAX_TITLE_LENGTH} characters or less.`);
      return;
    }

    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      setError(`Content must be ${MAX_CONTENT_LENGTH} characters or less.`);
      return;
    }

    if (isEditMode) {
      const posts = getPosts();
      const existingPost = posts.find((p) => p.id === id);

      if (!existingPost) {
        setError('Post not found.');
        return;
      }

      const canEdit =
        currentUser &&
        (currentUser.role === 'admin' || currentUser.userId === existingPost.authorId);

      if (!canEdit) {
        setError('You do not have permission to edit this post.');
        return;
      }

      updatePost({
        ...existingPost,
        title: trimmedTitle,
        content: trimmedContent,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newPost = {
        id: uuidv4(),
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        authorId: currentUser.userId,
        authorName: currentUser.displayName,
      };

      addPost(newPost);
    }

    navigate('/blogs', { replace: true });
  }

  /**
   * Handles cancel button click by navigating back.
   */
  function handleCancel() {
    navigate(-1);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-neutral-500 text-sm animate-fade-in">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
            {isEditMode ? 'Edit Post' : 'Write a New Post'}
          </h1>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-danger-50 text-danger-700 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                maxLength={MAX_TITLE_LENGTH}
              />
              <div className="mt-1 text-right">
                <span className={`text-xs ${title.length > MAX_TITLE_LENGTH ? 'text-danger-600' : 'text-neutral-500'}`}>
                  {title.length}/{MAX_TITLE_LENGTH}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here..."
                rows={12}
                className="w-full px-4 py-2.5 text-sm text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y"
                maxLength={MAX_CONTENT_LENGTH}
              />
              <div className="mt-1 text-right">
                <span className={`text-xs ${content.length > MAX_CONTENT_LENGTH ? 'text-danger-600' : 'text-neutral-500'}`}>
                  {content.length}/{MAX_CONTENT_LENGTH}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {isEditMode ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default WriteBlog;
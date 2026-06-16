import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getPosts } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';

/**
 * Authenticated blog list page.
 * Displays all posts from localStorage in a responsive grid, sorted newest first.
 * Shows an empty state with a CTA to write the first post if no posts exist.
 * @returns {JSX.Element}
 */
function Home() {
  const [posts, setPosts] = useState([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = allPosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            All Posts
          </h1>
          <Link
            to="/blogs/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Write Post
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} currentUser={currentUser} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-card animate-fade-in">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              No posts yet
            </h2>
            <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
              Be the first to share your story! Click the button below to create your first blog post.
            </p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
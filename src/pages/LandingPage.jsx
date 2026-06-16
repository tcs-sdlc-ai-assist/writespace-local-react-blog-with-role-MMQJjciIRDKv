import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getPosts } from '../utils/storage.js';

/**
 * Public landing page component.
 * Displays hero section, features section, latest posts preview, and footer.
 * @returns {JSX.Element}
 */
function LandingPage() {
  const allPosts = getPosts();
  const latestPosts = allPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-700/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            WriteSpace
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Your creative writing space. Share your thoughts, stories, and ideas with the world in a clean, distraction-free environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 text-base font-semibold text-primary-700 bg-white rounded-lg shadow-soft hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 text-base font-semibold text-white border-2 border-white/80 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Why WriteSpace?
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Everything you need to write, share, and manage your content in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-50 rounded-xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary-100 text-primary-600 mb-5">
                <svg
                  className="w-7 h-7"
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
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Write Freely
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Create and publish blog posts in a clean, distraction-free writing environment designed for focus.
              </p>
            </div>

            <div className="bg-secondary-50 rounded-xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-secondary-100 text-secondary-600 mb-5">
                <svg
                  className="w-7 h-7"
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
                Role-Based Access
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Admins manage users and all content, while writers focus on creating and editing their own posts.
              </p>
            </div>

            <div className="bg-success-50 rounded-xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-success-100 text-success-600 mb-5">
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Local Storage
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Your data stays in your browser. No servers, no accounts to worry about — just start writing instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Latest Posts
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Check out the most recent stories from our community.
            </p>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} currentUser={null} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-card animate-fade-in">
              <p className="text-neutral-500 text-lg mb-4">
                No posts yet. Be the first to share your story!
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Start Writing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                WriteSpace
              </span>
              <p className="text-sm text-neutral-500 mt-1">
                Your creative writing space.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
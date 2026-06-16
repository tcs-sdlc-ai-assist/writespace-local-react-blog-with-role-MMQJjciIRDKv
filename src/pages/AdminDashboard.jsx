import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getPosts, getUsers } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';

/**
 * Admin dashboard page component.
 * Displays statistics overview, quick actions, and recent posts.
 * Protected by ProtectedRoute with adminOnly flag.
 * @returns {JSX.Element}
 */
function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = allPosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);

    const allUsers = getUsers();
    setUsers(allUsers);
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const regularUserCount = users.filter((u) => u.role === 'user').length;
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gradient Banner */}
        <div className="relative overflow-hidden bg-gradient-hero rounded-xl p-6 sm:p-8 mb-8 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-700/90" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, {currentUser ? currentUser.displayName : 'Admin'}!
            </h1>
            <p className="text-sm sm:text-base text-white/80">
              Here&apos;s an overview of your WriteSpace platform.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            color="primary"
            icon={
              <svg
                className="w-6 h-6"
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
            }
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            color="secondary"
            icon={
              <svg
                className="w-6 h-6"
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
            }
          />
          <StatCard
            title="Admins"
            value={adminCount}
            color="warning"
            icon={
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
          />
          <StatCard
            title="Regular Users"
            value={regularUserCount}
            color="success"
            icon={
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/blogs/new"
              className="flex items-center space-x-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 p-5"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-neutral-900">
                  Write New Post
                </span>
                <span className="text-xs text-neutral-500">
                  Create and publish a new blog post
                </span>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center space-x-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 p-5"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary-100 text-secondary-600">
                <svg
                  className="w-6 h-6"
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
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-neutral-900">
                  Manage Users
                </span>
                <span className="text-xs text-neutral-500">
                  View and manage platform users
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">
              Recent Posts
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} currentUser={currentUser} />
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No posts yet
              </h3>
              <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
                Get started by creating the first blog post on the platform.
              </p>
              <Link
                to="/blogs/new"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
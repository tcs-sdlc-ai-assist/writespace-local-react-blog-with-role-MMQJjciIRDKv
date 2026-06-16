import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, isAdmin } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

/**
 * Authenticated navigation bar component.
 * Displays brand, role-based navigation links, user avatar, display name, and logout button.
 * Includes responsive mobile menu support.
 * @returns {JSX.Element}
 */
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const admin = isAdmin();

  const displayName = user ? user.displayName : '';
  const role = user ? user.role : 'user';

  /**
   * Handles logout by clearing session and redirecting to landing page.
   */
  function handleLogout() {
    logout();
    navigate('/');
  }

  /**
   * Toggles the mobile menu open/closed state.
   */
  function toggleMobileMenu() {
    setMobileMenuOpen((prev) => !prev);
  }

  /**
   * Closes the mobile menu.
   */
  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <nav className="bg-white shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              to={admin ? '/admin' : '/blogs'}
              className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              WriteSpace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/blogs"
              className="px-3 py-2 text-sm font-medium text-neutral-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/blogs/new"
              className="px-3 py-2 text-sm font-medium text-neutral-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              Write
            </Link>
            {admin && (
              <>
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm font-medium text-neutral-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className="px-3 py-2 text-sm font-medium text-neutral-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  Users
                </Link>
              </>
            )}
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {getAvatar(role)}
            <span className="text-sm font-medium text-neutral-700">
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-danger-700 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slide-down border-t border-neutral-200">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <Link
              to="/blogs"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-sm font-medium text-neutral-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/blogs/new"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-sm font-medium text-neutral-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              Write
            </Link>
            {admin && (
              <>
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm font-medium text-neutral-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm font-medium text-neutral-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  Users
                </Link>
              </>
            )}
          </div>
          <div className="px-4 pb-4 border-t border-neutral-200 pt-3">
            <div className="flex items-center space-x-3 mb-3">
              {getAvatar(role)}
              <span className="text-sm font-medium text-neutral-700">
                {displayName}
              </span>
            </div>
            <button
              onClick={() => {
                closeMobileMenu();
                handleLogout();
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-danger-700 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
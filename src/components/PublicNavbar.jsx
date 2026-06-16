import { Link } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, isAdmin } from '../utils/auth.js';

/**
 * Public navigation bar component for guest/public pages.
 * Displays brand on the left and auth-related links on the right.
 * If user is authenticated, shows role-appropriate navigation link.
 * @returns {JSX.Element}
 */
function PublicNavbar() {
  const authenticated = isAuthenticated();
  const user = authenticated ? getCurrentUser() : null;
  const admin = authenticated ? isAdmin() : false;

  return (
    <nav className="bg-white shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              WriteSpace
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {authenticated && user ? (
              admin ? (
                <Link
                  to="/admin"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/blogs"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  My Blogs
                </Link>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
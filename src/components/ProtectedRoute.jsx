import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAuthenticated, isAdmin } from '../utils/auth.js';

/**
 * Route guard component for role-based access control.
 * Checks authentication and optionally restricts to admin users.
 * @param {Object} props
 * @param {boolean} [props.adminOnly=false] - Whether the route requires admin role.
 * @param {React.ReactNode} [props.children] - Optional children to render instead of Outlet.
 * @returns {JSX.Element} The children/Outlet if authorized, or a Navigate redirect.
 */
function ProtectedRoute({ adminOnly = false, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/blogs" replace />;
  }

  return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
  adminOnly: PropTypes.bool,
  children: PropTypes.node,
};

export default ProtectedRoute;
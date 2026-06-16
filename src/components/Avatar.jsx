import PropTypes from 'prop-types';

/**
 * Returns role-distinct avatar JSX element.
 * @param {string} role - The user role ("admin" or "user").
 * @returns {JSX.Element} A styled avatar element with role-appropriate emoji and colors.
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 text-sm font-semibold">
        👑
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold">
      📖
    </span>
  );
}

/**
 * Avatar React component that renders a role-based avatar.
 * @param {Object} props
 * @param {string} props.role - The user role ("admin" or "user").
 * @returns {JSX.Element}
 */
function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.string.isRequired,
};

export default Avatar;
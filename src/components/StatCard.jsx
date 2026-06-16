import PropTypes from 'prop-types';

/**
 * Admin dashboard statistics display card.
 * Displays a label, numeric value, and icon with color-coded styling.
 * @param {Object} props
 * @param {string} props.title - The label/title for the statistic.
 * @param {number|string} props.value - The numeric value to display.
 * @param {React.ReactNode} props.icon - The icon element to render.
 * @param {string} [props.color="primary"] - Color theme key ("primary", "secondary", "success", "warning", "danger").
 * @returns {JSX.Element}
 */
function StatCard({ title, value, icon, color = 'primary' }) {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      icon: 'bg-primary-100 text-primary-600',
    },
    secondary: {
      bg: 'bg-secondary-50',
      text: 'text-secondary-600',
      icon: 'bg-secondary-100 text-secondary-600',
    },
    success: {
      bg: 'bg-success-50',
      text: 'text-success-600',
      icon: 'bg-success-100 text-success-600',
    },
    warning: {
      bg: 'bg-warning-50',
      text: 'text-warning-600',
      icon: 'bg-warning-100 text-warning-600',
    },
    danger: {
      bg: 'bg-danger-50',
      text: 'text-danger-600',
      icon: 'bg-danger-100 text-danger-600',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`${colors.bg} rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 p-5 animate-fade-in`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-600">{title}</span>
          <span className={`text-2xl font-bold mt-1 ${colors.text}`}>
            {value}
          </span>
        </div>
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colors.icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger']),
};

export default StatCard;
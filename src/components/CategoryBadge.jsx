import PropTypes from 'prop-types';

// Category → CSS class mapping drives the coloured pill colours in index.css.
const CATEGORY_CLASS = {
  'Learning': 'badge-learning',
  'Code': 'badge-code',
  'General': 'badge-general',
  'Others': 'badge-others',
};

/**
 * CategoryBadge — renders a small coloured pill showing the prompt category.
 * @param {object} props
 * @param {string} props.category — one of the six supported category strings
 */
const CategoryBadge = ({ category }) => {
  const cls = CATEGORY_CLASS[category] || 'badge-general';
  return <span className={`category-badge ${cls}`}>{category}</span>;
};

CategoryBadge.propTypes = {
  category: PropTypes.oneOf([
    'Learning',
    'Code',
    'General',
    'Others',
  ]).isRequired,
};

export default CategoryBadge;

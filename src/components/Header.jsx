import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = ['Learning', 'Code', 'General', 'Others'];

/**
 * Header — displays the app name, category filter tabs, an "Add Prompt"
 * button, and a light/dark theme toggle.
 * @param {object}   props
 * @param {string}   props.activeCategory     — currently selected category ('' = All)
 * @param {Function} props.onFilterChange     — called with the new category string
 * @param {Function} props.onAddPromptClick   — called when the user wants to open the form
 */
const Header = ({ activeCategory, onFilterChange, onAddPromptClick }) => {
  const { theme, toggleTheme } = useTheme();

  const handleFilterChange = (cat) => onFilterChange(cat);

  return (
    <header className="app-header">
      <div className="app-header__top">
        <h1 className="app-header__logo">📋 Prompt Manager</h1>
        <div className="app-header__actions">
          <button className="btn-primary" onClick={onAddPromptClick}>
            + Add Prompt
          </button>
          <button
            className="btn-theme"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      <nav className="category-tabs" aria-label="Category filter">
        <button
          className={`category-tab ${activeCategory === '' ? 'category-tab--active' : ''}`}
          onClick={() => handleFilterChange('')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'category-tab--active' : ''}`}
            onClick={() => handleFilterChange(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>
    </header>
  );
};

Header.propTypes = {
  activeCategory: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onAddPromptClick: PropTypes.func.isRequired,
};

export default Header;

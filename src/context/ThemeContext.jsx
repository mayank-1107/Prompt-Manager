/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// ThemeContext — provides a simple light/dark mode toggle so components can
// read the current theme and call toggleTheme without prop drilling.
// ---------------------------------------------------------------------------

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

/**
 * ThemeProvider — wraps the app and supplies ThemeContext value.
 * Uses useEffect to sync the active theme class onto document.body so the
 * page background colour updates even outside the React root.
 * @param {object} props
 * @param {React.ReactNode} props.children — child components
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // useEffect: keep document.body in sync with the active theme class.
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-root theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/** Convenience hook so consumers don't import ThemeContext directly. */
export const useTheme = () => useContext(ThemeContext);

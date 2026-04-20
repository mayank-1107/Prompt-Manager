import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import PromptCard from './PromptCard';

const PromptGrid = ({ activeCategory }) => {
  const originalPrompts = useSelector((state) => state.prompts?.prompts || []);
  const enhancedPrompts = useSelector((state) => state.prompts?.enhancedPrompts || []);

  const allPrompts = [
    ...originalPrompts.map(p => ({ ...p, isEnhanced: false })),
    ...enhancedPrompts.map(ep => ({
      id: ep.id,
      title: ep.originalPrompt.substring(0, 50),
      content: ep.enhancedPrompt,
      category: ep.category || 'Others',
      isFavorite: ep.isFavorite,
      isEnhanced: true,
    }))
  ];

  const filtered = activeCategory === '' 
    ? allPrompts 
    : allPrompts.filter((p) => p.category === activeCategory);

  if (filtered.length === 0) {
    return (
      <p className="empty-state">
        No prompts found{activeCategory ? ` for "${activeCategory}"` : ''}.
      </p>
    );
  }

  return (
    <section className="prompt-grid">
      {filtered.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </section>
  );
};

PromptGrid.propTypes = {
  activeCategory: PropTypes.string.isRequired,
};

export default PromptGrid;

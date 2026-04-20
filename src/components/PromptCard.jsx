import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleFavorite, deletePrompt, toggleEnhancedFavorite, deleteEnhancedPrompt } from '../store/promptsSlice';
import CategoryBadge from './CategoryBadge';

/**
 * PromptCard — displays a single prompt with its title, truncated content,
 * category badge, a favorite toggle button, a copy button, and a delete button.
 * @param {object}  props
 * @param {object}  props.prompt       — the prompt data object
 * @param {string|number}  props.prompt.id
 * @param {string}  props.prompt.title
 * @param {string}  props.prompt.content
 * @param {string}  props.prompt.category
 * @param {boolean} props.prompt.isFavorite
 * @param {boolean} props.prompt.isEnhanced — whether this is an enhanced/generated prompt
 */
const PromptCard = ({ prompt }) => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);

  const handleToggleFavorite = () => {
    if (prompt.isEnhanced) {
      dispatch(toggleEnhancedFavorite(prompt.id));
    } else {
      dispatch(toggleFavorite(prompt.id));
    }
  };

  const handleDeletePrompt = () => {
    if (prompt.isEnhanced) {
      dispatch(deleteEnhancedPrompt(prompt.id));
    } else {
      dispatch(deletePrompt(prompt.id));
    }
  };
  
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  return (
    <article className="prompt-card">
      <header className="prompt-card__header">
        <h3 className="prompt-card__title">{prompt.title}</h3>
        <button
          className={`btn-favorite ${prompt.isFavorite ? 'btn-favorite--active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {prompt.isFavorite ? '★' : '☆'}
        </button>
      </header>

      <p className="prompt-card__content">{prompt.content}</p>

      <footer className="prompt-card__footer">
        <CategoryBadge category={prompt.category} />
        <div className="prompt-card__actions">
          <button
            className="btn-copy"
            onClick={handleCopyPrompt}
            aria-label="Copy prompt"
            title="Copy prompt to clipboard"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button
            className="btn-delete"
            onClick={handleDeletePrompt}
            aria-label="Delete prompt"
            title="Delete prompt"
          >
            Delete
          </button>
        </div>
      </footer>
    </article>
  );
};

PromptCard.propTypes = {
  prompt: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
    isEnhanced: PropTypes.bool,
  }).isRequired,
};

export default PromptCard;

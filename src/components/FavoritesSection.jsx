import { useSelector, useDispatch } from 'react-redux';
import { deleteEnhancedPrompt, toggleEnhancedFavorite } from '../store/promptsSlice';
import PromptCard from './PromptCard';

const FavoritesSection = () => {
  const dispatch = useDispatch();
  
  const originalFavorites = useSelector((state) =>
    state.prompts?.prompts?.filter((p) => p.isFavorite) || []
  );
  
  const enhancedFavorites = useSelector((state) =>
    state.prompts?.enhancedPrompts?.filter((p) => p.isFavorite) || []
  );

  const allFavorites = [...originalFavorites, ...enhancedFavorites];

  const handleDeleteEnhanced = (id) => {
    dispatch(deleteEnhancedPrompt(id));
  };

  const handleToggleFavorite = (id) => {
    dispatch(toggleEnhancedFavorite(id));
  };

  return (
    <section className="favorites-section">
      <h2 className="favorites-section__heading">⭐ Favorites</h2>
      {allFavorites.length === 0 ? (
        <p className="empty-state">
          You haven&apos;t favorited any prompts yet. Click the 🤍 button on a generated prompt to add it here.
        </p>
      ) : (
        <div className="favorites-grid">
          {originalFavorites.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
          
          {/* AI-Generated/Enhanced Prompts */}
          {enhancedFavorites.map((prompt) => (
            <div key={prompt.id} className="enhanced-prompt-card">
              <div className="prompt-header">
                <h3 className="prompt-title">
                  {prompt.originalPrompt.substring(0, 50)}...
                </h3>
                {prompt.category && (
                  <span className="prompt-category">{prompt.category}</span>
                )}
              </div>
              
              <p className="prompt-content">{prompt.enhancedPrompt}</p>
              
              <div className="prompt-actions">
                <button
                  type="button"
                  className="btn-copy"
                  onClick={() => navigator.clipboard.writeText(prompt.enhancedPrompt)}
                  title="Copy to clipboard"
                >
                  📋 Copy
                </button>
                <button
                  type="button"
                  className="btn-unfav"
                  onClick={() => handleToggleFavorite(prompt.id)}
                  title="Remove from favorites"
                >
                  ❤️ Remove
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleDeleteEnhanced(prompt.id)}
                  title="Delete prompt"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoritesSection;

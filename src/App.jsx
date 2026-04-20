import { useState } from 'react';
import Header from './components/Header';
import PromptGrid from './components/PromptGrid';
import FavoritesSection from './components/FavoritesSection';
import PromptForm from './components/PromptForm';
import ChatbotAssistant from './components/ChatbotAssistant';

/**
 * App — root component. Owns the active category filter state and the
 * form-open state, then composes Header, PromptGrid, FavoritesSection, and
 * PromptForm together.
 */
const App = () => {
  // useState: active category filter ('' means All)
  const [activeCategory, setActiveCategory] = useState('');

  // useState: controls whether the Add Prompt modal is shown
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFilterChange = (category) => setActiveCategory(category);
  const handleAddPromptClick = () => setIsFormOpen(true);
  const handleFormClose = () => setIsFormOpen(false);

  return (
    <div className="app-layout">
      <Header
        activeCategory={activeCategory}
        onFilterChange={handleFilterChange}
        onAddPromptClick={handleAddPromptClick}
      />

      <main className="app-main">
        <ChatbotAssistant />
        <PromptGrid activeCategory={activeCategory} />
        <FavoritesSection />
      </main>

      {isFormOpen && <PromptForm onClose={handleFormClose} />}
    </div>
  );
};

export default App;

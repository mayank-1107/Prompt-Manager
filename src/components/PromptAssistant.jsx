import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPrompt } from '../store/promptsSlice';
import { getNextPromptId } from '../utils/promptId';

const CATEGORIES = ['JSX', 'State & Props', 'Components', 'Redux', 'Hooks', 'General'];

const buildProfessionalPrompt = (basicPrompt) => {
  const trimmed = basicPrompt.trim();
  const statement = trimmed.endsWith('.') ? trimmed : `${trimmed}.`;

  return [
    'Role: You are a senior, detail-oriented assistant.',
    `Task: ${statement}`,
    'Context: Respond in a professional, polished tone and assume a broad audience unless specified.',
    'Requirements:',
    '- Provide a concise, structured response.',
    '- Include steps, examples, or checklists when useful.',
    '- Call out assumptions or risks.',
    'Output format:',
    '- Title',
    '- Summary',
    '- Main response',
    '- Next actions',
  ].join('\n');
};

const titleFromPrompt = (basicPrompt) => {
  const words = basicPrompt.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'Professional Prompt';
  const title = words.slice(0, 5).join(' ');
  return `${title.charAt(0).toUpperCase()}${title.slice(1)}`;
};

const PromptAssistant = () => {
  const dispatch = useDispatch();
  const [basicPrompt, setBasicPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleGenerate = (event) => {
    event.preventDefault();
    if (!basicPrompt.trim()) return;

    const professionalPrompt = buildProfessionalPrompt(basicPrompt);
    setGeneratedPrompt(professionalPrompt);
    setTitle((current) => (current.trim() ? current : titleFromPrompt(basicPrompt)));
    setMessages((current) => [
      ...current,
      { id: getNextPromptId(), role: 'user', content: basicPrompt.trim() },
      { id: getNextPromptId(), role: 'assistant', content: professionalPrompt },
    ]);
  };

  const handleAddPrompt = () => {
    if (!title.trim() || !generatedPrompt.trim()) return;

    dispatch(
      addPrompt({
        id: getNextPromptId(),
        title: title.trim(),
        content: generatedPrompt.trim(),
        category,
        isFavorite,
      })
    );

    setBasicPrompt('');
    setGeneratedPrompt('');
    setTitle('');
    setCategory(CATEGORIES[0]);
    setIsFavorite(false);
  };

  return (
    <section className="assistant-section">
      <header className="assistant-section__header">
        <div>
          <h2 className="assistant-section__title">🤖 Prompt Assistant</h2>
          <p className="assistant-section__subtitle">
            Turn a basic idea into a professional prompt and save it to your library.
          </p>
        </div>
      </header>

      <div className="assistant-card">
        <div className="assistant-chat" aria-live="polite">
          {messages.length === 0 ? (
            <p className="assistant-empty">Start by describing a basic prompt below.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`assistant-message assistant-message--${message.role}`}
              >
                <span className="assistant-message__label">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </span>
                <p className="assistant-message__content">{message.content}</p>
              </div>
            ))
          )}
        </div>

        <form className="assistant-form" onSubmit={handleGenerate}>
          <label className="form-label" htmlFor="assistant-basic">
            Basic prompt
            <textarea
              id="assistant-basic"
              className="form-input form-textarea"
              rows={3}
              value={basicPrompt}
              onChange={(event) => setBasicPrompt(event.target.value)}
              placeholder="Describe what you want the prompt to achieve..."
              required
            />
          </label>

          <div className="assistant-controls">
            <label className="form-label" htmlFor="assistant-category">
              Category
              <select
                id="assistant-category"
                className="form-input form-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label className="assistant-toggle">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(event) => setIsFavorite(event.target.checked)}
              />
              Add to favorites
            </label>
          </div>

          <button type="submit" className="btn-primary">
            Generate professional prompt
          </button>
        </form>

        <div className="assistant-output">
          <label className="form-label" htmlFor="assistant-title">
            Prompt title
            <input
              id="assistant-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add a short, descriptive title"
            />
          </label>

          <label className="form-label" htmlFor="assistant-generated">
            Professional prompt
            <textarea
              id="assistant-generated"
              className="form-input form-textarea"
              rows={5}
              value={generatedPrompt}
              onChange={(event) => setGeneratedPrompt(event.target.value)}
              placeholder="Generated prompt will appear here..."
            />
          </label>

          <button
            type="button"
            className="btn-primary"
            onClick={handleAddPrompt}
            disabled={!title.trim() || !generatedPrompt.trim()}
          >
            Add to library
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromptAssistant;

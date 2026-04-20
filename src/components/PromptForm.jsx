import { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addPrompt } from '../store/promptsSlice';
import { getNextPromptId } from '../utils/promptId';

const CATEGORIES = ['Learning', 'Code', 'General', 'Others'];

// ---------------------------------------------------------------------------
// useReducer — manages the three form fields as a single state object so
// students can see how useReducer replaces multiple useState calls.
// ---------------------------------------------------------------------------
const formInitialState = {
  title: '',
  content: '',
  category: CATEGORIES[0],
};

/** Handles CHANGE_FIELD and RESET actions for the form state. */
const formReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return formInitialState;
    default:
      return state;
  }
};

/**
 * PromptForm — modal overlay form that lets the user add a new prompt.
 * Manages form field state with useReducer and dispatches addPrompt on submit.
 * @param {object}   props
 * @param {Function} props.onClose — callback to close the modal
 */
const PromptForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formState, formDispatch] = useReducer(formReducer, formInitialState);

  const { title, content, category } = formState;

  const handleFieldChange = (field) => (e) =>
    formDispatch({ type: 'CHANGE_FIELD', field, value: e.target.value });

  const handleAddPrompt = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    dispatch(
      addPrompt({
        id: getNextPromptId(),
        title: title.trim(),
        content: content.trim(),
        category,
        isFavorite: false,
      })
    );

    formDispatch({ type: 'RESET' });
    onClose();
  };

  /** Close the modal when the user clicks the backdrop. */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="modal">
        <header className="modal__header">
          <h2 id="form-title" className="modal__title">Add New Prompt</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close form">✕</button>
        </header>

        <form onSubmit={handleAddPrompt} className="prompt-form">
          <label htmlFor="prompt-title" className="form-label">
            Title
            <input
              id="prompt-title"
              type="text"
              className="form-input"
              value={title}
              onChange={handleFieldChange('title')}
              placeholder="Short descriptive title"
              required
            />
          </label>

          <label htmlFor="prompt-content" className="form-label">
            Prompt Content
            <textarea
              id="prompt-content"
              className="form-input form-textarea"
              value={content}
              onChange={handleFieldChange('content')}
              placeholder="Write your prompt here…"
              rows={5}
              required
            />
          </label>

          <label htmlFor="prompt-category" className="form-label">
            Category
            <select
              id="prompt-category"
              className="form-input form-select"
              value={category}
              onChange={handleFieldChange('category')}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PromptForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PromptForm;

# 🎯 Prompt Manager - Team Project Documentation

## 📋 Project Overview

**Prompt Manager** is a full-stack web application that helps users create, manage, and enhance AI prompts. The app features a chatbot-powered prompt enhancer (using Ollama AI), prompt organization by categories, favorites management, and persistent storage using Redux and localStorage.

---

## 👥 Team Member Assignments (4 Members)

### **Member 1: Frontend UI & Components** (Sahil)
**Responsibility:** Building all React UI components and styling

**Components:**
- `Header.jsx` - Navigation and category filtering
- `PromptCard.jsx` - Individual prompt card display
- `CategoryBadge.jsx` - Category label component
- `PromptGrid.jsx` - Grid layout for displaying prompts
- Styling and responsive design

---

### **Member 2: State Management (Redux)** (Developer 2)
**Responsibility:** Redux setup, store configuration, and global state management

**Files:**
- `store/index.js` - Redux store configuration
- `store/promptsSlice.js` - Actions and reducers
- localStorage persistence
- State synchronization across components

---

### **Member 3: Forms & User Interactions** (Developer 3)
**Responsibility:** Form handling, user input validation, and modal management

**Components:**
- `PromptForm.jsx` - Add new prompt modal
- Form validation logic
- useReducer for form state
- Modal interactions

---

### **Member 4: AI Backend & Features** (Developer 4)
**Responsibility:** AI integration, API calls, and advanced features

**Components:**
- `ChatbotAssistant.jsx` - AI prompt enhancer chatbot
- `FavoritesSection.jsx` - Favorites display
- `services/huggingfaceAPI.js` - Backend API integration
- Backend server logic

---

## 🛠️ Tech Stack

```
Frontend:
├── React 19           (UI framework)
├── Redux Toolkit      (State management)
├── React-Redux        (React-Redux bindings)
├── Axios              (HTTP client)
├── Vite               (Build tool)
└── CSS3               (Styling)

Backend:
├── Express.js         (Server framework)
├── Axios              (HTTP requests)
├── CORS               (Cross-origin handling)
├── dotenv             (Environment variables)
└── Ollama             (AI model)
```

---

## 🏗️ Architecture & Component Structure

```
src/
├── main.jsx                 (App entry point)
├── App.jsx                  (Root component)
├── index.css                (Global styles)
├── components/
│   ├── Header.jsx          (MEMBER 1)
│   ├── PromptCard.jsx      (MEMBER 1)
│   ├── CategoryBadge.jsx   (MEMBER 1)
│   ├── PromptGrid.jsx      (MEMBER 1)
│   ├── PromptForm.jsx      (MEMBER 3)
│   ├── ChatbotAssistant.jsx (MEMBER 4)
│   └── FavoritesSection.jsx (MEMBER 4)
├── store/
│   ├── index.js            (MEMBER 2)
│   └── promptsSlice.js     (MEMBER 2)
├── services/
│   └── huggingfaceAPI.js   (MEMBER 4)
├── context/
│   └── ThemeContext.jsx    (Theme management)
└── utils/
    └── promptId.js         (ID generation)
```

---

## 📚 Member 1: Frontend UI & Components (Sahil)

### **Responsibility:**
Create all UI components and ensure responsive, user-friendly interface.

### **Components Created:**

#### **1. Header.jsx**
```jsx
/**
 * Header Component
 * Purpose: Display app title, category filters, and "Add Prompt" button
 * 
 * Props:
 * - activeCategory: Currently selected category filter
 * - onFilterChange: Callback when user selects a category
 * - onAddPromptClick: Callback when user clicks "Add Prompt"
 */

import { useSelector } from 'react-redux';

const Header = ({ activeCategory, onFilterChange, onAddPromptClick }) => {
  // Read categories from Redux store
  const categories = useSelector(state => state.prompts?.categories || []);

  return (
    <header className="app-header">
      <h1>📝 Prompt Manager</h1>
      
      {/* Category Filter Buttons */}
      <div className="category-filters">
        <button 
          className={activeCategory === '' ? 'active' : ''}
          onClick={() => onFilterChange('')}
        >
          All Prompts
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={activeCategory === category ? 'active' : ''}
            onClick={() => onFilterChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Add New Prompt Button */}
      <button className="btn-primary" onClick={onAddPromptClick}>
        + Add Prompt
      </button>
    </header>
  );
};

export default Header;
```

**How It Works:**
1. Uses `useSelector` to read `categories` from Redux state
2. Displays a button for each category
3. Highlights the active category
4. Calls `onFilterChange()` when user clicks a category
5. Shows "Add Prompt" button that triggers modal

**Connection:** 
→ Used by `App.jsx` to filter prompts by category
→ Updates `activeCategory` state in parent component

---

#### **2. PromptCard.jsx**
```jsx
/**
 * PromptCard Component
 * Purpose: Display a single prompt with title, content, actions (favorite, copy, delete)
 * 
 * Props:
 * - prompt: Object containing {id, title, content, category, isFavorite, isEnhanced}
 */

import { useDispatch } from 'react-redux';
import { toggleFavorite, deletePrompt } from '../store/promptsSlice';

const PromptCard = ({ prompt }) => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);

  // Handle favorite toggle - dispatches Redux action
  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(prompt.id));
  };

  // Handle delete - dispatches Redux action
  const handleDeletePrompt = () => {
    dispatch(deletePrompt(prompt.id));
  };

  // Copy prompt to clipboard
  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="prompt-card">
      <h3>{prompt.title}</h3>
      <p>{prompt.content}</p>
      
      <footer className="prompt-card__footer">
        <CategoryBadge category={prompt.category} />
        
        <button onClick={handleToggleFavorite}>
          {prompt.isFavorite ? '★' : '☆'} Favorite
        </button>
        <button onClick={handleCopyPrompt}>
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
        <button onClick={handleDeletePrompt}>Delete</button>
      </footer>
    </article>
  );
};
```

**How It Works:**
1. Receives a prompt object as prop
2. Uses `useDispatch` to interact with Redux
3. Each button dispatches a different Redux action:
   - ⭐ Favorite → `toggleFavorite(id)`
   - 📋 Copy → Uses Clipboard API
   - 🗑️ Delete → `deletePrompt(id)`
4. Displays feedback (✓ Copied!)

**Connection:**
→ Used by `PromptGrid.jsx` to display each prompt
→ Dispatches actions to Redux state
→ Uses `CategoryBadge.jsx` component

---

#### **3. CategoryBadge.jsx**
```jsx
/**
 * CategoryBadge Component
 * Purpose: Display category label with styling
 * 
 * Props:
 * - category: Category name to display
 */

const CategoryBadge = ({ category }) => {
  const getCategoryColor = (cat) => {
    const colors = {
      'Learning': '#4CAF50',
      'Code': '#2196F3',
      'General': '#FF9800',
      'Others': '#9C27B0'
    };
    return colors[cat] || '#757575';
  };

  return (
    <span 
      className="category-badge"
      style={{ backgroundColor: getCategoryColor(category) }}
    >
      {category}
    </span>
  );
};
```

**How It Works:**
1. Takes category name as prop
2. Maps category to a color
3. Renders styled badge
4. Reusable across all prompts

---

#### **4. PromptGrid.jsx**
```jsx
/**
 * PromptGrid Component
 * Purpose: Display all prompts in a grid, filtered by category
 * 
 * Props:
 * - activeCategory: Currently selected category for filtering
 * 
 * Redux Connection:
 * - Reads: state.prompts.prompts (original prompts)
 * - Reads: state.prompts.enhancedPrompts (AI-generated prompts)
 */

import { useSelector } from 'react-redux';

const PromptGrid = ({ activeCategory }) => {
  // Read prompts from Redux
  const originalPrompts = useSelector(state => state.prompts?.prompts || []);
  const enhancedPrompts = useSelector(state => state.prompts?.enhancedPrompts || []);

  // Combine all prompts
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

  // Filter by active category
  const filtered = activeCategory === '' 
    ? allPrompts 
    : allPrompts.filter(p => p.category === activeCategory);

  return (
    <section className="prompt-grid">
      {filtered.map(prompt => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </section>
  );
};
```

**How It Works:**
1. Uses `useSelector` to read both original and enhanced prompts from Redux
2. Combines them into a single array
3. Filters by `activeCategory` received from props
4. Maps through filtered prompts and renders `PromptCard` for each
5. Auto re-renders when Redux state changes (due to useSelector)

**Connection:**
→ Receives `activeCategory` prop from `App.jsx`
→ Reads prompt data from Redux store (MEMBER 2)
→ Renders `PromptCard.jsx` components

---

## 💾 Member 2: State Management - Redux (Developer 2)

### **Responsibility:**
Manage all global state using Redux Toolkit, handle data persistence.

### **Redux Store Structure:**

#### **store/index.js**
```jsx
/**
 * Redux Store Setup
 * 
 * This file:
 * 1. Configures the Redux store
 * 2. Loads initial state from localStorage
 * 3. Auto-saves state to localStorage on every change
 */

import { configureStore } from '@reduxjs/toolkit';
import promptsReducer from './promptsSlice';

// Load state from localStorage when app starts
const loadState = () => {
  try {
    const serialised = localStorage.getItem('promptsState');
    if (!serialised) return undefined;
    return { prompts: JSON.parse(serialised) };
  } catch {
    return undefined;
  }
};

// Save state to localStorage whenever it changes
const saveState = (state) => {
  try {
    localStorage.setItem('promptsState', JSON.stringify(state.prompts));
  } catch {
    // ignore write errors
  }
};

// Create Redux store with initial state from localStorage
const store = configureStore({
  reducer: {
    prompts: promptsReducer,  // All prompt-related state
  },
  preloadedState: loadState(),  // Load saved state
});

// Subscribe to store changes and auto-save to localStorage
store.subscribe(() => saveState(store.getState()));

export default store;
```

**How It Works:**
1. `loadState()` - Reads from localStorage when app loads
2. `configureStore()` - Creates Redux store with the reducer
3. `preloadedState` - Sets initial state from localStorage
4. `store.subscribe()` - Listens to every state change
5. `saveState()` - Auto-saves new state to localStorage

**Flow:**
```
App Start → loadState() → localStorage → Redux store → User interacts
                                           ↓
                                      state changes
                                           ↓
                                      saveState() → localStorage
                                           ↓
                                      localStorage updated ✓
```

---

#### **store/promptsSlice.js**
```jsx
/**
 * Redux Slice for Prompts
 * 
 * A "slice" contains:
 * - initialState: Starting data
 * - reducers: Functions that modify state
 * - actions: Auto-generated from reducers
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Original user-created prompts
  prompts: [
    { 
      id: 1, 
      title: 'API Documentation', 
      content: 'How to write clear API docs?', 
      category: 'Learning', 
      isFavorite: false 
    },
    // ... more prompts
  ],

  // AI-generated/enhanced prompts
  enhancedPrompts: [],

  // App state
  filter: '',
  showFavoritesOnly: false,
  categories: ['Learning', 'Code', 'General', 'Others'],
};

const promptsSlice = createSlice({
  name: 'prompts',
  initialState,
  reducers: {
    // ===== ORIGINAL PROMPT ACTIONS =====
    
    /**
     * addPrompt - Add a new user-created prompt
     * Dispatched by: PromptForm component
     * Payload: { id, title, content, category, isFavorite }
     */
    addPrompt(state, action) {
      state.prompts.push(action.payload);
    },

    /**
     * toggleFavorite - Mark/unmark a prompt as favorite
     * Dispatched by: PromptCard component
     * Payload: promptId
     */
    toggleFavorite(state, action) {
      const prompt = state.prompts.find(p => p.id === action.payload);
      if (prompt) {
        prompt.isFavorite = !prompt.isFavorite;
      }
    },

    /**
     * deletePrompt - Remove a prompt
     * Dispatched by: PromptCard component
     * Payload: promptId
     */
    deletePrompt(state, action) {
      state.prompts = state.prompts.filter(p => p.id !== action.payload);
    },

    // ===== ENHANCED PROMPT ACTIONS =====

    /**
     * addEnhancedPrompt - Store AI-generated prompt
     * Dispatched by: ChatbotAssistant component
     * Payload: { id, originalPrompt, enhancedPrompt, isFavorite, category }
     */
    addEnhancedPrompt(state, action) {
      const { id, originalPrompt, enhancedPrompt, isFavorite = false, category = null } = action.payload;
      state.enhancedPrompts.push({
        id,
        originalPrompt,
        enhancedPrompt,
        isFavorite,
        category,
        createdAt: new Date().toISOString(),
      });
    },

    /**
     * toggleEnhancedFavorite - Star/unstar AI prompt
     * Dispatched by: ChatbotAssistant, FavoritesSection
     * Payload: promptId
     */
    toggleEnhancedFavorite(state, action) {
      const prompt = state.enhancedPrompts.find(p => p.id === action.payload);
      if (prompt) {
        prompt.isFavorite = !prompt.isFavorite;
      }
    },

    /**
     * addToCategory - Assign category to AI prompt
     * Dispatched by: ChatbotAssistant component
     * Payload: { id, category }
     */
    addToCategory(state, action) {
      const { id, category } = action.payload;
      const prompt = state.enhancedPrompts.find(p => p.id === id);
      if (prompt) {
        prompt.category = category;
      }
    },

    /**
     * deleteEnhancedPrompt - Remove AI prompt
     * Dispatched by: ChatbotAssistant, FavoritesSection
     * Payload: promptId
     */
    deleteEnhancedPrompt(state, action) {
      state.enhancedPrompts = state.enhancedPrompts.filter(p => p.id !== action.payload);
    },
  },
});

// Export auto-generated action creators
export const { 
  addPrompt, 
  toggleFavorite, 
  deletePrompt, 
  addEnhancedPrompt,
  toggleEnhancedFavorite,
  addToCategory,
  deleteEnhancedPrompt,
} = promptsSlice.actions;

// Export reducer to be used in store
export default promptsSlice.reducer;
```

**Redux Flow Diagram:**
```
Component triggers action
        ↓
dispatch(addPrompt({...}))
        ↓
Reducer receives action
        ↓
state.prompts.push(action.payload)
        ↓
State updated ✓
        ↓
Components with useSelector re-render
        ↓
store.subscribe() called
        ↓
saveState() → localStorage
```

---

## 📝 Member 3: Forms & User Interactions (Developer 3)

### **Responsibility:**
Handle user input forms, validation, and modal interactions.

### **Components Created:**

#### **PromptForm.jsx**
```jsx
/**
 * PromptForm Component
 * Purpose: Modal form for adding new prompts
 * 
 * Technologies Used:
 * 1. useReducer - For local form state management (before Redux save)
 * 2. useDispatch - To dispatch addPrompt action to Redux
 * 3. Props.onClose - Callback to close modal
 */

import { useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { addPrompt } from '../store/promptsSlice';
import { getNextPromptId } from '../utils/promptId';

const CATEGORIES = ['Learning', 'Code', 'General', 'Others'];

// Initial state for form fields
const formInitialState = {
  title: '',
  content: '',
  category: CATEGORIES[0],
};

/**
 * formReducer - Handles form state updates
 * 
 * Actions:
 * - CHANGE_FIELD: Update a specific field
 * - RESET: Clear all fields
 */
const formReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_FIELD':
      // Update one field while keeping others
      return { 
        ...state, 
        [action.field]: action.value 
      };
    
    case 'RESET':
      // Clear all fields back to initial state
      return formInitialState;
    
    default:
      return state;
  }
};

const PromptForm = ({ onClose }) => {
  // useReducer for form field management
  const [formState, formDispatch] = useReducer(formReducer, formInitialState);
  
  // useDispatch for Redux actions
  const dispatch = useDispatch();

  const { title, content, category } = formState;

  /**
   * handleFieldChange - Called when user types in input
   * Updates form state via useReducer
   */
  const handleFieldChange = (field) => (e) =>
    formDispatch({ 
      type: 'CHANGE_FIELD', 
      field, 
      value: e.target.value 
    });

  /**
   * handleAddPrompt - Called when user submits form
   * 1. Validates input
   * 2. Dispatches addPrompt action to Redux
   * 3. Resets form
   * 4. Closes modal
   */
  const handleAddPrompt = (e) => {
    e.preventDefault();
    
    // Validation: check if fields are empty
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Dispatch action to Redux
    dispatch(
      addPrompt({
        id: getNextPromptId(),           // Generate unique ID
        title: title.trim(),
        content: content.trim(),
        category,
        isFavorite: false,
      })
    );

    // Reset form fields
    formDispatch({ type: 'RESET' });
    
    // Close modal
    onClose();
  };

  /**
   * handleBackdropClick - Close modal if user clicks outside
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    // Modal overlay
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal">
        {/* Modal Header */}
        <header className="modal__header">
          <h2>Add New Prompt</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </header>

        {/* Form */}
        <form onSubmit={handleAddPrompt}>
          {/* Title Input */}
          <label htmlFor="prompt-title">
            Title
            <input
              id="prompt-title"
              type="text"
              value={title}
              onChange={handleFieldChange('title')}
              placeholder="Enter prompt title"
              required
            />
          </label>

          {/* Content Textarea */}
          <label htmlFor="prompt-content">
            Prompt Content
            <textarea
              id="prompt-content"
              value={content}
              onChange={handleFieldChange('content')}
              placeholder="Enter your prompt"
              rows={5}
              required
            />
          </label>

          {/* Category Dropdown */}
          <label htmlFor="prompt-category">
            Category
            <select
              id="prompt-category"
              value={category}
              onChange={handleFieldChange('category')}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          {/* Submit Button */}
          <button type="submit" className="btn-primary">
            Add Prompt
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromptForm;
```

**How useReducer Works:**

```
User types in input
        ↓
onChange event triggered
        ↓
handleFieldChange() called
        ↓
formDispatch({ type: 'CHANGE_FIELD', field: 'title', value: 'New Title' })
        ↓
formReducer receives action
        ↓
Returns new state: { title: 'New Title', content: '', category: 'Learning' }
        ↓
Component re-renders with updated formState
```

**Why useReducer Here?**
- Multiple form fields
- Complex update logic
- Cleaner than multiple `useState` calls
- Shows advanced React patterns

**Connection to Redux:**
1. Form state is managed locally with `useReducer`
2. On submit, dispatches `addPrompt` action to Redux
3. Redux stores the prompt globally
4. Other components read the new prompt via `useSelector`

---

## 🤖 Member 4: AI Backend & Features (Developer 4)

### **Responsibility:**
Implement AI prompt enhancement, manage API calls, handle advanced features.

### **Components Created:**

#### **ChatbotAssistant.jsx**
```jsx
/**
 * ChatbotAssistant Component
 * Purpose: AI-powered prompt enhancement chatbot
 * 
 * Features:
 * 1. Chat interface with message history
 * 2. Send user prompts to AI backend
 * 3. Display AI-enhanced responses
 * 4. Save AI responses to Redux
 * 5. Favorite and categorize AI responses
 */

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEnhancedPrompt, toggleEnhancedFavorite, addToCategory } from '../store/promptsSlice';
import { sendMessageToAI } from '../services/huggingfaceAPI';

const ChatbotAssistant = () => {
  // Redux dispatch for state updates
  const dispatch = useDispatch();
  
  // Read categories and enhanced prompts from Redux
  const categories = useSelector(state => state.prompts?.categories || []);
  const enhancedPrompts = useSelector(state => state.prompts?.enhancedPrompts || []);

  // Local component state
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      content: '🎯 Transform any task into professional role-based prompts. Try: "write a book"',
      isInitial: true 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);
  const [showCategorySelect, setShowCategorySelect] = useState(null);

  // Auto-scroll to latest message
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * handleCopy - Copy message to clipboard
   * Shows visual feedback for 2 seconds
   */
  const handleCopy = (text, msgId) => {
    navigator.clipboard.writeText(text);
    setCopied(msgId);
    setTimeout(() => setCopied(null), 2000);
  };

  /**
   * handleAddFavorite - Save AI response as favorite
   * 1. Check if prompt already saved
   * 2. If yes: toggle favorite
   * 3. If no: add to enhanced prompts and mark as favorite
   */
  const handleAddFavorite = (msgId, originalPrompt, enhancedPrompt) => {
    const existingPrompt = enhancedPrompts.find(p => p.id === msgId);
    
    if (existingPrompt) {
      // Already saved, just toggle favorite
      dispatch(toggleEnhancedFavorite(msgId));
    } else {
      // First time saving
      dispatch(addEnhancedPrompt({ 
        id: msgId, 
        originalPrompt, 
        enhancedPrompt, 
        isFavorite: true 
      }));
    }
  };

  /**
   * handleAddToCategory - Assign AI response to category
   * 1. Check if prompt already saved
   * 2. If yes: update category
   * 3. If no: add to enhanced prompts with category
   */
  const handleAddToCategory = (msgId, originalPrompt, enhancedPrompt, category) => {
    const existingPrompt = enhancedPrompts.find(p => p.id === msgId);
    
    if (existingPrompt) {
      dispatch(addToCategory({ id: msgId, category }));
    } else {
      dispatch(addEnhancedPrompt({ 
        id: msgId, 
        originalPrompt, 
        enhancedPrompt, 
        category 
      }));
    }
    setShowCategorySelect(null);
  };

  /**
   * handleSend - Send user message to AI
   * 1. Add user message to chat
   * 2. Call API with message + chat history
   * 3. Display AI response
   * 4. Save to Redux
   * 5. Handle errors
   */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    
    // Add user message to chat
    const newMessages = [...messages, { 
      id: Date.now(), 
      role: 'user', 
      content: userMessage, 
      isInitial: false 
    }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Call backend API
      const response = await sendMessageToAI(userMessage, newMessages.slice(0, -1));
      
      // Generate unique ID for AI response
      const msgId = Date.now() + 1;
      
      // Add AI response to chat
      setMessages(m => [...m, { 
        id: msgId, 
        role: 'assistant', 
        content: response, 
        isInitial: false, 
        originalPrompt: userMessage 
      }]);
    } catch (err) {
      // Show error message
      setError(err.message);
      // Remove user message if API fails
      setMessages(newMessages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="simple-chatbot">
      <div className="chat-header">
        <h1>🎯 Prompt Enhancer Pro</h1>
        <p>Powered by Ollama AI</p>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message message--${msg.role}`}>
            <div className="message-content">
              <p>{msg.content}</p>
              
              {/* Action buttons for AI responses */}
              {msg.role === 'assistant' && !msg.isInitial && (
                <div className="message-actions">
                  <button onClick={() => handleCopy(msg.content, msg.id)}>
                    {copied === msg.id ? '✓ Copied!' : '📋 Copy'}
                  </button>

                  <button onClick={() => handleAddFavorite(msg.id, msg.originalPrompt, msg.content)}>
                    {enhancedPrompts.find(p => p.id === msg.id)?.isFavorite ? '★' : '☆'} Favorite
                  </button>

                  <button onClick={() => setShowCategorySelect(msg.id)}>
                    📂 Category
                  </button>
                </div>
              )}

              {/* Category selector dropdown */}
              {showCategorySelect === msg.id && (
                <div className="category-select">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleAddToCategory(msg.id, msg.originalPrompt, msg.content, cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="loading">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && <div className="error-message">{error}</div>}

      {/* Input form */}
      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your task (e.g., 'write a book')"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  );
};

export default ChatbotAssistant;
```

**Chat Flow:**
```
User enters: "write a book"
        ↓
handleSend() called
        ↓
Add user message to local chat state
        ↓
sendMessageToAI("write a book", history)
        ↓
API request to backend → Ollama AI
        ↓
AI generates: "As a bestselling author, create a detailed book outline..."
        ↓
Add AI response to local chat
        ↓
User clicks "Favorite" or "Category"
        ↓
dispatch(addEnhancedPrompt({...}))
        ↓
Redux state updated
        ↓
localStorage auto-saved
        ↓
PromptGrid re-renders with new prompt ✓
```

---

#### **FavoritesSection.jsx**
```jsx
/**
 * FavoritesSection Component
 * Purpose: Display all favorited prompts (original + AI-enhanced)
 * 
 * Reads from Redux:
 * - state.prompts.prompts (filter by isFavorite)
 * - state.prompts.enhancedPrompts (filter by isFavorite)
 */

import { useSelector, useDispatch } from 'react-redux';
import { deleteEnhancedPrompt, toggleEnhancedFavorite } from '../store/promptsSlice';

const FavoritesSection = () => {
  const dispatch = useDispatch();

  // Read original favorites from Redux
  const originalFavorites = useSelector(state =>
    state.prompts?.prompts?.filter(p => p.isFavorite) || []
  );

  // Read AI-enhanced favorites from Redux
  const enhancedFavorites = useSelector(state =>
    state.prompts?.enhancedPrompts?.filter(p => p.isFavorite) || []
  );

  // Combine both arrays
  const allFavorites = [...originalFavorites, ...enhancedFavorites];

  return (
    <section className="favorites-section">
      <h2>⭐ Favorites ({allFavorites.length})</h2>

      {allFavorites.length === 0 ? (
        <p className="empty-state">
          No favorites yet. Click ⭐ to save your best prompts!
        </p>
      ) : (
        <div className="favorites-grid">
          {/* Original favorites */}
          {originalFavorites.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}

          {/* AI-enhanced favorites */}
          {enhancedFavorites.map(prompt => (
            <div key={prompt.id} className="enhanced-prompt-card">
              <h3>{prompt.originalPrompt.substring(0, 50)}...</h3>
              <p>{prompt.enhancedPrompt}</p>

              {prompt.category && (
                <span className="category-badge">{prompt.category}</span>
              )}

              <div className="actions">
                <button onClick={() => navigator.clipboard.writeText(prompt.enhancedPrompt)}>
                  📋 Copy
                </button>
                <button onClick={() => dispatch(toggleEnhancedFavorite(prompt.id))}>
                  ★ Unfavorite
                </button>
                <button onClick={() => dispatch(deleteEnhancedPrompt(prompt.id))}>
                  🗑️ Delete
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
```

---

#### **services/huggingfaceAPI.js**
```jsx
/**
 * API Service - Backend Communication
 * 
 * Purpose: Handle all HTTP requests to the Express backend
 * The backend forwards requests to Ollama AI
 */

import axios from 'axios';

/**
 * sendMessageToAI
 * 
 * @param {string} message - User's prompt
 * @param {Array} history - Previous chat messages for context
 * @returns {Promise<string>} - AI's enhanced prompt response
 */
export const sendMessageToAI = async (message, history = []) => {
  // Validate input
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }

  try {
    // Send request to backend
    const response = await axios.post(
      'http://localhost:3001/api/chat',  // Backend URL
      { 
        message,      // Current user message
        history       // Chat history for context
      },
      { 
        timeout: 200000  // 200 second timeout for AI processing
      }
    );

    // Return AI response
    return response.data.response || 'Got your message. Please continue.';
  } 
  catch (error) {
    // Error handling
    
    if (error.message.includes('Connect')) {
      throw new Error('Backend server not running. Run: npm run server');
    }
    
    if (error.response?.status === 503) {
      throw new Error('AI model loading. Wait 30 seconds and try again.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('API key error. Check backend logs.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. AI is slow. Try again.');
    }

    throw new Error(error.message || 'Unable to get response. Try again.');
  }
};
```

**API Communication Flow:**
```
ChatbotAssistant
      ↓
sendMessageToAI("write a book")
      ↓
axios.post('http://localhost:3001/api/chat', {...})
      ↓
Express Backend (server.js)
      ↓
Forward to Ollama AI Model
      ↓
Ollama generates response
      ↓
Backend returns response
      ↓
Axios returns to component
      ↓
Component adds to chat ✓
```

---

## 🔄 Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT COMPONENTS                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  App.jsx                Header.jsx    PromptGrid.jsx            │
│  (root)          ↔    (categories)  ↔  (displays prompts)      │
│     ↓                                         ↓                  │
│  useState:                               useSelector (Redux)    │
│  - activeCategory                                               │
│  - isFormOpen                            PromptCard.jsx         │
│                                    ↔   (actions: fav, delete)   │
│                    ↓                                             │
│              PromptForm.jsx                     ↓               │
│           (useReducer + Redux)          useDispatch (Redux)    │
│              (add new prompt)                                    │
│                                                                  │
│     ChatbotAssistant.jsx ↔──→ FavoritesSection.jsx             │
│   (AI enhancement)            (display favorites)               │
│                                                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
        useSelector() & useDispatch()
                          │
        ┌─────────────────┴──────────────────┐
        ↓                                    ↓
┌──────────────────────────┐      ┌──────────────────────┐
│    REDUX STORE           │      │  localStorage        │
├──────────────────────────┤      ├──────────────────────┤
│ state.prompts:           │  ↔   │ promptsState (JSON)  │
│  - prompts[]             │      │                      │
│  - enhancedPrompts[]     │      │ Auto-saved on:       │
│  - categories[]          │      │ - addPrompt          │
│  - filter                │      │ - toggleFavorite     │
│  - showFavoritesOnly     │      │ - deletePrompt       │
│                          │      │ - addEnhancedPrompt  │
│ Actions via reducers:    │      │ - etc.               │
│  - addPrompt()           │      │                      │
│  - toggleFavorite()      │      │ Loaded on app start  │
│  - deletePrompt()        │      │                      │
│  - addEnhancedPrompt()   │      │                      │
│  - etc.                  │      │                      │
└──────────────────────────┘      └──────────────────────┘
        ↑
        │
    API Call
        │
        ↓
┌──────────────────────────────────────┐
│    BACKEND (server.js)               │
├──────────────────────────────────────┤
│ Express server on port 3001          │
│ Receives: POST /api/chat             │
│ Body: { message, history }           │
│                                      │
│ Forwards to:                         │
│   ↓                                  │
│ ┌────────────────────────────────┐   │
│ │  Ollama AI Model               │   │
│ │  (Runs locally)                │   │
│ │  Generates enhanced prompts    │   │
│ └────────────────────────────────┘   │
│                                      │
│ Returns: { response: "..." }         │
└──────────────────────────────────────┘
```

---

## 🚀 How Everything Connects

### **Scenario: User Enhances Prompt with AI**

```
1️⃣  User enters "write a book" in ChatbotAssistant input
        ↓
2️⃣  handleSend() → Add message to local state (setMessages)
        ↓
3️⃣  sendMessageToAI("write a book", history)
        ↓
4️⃣  API call to backend: axios.post('/api/chat', {...})
        ↓
5️⃣  Backend forwards to Ollama AI
        ↓
6️⃣  AI returns: "As a bestselling author: Create a detailed outline..."
        ↓
7️⃣  Component receives response, adds to messages state
        ↓
8️⃣  User clicks "Favorite" button
        ↓
9️⃣  dispatch(addEnhancedPrompt({id, originalPrompt, enhancedPrompt, isFavorite: true}))
        ↓
🔟 Redux reducer adds to state.enhancedPrompts[]
        ↓
1️⃣1️⃣ store.subscribe() called → saveState() to localStorage
        ↓
1️⃣2️⃣ All components with useSelector(state.prompts.enhancedPrompts) re-render
        ↓
1️⃣3️⃣ PromptGrid shows new enhanced prompt
        ↓
1️⃣4️⃣ FavoritesSection shows in favorites
        ↓
✅ COMPLETE - Prompt saved globally & persisted!
```

---

## 📦 Setup & Installation

```bash
# Install dependencies
npm install

# Run both backend server and frontend dev server
npm run dev-full

# Or run separately:
npm run server    # Backend on :3001
npm run dev       # Frontend on :5173
```

**Make sure:**
- Node.js is installed
- Ollama is installed and running
- Backend server (`server.js`) is running on port 3001
- Frontend Vite dev server is running on port 5173

---

## 🎓 Key Concepts Summary for Teacher

| Concept | Implementation | Used By |
|---------|----------------|---------|
| **Component Composition** | Parent → Child props | App → Header, PromptGrid, PromptForm |
| **State Management (Local)** | `useState`, `useReducer` | App, PromptForm, ChatbotAssistant |
| **State Management (Global)** | Redux Toolkit | All components read/write via `useSelector`/`useDispatch` |
| **Data Persistence** | localStorage sync | Redux store auto-saves on every change |
| **API Integration** | Axios HTTP client | ChatbotAssistant → Backend → Ollama |
| **Form Validation** | useReducer + manual checks | PromptForm validates before Redux dispatch |
| **Error Handling** | Try-catch, error states | API service, form submission |
| **User Feedback** | Copying feedback, loading state | PromptCard, ChatbotAssistant |
| **Responsive Design** | CSS Grid/Flexbox | All components |

---

## 👥 Team Responsibilities Summary

| Member | Components | Tech | Skill Level |
|--------|-----------|------|-------------|
| **Member 1 (Sahil)** | Header, PromptCard, CategoryBadge, PromptGrid | React, Styling, useSelector | Intermediate |
| **Member 2** | store/index.js, promptsSlice.js | Redux Toolkit, localStorage | Advanced |
| **Member 3** | PromptForm | useReducer, Form Validation | Intermediate-Advanced |
| **Member 4** | ChatbotAssistant, FavoritesSection, API Service | React Hooks, Axios, API integration | Advanced |

---

## 📌 File Structure Explained

```
Prompt-Manager/
├── src/
│   ├── main.jsx                     ← App entry point
│   ├── App.jsx                      ← Root component (Member 1)
│   ├── index.css                    ← Global styles
│   │
│   ├── components/
│   │   ├── Header.jsx               ← Member 1 (Filter + Add button)
│   │   ├── PromptCard.jsx           ← Member 1 (Individual prompt display)
│   │   ├── CategoryBadge.jsx        ← Member 1 (Category styling)
│   │   ├── PromptGrid.jsx           ← Member 1 (Prompt grid layout)
│   │   ├── PromptForm.jsx           ← Member 3 (Add prompt modal)
│   │   ├── ChatbotAssistant.jsx     ← Member 4 (AI chat interface)
│   │   └── FavoritesSection.jsx     ← Member 4 (Favorites display)
│   │
│   ├── store/
│   │   ├── index.js                 ← Member 2 (Store setup)
│   │   └── promptsSlice.js          ← Member 2 (Redux logic)
│   │
│   ├── services/
│   │   └── huggingfaceAPI.js        ← Member 4 (API calls)
│   │
│   ├── context/
│   │   └── ThemeContext.jsx         ← Theme management
│   │
│   └── utils/
│       └── promptId.js              ← ID generation
│
├── server.js                         ← Backend (Express + Ollama)
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 🎯 Learning Outcomes

After studying this project, students will understand:

✅ **React Fundamentals**
- Component composition and reusability
- Props drilling and component communication
- useState and useReducer hooks
- Side effects with useRef and useEffect

✅ **Redux State Management**
- Creating slices with Redux Toolkit
- Dispatching actions and updating state
- Reading state with useSelector
- Combining multiple reducers

✅ **Data Persistence**
- localStorage API
- Serialization/deserialization (JSON)
- Auto-sync state to storage

✅ **API Integration**
- HTTP requests with Axios
- Error handling and timeouts
- Request/response cycles
- Async/await patterns

✅ **Form Handling**
- Controlled components
- Form validation
- Modal overlays
- useReducer for complex forms

✅ **Full Stack Development**
- Frontend-backend communication
- REST API design
- Server integration
- Environment setup

---

**Created for Educational Purposes** 📚
This project demonstrates real-world React + Redux patterns suitable for teaching full-stack web development.

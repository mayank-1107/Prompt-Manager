import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEnhancedPrompt, toggleEnhancedFavorite, addToCategory } from '../store/promptsSlice';
import { sendMessageToAI } from '../services/huggingfaceAPI';

const ChatbotAssistant = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.prompts?.categories || []);
  const enhancedPrompts = useSelector(state => state.prompts?.enhancedPrompts || []);
  
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: '🎯 Transform any task into professional role-based prompts. Try: "write a book" or "create a marketing plan"', isInitial: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);
  const [showCategorySelect, setShowCategorySelect] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (text, msgId) => {
    navigator.clipboard.writeText(text);
    setCopied(msgId);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAddFavorite = (msgId, originalPrompt, enhancedPrompt) => {
    const existingPrompt = enhancedPrompts.find(p => p.id === msgId);
    if (existingPrompt) {
      dispatch(toggleEnhancedFavorite(msgId));
    } else {
      dispatch(addEnhancedPrompt({ id: msgId, originalPrompt, enhancedPrompt, isFavorite: true }));
    }
  };

  const handleAddToCategory = (msgId, originalPrompt, enhancedPrompt, category) => {
    const existingPrompt = enhancedPrompts.find(p => p.id === msgId);
    if (existingPrompt) {
      dispatch(addToCategory({ id: msgId, category }));
    } else {
      dispatch(addEnhancedPrompt({ id: msgId, originalPrompt, enhancedPrompt, category }));
    }
    setShowCategorySelect(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    
    const newMessages = [...messages, { id: Date.now(), role: 'user', content: userMessage, isInitial: false }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await sendMessageToAI(userMessage, newMessages.slice(0, -1));
      const msgId = Date.now() + 1;
      setMessages(m => [...m, { id: msgId, role: 'assistant', content: response, isInitial: false, originalPrompt: userMessage }]);
    } catch (err) {
      setError(err.message);
      setMessages(newMessages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="simple-chatbot">
      <div className="chat-header">
        <h1>🎯 Prompt Enhancer Pro</h1>
        <p>Powered by Ollama • Create Role-Based Prompts</p>
      </div>

      <div className="chat-messages">
        {messages.map(msg => {
          const savedPrompt = enhancedPrompts.find(p => p.id === msg.id);
          const isFavorited = savedPrompt?.isFavorite || false;
          const savedCategory = savedPrompt?.category || null;
          
          return (
            <div key={msg.id} className={`chat-msg chat-msg--${msg.role}`}>
              <span className="chat-icon">{msg.role === 'user' ? '✍️' : '✨'}</span>
              <div className="chat-content">
                <p className="chat-text">{msg.content}</p>
                {msg.role === 'assistant' && !msg.isInitial && (
                  <div className="chat-actions">
                    <button 
                      type="button"
                      className="copy-btn"
                      onClick={() => handleCopy(msg.content, msg.id)}
                      title="Copy to clipboard"
                    >
                      {copied === msg.id ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button 
                      type="button"
                      className={`fav-btn ${isFavorited ? 'active' : ''}`}
                      onClick={() => handleAddFavorite(msg.id, msg.originalPrompt, msg.content)}
                      title="Add to favorites"
                    >
                      {isFavorited ? '❤️ Favorited' : '🤍 Favorite'}
                    </button>
                    <div className="category-select-wrapper">
                      <button 
                        type="button"
                        className="category-btn"
                        onClick={() => setShowCategorySelect(showCategorySelect === msg.id ? null : msg.id)}
                        title="Add to category"
                      >
                        {savedCategory ? `📁 ${savedCategory}` : '📁 Category'}
                      </button>
                      {showCategorySelect === msg.id && (
                        <div className="category-dropdown">
                          {categories && categories.length > 0 ? categories.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              className={`category-option ${savedCategory === cat ? 'selected' : ''}`}
                              onClick={() => handleAddToCategory(msg.id, msg.originalPrompt, msg.content, cat)}
                            >
                              {cat}
                            </button>
                          )) : <p className="category-empty">No categories yet</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="chat-msg chat-msg--assistant">
            <span className="chat-icon">✨</span>
            <div className="dots-loading"><span></span><span></span><span></span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="chat-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter any task (e.g., 'write a book', 'create a resume', 'plan a project')..."
          disabled={loading}
        />
        <button type="submit" className="chat-send-btn" disabled={!input.trim() || loading}>
          ➤
        </button>
      </form>
    </section>
  );
};

export default ChatbotAssistant;

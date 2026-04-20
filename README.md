# Prompt Manager WebApp with Ollama

A professional prompt enhancement tool that transforms simple user requests into structured, high-quality prompts using **Ollama** (local AI) and **Mistral** model.

**Perfect for**: Content creators, developers, writers, students who want to write better prompts for ChatGPT, Claude, or other AI tools.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- Ollama installed ([Download](https://ollama.ai))

### Setup (2 minutes)
```bash
# 1. Install dependencies
npm install

# 2. Start Ollama (new terminal)
ollama serve

# 3. Start backend
npm run server

# 4. Start frontend (new terminal)
npm run dev

# 5. Open http://localhost:5173
```

---

## 📋 Features

### 1. **Prompt Enhancement**
Transform any request into a professional, structured prompt:
```
Input: "write a book introduction"
↓
Output: ACT AS, TASK, REQUIREMENTS, FORMAT, CONTEXT structure
```

### 2. **Chat Interface**
- Multi-turn conversation with history
- Real-time response streaming
- Error handling & loading states

### 3. **Prompt Library**
- Save enhanced prompts
- Organize by categories
- Mark as favorites
- Copy with one click

### 4. **Dark Mode**
- Light/Dark theme toggle
- Persistent theme preference

### 5. **Responsive Design**
- Mobile-friendly interface
- Grid layout for prompts
- Smooth animations

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React** | UI components & hooks |
| **Vite** | Fast development server |
| **Redux Toolkit** | Global state management |
| **Axios** | HTTP client for backend |
| **Context API** | Theme management |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Ollama** | Local LLM service |
| **Mistral 7B** | Language model |

### Architecture
```
Frontend (React/Vite)
    ↓ http://localhost:5173
Backend (Express)
    ↓ http://localhost:3001
Ollama API
    ↓ http://localhost:11434
Mistral Model
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatbotAssistant.jsx      ← Main chat interface
│   ├── PromptForm.jsx            ← Create new prompt
│   ├── PromptCard.jsx            ← Display single prompt
│   ├── PromptGrid.jsx            ← Grid of prompts
│   └── ...
├── services/
│   └── huggingfaceAPI.js         ← Backend communication
├── store/
│   └── promptsSlice.js           ← Redux state
├── context/
│   └── ThemeContext.jsx          ← Dark mode
└── App.jsx

server.js                          ← Backend + Ollama integration
package.json
vite.config.js
```

---

## React Concepts Demonstrated

| Concept | Where |
|---|---|
| `useState` | Form state, UI interactions |
| `useEffect` | Auto-scroll, theme persistence |
| `useContext` | Theme provider & consumer |
| `useDispatch` | Redux actions |
| `useSelector` | Redux state selection |
| Custom hooks | `useTheme()` |
| Redux Toolkit | `promptsSlice.js` |

---

## 🎯 System Prompt Template

Every enhancement follows this structure:

```
ACT AS: [Role/Expertise]
TASK: [Clear instruction]
REQUIREMENTS: [Quality standards]
FORMAT: [Output structure]
CONTEXT: [Background info]
```

Example output:
```
ACT AS: Professional Technical Writer
TASK: Create a step-by-step installation guide
REQUIREMENTS:
- For beginners (no prior experience)
- Include code examples
- Keep each step under 100 words
FORMAT: Markdown with numbered sections
CONTEXT: For a web development framework
```

---

## 🚀 Available Commands

```bash
npm run dev              # Start frontend (port 5173)
npm run server          # Start backend (port 3001)
npm run build           # Production build
npm run lint            # Code quality check
```

Ollama (separate terminal):
```bash
ollama serve            # Start Ollama service
ollama pull mistral     # Download model
```

---

## 🔌 API Endpoint

### POST `/api/chat`
Enhance a prompt or continue conversation

**Request**:
```javascript
{
  message: "write a marketing email",
  history: [
    { role: 'user', content: 'previous request' },
    { role: 'assistant', content: 'previous response' }
  ]
}
```

**Response**:
```javascript
{
  response: "ACT AS: Marketing Expert\nTASK: ...\n..."
}
```

---

## ⚙️ Configuration

### Environment Variables (`.env.local`)
```env
VITE_API_URL=http://localhost:3001
```

### Backend Settings (`server.js`)
```javascript
PORT = 3001
MODEL = 'mistral'
OLLAMA_URL = 'http://localhost:11434/api/generate'
TIMEOUT = 180000  // 3 minutes
```

---

## 🐛 Troubleshooting

**Q: "Backend server not running"**
```bash
npm run server
```

**Q: "Ollama not running"**
```bash
ollama serve  # In separate terminal
```
---

## 📊 Performance

- **Response time**: 2-5 seconds (Mistral model)
- **Model size**: 7B parameters
- **Memory usage**: ~4-5 GB
- **Timeout**: 3 minutes for long responses

### Model Options
| Model | Speed | Quality | Memory |
|---|---|---|---|
| neural-chat | ⚡ Fast | Good | 4GB |
| **mistral** | ✅ Balanced | Good | 4GB |
| dolphin-mixtral | 🐢 Slower | Best | 26GB |

---

## 🔐 Security

### Development
- ✅ CORS enabled (localhost only)
- ✅ Local Ollama (no internet exposure)
- ✅ No API keys required

### For Production
- Add authentication
- Enable HTTPS
- Implement rate limiting
- Deploy Ollama securely or use cloud API
- Add input validation

---

## 📝 React Hooks Used

```jsx
// Theme
const { theme, toggleTheme } = useTheme();

// Redux
const dispatch = useDispatch();
const prompts = useSelector(state => state.prompts.enhancedPrompts);

// State
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);

// Side effects
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

---

## 📚 Resources

- [Ollama Docs](https://github.com/ollama/ollama)
- [React Docs](https://react.dev)
- [Redux Docs](https://redux.js.org)
- [Vite Docs](https://vitejs.dev)
- [Express Docs](https://expressjs.com)

---

## ✅ Status

- ✅ Frontend: Production ready
- ✅ Backend: Production ready
- ✅ Ollama integration: Tested & optimized
- ✅ Documentation: Complete
- ✅ Code quality: Linting passes

---

**Created**: April 15, 2026  
**Last Updated**: April 15, 2026

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;
const OLLAMA_URL = 'http://localhost:11434/api/generate';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // ========== SYSTEM PROMPT ==========
    const systemPrompt = `You are a Professional Prompt Engineer. Transform user requests into role-based prompts.

ALWAYS use this format:
---
ACT AS: [Role/expertise]
TASK: [Specific instruction]
REQUIREMENTS: [Quality standards]
FORMAT: [Output structure]
CONTEXT: [Background info]
---

Be concise. Return ONLY the enhanced prompt.`;

    // Build conversation with history
    let conversationText = systemPrompt + '\n\n---\n\n';
    
    if (history && Array.isArray(history) && history.length > 0) {
      conversationText += 'CONVERSATION HISTORY:\n';
      history.forEach((msg, idx) => {
        if (msg.role === 'user') {
          conversationText += `\n[User Request ${idx + 1}]\n${msg.content}\n`;
        } else {
          conversationText += `\n[Enhanced Prompt ${idx + 1}]\n${msg.content}\n`;
        }
      });
      conversationText += '\n---\n\n';
    }

    conversationText += `Now enhance this request:\n\n"${message}"\n\nProvide the enhanced prompt:`;

    const response = await axios.post(
      OLLAMA_URL,
      {
        model: 'neural-chat',
        prompt: conversationText,
        stream: false,
        temperature: 0.4,
        top_p: 0.8,
        top_k: 30,
        num_predict: 450,
      },
      { timeout: 180000 }
    );

    const enhancedPrompt = response.data.response?.trim() || 'Please provide a clearer request to enhance.';
    res.json({ response: enhancedPrompt });
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({ 
        error: 'Ollama not running. Start it with: ollama serve' 
      });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Request timeout (>3min). Try a simpler prompt.' });
    }

    res.status(500).json({ error: error.message || 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

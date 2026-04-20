import axios from 'axios';

export const sendMessageToAI = async (message, history = []) => {
  if (!message.trim()) throw new Error('Message cannot be empty');

  try {
    const response = await axios.post(
      'http://localhost:3001/api/chat',
      { message, history },
      { timeout: 200000 }
    );
    return response.data.response || 'Got your message. Please continue.';
  } catch (error) {
    if (error.message.includes('Connect')) {
      throw new Error('Backend server not running. Run: npm run server');
    }
    if (error.response?.status === 503) {
      throw new Error('Model loading. Wait 30 seconds and try again.');
    }
    if (error.response?.status === 401) {
      throw new Error('API key error. Check backend logs.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Try again.');
    }

    throw new Error(error.message || 'Unable to get response. Try again.');
  }
};

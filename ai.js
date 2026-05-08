// ai.js
// AI integration for the CulturaBridge home page.
// Use the existing home page chatbot input (#chat-input) and chat panel.

const GOOGLE_API_KEY = 'AIzaSyC9dtiZASG3LyNQ2-s5AXjeB4dWhFWtKsc'; // Add your Google Studio / Generative Language API key here if you want browser-based calls.
const AI_PROXY_URL = '/.netlify/functions/chat'; // Use a server-side proxy when available.
const GOOGLE_MODEL = 'text-bison-001';
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1/models';

const aiChatHistory = [
  {
    role: 'system',
    content: 'You are CulturaBridge AI, an assistant for heritage preservation, cultural collaboration, grant advice, and project matchmaking. Keep answers friendly, concise, and relevant to cultural preservation, community projects, and collaborator matching.',
  },
];

const fallbackAnswers = [
  'I can help you find collaborators, suggest grants, or shape your preservation strategy. What would you like to explore?',
  'For your project, consider reaching out to local archivists and cultural anthropologists who can support documentation and provenance.',
  'Some useful grant options include preservation funds, digital humanities awards, and cultural heritage sponsorships. I can help you narrow them down.',
  'Your project would benefit from stronger community validation and local custodian involvement. Would you like a grant-focused plan or an outreach strategy?',
];

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function appendChatMessage(role, text) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${role === 'user' ? 'user' : 'ai'}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  msgEl.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div><div class="chat-time">${timestamp}</div>`;
  msgs.appendChild(msgEl);
  msgs.scrollTop = msgs.scrollHeight;
}

function createTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return null;
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg ai';
  typingEl.innerHTML = `<div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(typingEl);
  msgs.scrollTop = msgs.scrollHeight;
  return typingEl;
}

function isProxyUsable() {
  return Boolean(AI_PROXY_URL) && window.location.protocol !== 'file:';
}

async function fetchAIResponse(prompt) {
  if (isProxyUsable()) {
    try {
      const response = await fetch(AI_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Proxy request failed: ' + response.status + ' ' + errorText);
      }
      const data = await response.json();
      return data.reply || data.text || '';
    } catch (proxyError) {
      console.warn('AI proxy failure, falling back to direct Google Studio:', proxyError);
    }
  }

  if (!GOOGLE_API_KEY) {
    console.warn('No AI proxy available and GOOGLE_API_KEY is not set; using fallback responses.');
    return fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
  }

  aiChatHistory.push({ role: 'user', content: prompt });
  const requestUrl = `${GOOGLE_API_URL}/${GOOGLE_MODEL}:generateText?key=${encodeURIComponent(GOOGLE_API_KEY)}`;
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: {
        text: prompt,
      },
      temperature: 0.8,
      maxOutputTokens: 250,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Studio API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const aiText = result?.candidates?.[0]?.output || result?.output?.text || '';
  if (!aiText) throw new Error('Empty AI response from Google Studio');
  aiChatHistory.push({ role: 'assistant', content: aiText });
  return aiText;
}

async function sendChat() {
  const inp = document.getElementById('chat-input');
  if (!inp) return;
  const rawText = inp.value.trim();
  if (!rawText) return;

  inp.value = '';
  appendChatMessage('user', rawText);
  const typing = createTypingIndicator();

  try {
    const aiText = await fetchAIResponse(rawText);
    if (typing) typing.remove();
    appendChatMessage('ai', aiText);
  } catch (error) {
    if (typing) typing.remove();
    appendChatMessage('ai', `Sorry, I could not complete that request. ${error.message}`);
    console.error('AI chat error:', error);
    if (typeof showToast === 'function') {
      showToast('AI integration error. Check the console.', '⚠️');
    }
  }
}

// Optional initialization hook for chat input focus
window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chat-input');
  if (input) {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChat();
      }
    });
  }
});

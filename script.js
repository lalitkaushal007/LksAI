// ========== STATE MANAGEMENT ==========
const state = {
    apiKey: localStorage.getItem('lksai_api_key') || '',
    currentModel: 'claude-3.5-sonnet',
    temperature: parseFloat(localStorage.getItem('lksai_temperature') || '0.7'),
    contextWindow: parseInt(localStorage.getItem('lksai_context_window') || '5'),
    darkMode: localStorage.getItem('lksai_dark_mode') !== 'false',
    soundEnabled: localStorage.getItem('lksai_sound') === 'true',
    messages: [],
    chatHistory: JSON.parse(localStorage.getItem('lksai_chat_history') || '[]'),
    currentChatId: null,
    isLoading: false,
    soundUrl: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
};

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODELS = {
    'claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet',
    'deepseek-chat': 'deepseek/deepseek-chat',
    'meta-llama/llama-2-70b-chat': 'meta-llama/llama-2-70b-chat',
    'mistral-7b-instruct': 'mistral/mistral-7b-instruct',
    'gpt-3.5-turbo': 'openai/gpt-3.5-turbo'
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadSettingsFromStorage();
    renderChatHistory();
});

function initializeApp() {
    // Set initial dark mode
    if (state.darkMode) {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
    }

    // Load saved API key
    const apiKeyInput = document.getElementById('apiKeyInput');
    if (apiKeyInput && state.apiKey) {
        apiKeyInput.value = state.apiKey;
    }

    // Setup auto-resize textarea
    setupTextareaAutoResize();
    
    showToast('Welcome to LksAI! Please add your OpenRouter API key in Settings.', 'info');
}

function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const modelSelect = document.getElementById('modelSelect');
    const temperatureSlider = document.getElementById('temperatureSlider');
    const contextWindowSlider = document.getElementById('contextWindowSlider');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const soundToggle = document.getElementById('soundToggle');

    // Message input events
    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // API Key input
    if (apiKeyInput) {
        apiKeyInput.addEventListener('change', (e) => {
            state.apiKey = e.target.value;
            localStorage.setItem('lksai_api_key', state.apiKey);
            showToast('API Key saved!', 'success');
        });
    }

    // Model selection
    if (modelSelect) {
        modelSelect.addEventListener('change', (e) => {
            state.currentModel = e.target.value;
            localStorage.setItem('lksai_model', state.currentModel);
        });
    }

    // Temperature slider
    if (temperatureSlider) {
        temperatureSlider.addEventListener('input', (e) => {
            state.temperature = parseFloat(e.target.value);
            document.getElementById('temperatureValue').textContent = state.temperature.toFixed(1);
            localStorage.setItem('lksai_temperature', state.temperature);
        });
    }

    // Context window slider
    if (contextWindowSlider) {
        contextWindowSlider.addEventListener('input', (e) => {
            state.contextWindow = parseInt(e.target.value);
            document.getElementById('contextValue').textContent = state.contextWindow;
            localStorage.setItem('lksai_context_window', state.contextWindow);
        });
    }

    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.checked = state.darkMode;
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }

    // Sound toggle
    if (soundToggle) {
        soundToggle.checked = state.soundEnabled;
        soundToggle.addEventListener('change', toggleSound);
    }
}

function setupTextareaAutoResize() {
    const textarea = document.getElementById('messageInput');
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        });
    }
}

function loadSettingsFromStorage() {
    const modelSelect = document.getElementById('modelSelect');
    const temperatureSlider = document.getElementById('temperatureSlider');
    const contextWindowSlider = document.getElementById('contextWindowSlider');
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (modelSelect) {
        const savedModel = localStorage.getItem('lksai_model') || 'claude-3.5-sonnet';
        state.currentModel = savedModel;
        modelSelect.value = savedModel;
    }

    if (temperatureSlider) {
        temperatureSlider.value = state.temperature;
        document.getElementById('temperatureValue').textContent = state.temperature.toFixed(1);
    }

    if (contextWindowSlider) {
        contextWindowSlider.value = state.contextWindow;
        document.getElementById('contextValue').textContent = state.contextWindow;
    }
}

// ========== CHAT FUNCTIONALITY ==========
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (!message) {
        showToast('Please enter a message', 'error');
        return;
    }

    if (!state.apiKey) {
        showToast('Please add your OpenRouter API key in Settings', 'error');
        toggleSettings();
        return;
    }

    if (state.isLoading) {
        showToast('Waiting for response...', 'info');
        return;
    }

    // Add user message
    state.messages.push({ role: 'user', content: message });
    renderMessages();
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Generate new chat if needed
    if (!state.currentChatId) {
        state.currentChatId = generateChatId();
        const chatEntry = {
            id: state.currentChatId,
            title: message.substring(0, 50),
            timestamp: new Date().getTime(),
            messages: state.messages
        };
        state.chatHistory.unshift(chatEntry);
        localStorage.setItem('lksai_chat_history', JSON.stringify(state.chatHistory));
        renderChatHistory();
    }

    state.isLoading = true;
    updateApiStatus('loading');
    document.querySelector('.send-btn').disabled = true;

    try {
        // Get relevant context
        const contextMessages = getContextMessages();
        
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'LksAI',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODELS[state.currentModel],
                messages: contextMessages,
                temperature: state.temperature,
                max_tokens: 2048,
                stream: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        await handleStreamedResponse(response);
        updateApiStatus('ready');
        playNotificationSound();
        updateChatHistory();
    } catch (error) {
        console.error('Error:', error);
        showToast(`Error: ${error.message}`, 'error');
        state.messages.pop(); // Remove user message on error
        renderMessages();
        updateApiStatus('error');
    } finally {
        state.isLoading = false;
        document.querySelector('.send-btn').disabled = false;
        document.getElementById('messageInput').focus();
    }
}

async function handleStreamedResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantMessage = '';
    let messageAdded = false;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                    const json = JSON.parse(data);
                    const content = json.choices?.[0]?.delta?.content || '';
                    assistantMessage += content;

                    if (!messageAdded) {
                        state.messages.push({ role: 'assistant', content: '' });
                        messageAdded = true;
                    }

                    state.messages[state.messages.length - 1].content = assistantMessage;
                    renderMessages();
                } catch (e) {
                    // Skip invalid JSON
                }
            }
        }
    }
}

function getContextMessages() {
    // Return last N messages for context (limited by contextWindow)
    const startIndex = Math.max(0, state.messages.length - state.contextWindow * 2);
    return state.messages.slice(startIndex);
}

function renderMessages() {
    const messagesArea = document.getElementById('messagesArea');
    
    if (state.messages.length === 0) {
        messagesArea.innerHTML = `
            <div class="welcome-message">
                <h1>Welcome to LksAI</h1>
                <p>Your advanced AI assistant powered by multiple models</p>
                <div class="feature-grid">
                    <div class="feature">
                        <span>🚀</span>
                        <p>Multiple AI Models</p>
                    </div>
                    <div class="feature">
                        <span>⚡</span>
                        <p>Real-time Streaming</p>
                    </div>
                    <div class="feature">
                        <span>💾</span>
                        <p>Chat History</p>
                    </div>
                    <div class="feature">
                        <span>🎨</span>
                        <p>Modern Interface</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    messagesArea.innerHTML = '';
    
    state.messages.forEach((msg, index) => {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${msg.role}`;

        if (msg.role === 'ai' || msg.role === 'assistant') {
            messageEl.innerHTML = `
                <span class="message-icon">🤖</span>
                <div class="message-content">${formatMessage(msg.content)}</div>
            `;
        } else {
            messageEl.innerHTML = `
                <div class="message-content">${escapeHtml(msg.content)}</div>
            `;
        }

        messagesArea.appendChild(messageEl);
    });

    // Auto-scroll to bottom
    messagesArea.parentElement.scrollTop = messagesArea.parentElement.scrollHeight;
}

function formatMessage(content) {
    // Escape HTML but preserve code formatting
    let formatted = escapeHtml(content);
    
    // Format inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Format code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
    });
    
    return formatted;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== CHAT HISTORY ==========
function startNewChat() {
    state.messages = [];
    state.currentChatId = null;
    document.getElementById('messageInput').value = '';
    document.getElementById('messageInput').style.height = 'auto';
    document.getElementById('chatTitle').textContent = 'LksAI Chat';
    renderMessages();
    renderChatHistory();
}

function renderChatHistory() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

    if (state.chatHistory.length === 0) {
        chatList.innerHTML = '<p style="padding: 10px; color: var(--text-secondary); font-size: 12px;">No chats yet</p>';
        return;
    }

    state.chatHistory.forEach(chat => {
        const chatItem = document.createElement('button');
        chatItem.className = `chat-item ${chat.id === state.currentChatId ? 'active' : ''}`;
        chatItem.textContent = chat.title;
        chatItem.onclick = () => loadChat(chat.id);
        chatList.appendChild(chatItem);
    });
}

function loadChat(chatId) {
    const chat = state.chatHistory.find(c => c.id === chatId);
    if (chat) {
        state.currentChatId = chatId;
        state.messages = chat.messages || [];
        document.getElementById('chatTitle').textContent = chat.title;
        renderMessages();
        renderChatHistory();
    }
}

function updateChatHistory() {
    if (state.currentChatId) {
        const chat = state.chatHistory.find(c => c.id === state.currentChatId);
        if (chat) {
            chat.messages = state.messages;
            localStorage.setItem('lksai_chat_history', JSON.stringify(state.chatHistory));
        }
    }
}

function generateChatId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========== SETTINGS & UI ==========
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('active');
}

function changeModel() {
    const modelSelect = document.getElementById('modelSelect');
    state.currentModel = modelSelect.value;
    localStorage.setItem('lksai_model', state.currentModel);
    showToast(`Switched to ${state.currentModel}`, 'success');
}

function updateTemperature() {
    const slider = document.getElementById('temperatureSlider');
    state.temperature = parseFloat(slider.value);
    document.getElementById('temperatureValue').textContent = state.temperature.toFixed(1);
    localStorage.setItem('lksai_temperature', state.temperature);
}

function updateContextWindow() {
    const slider = document.getElementById('contextWindowSlider');
    state.contextWindow = parseInt(slider.value);
    document.getElementById('contextValue').textContent = state.contextWindow;
    localStorage.setItem('lksai_context_window', state.contextWindow);
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('light-mode');
    localStorage.setItem('lksai_dark_mode', state.darkMode);
}

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('lksai_sound', state.soundEnabled);
}

function clearChatHistory() {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
        state.chatHistory = [];
        state.messages = [];
        state.currentChatId = null;
        localStorage.removeItem('lksai_chat_history');
        renderChatHistory();
        renderMessages();
        showToast('Chat history cleared', 'success');
    }
}

// ========== UTILITIES ==========
function updateApiStatus(status) {
    const apiStatus = document.getElementById('apiStatus');
    const statusMap = {
        'ready': { text: '⚪ Ready', class: 'ready' },
        'loading': { text: '🔵 Loading...', class: 'loading' },
        'error': { text: '🔴 Error', class: 'error' }
    };
    
    const statusInfo = statusMap[status] || statusMap['ready'];
    apiStatus.textContent = statusInfo.text;
    apiStatus.className = `api-status ${statusInfo.class}`;
}

function playNotificationSound() {
    if (state.soundEnabled) {
        const audio = new Audio(state.soundUrl);
        audio.play().catch(() => {
            // Silently fail if audio can't play
        });
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('settingsModal');
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Focus on input when page loads
window.addEventListener('load', () => {
    document.getElementById('messageInput').focus();
});
# 🤖 LksAI - Advanced Chatting AI

A modern, feature-rich ChatGPT-like web application built with pure HTML, CSS, and JavaScript. LksAI supports multiple AI models through OpenRouter's free API.

![LksAI](https://img.shields.io/badge/LksAI-Advanced%20AI%20Chat-6366f1?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![JavaScript](https://img.shields.io/badge/Built%20with-HTML%2FCSS%2FJS-yellow?style=flat-square)

## ✨ Features

- 🤖 **Multi-Model Support**: Claude 3.5 Sonnet, DeepSeek, Llama 2, Mistral, and more
- 🚀 **Real-time Streaming**: See responses as they generate
- 💾 **Persistent Chat History**: All conversations saved locally
- 🎨 **Modern UI**: Beautiful dark and light modes
- ⚙️ **Customizable Settings**:
  - Temperature control (0.0 - 1.0)
  - Context window adjustment
  - Sound notifications
  - Dark/Light theme toggle
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔒 **Privacy First**: All data stored locally in browser
- ⚡ **No Backend Required**: Works directly with OpenRouter API
- 🎯 **Zero Dependencies**: Pure HTML, CSS, and JavaScript

## 🚀 Quick Start

### 1. Get Your Free API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Go to Settings → API Keys
4. Create a new API key (no credit card required for free tier)
5. Copy your API key

### 2. Open LksAI

- Simply open `index.html` in your web browser
- Or deploy it to GitHub Pages, Netlify, Vercel, etc.

### 3. Add Your API Key

1. Click the ⚙️ **Settings** button
2. Paste your OpenRouter API key
3. Click close and start chatting!

## 📋 Supported Models

| Model | Provider | Speed | Quality | Cost |
|-------|----------|-------|---------|------|
| Claude 3.5 Sonnet | Anthropic | Medium | Excellent | Free tier |
| DeepSeek Chat | DeepSeek | Fast | Very Good | Free |
| Llama 2 70B | Meta | Medium | Good | Free |
| Mistral 7B | Mistral | Fast | Good | Free |
| GPT 3.5 Turbo | OpenAI | Medium | Very Good | Free tier |

## 🎮 How to Use

### Basic Chat
1. Type your message in the input box
2. Press `Enter` to send (or `Shift+Enter` for new line)
3. Wait for AI response
4. Continue the conversation

### Chat History
- All chats are saved in the left sidebar
- Click any previous chat to load it
- Click **+ New Chat** to start fresh

### Settings
Click **⚙️ Settings** to customize:
- **API Key**: Your OpenRouter authentication
- **Temperature**: Control creativity (0 = factual, 1 = creative)
- **Context Window**: How many previous messages to remember
- **Dark Mode**: Toggle between dark and light themes
- **Sound Notifications**: Enable notification sounds
- **Clear History**: Delete all saved conversations

### Model Selection
Use the dropdown in the chat header to switch between models instantly.

## 📂 File Structure

```
LksAI/
├── index.html       # Main HTML structure
├── styles.css       # Complete styling (dark & light modes)
├── script.js        # Full application logic
└── README.md        # This file
```

## 🔧 Configuration

All settings are saved to browser's `localStorage`:
- `lksai_api_key` - Your OpenRouter API key
- `lksai_model` - Currently selected model
- `lksai_temperature` - Temperature setting (0-1)
- `lksai_context_window` - Context size (1-10)
- `lksai_dark_mode` - Theme preference
- `lksai_sound` - Sound notification toggle
- `lksai_chat_history` - All saved conversations

## 🎨 Customization

### Change Colors
Edit the CSS variables at the top of `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    /* ... more variables ... */
}
```

### Add New Models
Edit the `MODELS` object in `script.js`:

```javascript
const MODELS = {
    'your-model': 'provider/model-name',
    // ... existing models ...
};
```

Then add an option to the HTML select:

```html
<option value="your-model">Your Model Name</option>
```

## 💡 Tips & Tricks

1. **Faster Responses**: Use DeepSeek or Mistral models
2. **Better Quality**: Use Claude 3.5 Sonnet
3. **Cost Optimization**: Use lower context window for faster responses
4. **Mobile Friendly**: App is fully responsive, works on phones
5. **Offline Ready**: Once loaded, works without internet (except API calls)
6. **Export Conversations**: Copy-paste from chat or use browser dev tools

## 🐛 Troubleshooting

### API Key Not Working
- Verify your OpenRouter API key is correct
- Check you haven't exceeded free tier limits
- Visit [OpenRouter Status](https://status.openrouter.io) to check service status

### Empty Response
- Check your internet connection
- Ensure API key is valid
- Try a different model
- Check browser console for errors (F12)

### Storage Issues
- Clear browser cache and localStorage
- Try incognito/private window
- Check if localStorage is enabled

### CORS Errors
- OpenRouter handles CORS, should work automatically
- If issues persist, check firewall settings

## 📊 Performance

- **Load Time**: < 1 second
- **Response Time**: Depends on model (typically 2-10 seconds)
- **Storage**: ~5-10MB for 100+ chat messages
- **Memory**: < 50MB typical usage

## 🔐 Security & Privacy

✅ **What's Private**:
- Your API key is stored only in your browser's localStorage
- Chat messages never leave your browser
- No data is sent to any server except OpenRouter
- No tracking or analytics

⚠️ **Important**:
- Never share your API key
- OpenRouter will see your API key and messages
- Read OpenRouter's privacy policy

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - Free to use for personal and commercial projects

## 🙏 Credits

Built with ❤️ by [Lalit Kaushal](https://github.com/lalitkaushal007)

Powered by [OpenRouter.ai](https://openrouter.ai)

## 🚀 Deployment

### GitHub Pages
```bash
# Push to gh-pages branch
git checkout --orphan gh-pages
git add .
git commit -m "Deploy LksAI"
git push -u origin gh-pages
```

### Netlify
1. Drag and drop the folder to Netlify
2. Domain auto-assigned
3. Done!

### Vercel
1. Connect GitHub repo
2. Select default settings
3. Deploy

## 📞 Support

For issues or questions:
1. Check [OpenRouter Documentation](https://openrouter.ai/docs)
2. Review [FAQ](https://openrouter.ai/faq)
3. Open an issue on GitHub
4. Check browser console (F12) for errors

## 🎯 Roadmap

- [ ] Image upload support
- [ ] Voice input/output
- [ ] Export conversations as PDF
- [ ] Custom system prompts
- [ ] Plugin system
- [ ] Multi-language support
- [ ] Code execution environment
- [ ] Collaborative chat rooms

## ⭐ Show Your Support

If you find LksAI useful, please star this repository! 🌟

---

**Made with ❤️ | Happy Chatting! 🚀**
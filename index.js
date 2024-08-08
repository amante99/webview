const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve the webview.html file
app.get('/webview', (req, res) => {
    res.sendFile(path.join(__dirname, 'webview.html'));
});

// Telegram webhook endpoint
app.post('/webhook', async (req, res) => {
    const message = req.body.message;
    if (message && message.text) {
        const chatId = message.chat.id;
        if (message.text === '/start') {
            const responseText = 'Welcome! Click the button below to open the web view.';
            const replyMarkup = {
                inline_keyboard: [
                    [{
                        text: 'Open Web View',
                        web_app: { url: 'https://webview-pi.vercel.app/webview' } // Replace with your Vercel URL
                    }]
                ]
            };
            await sendMessageToTelegram(chatId, responseText, replyMarkup);
        } else {
            const responseText = `You said: ${message.text}`;
            await sendMessageToTelegram(chatId, responseText);
        }
    }
    res.sendStatus(200);
});

// Function to send messages to Telegram
const sendMessageToTelegram = async (chatId, text, replyMarkup = null) => {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
        chat_id: chatId,
        text: text,
        reply_markup: replyMarkup
    });
    return response.data;
};

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

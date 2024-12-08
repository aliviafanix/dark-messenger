const socket = io();

// DOM Elements
const messagesContainer = document.querySelector('.messages-container');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const onlineCounter = document.querySelector('#online-counter');

// Get username from localStorage or prompt
let username = localStorage.getItem('username');
if (!username) {
    username = prompt('Введите ваше имя:') || 'Аноним';
    localStorage.setItem('username', username);
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// Add message to DOM
function appendMessage(message, isSent = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isSent ? 'sent' : 'received');

    const usernameElement = document.createElement('div');
    usernameElement.classList.add('username');
    usernameElement.textContent = message.username;

    const contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.textContent = message.message || message.content;

    const timeElement = document.createElement('div');
    timeElement.classList.add('time');
    timeElement.textContent = formatTime(message.timestamp);

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(contentElement);
    messageElement.appendChild(timeElement);

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Load previous messages
socket.on('previousMessages', (messages) => {
    messagesContainer.innerHTML = '';
    messages.forEach(message => {
        appendMessage(message, message.username === username);
    });
});

// Handle new messages
socket.on('message', (message) => {
    appendMessage(message, message.username === username);
});

// Update online users count
socket.on('userCount', (count) => {
    onlineCounter.textContent = count;
});

// Send message
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message) {
        socket.emit('chatMessage', {
            username,
            message
        });
        messageInput.value = '';
    }
});

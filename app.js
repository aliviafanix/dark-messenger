// Конфигурация Firebase
const firebaseConfig = {
    // Здесь нужно будет вставить ваши данные от Firebase
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Элементы DOM
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameInput = document.getElementById('username');
const onlineCountElement = document.getElementById('online-count');

// Проверка локального хранилища для имени пользователя
if (localStorage.getItem('username')) {
    usernameInput.value = localStorage.getItem('username');
}

// Референс для сообщений и онлайн пользователей
const messagesRef = database.ref('messages');
const onlineRef = database.ref('online');

// Функция для отправки сообщения
function sendMessage() {
    const message = messageInput.value.trim();
    const username = usernameInput.value.trim();

    if (message && username) {
        // Сохраняем имя пользователя
        localStorage.setItem('username', username);

        // Отправляем сообщение в Firebase
        messagesRef.push({
            username: username,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // Очищаем поле ввода
        messageInput.value = '';
    }
}

// Обработчики событий
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Форматирование времени
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// Слушаем новые сообщения
messagesRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    const currentUsername = localStorage.getItem('username');
    
    messageElement.className = `message ${message.username === currentUsername ? 'sent' : 'received'}`;
    messageElement.innerHTML = `
        <div class="username">${message.username}</div>
        <div class="text">${message.text}</div>
        <div class="time">${formatTime(message.timestamp)}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Управление онлайн статусом
const userRef = onlineRef.push();

// Обновляем статус при подключении/отключении
userRef.onDisconnect().remove();
userRef.set(true);

// Обновляем счетчик онлайн пользователей
onlineRef.on('value', (snapshot) => {
    const count = snapshot.numChildren();
    onlineCountElement.textContent = count;
});

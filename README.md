# Dark Messenger

Современный мессенджер с тёмной темой и минималистичным дизайном.

## 🚀 Особенности

- Современный тёмный дизайн
- Реалтайм-сообщения через Socket.IO
- MongoDB для хранения истории сообщений
- Адаптивный интерфейс
- Счётчик онлайн пользователей

## 🛠 Технологии

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Real-time: Socket.IO

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/dark-messenger.git
cd dark-messenger
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env в корне проекта:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Запустите приложение:
```bash
npm start
```

## 🚀 Деплой

### GitHub Pages

1. Форкните репозиторий
2. В настройках репозитория (Settings -> Pages):
   - Source: Deploy from a branch
   - Branch: gh-pages

### Переменные окружения

В настройках репозитория (Settings -> Secrets and variables -> Actions):
1. Добавьте секрет `MONGODB_URI` с вашей строкой подключения к MongoDB

### MongoDB Atlas

1. Создайте аккаунт на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте новый кластер (бесплатный M0)
3. Добавьте свой IP в whitelist
4. Создайте пользователя базы данных
5. Получите строку подключения и добавьте её в секреты GitHub

## 📝 Лицензия

MIT

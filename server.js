const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const Message = require('./models/Message');
const path = require('path');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(compression());
app.use(express.static('public'));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dark-messenger')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO
let onlineUsers = 0;

io.on('connection', async (socket) => {
    onlineUsers++;
    io.emit('userCount', onlineUsers);

    // Send last 50 messages to new user
    try {
        const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
        socket.emit('previousMessages', messages.reverse());
    } catch (err) {
        console.error('Error fetching previous messages:', err);
    }

    socket.on('chatMessage', async (data) => {
        try {
            const message = new Message({
                username: data.username,
                content: data.message
            });
            await message.save();
            
            io.emit('message', {
                username: data.username,
                message: data.message,
                timestamp: message.timestamp
            });
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    socket.on('disconnect', () => {
        onlineUsers--;
        io.emit('userCount', onlineUsers);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Added for safety

const app = express();
app.use(cors()); // Enable CORS for the express app

const server = http.createServer(app);

// Updated CORS to be more flexible for deployment
const io = new Server(server, { 
    cors: { 
        origin: "*",
        methods: ["GET", "POST"]
    } 
});

io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    socket.on('join-room', (id) => {
        socket.join(id);
        console.log(`User joined room: ${id}`);
    });

    socket.on('update-car-color', (data) => {
        io.to(data.roomId).emit('update-car-color', data);
    });

    socket.on('send-tilt', (data) => {
        // Using io.to instead of socket.to ensures everyone in room gets it
        io.to(data.roomId).emit('receive-tilt', data);
    });

    // FIXED: Match the event name in your App.js
    socket.on('vibrate-phone', (data) => {
        io.to(data.roomId).emit('vibrate-phone'); 
    });

    // FIXED: Match the 'restart-game' emit in your App.js
    socket.on('restart-game', (roomId) => {
        io.to(roomId).emit('restart-game');
    });

    socket.on('send-nitro', (roomId) => {
        io.to(roomId).emit('receive-nitro');
    });

    socket.on('disconnect', () => {
        console.log("User disconnected");
    });
});

// IMPORTANT: Use process.env.PORT for Render
const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live on port ${PORT}`);
});
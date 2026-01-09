const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, { 
    cors: { 
        origin: "*", 
        methods: ["GET", "POST"]
    } 
});

io.on('connection', (socket) => {
    console.log("User Connected:", socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('update-car-color', (data) => {
        io.to(data.roomId).emit('update-car-color', data);
    });

    socket.on('send-tilt', (data) => {
        io.to(data.roomId).emit('receive-tilt', data);
    });

    socket.on('send-nitro', (data) => {
        io.to(data.roomId).emit('receive-nitro');
    });

    // When the computer crashes, tell the phone to vibrate and show restart button
    socket.on('vibrate-phone', (data) => {
        io.to(data.roomId).emit('vibrate-phone');
    });

    // When the phone hits REBOOT, tell the computer to restart
    socket.on('restart-game', (roomId) => {
        io.to(roomId).emit('restart-game');
    });

    socket.on('disconnect', () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on port ${PORT}`);
});

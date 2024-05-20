import express from 'express';
import http from 'http';
import ip from 'ip';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
app.use(cors());

app.get('/', (req, res) => {
    res.json('ip address: http://' + ip.address() + ':' + PORT);
});

let colorCellList = [
    'g', 
    'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'b', 'r',
    'b', 'r', 'b', 'r', 'b', 'r', 'r', 'b', 'r', 'b', 'r', 'b',
    'r', 'b', 'r', 'b', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r',
];

let player1 = {
    id: '',
    name: 'Player 1',
}

let player2 = {
    id: '',
    name: 'Player 2',
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected');
    
    socket.emit('socketID', socket.id);
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected');
        clearInterval(intervalRef); // Clear the interval when the socket disconnects
    });

    let intervalRef;
    socket.on('join', (room) => {
        console.log('join room:' + room);
        socket.join(room);
        const newBalance = 2000;
        io.to(room).emit('join', room, newBalance);
        
        socket.currentRoom = room;

        console.log(io.sockets.adapter.rooms.get(room));
        const roomClients = io.sockets.adapter.rooms.get(room);
        const clients = Array.from(roomClients);

        
        if (roomClients.size === 2) {
            player1.id = clients[0];
            player2.id = clients[1];

            io.to(player1.id).emit('playerName', player1);
            io.to(player2.id).emit('playerName', player2);

            console.log('start')
            io.to(room).emit('roomStatus', 'Start game');
            intervalRef = setInterval(() => {
                const winningInfo = generateWinningNumberAndColor();
                console.log(`Winning Number: ${winningInfo.winningNumber}, Color: ${winningInfo.winningColor}`);
                io.to(room).emit('winningNumberAndColor', winningInfo);
            }, 15000); // Every 15 seconds
        } else {
            io.to(room).emit('roomStatus', 'waiting for player');
        }
    })

    socket.on('leave', (room) => {
        console.log('leave room:' + room);
        socket.leave(room);
        io.to(room).emit('leave', room);
        clearInterval(intervalRef); // Clear the interval when the socket leaves
    });

    socket.on('playerWon', (data) => {
        // Broadcast the win notification to all clients
        const message = data.playerId === player1.id ? 'Player 1 wins' : 'Player 2 wins';
        io.emit('winNotification', message);
    });

    // Function to generate a winning number and color
    function generateWinningNumberAndColor() {
        const winningNumber = Math.floor(Math.random() * 37);
        let winningColor;

        if (winningNumber === 0) {
            winningColor = 'g';
        } else {
            let winningBaseColor = colorCellList[winningNumber];
            if (winningBaseColor === 'r') {
                winningColor = 'r';
            } else {
                winningColor = 'b';
            }
        }
        
        return { winningNumber, winningColor };
    }
})

server.listen(PORT, () => { 
    console.log('Server ip : http://' + ip.address() + ":" + PORT);
})

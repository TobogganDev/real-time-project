// Constants
let i = 0;
let room = '';
let socketid = '';
let balanceAmount = 0;
const room_input = document.getElementById('room_input');
const text = document.getElementById('msg_input');
const balanceArea = document.getElementsByClassName('balanceTextAmount')[0];
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    document.querySelector('.chatMessage').innerHTML = '';
    balanceArea.innerHTML = 0;
});

socket.on('disconnect', () => {
    document.querySelector('.chatMessage').innerHTML = '';
});

socket.on('message', (data) => {
    if (data.room === room) {
        const chatMessageDiv = document.createElement('div');
        const chatMessageP = document.createElement('p');
        chatMessageP.innerText = data.msg;
        chatMessageDiv.classList.add('chatMessage');
        chatMessageDiv.appendChild(chatMessageP);
        document.querySelector('.chatMessage').appendChild(chatMessageDiv);
    }
});

socket.on('join', (room, newBalance) => {
    console.log(`Connected to room : ${room ? room : 'default'}`);
    console.log(`Balance : ${newBalance}`);
    document.querySelector('.chatMessage').innerHTML = '';
    balanceArea.innerHTML = newBalance;
});

socket.on('leave', (room) => {
    console.log(`Disconnected from room : ${room ? room : 'default'}`);
});

// Send a message
let sendMessage = () => {
    socket.emit('message', text.value, room);
    console.log(`Message : ${text.value}\nTo room : ${room ? room : 'default'}`);
    balanceAmount--;
    balanceArea.innerHTML = balanceAmount;
    text.value = '';
}

// Join a Room
let joinRoom = () => {
    if (room !== room_input.value) {
        socket.emit('leave', room);
        socket.emit('join', room_input.value);
        room = room_input.value;
        console.log(`Connected to room : ${room ? room : 'default'}`);
    }
}

// AddEvent Listeners
document.querySelector('#joinRoomBtn').addEventListener('click', joinRoom);
document.querySelector('#sendMessageBtn').addEventListener('click', sendMessage);
// Constants
let i = 0;
let room = '';
let socketid = '';
let balanceAmount = 0;
const room_input = document.getElementById('room_input');
const text = document.getElementById('msg_input');
const balanceArea = document.getElementsByClassName('balanceTextAmount')[0];
const socket = io('http://192.168.1.76:3000');

socket.on('connect', () => {
    document.querySelector('.chatMessage').innerHTML = '';
    balanceArea.innerHTML = 0;
});

socket.on('socketID', (id) => {
    console.log('Socket ID:', id);
    socketid = id;
});

socket.on('roomStatus', (data) => {
    console.log(data);
});

socket.on('disconnect', () => {
    document.querySelector('.chatMessage').innerHTML = '';
    console.log('Disconnected');
});

socket.on('message', (data) => {
    if (data.room === room) {
        const chatMessageDiv = document.createElement('div');
        const chatMessageP = document.createElement('p');
        chatMessageP.innerText = data.msg;
        chatMessageP.classList.add('chatMessageText');
        chatMessageDiv.classList.add('chatMessage');
        chatMessageDiv.appendChild(chatMessageP);
        document.querySelector('.chatMessage').appendChild(chatMessageDiv);
    }
});

socket.on('join', (room, newBalance) => {
    console.log(`Connected to room : ${room? room : 'default'}`);
    console.log(`Initial Balance : ${newBalance}`);
    document.querySelector('.chatMessage').innerHTML = '';
    balanceArea.innerHTML = newBalance; // Display the initial balance
    balanceAmount = newBalance; // Set the initial balance
});

socket.on('playerName', (data) => {
    const playerNameElement = document.getElementById('playerNameDisplay');
    
    if (playerNameElement) {
        playerNameElement.textContent = data.name;
    }
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
// document.querySelector('#sendMessageBtn').addEventListener('click', sendMessage);

socket.on('winningNumberAndColor', (winningInfo) => {
    console.log('Received winning number and color:', winningInfo);
    // Animate to the winning cell
    animateToWinningCell(winningInfo.winningNumber, winningInfo.winningColor);
});

socket.on('winNotification', (data) => {
    // Display the win message in the chat
    const chatMessageDiv = document.createElement('div');
    const chatMessageP = document.createElement('p');
    chatMessageP.innerText = data;
    chatMessageP.classList.add('chatMessageText');
    chatMessageDiv.classList.add('chatMessage');
    chatMessageDiv.appendChild(chatMessageP);
    document.querySelector('.chatMessage').appendChild(chatMessageDiv);
});

let gameBoard = document.querySelector('.grillePlatoContainer');
let selectedAmountChip = 0;
let chipBet = document.querySelectorAll('.Chip-Bet');
let colorCellList = [
    'g', 
    'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'b', 'r',
    'b', 'r', 'b', 'r', 'b', 'r', 'r', 'b', 'r', 'b', 'r', 'b',
    'r', 'b', 'r', 'b', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r',
];
let playerBets = [];


initGameBoard();
initBandeauRoulette();

let betCells = document.querySelectorAll('.grillePlatoContainer .gameBoardCell');
let rouletteBandeau = document.querySelector('.bandeauRoulette');

function initGameBoard() {
    let gameBoard = document.querySelector('.grillePlatoContainer');
    
    // Add 0 cell
    gameBoard.appendChild(generateCellZero());
    
    // Add 1-36 cells directly to the grid container
    generateCells().forEach(element => {
        gameBoard.appendChild(element);
    });
    
    // Add black and red cells
    let gameBoardColorBlack = document.createElement('div');
    gameBoardColorBlack.classList.add('gameBoardCell', 'gameBoardColorCell', 'color-b');
    gameBoardColorBlack.id = 'blackCell';
    gameBoardColorBlack.innerHTML = `<p>Black</p>`;
    gameBoard.appendChild(gameBoardColorBlack);
    
    let gameBoardColorRed = document.createElement('div');
    gameBoardColorRed.classList.add('gameBoardCell', 'gameBoardColorCell', 'color-r');
    gameBoardColorRed.id = 'redCell';
    gameBoardColorRed.innerHTML = `<p>Red</p>`;
    gameBoard.appendChild(gameBoardColorRed);
}

function initBandeauRoulette () {
    let roulette = document.querySelector('.rouletteContainer');
    
    let bandeauRoulette = document.createElement('div');
    bandeauRoulette.classList.add('bandeauRoulette');
    
    for (let i = 0; i < 4; i++) {
        bandeauRoulette.appendChild(generateCellZero());
        generateCells().forEach(element => {
            bandeauRoulette.appendChild(element);
        });
    }
    
    let cells = Array.from(bandeauRoulette.children);
    for (let i = cells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    
    while (bandeauRoulette.firstChild) {
        bandeauRoulette.removeChild(bandeauRoulette.firstChild);
    }
    
    cells.forEach(cell => {
        bandeauRoulette.appendChild(cell);
    });
    
    roulette.appendChild(bandeauRoulette);
}

function generateCellZero() {
    let gameBoardZero = document.createElement('div');
    gameBoardZero.classList.add('gameBoardCell', 'color-g', 'zeroCell');
    gameBoardZero.id = 'cell0';
    gameBoardZero.innerHTML = `<p>0</p>`;
    return gameBoardZero;
};

function generateCells() {
    let gameBoardCells = [];
    for (let i = 1; i < 37; i++) {
        let gameNumber = document.createElement('div');
        gameNumber.classList.add('gameBoardCell', `color-${colorCellList[i]}`);
        gameNumber.id = `cell${i}`;
        gameNumber.innerHTML = `<p>${i}</p>`;
        gameBoardCells.push(gameNumber);
    }
    return gameBoardCells;
};

let selectChip = (chip) => {
    chipBet.forEach(element => {
        element.classList.remove('-selected');
    });
    chip.classList.toggle('-selected');
    selectedAmountChip = parseInt(chip.getAttribute('data-amount'));
    console.log(selectedAmountChip);
}

let betOnCell = (cell) => {
    if (selectedAmountChip == 0) {
        alert('Please select a chip');
        return;
    }
    
    cell.classList.add('-bet');
    
    let currentBet = parseInt(cell.getAttribute('data-bet')) || 0;
    cell.setAttribute('data-bet', currentBet + selectedAmountChip);
    
    if (!cell.querySelector('.amountOfBet')) {
        let betAmount = document.createElement('p');
        betAmount.classList.add('amountOfBet');
        betAmount.innerText = cell.getAttribute('data-bet');
        cell.appendChild(betAmount);
    } else {
        cell.querySelector('.amountOfBet').innerText = cell.getAttribute('data-bet');
    }
    
    // Store the bet
    let bet = {
        cellId: cell.id,
        amount: selectedAmountChip,
        number: null,
        color: null
    };
    
    if (cell.classList.contains('gameBoardColorCell')) {
        bet.color = cell.classList.contains('color-r')? 'red' : 'black';
    } else {
        // Use querySelector to get the first <p> element within the cell
        let firstParagraph = cell.querySelector('p');
        
        // Extract the number from the first <p> element
        bet.number = firstParagraph? firstParagraph.innerText.trim() : null;
        
        bet.color = cell.classList.contains('color-r')? 'red' : 'black';
    }
    
    playerBets.push(bet);
};

// Add event listener
chipBet.forEach(element => {
    element.addEventListener('click', () => {
        selectChip(element);
    });
});

betCells.forEach(element => {
    element.addEventListener('click', () => {
        betOnCell(element);
    });
});

function resetBets() {
    // Reset data-bet attribute and remove chips from all cells
    betCells.forEach(cell => {
        cell.setAttribute('data-bet', '0');
        cell.innerHTML = ''; // Remove any child elements (chips)
        cell.classList.remove('-bet'); // Remove the -bet class
    });
    
    // Reset playerBets array
    playerBets = [];
    
}

document.querySelector('#resetBetsBtn').addEventListener('click', resetBets);

function animateToWinningCell(winningNumber, winningColor) {
    document.getElementById('winningNumberDisplay').innerHTML = '';
    const numberOfCells = rouletteBandeau.childNodes.length;
    const cellWidth = rouletteBandeau.querySelector('.gameBoardCell').getBoundingClientRect().width;
    const totalWidth = numberOfCells * cellWidth;
    
    // Calculate the position of the winning cell
    const winningCellPosition = -winningNumber * cellWidth;
    
    // Calculate the final position considering the width of the bandeau
    let finalPosition = winningCellPosition;
    if (finalPosition < -totalWidth) {
        finalPosition += totalWidth;
    } else if (finalPosition > 0) {
        finalPosition -= totalWidth;
    }
    
    // Apply the animation to move the bandeau to the winning cell
    const animationName = `scroll-to-win-${new Date().getTime()}`;
    document.styleSheets[0].insertRule(`
        @keyframes ${animationName} {
            0% { transform: translateX(-${totalWidth}px); }
            100% { transform: translateX(${finalPosition}px); }
        }
    `, document.styleSheets[0].cssRules.length);
    
    rouletteBandeau.style.animation = 'none';
    setTimeout(() => {
        rouletteBandeau.style.animation = `${animationName} 4s ease-in-out 1 forwards`;
    }, 10);
    
    const winningCell = rouletteBandeau.querySelector(`#${'cell' + winningNumber}`);

    // Clone the winning cell to preserve its current state
    const clonedWinningCell = winningCell.cloneNode(true);

    // Manually add the classes back to the cloned cell
    clonedWinningCell.classList.add('gameBoardCell', `color-${colorCellList[winningNumber]}`, 'selected'); // Assuming 'selected' is a class you want to add

    // Append the cloned winning cell to the #winningNumberDisplay div
    const winningNumberDisplayDiv = document.getElementById('winningNumberDisplay');
    winningNumberDisplayDiv.appendChild(clonedWinningCell);
    console.log('winning color', winningColor)
    // Check if the player has won
    let playerWon = false;
    playerBets.forEach(bet => {
        if (bet.number == winningNumber || bet.color == winningColor) {
            playerWon = true;
            // Update the player's balance here
            balanceAmount += bet.amount; // Increase the balance by the bet amount
            balanceArea.innerHTML = balanceAmount;
            // Display a win message
            console.log(`Congratulations You won ${bet.amount} $.`);

            socket.emit('playerWon', {
                playerId: socketid,
                message: `Congratulations You won ${bet.amount} $.`
            })
        }
    });

    // Reset the animation after stopping at the winning cell
    setTimeout(() => {
        rouletteBandeau.style.animation = 'none';
        // Optionally, reset the game or fetch the next winning number
        // getWinningNumber();
    }, 4000);
}
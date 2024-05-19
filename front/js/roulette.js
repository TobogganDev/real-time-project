let gameBoard = document.querySelector('.grillePlatoContainer');
let selectedAmountChip = 0;
let chipBet = document.querySelectorAll('.Chip-Bet');
let colorCellList = [
    'g', 
    'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'b', 'r',
    'b', 'r', 'b', 'r', 'b', 'r', 'r', 'b', 'r', 'b', 'r', 'b',
    'r', 'b', 'r', 'b', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r',
];


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
    cell.getAttribute('data-bet') ? cell.setAttribute('data-bet', parseInt(cell.getAttribute('data-bet')) + selectedAmountChip) : cell.setAttribute('data-bet', selectedAmountChip);
    cell.querySelector('.amountOfBet') ? cell.querySelector('.amountOfBet').innerHTML = cell.getAttribute('data-bet') : cell.innerHTML += `<p class="amountOfBet">${cell.getAttribute('data-bet')}</p>`;
    console.log(cell.querySelector('.amountOfBet'))
}

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


// Roulette System

function randomizeAnimation() {
    const numberOfCells = rouletteBandeau.childNodes.length;
    const cellWidth = rouletteBandeau.querySelector('.gameBoardCell').getBoundingClientRect().width;
    const totalWidth = numberOfCells * cellWidth;
    const randomCell = Math.floor(Math.random() * numberOfCells);
    let endPosition = -randomCell * cellWidth;

    let currentPosition = parseInt(rouletteBandeau.dataset.position || 0);
    let newPosition = currentPosition + endPosition;

    const minTravelCells = 10;
    if (Math.abs(newPosition - currentPosition) < minTravelCells * cellWidth) {
        if (newPosition > currentPosition) {
            newPosition += minTravelCells * cellWidth;
        } else {
            newPosition -= minTravelCells * cellWidth;
        }
    }

    if (newPosition < -totalWidth) {
        newPosition += totalWidth;
    } else if (newPosition > 0) {
        newPosition -= totalWidth;
    }

    rouletteBandeau.dataset.position = newPosition % totalWidth;

    const animationName = `scroll-${new Date().getTime()}`;

    document.styleSheets[0].insertRule(`
        @keyframes ${animationName} {
            0% { transform: translateX(${currentPosition}px); }
            100% { transform: translateX(${newPosition}px); }
        }
    `, document.styleSheets[0].cssRules.length);

    rouletteBandeau.style.animation = 'none';
    setTimeout(() => {
        rouletteBandeau.style.animation = `${animationName} 4s ease-in-out 1 forwards`;
        setTimeout(() => {
            getWinningNumber();
        }, 4000);
    }, 10);
    setTimeout(() => {
        randomizeAnimation();
    }, 6000);
}

function getWinningNumber() {
    const bandeauRect = document.querySelector('.rouletteContainer').getBoundingClientRect();
    const cells = document.querySelectorAll('.gameBoardCell');
    const visibleCells = Array.from(cells).filter(cell => {
        const cellRect = cell.getBoundingClientRect();
        return cellRect.left >= bandeauRect.left && cellRect.right > bandeauRect.left;
    });
    if (visibleCells.length > 0) {
        const winningCell = visibleCells[0];
        console.log('Winning number:', winningCell.innerText.trim());
    }
}

randomizeAnimation();
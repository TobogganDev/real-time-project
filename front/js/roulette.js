let gameBoard = document.querySelector('.grillePlatoContainer');
let chipBet = document.querySelectorAll('.Chip-Bet');
let selectedAmountChip = document.querySelector('.Chip-Bet.-selected');
let colorCellList = [
    'g', 
    'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'b', 'r',
    'b', 'r', 'b', 'r', 'b', 'r', 'r', 'b', 'r', 'b', 'r', 'b',
    'r', 'b', 'r', 'b', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r',
]

let initGameBoard = () => {
    // Add 0 cell
    let gameBoardZero = document.createElement('div');
    gameBoardZero.classList.add('gameBoardCell');
    gameBoardZero.classList.add('color-g');
    gameBoardZero.classList.add('zeroCell');
    gameBoardZero.id = 'cell0';
    gameBoardZero.innerHTML = `<p>0</p>`;
    gameBoard.appendChild(gameBoardZero);

    // Add 1-36 cells
    let gameBoardNumber = document.createElement('div');
    gameBoardNumber.classList.add('gameBoardNumber');
    for (let i = 1; i < 37; i++) {
        let gameNumber = document.createElement('div');
        gameNumber.classList.add('gameBoardCell');
        gameNumber.classList.add(`color-${colorCellList[i]}`);
        gameNumber.id = `cell${i}`;
        gameNumber.innerHTML = `<p>${i}</p>`;
        gameBoardNumber.appendChild(gameNumber);
    }
    gameBoard.appendChild(gameBoardNumber);

    // Add black and red cells
    let gameBoardColor = document.createElement('div');
    gameBoardColor.classList.add('gameBoardColor');
    let gameBoardColorBlack = document.createElement('div');
    gameBoardColorBlack.classList.add('gameBoardColorCell');
    gameBoardColorBlack.classList.add('color-b');
    gameBoardColorBlack.id = 'blackCell';
    gameBoardColorBlack.innerHTML = `<p>Black</p>`;
    gameBoardColor.appendChild(gameBoardColorBlack);
    let gameBoardColorRed = document.createElement('div');
    gameBoardColorRed.classList.add('gameBoardColorCell');
    gameBoardColorRed.classList.add('color-r');
    gameBoardColorRed.id = 'redCell';
    gameBoardColorRed.innerHTML = `<p>Red</p>`;
    gameBoardColor.appendChild(gameBoardColorRed);
    gameBoard.appendChild(gameBoardColor);
}

let selectChip = (chip) => {
    chipBet.forEach(element => {
        element.classList.remove('-selected');
    });
    chip.classList.toggle('-selected');
    selectedAmountChip = chip.getAttribute('data-amount');
    console.log(selectedAmountChip);
}

// Add event listener
document.addEventListener('DOMContentLoaded', function() {
    initGameBoard();
});
chipBet.forEach(element => {
    element.addEventListener('click', () => {
        selectChip(element);
    });
});
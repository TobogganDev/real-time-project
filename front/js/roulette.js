document.addEventListener('DOMContentLoaded', function() {
    initGameBoard();
});

function initGameBoard() {
    let gameBoard = document.querySelector('.grillePlatoContainer');
    let colorCellList = [
        'g', 
        'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'b', 'r',
        'b', 'r', 'b', 'r', 'b', 'r', 'r', 'b', 'r', 'b', 'r', 'b',
        'r', 'b', 'r', 'b', 'b', 'r', 'b', 'r', 'b', 'r', 'b', 'r',
    ];

    // Add 0 cell
    let gameBoardZero = document.createElement('div');
    gameBoardZero.classList.add('gameBoardCell', 'color-g', 'zeroCell');
    gameBoardZero.id = 'cell0';
    gameBoardZero.innerHTML = `<p>0</p>`;
    gameBoard.appendChild(gameBoardZero);

    // Add 1-36 cells directly to the grid container
    for (let i = 1; i < 37; i++) {
        let gameNumber = document.createElement('div');
        gameNumber.classList.add('gameBoardCell', `color-${colorCellList[i]}`);
        gameNumber.id = `cell${i}`;
        gameNumber.innerHTML = `<p>${i}</p>`;
        gameBoard.appendChild(gameNumber);
    }

    // Add black and red cells
    let gameBoardColorBlack = document.createElement('div');
    gameBoardColorBlack.classList.add('gameBoardColorCell', 'color-b');
    gameBoardColorBlack.id = 'blackCell';
    gameBoardColorBlack.innerHTML = `<p>Black</p>`;
    gameBoard.appendChild(gameBoardColorBlack);

    let gameBoardColorRed = document.createElement('div');
    gameBoardColorRed.classList.add('gameBoardColorCell', 'color-r');
    gameBoardColorRed.id = 'redCell';
    gameBoardColorRed.innerHTML = `<p>Red</p>`;
    gameBoard.appendChild(gameBoardColorRed);
}

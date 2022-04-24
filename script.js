const gameBoard = (() => {
    let board = [['', '', ''], ['', '', ''], ['', '', '']];

    const getBoard = () => board;

    function placeTile(x, y, sign) {
        if (board[x][y] != 'X' && board[x][y] != 'O') {
            board[x][y] = sign;
            return true;
        } else {
            return {msg: "Error: this tile is already assigned"};
        }
    }

    function display() {
    }

    function reset() {
        board = [['', '', ''], ['', '', ''], ['', '', '']];
    }

    return {getBoard, placeTile, reset, display}
})();

const game = (() => {
    let sign = 'X';

    function switchSign() {
        sign = sign == 'X' ? 'O' : 'X';
    }
    
    function start() {

    }

    function placeTile(x, y) {
        if (gameBoard.placeTile(x, y, sign) == true) {
            switchSign();
            UI.display();
        }
    }

    function checkWin() {
        //verfifcations
        return {win: false, winner: ''}
    }

    return { placeTile }
})();

const UI = (() => {
    let board = [];

    const mainDiv = document.querySelector('.game-board');
    for (let x = 0; x < 3; x++) {
        let tileX = document.createElement('div')
        tileX.classList.add('x');
        mainDiv.appendChild(tileX);

        let boardX = [];
        for (let y = 0; y < 3; y++) {
            let tileY = document.createElement('div');
            tileY.classList.add('y');
            tileX.appendChild(tileY);
            boardX.push(tileY);

            tileY.addEventListener('click', () => {
                game.placeTile(x, y);
            });
        }
        board.push(boardX);
    }

    function display() {
        let grid = gameBoard.getBoard();
        board.forEach((lign, x) => {
            lign.forEach((element, y) => {
                element.textContent = grid[x][y];
            })
        });
    }

    return { display };
})();

UI.display();
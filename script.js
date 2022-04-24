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

    function reset() {
        board = [['', '', ''], ['', '', ''], ['', '', '']];
    }

    return {getBoard, placeTile, reset}
})();

const game = (() => {
    let sign = 'X';

    function switchSign() {
        sign = sign == 'X' ? 'O' : 'X';
    }
    
    function restart() {
        gameBoard.reset();
        UI.display();
        UI.switchAccess(true);
    }

    function end() {
        UI.switchAccess(false)
        UI.displayRestart(true);
        UI.showMessage(`${sign} won the game!`);
    }

    function placeTile(x, y) {
        if (gameBoard.placeTile(x, y, sign) == true) {
            UI.display();
            if (checkWin() == true) {
                UI.displayRestart(true);
                end();
            } else {
                switchSign();
            }
        }
    }

    function checkWin() {
        const board = gameBoard.getBoard();
        for (let i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && board[i][0] == board[i][2] && board[i][0] != '') {
                return true;
            }
            if (board[0][i] == board[1][i] && board[0][i] == board[2][i] && board[0][i] != '') {
                return true;
            }
        }
        if (board[0][0] == board[1][1] && board[0][0] == board[2][2] && board[1][1] != '') {
            return true;
        }
        if (board[0][2] == board[1][1] && board[0][2] == board[2][0] && board[1][1] != '') {
            return true;
        }
        return false;
    }

    return { placeTile, restart }
})();

const UI = (() => {
    let board = [];

    const messageDiv = document.querySelector(".message");
    const mainDiv = document.querySelector('.game-board');
    const cache = mainDiv.firstElementChild;
    const restart = document.querySelector('.restart');

    restart.addEventListener('click', () => {
        displayRestart(false);
        game.restart();
    });

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

    function showMessage(msg) {
        messageDiv.textContent = msg;
    }

    function switchAccess(access) {
        if (access == false) {
            cache.classList.add('cache');
        } else {
            cache.classList.remove('cache');
        }
    }

    function displayRestart(display) {
        if (display) {
            restart.classList.remove('inactive');
        } else {
            restart.classList.add('inactive');
        }
    }

    function display() {
        let grid = gameBoard.getBoard();
        board.forEach((lign, x) => {
            lign.forEach((element, y) => {
                element.textContent = grid[x][y];
            })
        });
    }

    return { display, switchAccess, showMessage, displayRestart };
})();

UI.display();
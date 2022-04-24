const Player = (name, sign) => {
    
    const getName = () => name;
    const getSign = () => sign;

    return { getName, getSign }
}

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
    let player1 = Player('player1', 'X');
    let player2 = Player('player2', 'O');
    let currentPlayer = player1;

    function switchSign() {
        currentPlayer = currentPlayer.getSign() == 'X' ? player2 : player1;
    }

    function start() {
        let playerName = document.querySelector('.player1').lastElementChild.value || 'Player 1';
        player1 = Player(playerName, 'X');
        playerName = document.querySelector('.player2').lastElementChild.value || 'Player 2';
        player2 = Player(playerName, 'O');
        UI.showMessage(`${player1.getName().toUpperCase()} vs ${player2.getName().toUpperCase()}`)
    }
    
    function restart() {
        gameBoard.reset();
        UI.display();
        UI.switchAccess(true);
    }

    function end() {
        UI.switchAccess(false)
        UI.displayRestart(true);
        UI.showMessage(`${currentPlayer.getName()} won the game!`);
    }

    function placeTile(x, y) {
        if (gameBoard.placeTile(x, y, currentPlayer.getSign()) == true) {
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

    return { placeTile, restart, start }
})();

const UI = (() => {
    let board = [];

    const messageDiv = document.querySelector(".message");
    const mainDiv = document.querySelector('.game-board');
    const cache = mainDiv.firstElementChild;
    const restart = document.querySelector('.restart');
    const startBtn = document.querySelector('.start-btn');

    //CONFIURE START // RESTART GAME BTN
    startBtn.addEventListener('click', () => {
        UI.instanciateBoard();
        startBtn.classList.add('inactive')
        const playerForm1 = document.querySelector('.player1');
        playerForm1.classList.add('inactive');
        const playerForm2 = document.querySelector('.player2');
        playerForm2.classList.add('inactive');
        game.start();
    });
    restart.addEventListener('click', () => {
        displayRestart(false);
        game.restart();
    });

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

    function instanciateBoard() {
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
    }

    function display() {
        
        let grid = gameBoard.getBoard();
        board.forEach((lign, x) => {
            lign.forEach((element, y) => {
                element.textContent = grid[x][y];
            })
        });
    }

    return { display, switchAccess, showMessage, displayRestart, instanciateBoard };
})();
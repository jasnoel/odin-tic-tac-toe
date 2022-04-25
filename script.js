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
    let mode = "vs";

    function switchSign() {
        currentPlayer = currentPlayer.getSign() == 'X' ? player2 : player1;
    }

    function start(newMode) {
        mode = newMode;
        let playerName = document.querySelector('.player1').lastElementChild.value || 'Player 1';
        player1 = Player(playerName, 'X');
        if (mode == 'solo') {
            player2 = Player('AI', 'O');
        } else {
            playerName = document.querySelector('.player2').lastElementChild.value || 'Player 2';
            player2 = Player(playerName, 'O');
        }
        UI.showMessage(`${player1.getName().toUpperCase()} vs ${player2.getName().toUpperCase()}`)
    }
    
    function restart() {
        gameBoard.reset();
        UI.display();
        UI.switchAccess(true);
    }

    function end(winner) {
        UI.switchAccess(false)
        UI.displayRestart(true);
        UI.showMessage(`${winner} won the game!`);
    }

    function checkNul() {
        let output = true;
        const board = gameBoard.getBoard();
        board.forEach((lign) => {
            lign.forEach((tile) => {
                if (tile == '') {
                    output = false;
                }
            })
        })
        return output;
    }

    function placeTile(x, y) {
        if (gameBoard.placeTile(x, y, currentPlayer.getSign()) == true) {
            UI.display();
            if (checkWin() == true) {
                UI.displayRestart(true);
                end(currentPlayer.getName());
            } else if (checkNul()) {
                UI.displayRestart(true);
                end("Nobody ");
            } else {
                console.log(checkNul());
                switchSign();
            }
        }
        if (mode == 'solo') {
            //just searching for a legal move
            const grid = gameBoard.getBoard();
            let x = null;
            let y = null;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[i][j] == '') {
                        x = i;
                        y = j;
                    }
                }
            }
            console.log(x, y)
            if (gameBoard.placeTile(x, y, currentPlayer.getSign()) == true) {
                UI.display();
                if (checkWin() == true) {
                    UI.displayRestart(true);
                    end(currentPlayer.getName());
                } else if (checkNul()) {
                    UI.displayRestart(true);
                    end("Nobody ");
                } else {
                    switchSign();
                }
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
    const AIStartBtn = document.querySelector('.ai-btn');

    //CONFIURE START // RESTART GAME BTN
    const startGame = (mode) => {
        UI.instanciateBoard();
        startBtn.classList.add('inactive');
        AIStartBtn.classList.add('inactive');
        const playerForm1 = document.querySelector('.player1');
        playerForm1.classList.add('inactive');
        const playerForm2 = document.querySelector('.player2');
        playerForm2.classList.add('inactive');
        game.start(mode);
    }
    AIStartBtn.addEventListener('click', () => startGame('solo'));
    startBtn.addEventListener('click', () => startGame('vs'));
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
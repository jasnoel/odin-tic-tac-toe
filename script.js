const gameBoard = (() => {
    let board = [['', '', ''], ['', '', ''], ['', '', '']];

    const getBoard = () => board;

    function placeTile(x, y, sign) {
        if (board[x][y] != 'X' && board[x][y] != 'O') {
            board[x][y] = sign;
        } else {
            return {msg: "Error: this tile is already assigned"};
        }
    }

    function reset() {
        board = [['', '', ''], ['', '', ''], ['', '', '']];
    }

    return {getBoard, placeTile, reset}
})();
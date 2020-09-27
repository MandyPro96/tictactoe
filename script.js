let origBoard;
const plr = 'X';
const comp = 'O';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(e) {
    // console.log(e.target.id)
    if (typeof origBoard[e.target.id] == 'number') {
        turn(e.target.id, plr);
        if (!checkWin(origBoard, plr) && !checkTie()) turn(bestSpot(), comp);

    }

}

function turn(id, player) {
    origBoard[id] = player;
    document.getElementById(id).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) {
        gameOver(gameWon);
    }
}
function checkWin(board, player) {
    let plays = board.reduce((a, c, i) => (c === player) ? a.concat(i) : a, [])
    let gameWon = null;
    for (let [idx, combo] of winCombos.entries()) {
        if (combo.every(e => plays.indexOf(e) > -1)) {
            gameWon = { index: idx, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let idx of winCombos[gameWon.index]) {
        document.getElementById(idx).style.backgroundColor = gameWon.player == plr ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == plr ? "YOU WON!": "YOU LOSE !!")
}

function declareWinner(text) {
    document.querySelector(".endgame").style.display = 'block';
    document.querySelector(".endgame .text").innerText= text;
}

function emptySquares() {
    return origBoard.filter(e => typeof e =='number')
}

function bestSpot() {
    return minimax(origBoard,comp).index 
}

function checkTie() {
    if(emptySquares().length==0) {
        for(var i=0;i<cells.length;i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click',turnClick,false);
        }
        declareWinner('Tie Game!');
        return true;
    }
    return false;

}

function minimax(newBoard,player) {
    var availSpots = emptySquares(newBoard);
    if(checkWin(newBoard,player)) {
        return {score: -10};
    }
    else if (checkWin(newBoard, comp)) {
        return {score: 10};
    }
    else if (availSpots.length==0) {
        return {score: 0};
    }

    var moves = [];
    for(var i = 0;i<availSpots.length;i++) {
        var move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if(player == comp) {
            var result = minimax(newBoard,plr);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard,comp);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }
    var bestmove;
    if(player == comp) {
        var bestScore = -1000;
        for(var i =0 ;i<moves.length;i++) {
            if(moves[i].score>bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }   
        }
    }
    else {
        var bestScore = 1000;
        for(var i =0 ;i<moves.length;i++) {
            if(moves[i].score<bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }   
        }
    }
    return moves[bestMove];

}

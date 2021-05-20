// A Module that modifies the display.
const DisplayController = (() => {
    // Creates a div for each cell in the grid
    const createGridDivs = function () {
        let grid = document.querySelector('#grid')

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let div = document.createElement('div')
                div.dataset.row = i
                div.dataset.col = j
                div.addEventListener('click', updateGridCell)
                grid.appendChild(div);
            }
        }
    }
    // Updates grid cell with its respective element from gameBoard array
    const updateGridCell = function (i, j, symbol) {
        let cell = document.querySelector(`div[data-row="${i}"][data-col="${j}"]`)
        console.log(cell.dataset.row)
        let p = document.createElement('p')
        p.innerHTML = symbol
        cell.appendChild(p) 
    }
    // Displays a prompt for the player whose turn it is.
    const prompt = function (player) {
        let p = document.getElementById('prompt')
        p.innerHTML = `${player.getName()}'s turn.`
    }

    let _startBtn = document.querySelector('#start-btn')
    _startBtn.addEventListener('click', (e) => {
        // e.preventDefault();
        document.querySelector('#start-screen').style.visibility = 'hidden'
        document.querySelector('#game-screen').style.visibility = 'visible'
        play.prompt(play.randomlySelectedPlayer)
    })

    return {createGridDivs, updateGridCell, prompt}
})()

DisplayController.createGridDivs()

// A factory function for creating players.
const Player = (name, type, symbol) => {
    const getName = function () {
        return name
    }
    const getType = function () {
        return type
    }
    const getSymbol = function () {
        return symbol
    }
    const makeMove = function (i, j) {
        if (GameBoard.getBoard()[i][j] === undefined) {
            GameBoard.getBoard()[i][j] = symbol
        }
        DisplayController.updateGridCell(i, j, symbol) 
    }

    return {getName, getType, getSymbol, makeMove}
}

// A Module that represents the game logic
const play = (() => {
    // Create the players.
    const player1 = Player(document.querySelector('#name1').value, 'human', 'X')
    const player2 = Player(document.querySelector('#name2').value, 'human', 'O')
    // Randomly select one of the players to go first.
    const players = [player1, player2]
    let randomlySelectedPlayer = players[Math.floor(Math.random() * players.length)]
    // Make display controller prompt the selected player to make a move.
    const prompt = (selectedPlayer) => {
        DisplayController.prompt(selectedPlayer) 
    }

    return {player1, player2, randomlySelectedPlayer, prompt}
})()

// A Module representing the game board. The game board is a 3x3 grid
const GameBoard = (() => {
    const gameBoard = [[],[],[]]
    const getBoard = function () {
        return gameBoard
    }
    return {getBoard}
})()

DisplayController.createGridDivs()
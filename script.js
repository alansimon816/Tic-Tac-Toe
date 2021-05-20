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
        e.preventDefault();
        document.querySelector('#start-screen').style.visibility = 'hidden'
        document.querySelector('#game-screen').style.visibility = 'visible'
        gameController.play()
    })

    return {createGridDivs, updateGridCell, prompt}
})()

DisplayController.createGridDivs()

// A factory function for creating players.
const Player = (name, type, symbol) => {
    const getName = () => name
    const getType = () => type
    const getSymbol = () => symbol
    const makeMove = function (i, j) {
        if (GameBoard.getBoard()[i][j] === undefined) {
            GameBoard.getBoard()[i][j] = symbol
        }
        DisplayController.updateGridCell(i, j, symbol) 
    }

    return {getName, getType, getSymbol, makeMove}
}

// A Module that represents the game logic
const gameController = (() => {
    let player1
    let player2
    let players

    const prompt = (selectedPlayer) => {
        DisplayController.prompt(selectedPlayer) 
    }

    const play = () => {
        // Create the players.
        player1 = Player((document.querySelector('#name1').value), 'human', 'X')
        player2 = Player((document.querySelector('#name2').value), 'human', 'O')
        // Randomly select one of the players to go first.
        players = [player1, player2]
        let randomPlayer = players[Math.floor(Math.random() * players.length)]
        prompt(randomPlayer)
    }
    return {player1, player2, prompt, play}
})()

// A Module representing the game board. The game board is a 3x3 grid
const GameBoard = (() => {
    const gameBoard = [[],[],[]]
    const getBoard = function () {
        return gameBoard
    }
    return {getBoard}
})()
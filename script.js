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
                div.addEventListener('click', updateGameState)
                grid.appendChild(div);
            }
        }
    }

    const addGridEventListeners = () => {
        let grid = document.querySelector('#grid')
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                document.querySelector(
                `#grid > div[data-row='${i}'][data-col='${j}']`)
                .addEventListener('click', updateGameState)
            }
        }
    }

    // Removes event listeners from each grid div
    const removeGridEventListeners = function () {
        let grid = document.querySelector('#grid')
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let div = document.querySelector(
                    `#grid > div[data-row='${i}'][data-col='${j}']`)
                div.removeEventListener('click', updateGameState)
            }
        }
    }

    const displayPlayAgainButton = () => {
        let btn = document.createElement('button')
        btn.innerHTML = "Play Again"
        btn.addEventListener('click', playAgain)
        document.querySelector("#game-screen").appendChild(btn)
    }
    // Clears the grid that is displayed.
    const clearGrid = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let div = document.querySelector(
                    `#grid > div[data-row='${i}'][data-col='${j}']`)
                div.innerHTML = ''
            }
        }
    }
    // Removes prompt and either the win or draw text from gameScreen.
    const removeText = () => {
        let gameScreen = document.querySelector('#game-screen') 
        gameScreen.removeChild(gameScreen.childNodes[5])
    }

    const removePlayAgainButton = () => {
        let gameScreen = document.querySelector('#game-screen')
        let btn = document.querySelector('#game-screen > button')
        gameScreen.removeChild(btn)
    }

    const playAgain = () => {
        GameBoard.clear()
        clearGrid()
        removeText()
        removePlayAgainButton()
        addGridEventListeners()
        gameController.play()
    }

    // Displays win message.
    const displayWinMsg = () => {
        let gameScreen = document.querySelector('#game-screen')
        let p = document.createElement('p')
        p.innerHTML = `${gameController.getCurrentPlayer().getName()} wins!`
        let grid = document.querySelector('#grid-overlay')
        gameScreen.insertBefore(p, grid)
        console.log('win')
    }

    // Displays draw message.
    const displayDrawMsg = () => {
        let gameScreen = document.querySelector('#game-screen')
        let p = document.createElement('p')
        p.innerHTML = "Draw!"
        let grid = document.querySelector('#grid-overlay')
        gameScreen.insertBefore(p, grid)
        console.log('draw')
    }

    // Updates grid cell with its respective element from gameBoard array
    const updateGameState = function (e) {
        let div = e.target
        let row = div.dataset.row
        let col = div.dataset.col
        
        if (!div.hasChildNodes()) {
            gameController.getCurrentPlayer().makeMove(row, col, 
            gameController.getCurrentPlayer().getSymbol())
            let p = document.createElement('p')
            p.innerHTML = gameController.getCurrentPlayer().getSymbol()
            div.appendChild(p)

            if (gameController.win()) {
                removeGridEventListeners()
                displayWinMsg()
                displayPlayAgainButton()
            }
            else if (gameController.draw()) {
                removeGridEventListeners()
                displayDrawMsg()
                displayPlayAgainButton()
            }
            else {
                gameController.changeTurn()
                gameController.prompt(gameController.getCurrentPlayer())
            }
        }
    }
    // Displays a prompt for the player whose turn it is.
    const prompt = function (player) {
        let p = document.getElementById('prompt')
        p.innerHTML = `${player.getName()}'s turn.`
    }

    // A form validation function to ensure that both fields are filled.
    const fieldsAreFilled = () => {
        let field1 = document.querySelector('#name1')
        let field2 = document.querySelector('#name2')
        return field1.value != '' && field2.value != ''
    }

    // A form validation function to ensure that fields are not equal.
    const fieldsAreDistinct = () => {
        let field1 = document.querySelector('#name1')
        let field2 = document.querySelector('#name2')
        return field1.value != field2.value
    }

    let _startBtn = document.querySelector('#start-btn')
    _startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (fieldsAreFilled() && fieldsAreDistinct()) {
            document.querySelector('#start-screen').style.visibility = 'hidden'
            document.querySelector('#game-screen').style.visibility = 'visible'
            gameController.play()
        } 
    })

    return {createGridDivs, updateGameState, prompt}
})()

DisplayController.createGridDivs()

// A factory function for creating players.
const Player = (name, type, symbol) => {
    const getName = () => name
    const getType = () => type
    const getSymbol = () => symbol

    const makeMove = (row, col, symbol) => GameBoard.getBoard()[row][col] = symbol

    return {getName, getType, getSymbol, makeMove}
}

// A Module that represents the game logic
const gameController = (() => {
    let player1
    let player2
    let currentPlayer

    const prompt = selectedPlayer => {
        DisplayController.prompt(selectedPlayer)
    }

    const win = () => {return (GameBoard.diagonal() || GameBoard.horizontal() || 
        GameBoard.vertical())}

    const draw = () => GameBoard.isFull() && !win()

    const play = () => {
        this.player1 = Player((document.querySelector('#name1').value), 'human', 'X')
        this.player2 = Player((document.querySelector('#name2').value), 'human', 'O')
        let players = [this.player1, this.player2]
        // Randomly select one of the players to go first.
        this.currentPlayer = players[Math.floor(Math.random() * players.length)]
        prompt(this.currentPlayer)
    }

    const changeTurn = () => {
        if (this.currentPlayer == this.player1)
            this.currentPlayer = this.player2
        else
            this.currentPlayer = this.player1
    }

    const getCurrentPlayer = () => this.currentPlayer

    return {player1,
            player2, 
            currentPlayer,
            changeTurn, 
            win, 
            draw, 
            getCurrentPlayer, 
            play,
            prompt}
})()

// A Module representing the game board. The game board is a 3x3 grid
const GameBoard = (() => {
    const gameBoard = [[],[],[]]
    const getBoard = function () {
        return gameBoard
    }

    // Checks if all positions in the board are filled with a symbol.
    const isFull = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard[i][j] == undefined) 
                    return false
            }
        }
        return true
    }

    // Checks if a homogenous diagonal is present in the board.
    const diagonal = () => {
        if ((gameBoard[0][0] == 'X' && gameBoard[1][1] == 'X' && gameBoard[2][2] == 'X') ||
            (gameBoard[2][0] == 'X' && gameBoard[1][1] == 'X' && gameBoard[0][2] == 'X') ||
            (gameBoard[0][0] == 'O' && gameBoard[1][1] == 'O' && gameBoard[2][2] == 'O') ||
            (gameBoard[2][0] == 'O' && gameBoard[1][1] == 'O' && gameBoard[0][2] == 'O')) {
                console.log('diagonal is true')
                return true
        }
        console.log('diagonal is false')
        return false
    }

    const allEqual = arr => arr.every(v => v === arr[0])

    const filled = arr => arr.every(v => v != undefined)

    const horizontal = () => {
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i][0] == gameBoard[i][1] &&
                gameBoard[i][1] == gameBoard[i][2] &&
                gameBoard[i][0] != undefined) {
                console.log('horizontal is true')
                return true
            }
        }  
        console.log('horizontal is false')
        return false
    }

    const vertical = () => {
        let col
        for (let j = 0; j < 3; j++) {
            col = []

            for (let i = 0; i < 3; i++) {
                col.push(gameBoard[i][j])
            }

            if (allEqual(col) && col[0] != undefined) {
                console.log('vertical is true')
                return true
            }
        }
        console.log('vertical is false')
        return false
    }

    const clear = () => {
        for (let i = 0; i < 3; i++) {
            gameBoard[i] = []
        }
    }
    return {getBoard,
            isFull,
            diagonal,
            horizontal,
            vertical,
            allEqual,
            filled,
            clear}
})()
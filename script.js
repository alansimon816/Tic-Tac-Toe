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
    // Updates grid cell with its respective element from gameBoard array
    const updateGameState = function (e) {
        let div = e.target
        let row = div.dataset.row
        let col = div.dataset.col
        console.log(div.dataset.row)
        if (!div.hasChildNodes()) {
            console.log(3)
            gameController.getCurrentPlayer().makeMove(row, col, 
            gameController.getCurrentPlayer().getSymbol())
            let p = document.createElement('p')
            p.innerHTML = gameController.getCurrentPlayer().getSymbol()
            div.appendChild(p)
            if (gameController.win()) {
                console.log('win')
            }
            else if (gameController.draw()) {
                console.log('draw')
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

    let _startBtn = document.querySelector('#start-btn')
    _startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#start-screen').style.visibility = 'hidden'
        document.querySelector('#game-screen').style.visibility = 'visible'
        console.log(1)
        gameController.play()
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
        console.log('gameController.prompt() entered')
        DisplayController.prompt(selectedPlayer)
    }

    // const diagonal = () => {
    //     let board = GameBoard.getBoard()
    //     if ((board[0][0] == 'X' && board[1][1] == 'X' && board[2][2] == 'X') ||
    //         (board[2][0] == 'X' && board[1][1] == 'X' && board[0][2] == 'X') ||
    //         (board[0][0] == 'O' && board[1][1] == 'O' && board[2][2] == 'O') ||
    //         (board[2][0] == 'O' && board[1][1] == 'O' && board[0][2] == 'O')) {
    //             return true
    //     }
    //     return false
    // }

    // const allEqual = arr => arr.every(v => v === arr[0])

    // const horizontal = () => {
    //     let board = GameBoard.getBoard()

    //     for (let i = 0; i < 3; i++) {
    //         if (allEqual(board[i]) && board[i][0] != undefined) {
    //             return true
    //         }
    //     }  

    //     return false
    // }

    // const vertical = () => {
    //     let board = GameBoard.getBoard()
    //     let col
    //     for (let j = 0; j < 3; j++) {
    //         col = []

    //         for (let i = 0; i < 3; i++) {
    //             col.push(board[i][j])
    //         }

    //         if (allEqual(col) && col[0] != undefined) {
    //             return true
    //         }
    //     }
    //     return false
    // }z

    const win = () => {return GameBoard.diagonal() || GameBoard.horizontal() || 
        GameBoard.vertical()}
    
    // const isFull = () => {
    //     let gameBoard = GameBoard.getBoard()
    //     for (let i = 0; i < 3; i++) {
    //         for (let j = 0; j < 3; j++) {
    //             if (gameBoard[i][j] == undefined) 
    //                 return false
    //         }
    //     }
    //     return true
    // }
    
    const draw = () => GameBoard.isFull() && !win()

    const play = () => {
        // Create the players.
        this.player1 = Player((document.querySelector('#name1').value), 'human', 'X')
        this.player2 = Player((document.querySelector('#name2').value), 'human', 'O')
        // Randomly select one of the players to go first.
        let players = [this.player1, this.player2]
        this.currentPlayer = players[Math.floor(Math.random() * players.length)]
        prompt(this.currentPlayer)
        console.log(2)
    }

    const changeTurn = () => {
        if (this.currentPlayer == this.player1)
            this.currentPlayer = this.player2
        else
            this.currentPlayer = this.player1
    }
    const getCurrentPlayer = () => this.currentPlayer
    console.log(4)
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
    const isFull = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard[i][j] == undefined) 
                    return false
            }
        }
        return true
    }

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
        let board = GameBoard.getBoard()

        for (let i = 0; i < 3; i++) {
            if (filled(gameBoard[i]) &&
                gameBoard[i].length == 3 &&
                allEqual(gameBoard[i]) && gameBoard[i][0] != undefined) {
                console.log('horizontal is true')
                return true
            }
        }  
        console.log('horizontal is false')
        return false
    }

    const vertical = () => {
        let board = GameBoard.getBoard()
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
    return {getBoard, isFull, diagonal, horizontal, vertical, allEqual, filled}
})()
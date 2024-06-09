// Define the Player class to represent each player
class Player {
    constructor(name) {
        this.name = name; // Player's name (also used as color)
    }
}

// Define the Game class to manage the game logic
class Game {
    constructor(height, width) {
        // Initialize game properties
        this.WIDTH = width; // Width of the game board
        this.HEIGHT = height; // Height of the game board
        this.players = []; // Array to store player objects
        this.currPlayer = null; // Current player object
        this.board = []; // 2D array to represent the game board
        this.isGameOver = false; // Flag to indicate whether the game is over
    }

    // Method to start the game with specified player names
    startGame(player1Name, player2Name) {
        // Create player objects with names (names are also used as colors)
        this.players = [
            new Player(player1Name), // Player 1's name and color
            new Player(player2Name)  // Player 2's name and color
        ];
        this.currPlayer = this.players[0]; // Set the current player
        this.board = []; // Clear the game board
        this.clearBoard(); // Clear the HTML board representation
        this.makeBoard(); // Create the game board array
        this.makeHtmlBoard(); // Create the HTML representation of the game board
    }

    // Method to clear the HTML board representation
    clearBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';
    }

    // Method to create the game board array
    makeBoard() {
        for (let y = 0; y < this.HEIGHT; y++) {
            this.board.push(Array.from({ length: this.WIDTH }));
        }
    }

    // Method to create the HTML representation of the game board
    makeHtmlBoard() {
        const board = document.getElementById('board');

        // Create the top row for column selection
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', (evt) => this.handleClick(evt));

        // Create cells for each column
        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        board.append(top);

        // Create rows and cells for the game board
        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    }

    // Method to find the bottom empty row in a column
    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    // Method to place a player's piece in the HTML board
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.name; // Use player's name as color
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    // Method to end the game and display a message
    endGame(msg) {
        alert(msg);
        this.isGameOver = true;
    }

    // Method to handle player clicks on the game board
    handleClick(evt) {
        if (this.isGameOver) return;
        const x = +evt.target.id;
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);
        if (this.checkForWin()) {
            return this.endGame(`Player ${this.currPlayer === this.players[0] ? '1' : '2'} won!`);
        }
        if (this.board.every(row => row.every(cell => cell))) {
            return this.endGame('Tie!');
        }
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    // Method to check for a win condition on the game board
    checkForWin() {
        // Function to check if all cells are the same player's piece
        function _win(cells) {
            return cells.every(
                ([y, x]) =>
                    y >= 0 &&
                    y < this.HEIGHT &&
                    x >= 0 &&
                    x < this.WIDTH &&
                    this.board[y][x] === this.currPlayer
            );
        }

        // Iterate over each cell in the board
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                // Define cell combinations for different win directions
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // Check if any of the combinations result in a win
                if (_win.call(this, horiz) || _win.call(this, vert) || _win.call(this, diagDR) || _win.call(this, diagDL)) {
                    return true;
                }
            }
        }
    }
}

// Instantiate a new game object
const game = new Game(6, 7);

// Add event listener for the color form submission
const colorForm = document.getElementById('color-form');
colorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;
    game.startGame(player1Name, player2Name);
});


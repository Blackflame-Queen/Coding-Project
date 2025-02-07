// here's the suits and ranks for the cards
const suits = ["Spades ♠️", "Hearts ❤️", "Diamonds ♦️", "Clubs ♣️"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

// this card class represents 1 card
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    getValue() {
        return ranks.indexOf(this.rank);
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
    }
}

// deck class is to represent the card deck
class Deck {
    constructor() {
        this.cards = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                this.cards.push(new Card(suit, rank));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealCard() {
        return this.cards.pop();
    }
}

// and the player class represents a player, of course
class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        this.score = 0;
    }

    addCard(card) {
        this.hand.push(card);
    }

    playCard() {
        return this.hand.shift(); 
    }

    addPoint() {
        this.score++;
    }

    toString() {
        return `${this.name} (Score: ${this.score})`;
    }
}

// here's the main logic for the game
class Game {
    constructor() {
        this.deck = new Deck();
        this.player1 = new Player("Diva 1");
        this.player2 = new Player("Diva 2");
        this.dealCards();
        this.gameLog = document.querySelector(".log-content");
        this.replayButton = document.getElementById("replay-button");
        this.replayButton.addEventListener("click", () => this.resetGame());
    }

    dealCards() {
        for (let i = 0; i < 26; i++) {
            this.player1.addCard(this.deck.dealCard());
            this.player2.addCard(this.deck.dealCard());
        }
    }
    // this section oversees each round with log entries
    playRound() {
        const card1 = this.player1.playCard();
        const card2 = this.player2.playCard();

        document.querySelector("#player1 .card-display").textContent = card1.toString();
        document.querySelector("#player2 .card-display").textContent = card2.toString();
        
        document.querySelector("#player1 .score").textContent = `Score: ${this.player1.score}`;
        document.querySelector("#player2 .score").textContent = `Score: ${this.player2.score}`;

        let logEntry = document.createElement("div");
        logEntry.textContent = `${this.player1.name} plays: ${card1.toString()} | ${this.player2.name} plays: ${card2.toString()}`;
        this.gameLog.appendChild(logEntry);

        if (card1.getValue() > card2.getValue()) {
            this.player1.addPoint();
            logEntry.textContent += " - Diva 1 wins the battle!!";
        } else if (card1.getValue() < card2.getValue()) {
            this.player2.addPoint();
            logEntry.textContent += " - Diva 2 wins the battle!!";
        } else {
            logEntry.textContent += " - Tie! No one wins!!.";
        }
        
        this.gameLog.scrollTop = this.gameLog.scrollHeight;
    }

    playGame() {
        const interval = setInterval(() => {
            if (this.player1.hand.length === 0 || this.player2.hand.length === 0) {
                clearInterval(interval);
                this.endGame();
            } else {
                this.playRound();
            }
        }, 2000); // this timer starts a round every 2 seconds
    }

    endGame() {
        let result = "";
        if (this.player1.score > this.player2.score) {
            result = `${this.player1.name} wins the war!!`;
        } else if (this.player1.score < this.player2.score) {
            result = `${this.player2.name} wins the war!!`;
        } else {
            result = "Stalemate!! lame...";
        }

        // this logs the final result
        let logEntry = document.createElement("div");
        logEntry.textContent = `Game Over!! ${result}`;
        this.gameLog.appendChild(logEntry);

        
        this.replayButton.disabled = false;
    }

    resetGame() {
        this.player1 = new Player("Diva 1");
        this.player2 = new Player("Diva 2");
        this.deck = new Deck();
        this.dealCards();
        this.gameLog.innerHTML = ""; // Clear the log
        this.replayButton.disabled = true;
        this.playGame();
    }
}

// This code starts the game
const game = new Game();
game.playGame();
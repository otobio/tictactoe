import * as ko from "knockout";


class ScoreBoard {
    played: number;
    playersAndScores: any;

    constructor(playerOne, playerTwo, ...otherPlayers) {
        this.played = 0;
        this.playersAndScores = {};
        this.playersAndScores[playerOne] = 0;
        this.playersAndScores[playerTwo] = 0;

        for (let otherPlayer of otherPlayers) {
            this.playersAndScores[otherPlayer] = 0;
        }
    }

    setGameWinner(playerName) {
        this.playersAndScores[playerName] += 1;
    }
}

class Game {
    private players: Array<string>;
    id: string;
    playersAndCharacters: Object;
    next: number;
    endpoint: string;
    gameplay: Array<string[]>;

    constructor(endpoint: string, gameId: string, ...players) {
        this.endpoint = endpoint + '/' + gameId;
        this.id = gameId;
        this.next = 1;
        this.players = [];
        this.playersAndCharacters = {};
        this.gameplay = [];

        const characters = ['x', 'o']; // etc

        for (let player of players) {
            this.players.push(player);
            const index = Math.floor(Math.random() * characters.length);
            this.playersAndCharacters[player] = characters[index];
            characters.splice(index, 1);
        }
    }

    savePlay(squares: string[]) {
        console.log(squares);
        this.gameplay.push(squares);

        if (this.next + 1 > Object.keys(this.playersAndCharacters).length) {
            this.next = 1;
        } else {
            this.next++;
        }

        this.save();
    }

    whoisNext(): string {
        return this.players[this.next - 1];
    }

    currentPlayerCharacter(): string {
        const playerName = this.whoisNext();
        return this.playersAndCharacters[playerName];
    }

    private fakeAjax(options) {
        return;
        //return $.ajax(options)
    }

    save() {
        this.fakeAjax({
            url: this.endpoint,
            method: this.gameplay.length > 0 ? 'PUT' : 'POST',
            data: JSON.stringify(this)
        });
    }

    delete() {
        this.fakeAjax({
            url: this.endpoint,
            method: 'DELETE'
        });
    }
}

class BoardVM {

    static self;
    endpoint: string;
    activeGame: Game;

    obsP1Character: KnockoutObservable<string>;
    obsP2Character: KnockoutObservable<string>;    
    obsBoxes: KnockoutObservableArray<string>;
    obsScoreBoard: KnockoutObservable<any>;

    constructor() {
        BoardVM.self = this;
        this.endpoint = 'http://localhost:5000/api/';
        this.obsBoxes = ko.observableArray(new Array(9));
        this.obsP1Character = ko.observable('*');
        this.obsP2Character = ko.observable('*');        

        this.newGame();
    }

    private fakeGetJSON(url, cb) {
        let firstEmptyPlace = 0;
        for (let ix = 0; ix < this.obsBoxes().length; ix++) {
            if (!this.obsBoxes()[ix]) {
                firstEmptyPlace = ix + 1;
            }
        }

        return cb({
            success: true,
            gameId: Date.now(),
            place: firstEmptyPlace
        });
    }

    newGame() {
        this.fakeGetJSON(this.endpoint + 'game', (response) => {
            console.log("Server response:", response);
            if (response.success) {
                this.activeGame = new Game(this.endpoint, response.gameId, "Player1", "Computer");
                this.obsP1Character(this.activeGame.playersAndCharacters["Player1"]);
                this.obsP2Character(this.activeGame.playersAndCharacters["Computer"]);
                this.resetBoard();
            }
        });
    }

    resetBoard() {
        this.obsBoxes = ko.observableArray(['', '', '', '', '', '', '', '', '']);
        $('.box').removeClass('blink-box');
    }

    computerPlaysAndMark() {
        this.fakeGetJSON(this.activeGame.endpoint + '/play', (response) => {
            console.log("server response", response);
            if (response.success) {
                this.obsBoxes()[response.place - 1] = this.activeGame.currentPlayerCharacter();
                this.obsBoxes.valueHasMutated();

                this.activeGame.savePlay(this.obsBoxes());

                const matchingBoxes = this.getMatchingBoxes();
                if (matchingBoxes.length === 3) {
                    $('.box[index=' + matchingBoxes[0] + ']').addClass('blink-box');
                    $('.box[index=' + matchingBoxes[1] + ']').addClass('blink-box');
                    $('.box[index=' + matchingBoxes[2] + ']').addClass('blink-box');
                } else {
                    // Player 1 is next
                    //
                }
            }
        })
    }

    mark(place, evt) {
        const $ele = $(evt.target);
        const index = $ele.attr('index');
        const self = BoardVM.self;

        if (self.activeGame.whoisNext() !== 'Computer') {
            self.obsBoxes()[index] = self.activeGame.currentPlayerCharacter();
            self.obsBoxes.valueHasMutated();

            self.activeGame.savePlay(self.obsBoxes());

            const matchingBoxes = self.getMatchingBoxes();
            console.log(matchingBoxes);
            if (matchingBoxes.length === 3) {
                $('.box[index=' + matchingBoxes[0] + ']').addClass('blink-box');
                $('.box[index=' + matchingBoxes[1] + ']').addClass('blink-box');
                $('.box[index=' + matchingBoxes[2] + ']').addClass('blink-box');
            } else {
                // Computer is next
                setTimeout(() => {
                    self.computerPlaysAndMark();
                }, 1000);
            }
        }
    }

    awardWinner() {

    }

    getMatchingBoxes() {
        const POSSIBLE_MATCHES = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
            [3, 4, 5],
            [6, 7, 8]
        ];

        for (let matchGroup of POSSIBLE_MATCHES) {
            const [one, two, three] = matchGroup;

            const valueOne = this.obsBoxes()[one];
            const valueTwo = this.obsBoxes()[two];
            const valueThree = this.obsBoxes()[three];

            if (valueOne === valueTwo && valueTwo === valueThree && valueOne != '') {
                return matchGroup;
            }
        }

        return [];
    }
}

ko.components.register('board', {
    viewModel: BoardVM,
    template: require('raw-loader!./board.html')
});

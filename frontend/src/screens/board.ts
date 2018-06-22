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
        this.endpoint = endpoint + 'game/' + gameId;
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
        $.ajax($.extend({}, options, { contentType: 'application/json' })).then(function () { });
    }

    save() {
        this.fakeAjax({
            url: this.endpoint,
            method: this.gameplay.length > 1 ? 'PUT' : 'POST',
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
    obsStatusBar: KnockoutObservable<string>;
    obsBoxes: KnockoutObservableArray<string>;
    obsScoreBoard: KnockoutObservable<any>;

    constructor() {
        BoardVM.self = this;
        this.endpoint = 'http://localhost:5000/api/';
        this.obsBoxes = ko.observableArray(new Array(9));
        this.obsP1Character = ko.observable('*');
        this.obsP2Character = ko.observable('*');
        this.obsStatusBar = ko.observable('');

        this.newGame();
    }

    private fakeGetJSON(url, cb) {
        let firstEmptyPlace = 0;
        for (let ix = 0; ix < this.obsBoxes().length; ix++) {
            if (!this.obsBoxes()[ix]) {
                firstEmptyPlace = ix + 1;
            }
        }

        $.ajax({
            'url': url,
            'method': 'GET',
            'dataType': 'json',
            'contentType': 'application/json'
        }).then((response) => {
            if (typeof cb === 'function') {
                cb(response);
            }
        });
    }

    newGame() {
        this.fakeGetJSON(this.endpoint + 'game', (response) => {
            if (response.success) {
                this.activeGame = new Game(this.endpoint, response.gameId, "Player1", "Computer");
                this.obsP1Character(this.activeGame.playersAndCharacters["Player1"]);
                this.obsP2Character(this.activeGame.playersAndCharacters["Computer"]);
                this.resetBoard();
            }
        });
    }

    resetBoard() {
        this.obsBoxes(['', '', '', '', '', '', '', '', '']);
        this.obsStatusBar("Turn: Player 1");
        $('.box').removeClass('blink-box');
    }

    computerPlaysAndMark() {
        this.fakeGetJSON(this.activeGame.endpoint + '/play/' + this.activeGame.currentPlayerCharacter(), (response) => {
            if (response.success) {
                const boxes = this.obsBoxes();
                boxes[response.place - 1] = this.activeGame.currentPlayerCharacter();
                this.obsBoxes(boxes);

                this.activeGame.savePlay(boxes);

                const matchingBoxes = this.getMatchingBoxes();
                if (matchingBoxes.length === 3) {
                    $('.box[index=' + matchingBoxes[0] + ']').addClass('blink-box');
                    $('.box[index=' + matchingBoxes[1] + ']').addClass('blink-box');
                    $('.box[index=' + matchingBoxes[2] + ']').addClass('blink-box');

                    this.obsStatusBar("COMPUTER PERSONALITY WINS.");
                } else {
                    this.obsStatusBar("Turn: Player 1");
                }
            }
        })
    }

    mark(place, evt) {
        const $ele = $(evt.target);
        const index = $ele.attr('index');
        const self = BoardVM.self;

        if (self.activeGame.whoisNext() !== 'Computer' && self.obsBoxes()[index] === '') {
            const boxes = self.obsBoxes();
            boxes[index] = self.activeGame.currentPlayerCharacter();
            self.obsBoxes(boxes);

            self.activeGame.savePlay(boxes);

            const matchingBoxes = self.getMatchingBoxes();

            if (matchingBoxes.length === 3) {
                $('.box[index=' + matchingBoxes[0] + ']').addClass('blink-box');
                $('.box[index=' + matchingBoxes[1] + ']').addClass('blink-box');
                $('.box[index=' + matchingBoxes[2] + ']').addClass('blink-box');

                self.obsStatusBar("PLAYER ONE WINS.");
            } else {
                self.obsStatusBar("Turn: Computer");
                self.computerPlaysAndMark();
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

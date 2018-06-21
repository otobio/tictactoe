import * as ko from "knockout";


class BoardVM {
    constructor() {
    }
}

ko.components.register('board', {
    viewModel: BoardVM,
    template: require('raw-loader!./board.html')
});

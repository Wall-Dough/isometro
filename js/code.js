var game;

function Game() {

    this.canvasWidth = 500;
    this.canvasHeight = 500;

    this.init_canvas = function () {
        this.c = document.createElement("canvas");
        this.c.width = this.canvasWidth;
        this.c.height = this.canvasHeight;

        document.body.appendChild(this.c);

        this.ctx = this.c.getContext("2d");
    };
    
    this._init = function () {
        this.init_canvas();
    };
}

window.onload = function () {
    game = new Game();

    game._init();
};
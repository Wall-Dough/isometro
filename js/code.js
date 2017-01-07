var game;

/* Contents */
new Line(null, null);
    // * p1 - Position3D
    // * p2 - Position3D
    // - setOpacity(o)
    // - draw()
new Position3D(0, 0, 0);
    // - project()
new Position2D(0, 0);
    // - unproject(z)
new Graphics(0, 0, 0);
    // - buildGrid()
    // - drawAll()
    // - init_canvas()
    // - _init()
new Game();
    // * graphics - Graphics
    // - init_graphics()
    // - _init()
// window.onload();

// Accepts 3D positions as parameters
function Line(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.opacity = 1;
    
    this.setOpacity = function (o) {
        this.opacity = o;
        return this;
    };

    this.draw = function () {
        var p1_2d = this.p1.project();
        var p2_2d = this.p2.project();
        
        var ctx = game.graphics.ctx;

        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.moveTo(p1_2d.x, p1_2d.y);
        ctx.lineTo(p2_2d.x, p2_2d.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
    };
}

function Position3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.project = function () {
        var graphics = game.graphics;
        var origin = graphics.origin;

        var horiz = graphics.c_width / 2 / graphics.grid_n;
        var vert = horiz * Math.tan(30 * Math.PI / 180);

        var new_x = origin.x + ((x - y) * horiz);
        var new_y = origin.y - ((x + y + (2 * z)) * vert);

        return new Position2D(new_x, new_y);
    };
}

function Position2D(x, y) {
    this.x = x;
    this.y = y;

    this.unproject = function (z) {
        var graphics = game.graphics;
        var origin = graphics.origin;

        var horiz = graphics.c_width / 2 / graphics.grid_n;
        var vert = horiz * Math.tan(30 * Math.PI / 180);
        
        var x_minus_y = (x - origin.x) / horiz;
        var x_plus_y = (origin.y - y) / (2 * vert * z);

        var new_x = (x_minus_y + x_plus_y) / 2;
        var new_y = x_plus_y - new_x;

        return new Position3D(new_x, new_y, z);
    };
}

function Graphics(c_width = 500, c_height = 500, grid_n = 20) {
    this.entities = [];

    this.c_width = c_width;
    this.c_height = c_height;
    this.grid_n = grid_n;
    this.origin;
    this.c;
    this.ctx;

    this.buildGrid = function () {
        var max = Math.floor(grid_n / 2);
        for (var i = -max; i <= max; i++) {
            var p1 = new Position3D(i, -max, 0);
            var p2 = new Position3D(i, max, 0);
            this.entities.push(new Line(p1, p2).setOpacity(1 - Math.abs(i / max)));

            p1 = new Position3D(-max, i, 0);
            p2 = new Position3D(max, i, 0);
            this.entities.push(new Line(p1, p2).setOpacity(1 - Math.abs(i / max)));
        }
    };

    this.drawAll = function () {
        for (var i in this.entities) {
            this.entities[i].draw();
        }
    };

    this.init_canvas = function () {
        this.c = document.createElement("canvas");
        this.c.width = this.c_width;
        this.c.height = this.c_height;

        document.body.appendChild(this.c);

        this.ctx = this.c.getContext("2d");
    };
    
    this._init = function () {

        this.init_canvas();

        this.origin = new Position2D(this.c_width / 2, this.c_height / 2);

        this.buildGrid();

        this.drawAll();
    };
}

function Game() {

    this.graphics;

    this.init_graphics = function () {
        this.graphics = new Graphics(500, 500, 20);
        this.graphics._init();
    };
    
    this._init = function () {
        this.init_graphics();
    };
}

window.onload = function () {
    game = new Game();

    game._init();
};
var game;

/* Contents */
new Player();
new Cube(null, 0, 0, 0);
    // * p - Position3D
new Quad(null, null, null);
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

function Player() {
    this.entity;

    this.draw = function () {
        this.entity.draw();
    };

    this._init = function () {
        this.entity = new Cube(new Position3D(0, 0, 0), 1, 1, 1);
    };
}

// Accepts 3D position and integers for dimensions
function Cube(p, w, b, h) {
    this.p = p;
    this.w = w;
    this.b = b;
    this.h = h;

    this.addX = function (dx) { this.p.x += dx; };

    this.subX = function (dx) { this.p.x -= dx; };

    this.addY = function (dy) { this.p.y += dy; };
    
    this.subY = function (dy) { this.p.y -= dy; };

    this.addZ = function (dz) { this.p.z += dz; };
    
    this.subZ = function (dz) { this.p.z -= dz; };

    this.draw = function () {
        // Right face
        new Quad(
            new Position3D(this.p.x, this.p.y, this.p.z),
            new Position3D(this.p.x + this.w, this.p.y, this.p.z),
            new Position3D(this.p.x + this.w, this.p.y, this.p.z + this.h),
            new Position3D(this.p.x, this.p.y, this.p.z + this.h)
        ).setFill("#DDD").draw();
        // Left face
        new Quad(
            new Position3D(this.p.x, this.p.y, this.p.z),
            new Position3D(this.p.x, this.p.y + this.b, this.p.z),
            new Position3D(this.p.x, this.p.y + this.b, this.p.z + this.h),
            new Position3D(this.p.x, this.p.y, this.p.z + this.h)
        ).setFill("#CCC").draw();
        // Top face
        new Quad(
            new Position3D(this.p.x, this.p.y, this.p.z + this.h),
            new Position3D(this.p.x + this.w, this.p.y, this.p.z + this.h),
            new Position3D(this.p.x + this.w, this.p.y + this.b, this.p.z + this.h),
            new Position3D(this.p.x, this.p.y + this.b, this.p.z + this.h)
        ).setFill("#EEE").draw();
    };
}

function Quad(p1, p2, p3, p4) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.strokeStyle = "black";
    this.fillStyle = "white";

    this.setStroke = function (stroke) {
        this.strokeStyle = stroke;
        return this;
    };
    
    this.setFill = function (fill) {
        this.fillStyle = fill;
        return this;
    };

    this.draw = function () {
        var graphics = game.graphics;
        var ctx = graphics.ctx;

        var p1_2d = this.p1.project();
        var p2_2d = this.p2.project();
        var p3_2d = this.p3.project();
        var p4_2d = this.p4.project();

        ctx.beginPath();
        var old_stroke = ctx.strokeStyle;
        var old_fill = ctx.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.moveTo(p1_2d.x, p1_2d.y);
        ctx.lineTo(p2_2d.x, p2_2d.y);
        ctx.lineTo(p3_2d.x, p3_2d.y);
        ctx.lineTo(p4_2d.x, p4_2d.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = old_stroke;
        ctx.fillStyle = old_fill;
    };
}

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

    this.addEntity = function (entity) {
        this.entities.push(entity);
    };

    this.buildGrid = function () {
        var max = Math.floor(grid_n / 2);
        for (var i = -max; i <= max; i++) {
            var p1 = new Position3D(i, -max, 0);
            var p2 = new Position3D(i, max, 0);
            this.addEntity(new Line(p1, p2).setOpacity(1 - Math.abs(i / max)));

            p1 = new Position3D(-max, i, 0);
            p2 = new Position3D(max, i, 0);
            this.addEntity(new Line(p1, p2).setOpacity(1 - Math.abs(i / max)));
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
    };
}

function Game() {

    this.graphics;
    this.player;

    this.init_graphics = function () {
        this.graphics = new Graphics(500, 500, 20);
        this.graphics._init();
    };

    this.init_player = function () {
        this.player = new Player();
        this.player._init();
        this.graphics.addEntity(this.player);
    };
    
    this._init = function () {
        this.init_graphics();

        this.init_player();

        this.graphics.drawAll();
    };
}

window.onload = function () {
    game = new Game();

    game._init();
};
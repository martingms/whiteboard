/* ----------------------------------------------------
 *
 *   Written by @martingamm, github.com/martingamm
 *
 * ----------------------------------------------------
 */

// Run once the DOM is ready
$(document).ready(function() {
    // Connects to socket.io on backend
    //socket.connect();
    // Inits canvas
    init();
});

// Initializes the canvas, is run on document.ready
function init() {
    //TODO rewrite this function to be more readable and less crappy
    // Gets the canvas element, and the size of the browser window
    var canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        width = window.innerWidth;
        height = window.innerHeight;
        tool = 'draw';

    // Sets the canvas size to be the same as the browser size
    canvas.width = width;
    canvas.height = height;

    var bigcanvas = document.getElementById('bigcanvas');
        bigctx = bigcanvas.getContext('2d');
        bigcanvas.width = 3*width;
        bigcanvas.height = 3*height;

    // Binds mouse and touch events to functions
    $(canvas).bind({
        'mousedown' : mouseDown,
        'mousemove' : mouseMove,
        'mouseup'   : mouseUp,
    });

    //TODO Rename these to a more fitting name
    drawnX = -width;
    drawnY = -height;
};

//TODO Rewrite these to case's, will get many more tools soon
function mouseDown(e) {
    if (tool === 'draw') {
        startDraw(e);
    }
    else if (tool === 'move') {
        startMove(e);
    }
};

function mouseMove(e) {
    if (tool === 'draw') {
        doDraw(e);
    }
    else if (tool === 'move') {
        doMove(e);
    }
};

function mouseUp(e) {
    if (tool === 'draw') {
        stopDraw();
    }
    else if (tool === 'move') {
        stopMove();
    }
};

// Triggered on mousedown, sets draw to true and updates X, Y values.
// Since it was unclear to me, this in this context means the canvas element
function startDraw(e) {
    this.draw = true;
    this.X = e.pageX;
    this.Y = e.pageY;
};

// Triggered on mousemove, strokes a line between this.X/Y and e.pageX/Y
function doDraw(e) {
    if(this.draw) {
        with(bigctx) {
            beginPath();
            lineWidth = 4;
            lineCap = 'round';
            moveTo(-drawnX + this.X, -drawnY + this.Y);
            lineTo(-drawnX + e.pageX, -drawnY + e.pageY);
            stroke();
        }
        ctx.drawImage(bigcanvas, drawnX, drawnY);

        // Sends the data to the server via socket.io
        /*
        socket.send({
                        'fromX' : this.X,
                        'fromY' : this.Y,
                        'toX'   : e.pageX,
                        'toY'   : e.pageY
                    });
        */
        this.X = e.pageX;
        this.Y = e.pageY;
    }
};

// Triggered on mouseup, sets draw to false
function stopDraw() {
    this.draw = false;
};

function startMove(e) {
    this.move = true;
    this.X = e.pageX;
    this.Y = e.pageY;
};

function doMove(e) {
    if (this.move) {
        this.deltaX = e.pageX - this.X;
        this.deltaY = e.pageY - this.Y;
        drawnX = drawnX + this.deltaX;
        drawnY = drawnY + this.deltaY;
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bigcanvas,drawnX,drawnY);
        this.X = e.pageX;
        this.Y = e.pageY;
    }
};

function stopMove() {
    this.move = false;
};

// Triggered when client recieves coordinate data from host
/*
function drawData(data) {
    with(ctx) {
        beginPath();
        lineWidth = 4;
        lineCap = 'round';
        moveTo(data.fromX, data.fromY);
        lineTo(data.toX, data.toY);
        stroke();
    }
};
*/

/* Socket.IO */
/*
var socket = new io.Socket();

// Triggered when client connects with host 
socket.on('connect', function() { 
    console.log('Connected with socket');
});

// Triggered when client recieves data from host
socket.on('message', function(data) { 
    drawData(data);
});

// Triggered when connection is lost between client and host
socket.on('disconnect', function() {
    console.log('Connection lost');
});
*/

/* ----------------------------------------------------
 *
 *   Written by @martingamm, github.com/martingamm
 *
 * ----------------------------------------------------
 */

// Run once the DOM is ready
$(document).ready(function() {
    // Connects to socket.io on backend
    socket.connect();
    // Inits canvas
    init();
});

// Initializes the canvas, is run on document.ready
function init() {
    // Gets the canvas element, and the size of the browser window
    var canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        width = window.innerWidth;
        height = window.innerHeight;

    // Sets the canvas size to be the same as the browser size
    canvas.width = width;
    canvas.height = height;

    // Binds mouse and touch events to functions
    $(canvas).bind({
        'mousedown':  startDraw,
        'mousemove':  draw,
        'mouseup':    stopDraw,
        //FIXME These touchevents doesn't really work because touch also scrolls the page
        //'touchstart': startDraw,
        //'touchmove':  draw,
        //'touchend':   stopDraw
    });
 };

// Triggered on mousedown, sets draw to true and updates X, Y values.
// Since it was unclear to me, this in this context means the canvas element
function startDraw(e) {
    this.draw = true;
    this.X = e.pageX;
    this.Y = e.pageY;
};

// Triggered on mousemove, strokes a line between this.X/Y and e.pageX/Y
function draw(e) {
    if(this.draw) {
        with(ctx) {
            beginPath();
            lineWidth = 4;
            lineCap = 'round';
            moveTo(this.X, this.Y);
            lineTo(e.pageX, e.pageY);
            stroke();
        }
        // Sends the data to the server via socket.io
        socket.send({
                        'fromX' : this.X,
                        'fromY' : this.Y,
                        'toX'   : e.pageX,
                        'toY'   : e.pageY
                    });
        this.X = e.pageX;
        this.Y = e.pageY;
    }
};

// Triggered on mouseup, sets draw to false
function stopDraw() {
    this.draw = false;
};

// Triggered when client recieves coordinate data from host
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


/* Socket.IO */
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

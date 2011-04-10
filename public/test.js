// Run once the DOM is ready
$(document).ready(function() {
    // Inits canvas
    init();
});

function init() {
    var canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        width = canvas.width;
        height = canvas.height;
        drawnX = 0;
        drawnY = 0;

    var bigcanvas = document.getElementById('bigcanvas');
        bigctx = bigcanvas.getContext('2d');
        bigcanvas.width = 5000;
        bigcanvas.height = 5000;

    with(bigctx) {
        beginPath();
        lineWidth = 4;
        lineCap = 'round';
        moveTo(0,0);
        lineTo(5000,5000);
        stroke();
        beginPath();
        moveTo(5000,0);
        lineTo(0,5000);
        stroke();
    }
    ctx.drawImage(bigcanvas,drawnX,drawnY);
    test();
};

function test() {
    $(canvas).bind({
        'mousedown':  function(e){this.move=true;this.X=e.pageX;this.Y=e.pageY;},
        'mousemove':  move,
        'mouseup':    function(){this.move=false;},
    });
};

function move(e) {
    if (this.move) {
        this.deltaX = e.pageX - this.X;
        this.deltaY = e.pageY - this.Y;
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bigcanvas,drawnX+this.deltaX,drawnY+this.deltaY);
        drawnX = drawnX + this.deltaX;
        drawnY = drawnY + this.deltaY;
        this.X = e.pageX;
        this.Y = e.pageY;
    }
};

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

    var bigcanvas = document.getElementById('bigcanvas');
        bigctx = bigcanvas.getContext('2d');
        bigcanvas.width = 3*width;
        bigcanvas.height = 3*height;

    with(bigctx) {
        beginPath();
        lineWidth = 4;
        lineCap = 'round';
        moveTo(0,0);
        lineTo(3*width,3*height);
        stroke();
        beginPath();
        moveTo(3*width,0);
        lineTo(0,3*height);
        stroke();
    }
    drawnX = -width;
    drawnY = -height;
    ctx.drawImage(bigcanvas,drawnX,drawnY);
    test();
};

function test() {
    $(canvas).bind({
        'mousedown' : function(e){this.move=true;this.X=e.pageX;this.Y=e.pageY;},
        'mousemove' : move,
        'mouseup'   : function(){this.move=false;},
    });
};

function move(e) {
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

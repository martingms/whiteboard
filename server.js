/*
* Written by martingamm
* at twitter and github
*/

var path = require('path'),
    http = require('http'),
    paperboy = require('paperboy'),
    io = require('socket.io'),

    // Change to 8000-ish when developing
    PORT = 8005,
    WEBROOT = path.join(path.dirname(__filename), 'public');

// Copied from the paperboy example at: https://github.com/felixge/node-paperboy
server = http.createServer(function(req, res) {
    var ip = req.connection.remoteAddress;
    paperboy
        .deliver(WEBROOT, req, res)
        .addHeader('Expires', 300)
        .addHeader('X-PaperRoute', 'Node')
        .before(function() {
            //console.log('Received Request');
        })
        .after(function(statCode) {
            log(statCode, req.url, ip);
        })
        .error(function(statCode, msg) {
            res.writeHead(statCode, {'Content-Type': 'text/plain'});
            res.end("Error " + statCode);
            log(statCode, req.url, ip, msg);
        })
        .otherwise(function(err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end("Error 404: File not found");
            log(404, req.url, ip, err);
        });
});
server.listen(PORT);

// Logs status code, url that was requested, and the client ip to the console.
function log(statCode, url, ip, err) {
    var logStr = statCode + ' - ' + url + ' - ' + ip;
    if (err) logStr += ' - ' + err;
    console.log(logStr);
};

/* Socket.IO */
var socket = io.listen(server);

// Ghetto-db in the form of an array :p
var db = []

// Triggered when someone connects to the server
socket.on('connection', function(client) {
    for (i = 0; i < db.length; i++) {
        client.send(db[i]);
    };  

    // Triggered when the connected client sends data
    client.on('message', function(data) {
        client.broadcast(data);
        db.push(data);
    });

    // Triggered when someone disconnects from the server
    client.on('disconnect', function() {
 
    });
}); 

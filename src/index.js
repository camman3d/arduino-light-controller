let osc = require('node-osc');
let server = new osc.Server(12346, '127.0.0.1');
let express = require('express');
let app = express();
let SerialPort = require("serialport").SerialPort;

let patterns = [
    'christmas1',
    'christmas2',
    'christmas3',
    'christmas4',
    'christmas5',
    'christmas6',
    'christmas7',
    'valentines1',
    'valentines2',
    'valentines3',
    'stPatricks',
    'easter',
    'america',
    'halloween1',
    'halloween2',
    'rainbow',
    'white1',
    'white2',
    'red',
    'pink',
    'orange',
    'yellow',
    'green',
    'cyan',
    'blue',
    'purple',
    'black'
];


let portName = process.argv[2] || '/dev/tty.usbmodem1421';
let serialport = new SerialPort(portName);
serialport.on('open', function(){
    console.log('Serial Port Opened');
    serialport.on('data', function(data){
        console.log('Got data:', data[0]);
    });
});

function setPattern(pattern) {
    let value = patterns.indexOf(pattern) + 97;
    console.log('Pattern: ' + pattern + ' (' + value + ')');
    serialport.write([value]);
}

server.on('message', msg => {
    // Expecting /led/pattern {pattern}
    if (msg[0] === '/led/pattern') {
        setPattern(msg[1]);
    }
});

app.get('/', (req, res) => {
    res.send(patterns.join(', '));
});

patterns.forEach(pattern => {
    app.get('/pattern/' + pattern, function (req, res) {
        setPattern(pattern);
        res.send(pattern);
    });
});

app.listen(3000, () => {
    console.log('HTTP server listening on port 3000');
});

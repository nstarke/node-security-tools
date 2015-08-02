var net = require('net');
var program = require('commander');
var util = require('util');
var hexdump = require('buffer-hexdump');

program
    .option('-l, --local-host [local-host]', 'Local host')
    .option('-p, --local-port [local-port]', 'Local port')
    .option('-r, --remote-host [remote-host]', 'Remote Host')
    .option('-q, --remote-port [remote-port]', 'Remote Port')
    .parse(process.argv);

var startErrors = [];

if (!program.localPort) {
    startErrors.push('Local port is required.');
}

if (!program.remoteHost) {
    startErrors.push('Remote host is required.');
}

if (!program.remotePort) {
    startErrors.push('Remote port is required.');
}

if (startErrors.length) {
    console.error(startErrors.join(' '));
    process.exit(1);
}

net.createServer(function(socket){
    var client = net.connect({ port: program.remotePort, host: program.remoteHost }, function(){
        socket.on('data', function(data){
            console.log(util.format('[==>] Sending %s bytes to %s:%s', data.length, program.remoteHost, program.remotePort));
            console.log(hexdump(data));
            client.write(data);
        });
        client.on('data', function(data){
            console.log(util.format("[<==] Receiving %s bytes from %s:%s.", data.length, program.remoteHost, program.remotePort));
            console.log(hexdump(data));
            socket.write(data);
        });
    });
}).listen(program.localPort, program.localHost || '0.0.0.0');

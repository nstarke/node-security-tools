var net = require('net');
var program = require('commander');
var exec = require('child_process').exec;
var readline = require('readline');
var util = require('util');
var fs = require('fs');

program
  .option('-a, --listen-address [listen-address]' , 'Listen Address')
  .option('-p, --listen-port [listen-port]', 'Listen Port')
  .option('-t, --target-host [target-host]', 'Target Host')
  .option('-q, --target-port [target-port]', 'Target Port')
  .option('-e, --execute [file-to-run]', 'File to run')
  .option('-c, --command-shell', 'Return a command shell')
  .parse(process.argv);

var startErrors = [];

if (program.listenPort && program.targetHost && program.targetPort) {
    startErrors.push('Must set either listen port OR target host and target port.');
}

if (startErrors.length) {
    console.error(startErrors.join(' '));
    process.exit(1);
}

if (program.listenPort){
    var server = net.createServer(function(socket) {
        socket.on('data', function(data){
            if (program.commandShell) {
                exec(data.toString(), function(err, stdout, stderr){
                    if (stderr) socket.write(stderr);
                    else if (err) socket.write(JSON.stringify(err));
                    else if (stdout) socket.write(stdout);
                    socket.write('<NODE:#> ');
                });
            } else {
                console.log('data received: ' + data.toString());
            }
        });
        if (program.commandShell) {
            socket.write('<NODE:#> ');
        } else if (program.execute) {
            exec(program.execute, function(err, stdout, stderr){
                if (stderr) socket.write(stderr);
                else if (err) socket.write(JSON.stringify(err));
                else if (stdout) socket.write(stdout);
                socket.write('Command Executed: ' + program.execute + '\n');
            });
        }
    }).listen(program.listenPort, program.listenAddress || '0.0.0.0');
} else if (program.targetHost && program.targetPort) {
    var client = net.connect( { port: program.targetPort, host: program.targetHost }, function(){
        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          terminal: false
        });
        rl.on('line', function(line){
            client.write(line);
        });
    });
    client.on('end', function(){
        console.log(util.format('Disconnected from: %s:%s', program.targetHost, program.targetPort));
        process.exit(0);
    });
}

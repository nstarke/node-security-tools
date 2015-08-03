var program = require('commander');
var prompt = require('prompt');
var Client = require('ssh2').Client;
var hexdump = require('buffer-hexdump');
var fs = require('fs');
var util = require('util');
var readline = require('readline');

program
    .option('-r, --remote-host [remote-host]', 'Remote Host')
    .option('-p, --remote-port [remote-port]', 'Remote Port')
    .option('-f, --forward-port [forward-port]', 'Forward Port')
    .option('-k, --key-path [key-path]', 'Private Key Path')
    .option('-u, --username [username]', 'Username')
    .parse(process.argv);

var startErrors = [];

if (!program.remoteHost) {
    startErrors.push('Remote Host is required');
}

if (program.username) {
    prompt.start();
    prompt.get({ properties: { password: { hidden: true } } }, function(err, results) {
        if (err || results.password.length === 0) {
            console.error('Problem with password');
            process.exit(1);
        }

        connect(results.password);
    });
} else {
    fs.readFile(program.keyPath, function(err, file){
        if (err) {
            console.error('Problem with key file');
            process.exit(1);
        }

        connect(null, file);
    });
}

function connect(password, key) {
    var connection = new Client();

    var config = {
        host: program.remoteHost,
        port: program.remotePort || 22
    };

    if (password) {
        config.username = program.username;
        config.password = password;
    } else if (key) {
        config.privateKey = fs.readFileSync(program.keyPath);
    }

    connection.on('ready', function() {
        if (program.forwardPort) {
            connection.forwardIn('127.0.0.1', program.forwardPort, function(err) {
                if (err) return console.error(err);
            });

            connection.on('tcp connection', function (info, accept, reject){
                  accept().on('data', function(data){
                      console.log(util.format('[<==] TCP data forwarded from: %s:%s', info.srcIP, info.srcPort));
                      console.log(hexdump(data));
                  });
            });

            connection.on('close', function() {
                console.log('Connection Closed');
                process.exit();
            });
        } else {
            connection.shell(function(err, stream) {
                if (err) return console.error(err);
                process.stdin.pipe(stream);
                stream.pipe(process.stdout);
                stream.on('close', function() {
                    connection.close();
                });
            });

            connection.on('close', function() {
                console.log('Connection Closed');
                process.exit();
            });
        }
    });

    connection.connect(config);
}


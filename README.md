# Node Security Tools
This repository serves as a collection of command line node scripts useful for penetration testers operating in a node environment.

## Examples:

### Netcat.js

Listen on port 8000 and return a command shell.
```
node netcat.js --listen-port 8000 -c
```

Connect on port 80 to localhost:
```
node netat.js --target-port 80 --target-address localhost
```

### TCP-Proxy.js

Listen on port 8000 and forward to port 80 on (most) home routers (192.168.1.1).
```
node tcp-proxy.js --local-port 8000 --remote-host 192.168.1.1 --remote-port 80
```

### SSH-Tunnel.js

Connect to remote address 192.168.0.156 and spawn shell:
```
node ssh-tunnel.js --remote-host 192.168.0.156 -u username
```

Connect to remote address 192.168.0.156 and open up a port on 192.168.0.156 to pipe data back
```
node ssh-tunnl.js --remote-host 192.168.0.156 -u username -f 8000
```

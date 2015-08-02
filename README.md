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

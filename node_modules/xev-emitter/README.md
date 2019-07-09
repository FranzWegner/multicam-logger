## Get keyup and keydown on Linux
Natively, node.js only gives you the 'keypress' event. It doesn't give you 'keyup' and 'keydown' events.

An alternative, if you are running a Linux desktop, is to parse the output of the `xev` command, which opens up a window and outputs all the X events that happen inside.

That's what this does.

## Usage

Installation
```
npm install xev-emitter
```

```javascript
// example.js
const xevEmitter = require('xev-emitter')(process.stdin)
xevEmitter.on('KeyPress', (key) => {
    console.log(key, 'was pressed')
})

xevEmitter.on('KeyRelease', (key) => {
    console.log(key, 'was released')
})
```

```sh
$ xev | node example.js
h was pressed
h was released
e was pressed
e was released
l was pressed
l was released
l was pressed
l was released
o was pressed
o was released
```

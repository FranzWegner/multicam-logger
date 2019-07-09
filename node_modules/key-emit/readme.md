# key-emit
This module creates node.js -styled event emitters for the key down, key up, and key press events and reformats the events so you can listen specifically for certain keys.  

The module also turns all key events into easier to digest/remember key strings, using a familiar format.   Basically, it removed some of the annoyances of dealing with key codes...

# Examples
The module returns a constructor that takes the dom element to listen on for key events.

If your in the node environment (electron, nw..)

```js
ke = require('key-emit')(document);
```

If you are in the browser straight up, include the browserified bundle

```html
<script src="../dist/key-emit.js" type="text/javascript"></script>

<script type="text/javascript">

    // key_emit is a global added by the key-emit.js include ^
    var ke = key_emit(document);
```

The ke object created by the constructor creates three event emitters for down/up and press events.

## Responding to key press events
Key press events can be captured using standard printable strings.  So if you want to register a handler for the ! character, you just do this:

```js
ke.pressed.on('!', function() {
    console.log("Pressed -> Hurrary!");
});
```

Upper and lower case letters are distinct:

```js
ke.pressed.on('A', function() {
	console.log("Capital A");
})
ke.pressed.on('a', function(){
	console.log("Lower case a");
})
```

See the listings of character string below for details about special characters.

## Responding to key down and up events
There is literally no difference when using key down and key up events, however there are more events fired (for instance, the Ctrl key doesn't generate a key press, but it does generate and up/down event).

**Note - you don't need to worry about character codes or anything like that...**  In addition, it does away with the differences between keys that really print the same.  For example, the `+` sign will always generate the '+' event, no matter if it is the result of the number pad key or the shift+= key.  Same with upper/lower case as well.

```js
ke.down.on('!', function() {
    console.log("Down -> Hurrary!");
});
ke.up.on('A', function() {
	console.log("Capital A released");
})
ke.up.on('a', function(){
	console.log("Lower case a released");
})
```

## Modifiers
You can listen for modifier commands as well - but this is a bit different than typically usage in JavaScript.

The shift modifier gets swallowed in most situations.  For example, if the user presses shift+c, the key down/up events will fire with the event "C", not "shift+c" as is commonly done.

Ctrl modifiers can be listened for, but only for down/up events (pressed events don't fire - at least not in electon.

```js
ke.down.on('ctrl H', function() {
   console.log("Pressed -> ctrl H");
});
```  
Unlike normal characters, the ctrl modifier always fires events with the upper case version of the ascii letter pressed.  

## Numeric events
Lots of time you want to use the individual numbers (as integers), 0-9.  key-emit will emit a special event (in addition to the normal press/up/down events) when a character 0-9 is pressed.  It will send the numeric value of the key as an event argument, so you don't need to bother with converting ascii to the number.

```js
key.pressed.on("0-9", function(value){
    my_array[value] = true;  // if user types "2", my_array[2] will be set to true
})
```

## Where's the any key?
You can also add a handler on "[any_key](http://cdn.meme.am/instances/43637787.jpg)" event.  The emitters will all generate this event whenever anything is pressed.  The actual event string (ex. "A") will be sent as the argument.  This is nice for debugging and logging.

```js
key.pressed.on("any_key", function(key_event) {
    console.log("User pressed " + key_event);
});
```

## Event list

The following are a list of events that can be listened for on the down/up/pressed event emitters.  You just register handlers for these strings - no mess no fuss.  Your event handler will be called no matter how the user managed to enter the character.

```
0-9 (number send as argument)
backspace
tab
enter
shift
ctrl
alt
pause/break
capslock
escape
space
pageup
pagedown
end
home
left
up
right
down
insert
delete
leftwindow
rightwindow
select
numlock
scrolllock
f1
f2
f3
f4
f5
f6
f7
f8
f9
f10
f11
f12
0
1
2
3
4
5
6
7
8
9
a
b
c
d
e
f
g
h
i
j
k
l
m
n
o
p
q
r
s
t
u
v
w
x
y
z
A
B
C
D
E
F
G
H
I
J
K
L
M
N
O
P
Q
R
S
T
U
V
W
X
Y
Z
*
+
-
.
/
:
<
_
>
?
~
{
|
}
\
;
=
,
`
[
]
'
)
!
@
#
$
%
^
&
(
```
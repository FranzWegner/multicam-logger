var maps = require("./keymaps")
var EventEmitter = require('wolfy87-eventemitter');


var make_key_updown_string = function(event) {
    var primary = maps.lower[event.keyCode];
    var upper_case = false;
    if (!primary || event.shiftKey) {
        if (maps.upper[event.keyCode]) {
            primary = maps.upper[event.keyCode]
            upper_case = true;
        }
    }
    var mods = [];
    if (primary != maps.mods.shift && !upper_case && event.shiftKey) {
        mods.push(maps.mods.shift);
    }
    if (primary != maps.mods.ctrl && event.ctrlKey) {
        primary = primary.toUpperCase();
        mods.push(maps.mods.ctrl);
    }
    if (primary != maps.mods.alt && event.altKey) {
        mods.push(maps.mods.alt);
    }
    if (primary != maps.mods.meta && event.metaKey) {
        mods.push(maps.mods.met);
    }

    return [mods.join(" "), primary].join(" ").trim();
}

var make_key_press_string = function(event) {
    var str = String.fromCharCode(event.which);
    if (event.which < 32) {
        str = "ctrl " + String.fromCharCode(event.which + 64);
    } else if (event.which == 127) {
        str = "delete"
    }
    if (maps.pressed[str]) {
        str = maps.pressed[str];
    }
    return str;
}

var is_number_key = function(str) {
    return !isNaN(parseInt(str));
}

var emit = function(e, str){
        e.emit(str);
        if (is_number_key(str)) {
            e.emit("0-9", parseInt(str));
        }
        e.emit("any_key", str);
}

var entry = function(domElement) {
    var domElement = domElement || document;

    // make three event emitters for the various key event types
    var pressed = new EventEmitter();
    var down = new EventEmitter();
    var up = new EventEmitter();



    var on_key_down = function(event) {
        var str = make_key_updown_string(event);
        emit(down, str);
    }
    var on_key_up = function(event) {
        var str = make_key_updown_string(event);
        emit(up, str);
    }
    var on_key_pressed = function(event) {
        var str = make_key_press_string(event);
        emit(pressed, str);

    }

    

    domElement.addEventListener("keydown", on_key_down, false);
    domElement.addEventListener("keyup", on_key_up, false);
    domElement.addEventListener("keypress", on_key_pressed, false);

    return {
        pressed: pressed,
        down: down,
        up: up
    }
  }


if (typeof module !== 'undefined') {
  module.exports = entry; 
}
else {
    window.key_emit = entry;
}


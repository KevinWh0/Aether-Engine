import { height } from "../../toolbox";

let mouse = {
  x: 0,
  y: 0,
  which: -1,
  scroll: 0,
  currentlyPressed: false,
  clicked: false,
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
};

let keyboard = {
  keys: new Array(255),
  KEY: {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    TAB: 9,
    ENTER: 13,
    BACKSPACE: 8,
    DELETE: 46,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM0: 48,
    NUM1: 49,
    NUM2: 50,
    NUM3: 51,
    NUM4: 52,
    NUM5: 53,
    NUM6: 54,
    NUM7: 55,
    NUM8: 56,
    NUM9: 57,
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
  },
  currentlyPressed: false,
  keyPressed: -1,
  keyReleased: -1,
};

let game = {
  canvas: {
    width: window.innerWidth,
    height: window.innerHeight,
    canvas: document.createElement("canvas"),
    context: undefined,

    start: function () {
      init();
    },
    init: function () {},
  },

  setLoopFunc: function (func) {
    updateGameArea = func;
    game.interval = setInterval(updateGameArea, Math.round(1000 / 60));
  },

  resetMousePressed: function () {
    mouse.clicked = false;
  },

  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

game.canvas.id = "canvas";
game.context = game.canvas.canvas.getContext("2d");
document.getElementById("canvasHolder").appendChild(game.canvas.canvas);

window.addEventListener("mousedown", function (e) {
  mouse.currentlyPressed = true;
  mouse.clicked = true;

  //for which button was pressed
  if (e.which == null)
    /* IE case */
    mouse.which =
      e.button < 2 ? mouse.LEFT : e.button == 4 ? mouse.MIDDLE : mouse.RIGHT;
  /* All others */ else
    mouse.which =
      e.which < 2 ? mouse.LEFT : e.which == 2 ? mouse.MIDDLE : mouse.RIGHT;
});

window.addEventListener("mouseup", function (e) {
  mouse.which = -1;
  mouse.currentlyPressed = false;
});

window.addEventListener("mousemove", function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("wheel", function (e) {
  mouse.scroll = e.deltaY;
});

window.addEventListener("keydown", function (e) {
  let keyCode = getCode(e.key);
  keyboard.keys[getCode(e.key.toUpperCase())] = true;
  keyboard.keyPressed = keyCode;
});

window.addEventListener("keyup", function (e) {
  let keyCode = getCode(e.key);
  keyboard.keys[getCode(e.key.toUpperCase())] = false;
  keyboard.keyReleased = keyCode;
});

window.addEventListener("resize", function (e) {
  resize();
});

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  game.canvas.canvas.width = width;
  game.canvas.canvas.height = height;

  game.canvas.canvas.style.width = `${width}px`;
  game.canvas.canvas.style.height = `${height}px`;
  game.context.imageSmoothingEnabled = false;
}
resize();
let renderer = {
  setContext: function (context) {
    this.context = context;
  },

  fill: function (color) {
    game.context.fillStyle = color;
  },
  rect: function (x, y, w, h) {
    game.context.fillRect(x, y, w, h);
  },
  //rectOutline:
  //roundedRect
  circle: function (x, y, r) {
    game.context.beginPath();
    game.context.arc(x, y, r, 0, 2 * Math.PI);
    game.context.fill();
  },

  setFont: function (font) {
    game.context.font = font;
  },

  setFontSize: function (size, font) {
    game.context.font = size + "px " + font;
  },

  text: function (text, x, y) {
    game.context.font = font;
    game.context.fillText(text, x, y);
  },
  textWrapped: function (text, x, y, maxWidth) {
    var words = text.split(" ");
    var line = "";
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = game.context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        game.context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    game.context.fillText(line, x, y);
  },

  image: function (image, x, y, w, h) {
    game.context.drawImage(image, x, y, w, h);
  },

  cropImage: function (img, x, y, w, h, cropX, cropY, cropW, cropH) {
    game.context.mozImageSmoothingEnabled = false;
    game.context.webkitImageSmoothingEnabled = false;
    game.context.msImageSmoothingEnabled = false;
    game.context.imageSmoothingEnabled = false;
    game.context.drawImage(img, cropX, cropY, cropW, cropH, x, y, w, h);
  },

  line: function (x1, y1, x2, y2) {
    game.context.beginPath();
    game.context.moveTo(x1, y1);
    game.context.lineTo(x2, y2);
    game.context.stroke();
  },
};

//Extra
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

Array.prototype.copy = function (arr) {
  let array = [];
  arr.forEach((e) => {
    array.push(e);
  });
  return array;
};

Array.prototype.equals = function (a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

Math.seededRandom = function (seed) {
  seed = ((seed * 9301 + 49297) % 233280) + "";
  for (var i = 0, h = 1779033703 ^ seed.length; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (
    ((function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    })() /
      1799436495) %
    1
  );
};

Map.prototype.getByValue = function (map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
};

function getCode(char) {
  return char.charCodeAt(0);
}

function setCursor(cursor) {
  document.body.style.cursor = cursor;
}

let events = new Map()

function subscribeToEvent(name, func) {
  events.set(name, func)
  return {
    unsubscribe: ()=>{
      events.delete(name)
    }
  }
}

function emitEvent(name, parameters) {
  let event = events.get(name)
  if(event){
    event(parameters)
  }else{
    console.error(`No such Event \"${name}\"`)
  }
}


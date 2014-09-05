var canvasWidth = document.body.clientWidth;
var canvasHeight = document.body.clientHeight;
var bigBallNumber = 0;
var gameScore = 1000;
var bigBallshapes = [];
var shapes = [];
var smallBallNumber = 200;
var bigBallLifeTime = 5000;
var gameFrequency = 10;
var smallBallAddFrequency = 100;
var bigBallRadius = 25;
var smallBallRadius = 10;
var gameStartSwitch = true;
var smallBallCollsionDetectionSwitch = true;
var smallBallMass = 1;


var o_canvasElement = document.getElementById('musicGame');
var o_canvasContext = o_canvasElement.getContext('2d');
var canvasElement = document.createElement('canvas');
var canvasContext = canvasElement.getContext('2d');


function winResize() {
    canvasWidth = document.body.clientWidth;
    canvasHeight = document.body.clientHeight;
    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;
    canvasContext.canvas.width = canvasWidth;
    canvasContext.canvas.height = canvasHeight;
    o_canvasContext.canvas.width = canvasWidth;
    o_canvasContext.canvas.height = canvasHeight;
};

var gameStart = function() {
    canvasContext.canvas.width = canvasWidth;
    canvasContext.canvas.height = canvasHeight;
    o_canvasContext.canvas.width = canvasWidth;
    o_canvasContext.canvas.height = canvasHeight;
    //SmallBall Draw
    drawBall = function drawBall() {
        //console.log('smallBallNumber=' + smallBallNumber);
        if (gameStartSwitch === true) {
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            if (smallBallCollsionDetectionSwitch === true) {
                smallBallCollsionDetection();
            }
            for (var n = 0; n < shapes.length; n++) {
                var tmpShape = shapes[n];
                smallBall(tmpShape);
            }
            for (var p = 0; p < bigBallshapes.length; p++) {
                var tmpbigBallshapes = bigBallshapes[p];
                bigBallshapes[p].lifeTime += 30;
                if (bigBallshapes[p].lifeTime > bigBallLifeTime) {
                    bigBallRemove(p);
                }
                CollsionDetection(tmpbigBallshapes);
                BigBallCreat(tmpbigBallshapes);
            }
        }
        o_canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        o_canvasContext.drawImage(canvasElement, 0, 0);
        setTimeout('drawBall()', gameFrequency);
    };
    setTimeout('drawBall()', gameFrequency);
};

var CollsionDetection = function(tmpbigBallshapes) {
    for (var n = 0; n < shapes.length; n++) {
        var tmpShape = shapes[n];
        if ((tmpShape.x - tmpbigBallshapes.x) * (tmpShape.x - tmpbigBallshapes.x) + (tmpShape.y - tmpbigBallshapes.y) * (tmpShape.y - tmpbigBallshapes.y) <= (bigBallRadius + smallBallRadius) * (bigBallRadius + smallBallRadius)) {
            bigBallshapes.push(new bigBallshape(shapes[n].x, shapes[n].y, color(), bigBallRadius, 0));
            shapes.splice(n, 1);
            var audio = new Audio();
            var musicPlay = audio.played;
            audio.setAttribute("src", 'ogg/' + (Math.floor(Math.random() * 8) + 1) + '.ogg');
            audio.load();
            audio.play();
            audio = null;
            musicPlay = null;
            gameScore = gameScore + 50;
        }
    }
};

var smallBallCollsionDetection = function() {
    for (var i = 0; i < shapes.length - 1; i++) {
        for (var j = i + 1; j < shapes.length; j++) {
            var newshapesX10 = shapes[j].x + shapes[j].speedX;
            var newshapesY10 = shapes[j].y + shapes[j].speedY;
            var newshapesX20 = shapes[i].x + shapes[i].speedX;
            var newshapesY20 = shapes[i].y + shapes[i].speedY;
            var dXAfter = newshapesX10 - newshapesX20;
            var dYAfter = newshapesY10 - newshapesY20;
            if (dXAfter * dXAfter + dYAfter * dYAfter <= smallBallRadius * 2 * smallBallRadius * 2) {
                var dX = shapes[j].x - shapes[i].x;
                var dY = shapes[j].y - shapes[i].y;
                var angle = Math.atan2(dY, dX);
                var vX10;
                var xY10;
                var vX20;
                var xY20;
                var X10;
                var Y10;
                var X20;
                var Y20;
                var exchange;
                vX10 = xDecomposition(shapes[i].speedX, shapes[i].speedY, angle);
                vY10 = yDecomposition(shapes[i].speedX, shapes[i].speedY, angle);
                vX20 = xDecomposition(shapes[j].speedX, shapes[j].speedY, angle);
                vY20 = yDecomposition(shapes[j].speedX, shapes[j].speedY, angle);
                exchange = vX10;
                vX10 = vX20;
                vX20 = exchange;
                shapes[i].speedX = yDecomposition(vX10, vY10, angle);
                shapes[i].speedY = xDecomposition(vX10, vY10, angle);
                shapes[j].speedX = yDecomposition(vX20, vY20, angle);
                shapes[j].speedY = xDecomposition(vX20, vY20, angle);
            }
        }
    }
};


var xDecomposition = function(x, y, angle) {
    var sine = Math.sin(angle);
    var cosine = Math.cos(angle);
    return x * cosine + y * sine;
};
var yDecomposition = function(x, y, angle) {
    var sine = Math.sin(angle);
    var cosine = Math.cos(angle);
    return y * cosine - x * sine;
};


var smallBallAdd = function() {
    var smallBallX = Math.random() * canvasWidth;
    var smallBallY = Math.random() * canvasHeight;
    if (shapes.length === 0) {
        shapes.push(new shape(smallBallX, smallBallY, smallBallMass, color(), Speed(), Speed()));
        return;
    }
    for (var i = 0; i < shapes.length; i++) {
        var dX = smallBallX - shapes[i].x;
        var dY = smallBallY - shapes[i].y;
        if (dX * dX + dY * dY <= smallBallRadius * 2 * smallBallRadius * 2 * 4) {
            return;
        }
    }
    shapes.push(new shape(smallBallX, smallBallY, smallBallMass, color(), Speed(), Speed()));
};

var smallBall = function(tmpShape) {
    var score = document.getElementById('score');
    //SmallBall Collsion Detection
    if (tmpShape.x - smallBallRadius < 0) {
        tmpShape.speedX = Math.abs(tmpShape.speedX);
    } else if ((tmpShape.x + smallBallRadius) >= canvasWidth) {
        tmpShape.speedX = -Math.abs(tmpShape.speedX);
    } else if (tmpShape.y - smallBallRadius < 0) {
        tmpShape.speedY = Math.abs(tmpShape.speedY);
    } else if ((tmpShape.y + smallBallRadius) >= canvasHeight) {
        tmpShape.speedY = -Math.abs(tmpShape.speedY);
    }
    //SmallBall Draw Start
    canvasContext.fillStyle = tmpShape.color;
    canvasContext.save();
    canvasContext.globalCompositeOperation = "destination-over";
    //SmallBall Direction
    tmpShape.x = tmpShape.x + tmpShape.speedX;
    tmpShape.y = tmpShape.y + tmpShape.speedY;
    canvasContext.beginPath();
    canvasContext.arc(tmpShape.x, tmpShape.y, smallBallRadius, 0, Math.PI * 2, false);
    canvasContext.fill();
    canvasContext.restore();
    score.innerHTML = gameScore + '♪';
};

var color = function() {
    var R = Math.floor(Math.random() * 254) + 1;
    var G = Math.floor(Math.random() * 254) + 1;
    var B = Math.floor(Math.random() * 254) + 1;
    var Alpha = Math.random();
    if (Alpha < 0.3) {
        Alpha = Alpha + 0.3;
    }
    return ('rgba(' + R + ',' + G + ',' + B + ',' + Alpha + ')');
};

var shape = function(x, y, mass, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.color = color;
    this.speedX = speedX / 2;
    this.speedY = speedY / 2;
    this.SeparateSwitch = false;
};

var Speed = function() {
    return Math.random() * 3 - 1.5;
    //return Math.random() - 0.5;
};

var bigBall = function() {
    if (gameStartSwitch === true) {
        var ev = window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
        var mouseX = ev.pageX || ev.clientX + scrollX;
        var mouseY = ev.pageY || ev.clientY + scrollY;
        if (mouseX < 400 && mouseY < 40) {
            return 0;
        }
        bigBallshapes.push(new bigBallshape(mouseX, mouseY, color(), bigBallRadius, 0));
        bigBallNumber = bigBallNumber + 1;
        gameScore = gameScore - 1000;
    }
};

var bigBallshape = function(x, y, color, radius, lifeTime) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.lifeTime = lifeTime;
};

var BigBallCreat = function(tmpbigBallshapes) {
    //SmallBall Draw Start
    canvasContext.save();
    canvasContext.fillStyle = tmpbigBallshapes.color;
    //SmallBall Direction
    canvasContext.beginPath();
    canvasContext.arc(tmpbigBallshapes.x, tmpbigBallshapes.y, tmpbigBallshapes.radius, 0, Math.PI * 2, false);
    canvasContext.fill();
    canvasContext.restore();
};

var bigBallRemove = function(bigBallOption) {
    var n = bigBallOption;
    if (bigBallshapes[n].radius > 0) {
        bigBallshapes[n].radius -= 1;
    } else {
        bigBallshapes.splice(n, 1);
        return 0;
    }
    setTimeout('bigBallRemove(' + bigBallOption + ')', 30);
};

var smallBallAddJudge = function() {
    if (gameStartSwitch === true) {
        if (shapes.length < smallBallNumber) {
            smallBallAdd();
        }
    }
    setTimeout('smallBallAddJudge()', smallBallAddFrequency);
};

var about = function() {
    var aboutClose = document.getElementById('about');
    var aboutMenu = document.getElementById('aboutMenu');
    if (gameStartSwitch === true) {
        gameStartSwitch = false;
        aboutMenu.style.display = 'inline';
        aboutClose.innerHTML = 'close';
    } else {
        gameStartSwitch = true;
        aboutMenu.style.display = 'none';
        aboutClose.innerHTML = 'about';
    }
};

var config = function() {
    var configClose = document.getElementById('config');
    var configMenu = document.getElementById('configMenu');
    if (gameStartSwitch === true) {
        gameStartSwitch = false;
        configMenu.style.display = 'inline';
        configClose.innerHTML = 'close';
    } else {
        gameStartSwitch = true;
        configMenu.style.display = 'none';
        configClose.innerHTML = 'config';
    }
};

var restart = function() {
    gameScore = 1000;
    bigBallshapes = [];
    shapes = [];
};

var smallNumberScanf = function() {
    var smallNumberConfig = document.getElementById('smallNumberScanf');
    console.log('smallNumberConfig.value=' + smallNumberConfig.value);
    smallBallNumber = parseInt(smallNumberConfig.value);
};

var smallBallCollsionDetectionSwitchFunction = function() {
    if (smallBallCollsionDetectionSwitch === false) {
        smallBallCollsionDetectionSwitch = true;
    } else {
        smallBallCollsionDetectionSwitch = false;
    }
};

document.onmousedown = bigBall;
window.addEventListener('load', gameStart, true);
window.addEventListener('resize', winResize, true);
setTimeout('smallBallAddJudge()', smallBallAddFrequency);

function __firefox() {
    HTMLElement.prototype.__defineGetter__("runtimeStyle", __element_style);
    window.constructor.prototype.__defineGetter__("event", __window_event);
    Event.prototype.__defineGetter__("srcElement", __event_srcElement);
}

function __element_style() {
    return this.style;
}

function __window_event() {
    return __window_event_constructor();
}

function __event_srcElement() {
    return this.target;
}

function __window_event_constructor() {
    if (document.all) {
        return window.event;
    }
    var _caller = __window_event_constructor.caller;
    while (_caller !== null) {
        var _argument = _caller.arguments[0];
        if (_argument) {
            var _temp = _argument.constructor;
            if (_temp.toString().indexOf("Event") != -1) {
                return _argument;
            }
        }
        _caller = _caller.caller;
    }
    return null;
}
if (window.addEventListener) {
    __firefox();
}
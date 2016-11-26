// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // random starting position of enemy
    // TODO:  need to figure out coord boudaries and y rows
    // canvas dimensions are set at width = 505; height = 606
    this.x = Math.random() * 500;
    // estimate y boundaries for enemy area
    this.y = Math.random() * 300;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // player sprite
    this.sprite = 'images/char-boy.png';
    // player start coordinates
    this.x = 200;
    this.y = 425;
};

Player.prototype.handleInput = function (pressedKey) {
    if(pressedKey === 'left' && this.x > 0){
        this.x -=50;
    }
    if(pressedKey === 'up' && this.y > 0){
        this.y -= 25;
    }
    if(pressedKey === 'right' && this.x < 425){
        this.x += 50;
    }
    if(pressedKey === 'down' && this.y < 425){
        this.y +=25;
    }
};

Player.prototype.update = function (dt) {
    // player update code
    console.log("this is the Player.proto.update  " + dt);
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

var enemy01 = new Enemy();
var enemy02 = new Enemy();
var enemy03 = new Enemy();

var allEnemies = [enemy01, enemy02, enemy03];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

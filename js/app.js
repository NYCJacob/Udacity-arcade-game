// global random int generator
function randomInt(min, max) {
    var rand = Math.random() * (max - min + 1);
    rand = Math.floor(rand) + min;
    return rand;
}

// collision detection
// based on MDN https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function checkCollisions() {
    allEnemies.forEach(function (enemy) {
        // hard coded values based on png width less empty space using trial and error
        if (enemy.x < player.x + 80 &&
            enemy.x + 80 > player.x &&
            enemy.y < player.y + 60 &&
            enemy.y + 60 > player.y) {
            console.log("COLLISION!!!" + "enemyX is " + enemy.x + "enemyY is " + enemy.y);
            console.log("Player x and y are" + player.x + "- " + player.y);
            player.status = false;
        }  // end if
    });
}  // end checkCollisions()

function gameOver() {
    ctx.font = "36px Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.fillText("GAME OVER!!!", 200, 200);
    ctx.strokeText('GAME OVER!!!', 200, 200 );
}

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug-cut.png';
    // random starting position of enemy
    // TODO:  need to figure out coord boundaries and y rows
    // canvas dimensions are set at width = 505; height = 606
    // Math.floor to get random int
    this.minX = 0;
    // canvas width = 505
    this.maxX = 505;
    // min needs to clear river at top therefore not 0
    this.minY = 100;
    // maxY needs to stay above player area  canvas height = 606
    this.maxY = 325;
    this.x = randomInt(this.minX, this.maxX);
    this.y = randomInt(this.minY, this.maxY);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    //console.log(this + this.x + this.y);
    if (this.x >= 500) {
        this.x = -20;
        this.y = randomInt(this.minY, this.maxY);
    } else {
        this.x += 50 * dt;
    }
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
    this.sprite = 'images/char-boy-cut.png';
    // player start coordinates
    this.x = 200;
    this.y = 500;
    this.points = 0;
    this.maxLives = 2;
    this.deaths = 0;
};

Player.prototype.handleInput = function (pressedKey) {
    if (player.status == true){
        switch (pressedKey){
            case 'left':
                this.x -= 50;
                break;
            case 'right':
                this.x += 50;
                break;
            case 'up':
                this.y -= 25;
                break;
            case 'down':
                this.y += 25;
                break;
        }

    }
    // condition statements to keep player on the board
    if (this.x > 420){
        this.x = 420;
    }
    if (this.y > 500){
        this.y = 500;
    }
    if (this.x < -10){
        this.x = -10;
    }
    if (this.y <= 0){
        this.y = 0;
    }

};

Player.prototype.collisionCount = function () {
    this.deaths += 1;
}

Player.prototype.update = function (dt) {
    // player update code
    // player falls upon collision below river
    if (player.status == false  && player.y < 500) {
        player.y += 40 * dt;
    }
    // player gets another chance until all lives used
    // need to allow player to fall all the way back before condition execution
    if (player.status == false && (player.y >= 500) && !(player.deaths == player.maxLives)){
        // count collision upon return to avoid multiple collision count
        player.collisionCount();
        //player gets another chance
        player.status = true;
    }
    if (player.deaths == player.maxLives) {
        gameOver();
    }

    // player reached river
    if (player.status == true && player.y < 100){
        // implement success feature
        player.points += 1;
    }
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

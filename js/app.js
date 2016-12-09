// use strict
"use strict";

// game global variables
var MAXSECONDS = 60;
var MAXMINUTES = 1;
// speed boundaries to compute bug random speed
var MINSPEED = 50;
var MAXSPEED = 90;
// timer function global variable
var minutes = MAXMINUTES;
var seconds = MAXSECONDS;
var clearTimer = null;
var timerDiv = document.getElementById('timer');

/*  Game utility functions
    * gameTimer() controls the timer display
    * clearMessage() clears the message at the top part of the canvas
    * scoreBoard(gameEvent) displays lives remaining and points based on event code parameter
    * checkCollisions() checks for player enemy/gem contact
 */

function gameTimer(){
        seconds -= 1;
    // check if time is up
    if (seconds === 0 && minutes === 0) {
        // set player dead so player movement stops in key up listener condition
        player.dead = true;
        timerDiv.innerHTML = '';
        scoreBoard(0);
    } else if (seconds == 0) {
        // decrement minute reset seconds
        minutes -= 1;
        seconds = 60;
    } else if (!player.dead) {   // update time only if player alive prevents - 0:59
        //console.log('minutes: ' + minutes + "  seconds: " + seconds);
        timerDiv.innerHTML = '<h2>Minutes: ' + minutes + ' Seconds: ' + seconds + '</h2>';
    }

}


//  created this function to allow message to remain on
function clearMessage() {
    // clear canvas display rect
    ctx.clearRect(0, 0, 505, 50);
}

function scoreBoard(gameEvent) {
    var livesDiv = document.getElementById('lives');
    livesDiv.innerHTML = '';
    livesDiv.innerHTML = '<h2>Lives Remaining: ' + (player.maxLives - player.deaths) + '</h2>';
    var scoreDiv = document.getElementById('score');
    scoreDiv.innerHTML = '';
    scoreDiv.innerHTML = '<h2>Score: ' + player.points + '</h2>';
    // clear old message in case still displayed
    clearMessage();
    switch (gameEvent) {
        // success message
        case 1:
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillStyle = "green";
            ctx.fillText("SUCCESS!!!", 250, 45);
            break;
        // collision message
        case -1:
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.fillText("COLLISION!!!", 250, 45);
            break;
        // game over message
        case 0:
            ctx.font = "36px Impact";
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.strokeStyle = "black";
            clearMessage();
            clearInterval(clearTimer);
            ctx.fillText("GAME OVER!!!", 250, 45);
            //  I left this here for trying to get text on top of game board
            ctx.strokeText('GAME OVER!!!', 250, 200 );
            break;
        case 2:
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillStyle = "orange";
            ctx.fillText("BONUS!!!", 250, 45);
            break;
    }
    // clear message after time out
    setTimeout(clearMessage, 10000);
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
          //  console.log("COLLISION!!!" + "enemyX is " + enemy.x + "enemyY is " + enemy.y);
          //  console.log("Player x and y are" + player.x + "- " + player.y);
            player.status = false;
        }  // end if
    });

    // check gems collisions
    if (activeGem.x < player.x + 60 &&
        activeGem.x + 60 > player.x &&
        activeGem.y < player.y + 60 &&
        activeGem.y + 60 > player.y) {
        console.log("player - Gem COLLISION!!!");
        player.hitGem = true;
        // make gem disappear off screen
        activeGem.x = 610;
    }  // end if

}  // end checkCollisions()

/* class objects
    *   GameItem  (parent)
    *       Enemy
    *       Player
    *   Gem
*/

/* game superclass using function constructor
    * sprite is path string to icon file
 */

var GameItem = function () {
    this.sprite = '';
    this.x = 0;
    this.y = 0;
    this.speed = 1;
};


var EnemyItem = function (sprite) {
    GameItem.call(this);
    var minX = 0;
    var maxX = 505;
    var minY = 100;
    var maxY = 330;
    this.sprite = sprite;
    this.x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    this.y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    this.speed = Math.floor(Math.random() * (MAXSPEED - MINSPEED + 1)) + MINSPEED;
    /*
        @getBounds returns a simple array of min/max x/y coordinates for class x/y calculations
     */
    this.getBounds = function () {
        return [minX, maxX, minY, maxY];
    }

};

EnemyItem.prototype = Object.create(GameItem.prototype);
EnemyItem.prototype.constructor = EnemyItem;


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
EnemyItem.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    if (this.x >= 500) {
        this.x = -20;
        // this.y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        this.y = Math.floor(Math.random() * (this.getBounds()[3] - this.getBounds()[2] + 1)) + this.getBounds()[2];
    } else {
        this.x += this.speed * dt;
    }
};
// Draw the enemy on the screen, required method for game
EnemyItem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// set number of enemies, could be used for a game levels feature also
var ENEMIES = 3;
var allEnemies = [];
for (var i = 0; i < ENEMIES; i++) {
    allEnemies.push(new EnemyItem('images/enemy-bug-cut.png'));
}


// Player starting values
// player start coor set in global var because needed in multiple functions/methods
var STARTCOOR = [220, 500];
var STARTPOINTS = 0;
var MAXLIVES =  2;
var STARTDEATHS = 0;
var dead = false;
var success = false;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    GameItem.call(this);
    // player sprite
    this.sprite = 'images/char-boy-cut.png';
    // player start coordinates
    this.x = STARTCOOR[0];
    this.y = STARTCOOR[1];
    this.points = STARTPOINTS;
    this.maxLives = MAXLIVES;
    this.deaths = STARTDEATHS;
    this.dead = dead;
    this.success = success;
    this.hitGem = false;
};

Player.prototype = Object.create(GameItem.prototype);
Player.prototype.constructor = Player;

Player.prototype.reset = function () {
    this.x = STARTCOOR[0];
    this.y = STARTCOOR[1];
    this.points = STARTPOINTS;
    this.maxLives = MAXLIVES;
    this.deaths = STARTDEATHS;
    this.dead = dead;
    this.success = success;
    scoreBoard();
};

Player.prototype.handleInput = function (pressedKey) {
    if ((this.status == true) && (this.success == false) && this.dead == false){
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
    if (this.x > 450){
        this.x = 450;
    }
    if (this.y > 500){
        this.y = 500;
    }
    if (this.x < 0){
        this.x = 0;
    }
    if (this.y <= 50){
        this.y = 50;
    }
};

Player.prototype.update = function (dt) {
    // player update code
    // player falls upon collision below river
    if (this.status == false  && this.y < 500) {
        this.y += 40 * dt;
        // update scoreBoard
        scoreBoard(-1);
    }
    // player gets another chance until all lives used
    // need to allow player to fall all the way back before condition execution
    if (this.status == false && (this.y >= 500) && !(this.deaths == this.maxLives)){
        // count collision upon return to avoid multiple collision count
        this.deaths += 1;
        // call scoreboard again so death gets scored upon player return to bottom
        scoreBoard();
        //player gets another chance
        this.status = true;
    }

    if (this.deaths == this.maxLives) {
        this.dead = true;
    }

    // player reached river
    if (this.status == true && this.y <= 50){
        // implement success feature
        console.log("player reached river player.update condition");
        this.success = true;
        this.points += 1;
        scoreBoard(1);
    }

    // hit gem bonus points
    if (this.hitGem === true) {
        this.points += 5;
        // 2 is bonus points switch case in scoreBoard()
        scoreBoard(2);
        // reset to prevent multiple bonuses
        this.hitGem = false;

        setTimeout(function () {
            activeGem.getAnother();
        }, 5000);

    }

};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
};


var Gem = function (color) {
    // The image/sprite for gem
    this.sprite = 'images/Gem-' + color + '-sm.png';
    // random starting position of enemy
    // canvas dimensions are set at width = 505; height = 606
    // Math.floor to get random int
    this.minX = 0;
    // canvas width = 505
    this.maxX = 505;
    // min needs to clear river at top therefore not 0
    this.minY = 100;
    // maxY needs to stay above player area  canvas height = 606
    this.maxY = 330;
    this.x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
    this.y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
};


// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var gems = ['Orange', 'Green', 'Blue'];

Gem.prototype.getAnother = function () {
    this.sprite = 'images/Gem-' + gems[Math.floor(Math.random() * (gems.length + 1))] + '-sm.png';
    this.x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
    this.y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
};

// instantiate first gem random color selector
//  this seems to be causing a +1 error lookup on gems[]
// var activeGem = new Gem(gems[Math.floor(Math.random() * (gems.length + 1))]);
var activeGem = new Gem(gems[Math.floor(Math.random() * (gems.length))]);

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();


// start and new game buttons
var newGameDiv = document.createElement('div');
var newGameButton = document.createElement('button');
newGameButton.innerHTML = 'New Game';
newGameDiv.appendChild(newGameButton);
//document.body.appendChild(newGameDiv);
var startDiv = document.createElement('div');
var startGameButton = document.createElement('button');
startGameButton.innerHTML = 'Start Game';
startDiv.appendChild(startGameButton);

// var messageDiv = document.getElementById('message-board');
document.getElementById('message-board').prepend(newGameDiv);
document.getElementById('message-board').prepend(startDiv);


function newGameListener() {
    newGameButton.addEventListener('click', newGame);
}

function newGame() {
    player.reset();
    // stop current timer
    clearInterval(clearTimer);
    // start new timer
    timerDiv.innerHTML = '';
    // reset time count
    seconds = MAXSECONDS;
    minutes = MAXMINUTES;
    clearTimer = setInterval(gameTimer, 1000);
}



function startGame() {
    timerDiv.innerHTML = '';
    clearTimer = setInterval(gameTimer, 1000);
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
    // prevent start game button from being used again
    startGameButton.removeEventListener('click', startGame);
    // add new game click listener
    newGameListener();
}

startGameButton.addEventListener('click', startGame);


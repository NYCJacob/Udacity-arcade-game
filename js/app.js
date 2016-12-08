// use strict
"use strict";

// game global variables
var MAXSECONDS = 60;
var MAXMINUTES = 1;
// speed boundaries to compute bug random speed
var MINSPEED = 50;
var MAXSPEED = 80;
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


// global random int generator
function randomInt(min, max) {
    var rand = Math.random() * (max - min + 1);
    rand = Math.floor(rand) + min;
    return rand;
}

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
    *   Enemy
    *   Player
    *   Gem
*/

/* game items superclass
    * GameItem
 */
//
// var GameItem = {
//     x : 0,
//     y : 0,
//     minX : 0,
//     maxX : 505,
//     minY : 100,
//     maxY : 330,
//     sprite : '',
//     getRand : function (min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//     }
// };
//
// // this is using GameItem superclass
// var Enemy2 = Object.create(GameItem);
// Enemy2.sprite = 'images/enemy-bug-cut.png';

/* game superclass using function constructor
    * sprite is path string to icon file
 */
var GameItem = function (sprite) {
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
    this.minX = 0;
    this.maxX = 505;
    this.minY = 100;
    this.maxY = 330;
    //  this didn't work
    // this.getRand = function (min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }
};

// this didn't work  - 'not a function'
// GameItem.prototype.getRand = function (min, max) {
//             return Math.floor(Math.random() * (max - min + 1)) + min;
//         };



var Enemy2 = function (sprite) {
    GameItem.call(this, sprite);
};
Enemy2.prototype = Object.create(GameItem.prototype);
Enemy2.prototype.constructor = Enemy2;
// Enemy2.prototype.speed = GameItem.getRand(50, 80);
Enemy2.prototype.speed = Math.floor(Math.random() * (MAXSPEED - MINSPEED + 1)) + MINSPEED;
// var bug = new Enemy2('images/enemy-bug-cut.png');

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy2.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    //console.log(this + this.x + this.y);
    if (this.x >= 500) {
        this.x = -20;
        this.y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
    } else {
        this.x += this.speed * dt;
    }
};
// Draw the enemy on the screen, required method for game
Enemy2.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// set number of enemies, could be used for a game levels feature also
var Enemies2 = 3;
var allEnemies2 = [];
for (var i = 0; i < Enemies2; i++) {
    allEnemies2.push(new Enemy2('images/enemy-bug-cut.png'));
}




/* Enemy class without a superclass section below
    ***************************************************************
 */
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load image
    this.sprite = 'images/enemy-bug-cut.png';
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
    this.x = randomInt(this.minX, this.maxX);
    this.y = randomInt(this.minY, this.maxY);
    // give random speeds to bugs
    this.speed = randomInt(50, 80);
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
        this.x += this.speed * dt;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player starting values
// player start coor set in global var because needed in multiple functions/methods
var startCoor = [220, 500];
var startPoints = 0;
var maxLives =  2;
var startDeaths = 0;
var dead = false;
var success = false;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // player sprite
    this.sprite = 'images/char-boy-cut.png';
    // player start coordinates
    this.x = startCoor[0];
    this.y = startCoor[1];
    this.points = startPoints;
    this.maxLives = maxLives;
    this.deaths = startDeaths;
    this.dead = dead;
    this.success = success;
    this.hitGem = false;
};

//  seems like there should be a better way to do this
//  because now I nav two sets of the same vars for Player
//  but I could not find a way to call Engine.init
Player.prototype.reset = function () {
    this.x = startCoor[0];
    this.y = startCoor[1];
    this.points = startPoints;
    this.maxLives = maxLives;
    this.deaths = startDeaths;
    this.dead = dead;
    this.success = success;
    scoreBoard();
};

Player.prototype.handleInput = function (pressedKey) {
    if ((player.status == true) && (player.success == false) && player.dead == false){
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
    if (player.status == false  && player.y < 500) {
        player.y += 40 * dt;
        // update scoreBoard
        scoreBoard(-1);
    }
    // player gets another chance until all lives used
    // need to allow player to fall all the way back before condition execution
    if (player.status == false && (player.y >= 500) && !(player.deaths == player.maxLives)){
        // count collision upon return to avoid multiple collision count
        player.deaths += 1;
        // call scoreboard again so death gets scored upon player return to bottom
        scoreBoard();
        //player gets another chance
        player.status = true;
    }

    if (player.deaths == player.maxLives) {
        player.dead = true;
    }

    // player reached river
    if (player.status == true && player.y <= 50){
        // implement success feature
        console.log("player reached river player.update condition");
        player.success = true;
        player.points += 1;
        scoreBoard(1);
    }

    // hit gem bonus points
    if (player.hitGem === true) {
        player.points += 5;
        // 2 is bonus points switch case in scoreBoard()
        scoreBoard(2);
        // reset to prevent multiple bonuses
        player.hitGem = false;
        // make new gem
        // activeGem = setTimeout(function () {
        //     activeGem.getActive();
        // }, 5000);
        // setTimeout(function () {
        //     activeGem.getActive();
        // }, 5000);
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
    this.x = randomInt(this.minX, this.maxX);
    this.y = randomInt(this.minY, this.maxY);
    // there are three gems but only one at a time selected randomly at random intervals
    // in render and update methods
    //this.activeGem =  allGems[randomInt(0, 2)];
};

Gem.prototype.update = function () {

};

// Gem.prototype.getGem = function () {
//     allGems[randomInt(0, 2)];
// };

// Draw the ge, on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var gems = ['Orange', 'Green', 'Blue'];
// var allGems = [];
// for (var x = 0; x < gems.length; x++) {
//     allGems.push(new Gem(gems[x]));
// }
Gem.prototype.getActive =  function () {
    return new Gem(gems[randomInt(0, 2)]);
};

Gem.prototype.getAnother = function () {
    this.sprite = 'images/Gem-' + gems[randomInt(0, 2)] + '-sm.png';
    this.x = randomInt(this.minX, this.maxX);
    this.y = randomInt(this.minY, this.maxY);
};

// instantiate first gem random color selector
var activeGem = new Gem(gems[randomInt(0, 2)]);

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

// set number of enemies, could be used for a game levels feature also
var Enemies = 3;
var allEnemies = [];
for (var x = 0; x < Enemies; x++) {
    allEnemies.push(new Enemy());
}

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

var messageDiv = document.getElementById('message-board');
document.getElementById('message-board').prepend(newGameDiv);
document.getElementById('message-board').prepend(startDiv);
//
// messageDiv.appendChild(newGameDiv);
//messageDiv.appendChild(startDiv);


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


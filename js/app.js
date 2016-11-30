
// global random int generator
function randomInt(min, max) {
    var rand = Math.random() * (max - min + 1);
    rand = Math.floor(rand) + min;
    return rand;
}

//  created this function to allow message to remain on
function clearMessage() {
    // clear canvas display rect
    ctx.clearRect(0, 0, 505, 50);
}

function scoreBoard(gameEvent) {
    var livesDiv = document.getElementById('lives');
    livesDiv.innerHTML = '';
    livesDiv.innerHTML = '<p>Lives Remaining: ' + (player.maxLives - player.deaths) + '</p>';
    var scoreDiv = document.getElementById('score');
    scoreDiv.innerHTML = '';
    scoreDiv.innerHTML = '<p>Score: ' + player.points;

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
            ctx.fillText("GAME OVER!!!", 250, 45);
            //  I left this here for trying to get text on top of game board
            ctx.strokeText('GAME OVER!!!', 250, 200 );
            break;
    }
    // clear message after shortly after display
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
}  // end checkCollisions()


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
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
};

// Player.prototype.reset = reset;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

// set number of enemies, could be used for a game levels feature also
var Enemies = 5;
var allEnemies = [];
for (var i = 0; i < Enemies; i++) {
    allEnemies.push(new Enemy());
}
// var enemy01 = new Enemy();
// var enemy02 = new Enemy();
// var enemy03 = new Enemy();
// var allEnemies = [enemy01, enemy02, enemy03];

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

// new game button
newGameDiv = document.createElement('div');
newGameButton = document.createElement('button');
newGameButton.innerHTML = 'New Game';
newGameDiv.appendChild(newGameButton);
document.body.appendChild(newGameDiv);

// it seems this becomes the window when calling player.reset from event listener  ?????
// newGameButton.addEventListener('click', player.reset.call(player));

// used this based on this
// http://stackoverflow.com/questions/21298918/is-it-possible-to-call-a-class-method-with-addeventlistener#21299126
newGameButton.addEventListener('click', function () {
    player.reset();
});

// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */

 var score = -2;

 var labelScore;
 var player;

 var pipes=[];

 var pipeInterval = 1.75;
function preload() {
game.load.image("playerImg", "../assets/finalspaceship.png");
  game.load.audio("score", "../assets/Laser shot.mp3");
  game.load.image("laser", "../assets/lasar 3.png");
  game.load.image("base", "../assets/Space_Base.png");

  game.load.image("pipe","../assets/finalasteroid.png");

}
/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    //game.input.onDown.add(clickHandler);
    game.stage.setBackgroundColor("#0F3F9E");
    player=game.add.sprite(20, 150, "playerImg");
    player.scale.setTo(0.5)
    //game.add.sprite(500, 85, "base");
    //game.add.text(20, 20, "WORK IN PROGRESS STILL ISNT FINISHED", {font: "30px Arial", fill: "#FFFFFF"});
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 200;
    player.anchor.setTo(0.5,0.5);


    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);

    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);
    labelScore = game.add.text(20,20,score.toString());
}

function playerJump() {
player.body.velocity.y = -130;
}


/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  game.physics.arcade.overlap(player, pipes, gameOver);

  if (player.y < 0 || player.y > 400) {
    gameOver();
  }
}

//function clickHandler(event) {
  //game.add.sprite(event.x, event.y, "laser")
  //game.sound.play("score");
  //playerJump();
//}
function addPipeBlock(x, y) {
  // make a new pipe block
  var block = game.add.sprite(x,y,"pipe");
  block.height = 40;
  block.width = 40;
  // insert it in the pipe array
  pipes.push(block);
  // enable physics engine for the block
  game.physics.arcade.enable(block);
  // set the block's horizontal velocity to a negative value
  // (negative x value for velocity means movement will be towards left)
  block.body.velocity.x = -200;
}
function generatePipe() {
  var gapStart = game.rnd.integerInRange(1, 5);
  // Loop 8 times because 8 blocks fit in the canvas.
  for (var count = 0; count < 8; count++) {
  // If the value of count is not equal to the gap start point // or end point, add the pipe image.
    if(count != gapStart && count != gapStart+1){
      addPipeBlock(750, count * 50);
    }
  }
  // Increment the score each time a new pipe is generated.
  changeScore();
}

// Function to change the score
function changeScore() {
//increments global score variable by 1
score++;
// updates the score label
labelScore.setText(score.toString());
}
function gameOver() {
// stop the game (update() function no longer called)
  location.reload();
}

// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var highscore = -3;
var highPlayer = "None";
// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var height = 400;
var width = 790;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

/*
* Loads all resources for the game and gives them names.
*/

var score = -2;

var labelScore;
var player;

var pipes=[];

var pipeInterval = 1.75;

var gapMargin = 30;
var gapSize = 120;
var blockSize = 80;

function preload() {game.load.image("playerImg", "../assets/finalspaceship.png");
 game.load.image('starfield', '../assets/starfield2.jpg');

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
    game.stage.setBackgroundColor("#ff00ff");
    tileSprite = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    player=game.add.sprite(20, 150, "playerImg");


    player.scale.setTo(0.5)
    player.kill();
    //game.add.sprite(500, 85, "base");
    //game.add.text(20, 20, "WORK IN PROGRESS STILL ISNT FINISHED", {font: "30px Arial", fill: "#FFFFFF"});
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(player);


    splashDisplay = game.add.text(100,200,
          "Press ENTER to start, SPACEBAR to jump \n   (if you are on Mobile you can just click)", {fill: "#FFFFFF"});
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
game.input.onDown.add(start);
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
  tileSprite.tilePosition.x -= 1.5;

}

//function clickHandler(event) {
  //game.add.sprite(event.x, event.y, "laser")
  //game.sound.play("score");
  //playerJump();
//}
function addPipeBlock(x, y) {
  // make a new pipe block
  var block = game.add.sprite(x,y,"pipe");
  block.height = blockSize;
  block.width = blockSize;
  // insert it in the pipe array
  pipes.push(block);
  // enable physics engine for the block
  game.physics.arcade.enable(block);
  // set the block's horizontal velocity to a negative value
  // (negative x value for velocity means movement will be towards left)
  block.body.velocity.x = -200;
}
// function generatePipe() {
//   var gapStart = game.rnd.integerInRange(1, 5);
//   // Loop 8 times because 8 blocks fit in the canvas.
//   for (var count = 0; count < 8; count++) {
//   // If the value of count is not equal to the gap start point // or end point, add the pipe image.
//     if(count != gapStart && count != gapStart+1){
//       addPipeBlock(750, count * 50);
//     }
//   }
//   // Increment the score each time a new pipe is generated.
//   changeScore();
// }


function generatePipe() {
  var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);
  for(var y = gapStart; y > 0; y -= blockSize-blockSize/2){
    addPipeBlock(width, y - blockSize);
  }
  for(var y = gapStart + gapSize; y < height; y += blockSize - blockSize/2) {
      addPipeBlock(width, y);
  }
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
  if (score > highscore){
    highPlayer = prompt("NEW HIGHSCORE! Please enter your name:");
    highscore = score;
  }
// stop the game (update() function no longer called)
  game.paused = true;
  score = -2;
  splashDisplay = game.add.text(200,200,
        "Highscore: " + highscore.toString() + " Player Name: " + highPlayer, {fill: "#FFFFFF"});
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(function(){
    game.paused = false;
    game.state.restart();
  }
  );
  game.input.onDown.add(function(){
    game.paused = false;
    game.state.restart();
  }
  );

  // location.reload();
}


function start() {


  player.revive();



  player.body.gravity.y = 300;
  player.anchor.setTo(0.5,0.5);

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
    game.input.onDown.remove(start);
  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
  game.input.onDown.add(playerJump);

  game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);
  labelScore = game.add.text(20,20,score.toString(),{fill: "#FFFFFF"});
  splashDisplay.destroy();
}

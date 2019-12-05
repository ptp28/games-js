// Create the canvas
var canvas = document.getElementById("mycanvas");
var context = canvas.getContext("2d");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	setMonsterPosition();
};

// Update game objects
var update = function (modifier) {
		if (38 in keysDown && hero.y > 0) { // Player holding up
			hero.y -= hero.speed * modifier;
		}
		if (40 in keysDown && hero.y < canvas.height-32) { // Player holding down
			hero.y += hero.speed * modifier;
		}
		if (37 in keysDown && hero.x > 0) { // Player holding left
			hero.x -= hero.speed * modifier;
		}
		if (39 in keysDown && hero.x < canvas.width-32) { // Player holding right
			hero.x += hero.speed * modifier;
		}
	

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		context.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		context.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		context.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	context.fillStyle = "rgb(250, 250, 250)";
	context.font = "24px Helvetica";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();

goblinRun = setInterval(setMonsterPosition, 1000);

// Throw the monster somewhere on the screen randomly
function setMonsterPosition()
{
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
}
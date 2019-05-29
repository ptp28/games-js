// LOAD SOUNDS

const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";

// SELECT CANVAS ELEMENT
const canvas = document.getElementById("breakout");
const context = canvas.getContext("2d");

// ADD BORDER TO CANVAS
canvas.style.border = "1px solid #0ff";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
context.lineWidth = 3;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
let LIFE = 3; // PLAYER HAS 3 LIVES
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 5;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

// CREATE THE PADDLE
const paddle = {
    x : canvas.width/2 - PADDLE_WIDTH/2,
    y : canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx :5
}

// DRAW PADDLE
function drawPaddle(){
    context.fillStyle = "#2e3548";
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    context.strokeStyle = "#ffcd05";
    context.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// MOVE PADDLE
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

// CREATE THE BALL
const ball = {
    x : canvas.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 7,
    dx : 4 * (Math.random() * 2 - 1),
    dy : -4
}

// DRAW THE BALL
function drawBall(){
    context.beginPath();
    
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    context.fillStyle = "#ffcd05";
    context.fill();
    
    context.strokeStyle = "#2e3548";
    context.stroke();
    
    context.closePath();
}

// MOVE THE BALL
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// BALL AND WALL COLLISION DETECTION
function ballWallCollision(){
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
        ball.dx = - ball.dx;
        WALL_HIT.play();
    }
    
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }
    
    if(ball.y + ball.radius > canvas.height){
        LIFE--; // LOSE LIFE
        LIFE_LOST.play();
        resetBall();
    }
}

// RESET THE BALL
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 4 * (Math.random() * 2 - 1);
    ball.dy = -4;
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        
        // PLAY SOUND
        PADDLE_HIT.play();
        
        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);
        
        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;
            
            
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// CREATE THE BRICKS
const brick = {
    row : 1,
    column : 8,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#2e3548",
    strokeColor : "#FFF"
}

let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// draw the bricks
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                context.fillStyle = brick.fillColor;
                context.fillRect(b.x, b.y, brick.width, brick.height);
                
                context.strokeStyle = brick.strokeColor;
                context.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // the brick is broken
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// show game stats
function showGameStats(text, textX, textY,title, titleX, titleY){
    // draw text
    context.fillStyle = "black";
    context.font = "25px Germania One";
    context.fillText(text, textX, textY);
    
    // draw image
    context.fillText(title, titleX, titleY);
}

// DRAW FUNCTION
function draw(){
    drawPaddle();
    
    drawBall();
    
    drawBricks();
    
    // SHOW SCORE
    showGameStats(SCORE, 105, 25, "SCORE : ", 10, 25);
    // SHOW LIVES
    showGameStats(LIFE, canvas.width - 25, 25, "LIVES : ", canvas.width-105, 25); 
    // SHOW LEVEL
    showGameStats(LEVEL, canvas.width/2, 25, "LEVEL : ", canvas.width/2 - 80, 25);
}

// game over
function gameOver(){
    if(LIFE <= 0){
        GAME_OVER = true;
    }
}

// level up
function levelUp(){
    let isLevelDone = true;
    
    // check if all the bricks are broken
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
        WIN.play();
        
        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 2;
        resetBall();
        LEVEL++;
    }
}

// UPDATE GAME FUNCTION
function update(){
    movePaddle();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickCollision();
    
    gameOver();
    
    levelUp();
}

// GAME LOOP
function loop(){
    // CLEAR THE CANVAS
    // context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    draw();
    
    update();
    
    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
loop();

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})
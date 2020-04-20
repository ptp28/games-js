let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
let canvasSideLength = 400;
let NUM_SQUARES = 4;
let squareContainer = [];
let sequence = [];
let userSequence = [];
var counter = 0;
var start;
var t, s, c;
var clickCounter = 0;
var tryAgainFlag = false;
var startFlag = false;
var clickFlag = true;

function init() {
    squareContainer = [];
    sequence = [];
    userSequence = [];
    counter = 0;
    start;
    t = 0;
    s = 0;
    c = 0;
    clickCounter = 0;
    startFlag = false;
    clickFlag = true;

    context.globalAlpha = 0.3;
    makeGrid();
    drawGrid();
    context.globalAlpha = 1.0;
    frontScreen();
}

canvas.addEventListener("click", mouseclick, false);
function mouseclick(e) {
    var rect = canvas.getBoundingClientRect();
    let clickX = e.pageX - rect.left;
    let clickY = e.pageY - rect.top;

    if(clickFlag)
    {
        if(!startFlag)
        {
            if(start.isInside(clickX, clickY))
            {
                context.clearRect(0,0, canvas.offsetWidth, canvas.height);
                canvas.style.opacity = 1.0;
                drawGrid();
                startFlag = true;
                startGame();
            }
            else
            {
                console.log(clickX);
            }
        }
        else
        {
            clickCounter++;
            getClick(clickX, clickY);
            if(clickCounter == sequence.length)
            {
                checkAnswer();
            }
        }
    }
}

function makeGrid() {
    var dividingFactor = 40;
    var sideLength = (canvasSideLength - (3 * canvasSideLength / dividingFactor)) / 2;
    // sqObject.drawSquare(0, 0,  canvasSideLength, '737373');
    squareContainer.push({ square: new Square(context, canvasSideLength / dividingFactor, canvasSideLength / dividingFactor, sideLength, '#F25022') });
    squareContainer.push({ square: new Square(context, sideLength + 2 * canvasSideLength / dividingFactor, canvasSideLength / dividingFactor, sideLength, '#7FBA00') });
    squareContainer.push({ square: new Square(context, canvasSideLength / dividingFactor, sideLength + 2 * canvasSideLength / dividingFactor, sideLength, '#00A4EF') });
    squareContainer.push({ square: new Square(context, sideLength + 2 * canvasSideLength / dividingFactor, sideLength + 2 * canvasSideLength / dividingFactor, sideLength, '#FFB900') });
}

function drawGrid()
{
    for(let i=0 ; i<squareContainer.length ; i++)
    {
        squareContainer[i].square.draw();
    }
}

function frontScreen()
{
    var msg = "Start";
    start = new Square(context, canvasSideLength/2-85, canvasSideLength/2-85, 170, 'white');
    start.draw();
    context.fillStyle = "black";
    context.textAlign = "center";
    context.font = "30px Arial";
    if(tryAgainFlag)
    {
        msg = "Try Again";
    }
    context.fillText(msg, canvasSideLength/2, canvasSideLength/2+10);
}

function startGame()
{
    clickCounter = 0;
    clickFlag = false;
    clearInterval(s);
    t = 0;
    s = 0;
    c = 0;
    counter = 0;
    makeSequence();
    performAnimation();
    clickFlag = true;
}

function checkAnswer()
{
    console.log("Q:",sequence);
    console.log("U:",userSequence);
    var correctCounter = 0;
    for(let i=0; i<sequence.length; i++)
    {
        if(sequence[i] == userSequence[i])
        {
            correctCounter++;
        }
    }
    if(correctCounter == userSequence.length)
    {
        console.log("Correct");
        s = setTimeout(startGame, 500);
        userSequence = [];
    }
    else
    {
        clickFlag = false;
        tryAgainFlag = true;
        s = setTimeout(init, 1000);
    }
}

function makeSequence() {
    let temp = getRandomSquare();
    if((sequence.length != 0 && temp != sequence[sequence.length-1]) || sequence.length==0)
    {
        sequence.push(temp);
    }
    else
    {
        makeSequence();
    }
    console.log(sequence + " = " + sequence.length);
}

function getRandomSquare() {
    return Math.floor(Math.random() * Math.floor(NUM_SQUARES));
}

function performAnimation() {
    if (counter != sequence.length + 1) {

        if(counter != 0)
        {
            change(sequence[counter-1]);
        }
        if(counter != sequence.length)
        {
            change(sequence[counter]);
        }
        t = setTimeout(performAnimation, 750);
        counter++;
    }
    else {
        clearTimeout(t);
    }
}

function change(i)
{
    squareContainer[i].square.changeColor();
    clearTimeout(c);
}


function getClick(clickX, clickY) {
    for (let i = 0; i < squareContainer.length; i++) {
        if(squareContainer[i].square.isInside(clickX, clickY))
        {
            userSequence.push(i);
            squareContainer[i].square.changeColor();
            c = setTimeout(() => change(i), 50);
        }
    }
}

init();
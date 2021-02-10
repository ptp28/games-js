var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("mycanvas");
var context: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.addEventListener("mousedown", mousedown, false);
canvas.addEventListener("mousemove", mousemove, false);
canvas.addEventListener("mouseup", mouseup, false);

var geo: string = "none";
var circleContainer: { circle: Circle}[] = [];
var t = 0;

var circleOb: Circle;

init();
function init()
{
    startGame();
}

function startGame()
{
    makeCircle(0,0);
    makeCircle(canvas.width, canvas.height);
    makeCircle(0,canvas.height);
    makeCircle(canvas.width,0);
    makeCircle(canvas.width / 2, canvas.height / 2);
    makeCircle(canvas.width / 2,0);
    makeCircle(0, canvas.height / 2);
    makeCircle(canvas.width / 2,canvas.height);
    makeCircle(canvas.width, canvas.height / 2);

    animateCircle();
}

function makeCircle(x: number, y:number)
{
    circleOb = new Circle(new Point(x, y), context);
    circleContainer.push({circle : circleOb});
    circleOb.draw();
    console.log(circleContainer);
}

function animateCircle()
{
        context.clearRect(0,0,canvas.width, canvas.height);
        setInterval(() => collect(), 100);
        drawCircles();
}

function collect()
{
    
    for(var i=0; i<circleContainer.length; i++)
    {
        updateCircle(i);
    }
    drawCircles();
}

function drawCircles()
{
    context.clearRect(0,0,canvas.width, canvas.height);
    for(let i=0; i<circleContainer.length; i++)
    {
        circleContainer[i].circle.draw();
    }
}

function updateCircle(i : number) {
    var update = false;

    if (circleContainer[i].circle.centerPoint.x < circleContainer[i].circle.randomPoint.x) {
        circleContainer[i].circle.centerPoint.x++;
        update = true;
    }
    else if (circleContainer[i].circle.centerPoint.x > circleContainer[i].circle.randomPoint.x && circleContainer[i].circle.centerPoint.x != circleContainer[i].circle.randomPoint.x) {
        circleContainer[i].circle.centerPoint.x--;
        update = true;
    }

    if (circleContainer[i].circle.centerPoint.y < circleContainer[i].circle.randomPoint.y) {
        circleContainer[i].circle.centerPoint.y++;
        update = true;
    }
    else if (circleContainer[i].circle.centerPoint.y > circleContainer[i].circle.randomPoint.y && circleContainer[i].circle.centerPoint.y != circleContainer[i].circle.randomPoint.y) {
        circleContainer[i].circle.centerPoint.y--;
        update = true;
    }

    // console.log(update);
    if (!update) {
        circleContainer[i].circle.randomPoint.newRandomPoint();
    }

}


var enabledrag: boolean = false;
function mousedown(e: MouseEvent) {
        enabledrag = true;
}

function mouseup(e: MouseEvent) {
        enabledrag = false;
}

function mousemove(e: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    if (enabledrag) {
        for (let i = 0; i < circleContainer.length; i++) {
            if (circleContainer[i].circle.isInside(new Point(e.clientX-rect.left, e.clientY-rect.top))) {
                circleContainer[i].circle.centerPoint = new Point(e.clientX-rect.left, e.clientY-rect.top);
                break;
            }
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < circleContainer.length; i++) {
            circleContainer[i].circle.draw();

        }
    }
}
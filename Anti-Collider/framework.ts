class Point {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public newRandomPoint() {
        this.x = Math.floor(Math.random() * Math.floor(canvas.width));
        this.y = Math.floor(Math.random() * Math.floor(canvas.height));
        // console.log("RANDOM : " + x + " , " + y);
    }
}

class Circle {
    private _centerPoint: Point;
    private _radius: number;
    private _context: CanvasRenderingContext2D;
    private _color: string;
    public randomPoint: Point;

    constructor(centerPoint: Point, context: CanvasRenderingContext2D) {
        this._centerPoint = centerPoint;
        this._context = context;
        this._radius = 25;
        this._color = "red";
        this.randomPoint = new Point();
        this.randomPoint.newRandomPoint();
    }

    public draw() {
        this._context.beginPath();
        this._context.arc(this._centerPoint.x, this._centerPoint.y, this._radius, 0, 2 * Math.PI, false);
        this._context.fillStyle = this._color;
        this._context.strokeStyle = "black";
        this._context.fill();
        this._context.stroke();
    }

    public isInside(pt: Point): boolean {
        let r = Math.sqrt(Math.pow(pt.x - this._centerPoint.x, 2) + Math.pow(pt.y - this._centerPoint.y, 2));
        if (r < this._radius) {
            return (true);
        }
        else {
            return (false);
        }
    }

    set centerPoint(pt: Point) {
        this._centerPoint = pt;
    }

    get centerPoint(): Point {
        return (this._centerPoint);
    }
}
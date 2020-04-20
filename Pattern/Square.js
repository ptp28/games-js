class Square {
    constructor(context, startX, startY, sideLength, color1) {
        this.context = context;
        this.startX = startX;
        this.startY = startY;
        this.sideLength = sideLength;
        this.colorPrimary = color1;
        this.colorActive = this.colorPrimary;
        this.border = false;
    }
    draw() {
        this.context.clearRect(this.startX, this.startY, this.sideLength, this.sideLength);
        this.context.beginPath();
        this.context.rect(this.startX, this.startY, this.sideLength, this.sideLength);
        this.context.fillStyle = this.colorActive;
        if(this.border)
        {
            this.context.strokeStyle = "black";
        }
        else
        {
            this.context.strokeStyle = "white";
        }
        this.context.fill();
        this.context.stroke();
    }
    isInside(clickX, clickY) {
        if (clickX >= this.startX && clickX <= (this.startX + this.sideLength) && clickY >= this.startY && clickY <= (this.startY + this.sideLength)) {
            return true;
        }
        return false;
    }
    changeColor() {
        if (this.colorActive == this.colorPrimary) {
            this.colorActive = 'white';
            this.border = true;
            this.draw();
        }
        else {
            this.colorActive = this.colorPrimary;
            this.border = false;
            this.draw();
        }
    }
}
let canvas;
let ctx;
const canvasWidth = 600;
const canvasHeight = 600;

let ship;
let key = []

let bullets = [];
let asteroids = [];

let score = 0;
let lives = 3;

document.addEventListener('DOMContentLoaded', InitCanvas);

function InitCanvas() {
    canvas = document.querySelector("#root-canvas");
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.body.addEventListener("keydown", (e) => {
        key[e.keyCode] = true;
        if (e.keyCode === 32) { //keycode of the space-bar
            bullets.push(new Bullet(ship.angle));
        }
    });

    document.body.addEventListener("keyup", (e) => {
        key[e.keyCode] = false;
    });

    ship = new Ship();

    for (let i = 0; i < 8; i++) {
        asteroids.push(new Asteroid());
    }


    Render();
}

class Bullet {
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 6;
        this.velX = 0;
        this.velY = 0;
    }
    Update() {
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
    Draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


class Asteroid {
    constructor(x, y, radius, level, collisionRadius) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 1;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        // Used to decide if this asteroid can be broken into smaller pieces
        this.level = level || 1;
    }
    Update() {
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
    }
    Draw() {
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 6);
        var radians = this.angle / Math.PI * 180;
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}

class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotationSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white'
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight / 2;
    }
    // Rotate - method to rotate, direction can be positive or negative
    Rotate(direction) {
        this.angle += this.rotationSpeed * direction;
    }

    // Update - method to update player parameters
    Update() {
        // convert into radians
        this.radians = this.angle / Math.PI * 180;
        // new position
        // newX = oldX *cos(radians)*distance, newY = oldY*sin(radians)*distance
        if (this.movingForward) {
            this.velocityX += Math.cos(this.radians) * this.speed;
            this.velocityY += Math.sin(this.radians) * this.speed;
        }

        //flip ship when cross the border
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }

        // if keyUp - slow down, keyDown faster
        this.velocityX *= this.movingForward ? 1.001 : 0.999;
        this.velocityY *= this.movingForward ? 1.001 : 0.999;

        // new positions
        this.x -= this.velocityX;
        this.y -= this.velocityY;
    }

    Draw() {
        ctx.strokeStyle = this.strokeColor;
        //start drawing

        const vertAngel = ((Math.PI * 2) / 3)
        const radians = this.angle / Math.PI * 180;

        // Nose where to fire bullet from
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
        ctx.beginPath();
        ctx.arc(this.noseX, this.noseY, 3, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 3;

        
        for (let i = 0; i < 3; i++) {

            const xLineTo = this.x - this.radius * Math.cos(vertAngel * i + radians);
            const yLineTo = this.y - this.radius * Math.sin(vertAngel * i + radians);
            ctx.lineTo(xLineTo, yLineTo);
        }
        ctx.closePath();
        ctx.stroke();
    }
}

Render = () => {
    // console.log('Render');
    // check if it's moving forward - "w" - code is 
    ship.movingForward = key[87];

    if (key[68]) { //d - rotate - clockwise
        ship.Rotate(1);
    }
    if (key[65]) { //a - rotate opposite clock
        ship.Rotate(-1);
    }

    //and clear the screen finally
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE : " + score.toString(), 20, 35);


    if(ship.visible){
        ship.Update();
        ship.Draw();
    }

    if (bullets.length !== 0) {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].Update();
            bullets[i].Draw();
        }
    }
    if (asteroids.length !== 0) {
        for (let j = 0; j < asteroids.length; j++) {
            asteroids[j].Update();
            // Pass j so we can track which asteroid points
            // to store
            asteroids[j].Draw(j);
        }
    }

    requestAnimationFrame(Render);
}
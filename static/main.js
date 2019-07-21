let canvas;
let ctx;
const canvasWidth = 600;
const canvasHeight = 600;

let key =[]

document.addEventListener('DOMContentLoaded',InitCanvas);

function InitCanvas(){
    canvas = document.querySelector("#root-canvas");
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';
    ctx.fillRectangle(0,0,canvas.width, canvas.height)
}
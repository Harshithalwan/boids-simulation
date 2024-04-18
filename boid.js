let x = 100, y = 100;
let speedX = 0, speedY = 0;
numBoids = 100;
const boids = [];
const visualRange = 100;


const canvas = document.getElementById("boids");
const parent = document.getElementById("canvasParent");
const width = parent.offsetWidth;
const height = parent.offsetHeight
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");

const draw = (boid) => {
    const angle = Math.atan2(boid.speedY, boid.speedX)
    ctx.translate(boid.x, boid.y);
    ctx.rotate(angle);
    ctx.translate(-boid.x, -boid.y);
    // const hexChars = '0123456789ABCDEF';
    // let color = '#';
    // for (let i = 0; i < 6; i++) {
    //     color += hexChars[Math.floor(Math.random() * hexChars.length)];
    // }
    ctx.beginPath();
    // ctx.fillStyle = color
    ctx.moveTo(boid.x, boid.y);
    ctx.lineTo(boid.x - 15, boid.y + 5);
    ctx.lineTo(boid.x - 15, boid.y - 5);
    ctx.arc(boid.x - 15, boid.y, 5, 0.5 * Math.PI, 1.5 * Math.PI);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);


}

const moveBoid = (boid) => {
    boid.x += boid.speedX;
    boid.y += boid.speedY;
}

const bounceFromBorder = (boid) => {
    const margin = 100;
    const turnConstant = 1
    if (boid.x < margin) {
        boid.speedX += turnConstant;
    }
    if (boid.x > width - margin) {
        boid.speedX -= turnConstant;
    }
    if (boid.y < margin) {
        boid.speedY += turnConstant;
    }
    if (boid.y > height - margin) {
        boid.speedY -= turnConstant;
    }
}

const getDistance = (boid1, boid2) => {
    const xDistance = Math.pow(boid1.x - boid2.x, 2);
    const yDistance = Math.pow(boid1.y - boid2.y, 2);
    return Math.sqrt(xDistance + yDistance);
}

const gravity = (boid) => {
    const gravityConstant = 0.005;
    let centerX = 0;
    let centerY = 0;
    let neighbourCount = 0;
    for (let otherBoid of boids) {
        if (boid !== otherBoid) {
            if (getDistance(boid, otherBoid) < visualRange) {
                centerX += otherBoid.x;
                centerY += otherBoid.y;
                neighbourCount++;
            }
        }
    }

    if (neighbourCount > 0) {
        centerX = centerX / neighbourCount;
        centerY = centerY / neighbourCount;
    }

    boid.speedX += (centerX - boid.x) * gravityConstant;
    boid.speedY += (centerY - boid.y) * gravityConstant;
}

const repel = (boid) => {
    const minDistance = 30;
    const repulsionConstant = 0.05
    let turnX = 0;
    let turnY = 0;
    for (let otherBoid of boids) {
        if (boid !== otherBoid) {
            if (getDistance(boid, otherBoid) < minDistance) {
                turnX += boid.x - otherBoid.x;
                turnY += boid.y - otherBoid.y;
            }
        }
    }
    boid.speedX += turnX * repulsionConstant;
    boid.speedY += turnY * repulsionConstant;
}

const align = (boid) => {
    const alignConstant = 0.1;
    let avgSpeedX = 0;
    let avgSpeedY = 0;
    let neighbourCount = 0;
    for (let otherBoid of boids) {
        if (getDistance(boid, otherBoid) < visualRange) {
            avgSpeedX += otherBoid.speedX;
            avgSpeedY += otherBoid.speedY;
            neighbourCount++;
        }
    }
    if (neighbourCount > 0) {
        boid.speedX += ((avgSpeedX / neighbourCount) - boid.speedX) * alignConstant;
        boid.speedY += ((avgSpeedY / neighbourCount) - boid.speedY) * alignConstant;
    }
}

const speedLimiter = (boid) => {
    const maxSpeed = 10;
    const speed = Math.sqrt(Math.pow(boid.speedX, 2) + Math.pow(boid.speedY, 2))
    if (speed > maxSpeed) {
        boid.speedX = (boid.speedX / speed) * maxSpeed
        boid.speedY = (boid.speedY / speed) * maxSpeed
    }
}

animate = async () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    for (let boid of boids) {
        draw(boid);
        bounceFromBorder(boid);
        gravity(boid);
        speedLimiter(boid);
        repel(boid);
        align(boid);
        moveBoid(boid);
    }
}
function init() {
    for (let i = 0; i < numBoids; i++) {
        boids[boids.length] = {
            x: Math.random() * width,
            y: Math.random() * height,
            speedX: Math.random() * 10 - 5,
            speedY: Math.random() * 10 - 5,
        };
    }
}
init();
animate();



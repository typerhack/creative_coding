const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const {contrastRatio} = require("canvas-sketch-util/color");

const settings = {
    dimensions: [1080, 1920],
    animate: true,
    duration: 15,
    fps: 30,
};

// Animating can be done like this:
/*
const animate = () => {
    console.log('Frame Number');
    requestAnimationFrame(animate);
}
animate();
 */

const sketch = ({context, width, height}) => {
    const agents = [];

    for (let i = 0; i < 90; i++) {
        const x = random.range(0, width);
        const y = random.range(0, height);
        agents.push(new Agent(x, y))
    }

    return ({context, width, height}) => {
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);

        for (let i = 0; i < agents.length; i++) {
            const agent = agents[i];

            for (let j = i + 1; j < agents.length; j++) {
                const otherAgent = agents[j];

                const dist = agent.pos.getDistance(otherAgent.pos);

                if (dist > 200) {
                    continue;
                }

                context.lineWidth = math.mapRange(dist, 0, 200, 8, 1)

                context.beginPath();
                context.moveTo(agent.pos.x, agent.pos.y);
                context.lineTo(otherAgent.pos.x, otherAgent.pos.y);
                context.strokeStyle = 'white';
                context.stroke();
            }
        }

        agents.forEach(agent => {
            agent.update();
            agent.draw(context);
            agent.bounce(width, height);
        })


    };
};

canvasSketch(sketch, settings);

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getDistance(otherVector) {
        const dx = this.x - otherVector.x;
        const dy = this.y - otherVector.y;
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return distance;
    }

}

class Agent {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
        this.radius = random.range(4, 12);
    }

    bounce(width, height) {
        if (this.pos.x <= 0 || this.pos.x >= width) {
            this.vel.x *= -1;
        }
        if (this.pos.y <= 0 || this.pos.y >= height) {
            this.vel.y *= -1;
        }
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(context) {
        context.fillStyle = 'black';
        context.strokeStyle = 'white';
        context.lineWidth = 4;

        context.save();

        context.translate(this.pos.x, this.pos.y);
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.restore();


    }
}

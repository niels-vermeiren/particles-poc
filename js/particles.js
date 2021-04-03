let canvas = document.createElement("canvas");
var particlesElement = document.getElementsByClassName('particles')[0];
particlesElement.appendChild(canvas);
fitToContainer(canvas);
const ctx = canvas.getContext("2d");

const backgroundColor = particlesElement.getAttribute('background-color');
const amount = particlesElement.getAttribute('amount');
const color = hexToRgb(particlesElement.getAttribute('color'));


function hexToRgb(hex) {
	return {
		r: '0x' + hex[1] + hex[2] | 0,
		g: '0x' + hex[3] + hex[4] | 0,
		b: '0x' + hex[5] + hex[6] | 0
	}
}

function fitToContainer(canvas){
  	canvas.style.width='100%';
  	canvas.style.height='100%';
  	canvas.width  = canvas.offsetWidth;
  	canvas.height = canvas.offsetHeight;
}

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get X() {
		return this.x;
	}

	get Y() {
		return this.y;
	}
}

class Particle {
	constructor(x, y, radius, color, vector) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.vector = vector;
	}

	get X() {
		return this.x;
	}

	get Y() {
		return this.y;
	}

	update () {
		this.x += this.vector.X;
		this.y += this.vector.Y;
	}

	draw () {	
		ctx.beginPath();
		ctx.fillStyle =  this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
	}
}

class ParticleManager {	
	constructor() {
		this.particles = []
		this.mouseX = -1;
		this.mouseY = -1;
	}

	createNew() {
		const x = Math.random() * canvas.offsetWidth;
		const y = Math.random() * canvas.offsetHeight + 1;
		let dirX = (Math.random() * 1) + 1;
		let dirY = (Math.random() * 1) + 1;
		dirX = Math.floor(Math.random() * 2) == 1? dirX : -dirX;
		dirY = Math.floor(Math.random() * 2) == 1? dirX : -dirX;
		let vector = new Vector(dirX, dirY);
		let radius = Math.random() * 3;
		let p = new Particle(x, y, radius, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)', vector);
		this.addParticle(p);
	}

	addParticle(particle) {
		if(this.particles.length < amount) {
			this.particles.push(particle);
		}
	}

	update() {
		let i = 0;
		while(i != this.particles.length) {
			let p = this.particles[i];
			let beyondXBounds = p.X < 0 || p.X > canvas.offsetWidth;
			let beyondYBounds = p.Y < 0 || p.Y > canvas.offsetHeight;
			p.update();
			if (beyondXBounds || beyondYBounds) {
				this.particles.splice(i, 1);
			} else i++;
		}
	}

	draw() {
		this.particles.forEach((p) => {
			p.draw();
			this.particles.forEach((p2) => {
				var distance = Math.sqrt(Math.pow(p.X - p2.X, 2) + Math.pow(p.Y - p2.Y, 2));
				var i = 0;
				if (distance < canvas.offsetWidth/8) {
					ctx.beginPath(); 
					var opacity = Math.abs((distance / (canvas.offsetWidth/8)) - 1);
					ctx.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', ' + opacity + ')';
					ctx.moveTo(p.X,p.Y);
					ctx.lineTo(p2.X,p2.Y);
					ctx.stroke();
				}
			});
				
		});	
	}
}

let pm = new ParticleManager();

for (var i = 50 - 1; i >= 0; i--) pm.createNew();
setInterval(function() {
  //engine loop
  pm.createNew();	
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  pm.update();
  pm.draw();
}, 50);
//I strongly suggest declaring global variables before they're used, so that you can find them easily later
//Not using globals is even better, but that's another topic for another day.
canvas = null;
gfx = null;
gl = gameLoop2;
width = 0;
height = 0;

// This is a safe way of isolating an entry point for your program
window.onload = function(){
	canvas = document.getElementById('canvas');
	gfx = canvas.getContext('2d');
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	init_particles(200);
};


/*


*/

function rint(n) { return Math.floor(Math.random()*n); }
function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (h && s === undefined && v === undefined) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return "rgb(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + ")";
}
function init_particles(n){
	for(var i = 0; i < n; i++){
		var p = makeRandomParticle();
		particles.push(p);
	}
	gl = gameLoop5;
	requestAnimationFrame(gl);
}

var makeRandomParticle = function(){
	return new Particle(rint(width), rint(height), Math.random()*2-1, Math.random()*2-1, rint(5)+2, HSVtoRGB(Math.random(), 1, 1));
}

var randomizeParticle = function(p) {
	p.x = rint(width);
	p.y = rint(height);
	p.vx = Math.random()*2-1;
	p.vy = Math.random()*2-1;
	p.r = rint(5)+2;
	p.c = HSVtoRGB(Math.random(), 1, 1);
}

var particles = [];

function update(dt) {
	for(var i = 0; i < particles.length; i++) {
		var p1 = particles[i];
		p1.x += p1.vx;
		p1.y += p1.vy;
		if(p1.x < 0) p1.x = width-1;
		if(p1.x > width-1) p1.x = 0;
		if(p1.y < 0) p1.y = width-1;
		if(p1.y > width-1) p1.y = 0;
		if(p1.r > 200) randomizeParticle(p1);
		for(var j = i+1; j < particles.length; j++) {
			p2 = particles[j];
			var dx = p1.x-p2.x;
			var dy = p1.y-p2.y;
			var d = dx*dx + dy*dy;
			if(d < 1) {
				if(p1.r == p2.r) continue;
				if(p1.r < p2.r){
					var tmp = p1;
					p1 = p2;
					p2 = tmp;
				}
				p1.r = Math.cbrt(p1.r*p1.r*p1.r + p2.r*p2.r*p2.r);
				randomizeParticle(p2);
			}
			var fgrav = 0.0001*(p1.r * p1.r * p1.r * p2.r * p2.r * p2.r) / d;
			var a = Math.atan2(p1.y-p2.y, p1.x-p2.x);
			var fx = Math.cos(a) * fgrav;
			var fy = Math.sin(a) * fgrav;
			p1.vx -= fx/p1.r;
			p1.vy -= fy/p1.r;
			p2.vx += fx/p2.r;
			p2.vy += fy/p2.r;

			var v1 = Math.sqrt(p1.vx*p1.vx + p1.vy*p1.vy);
			var v2 = Math.sqrt(p2.vx*p2.vx + p2.vy*p2.vy);
			var a1 = Math.atan2(p1.vy, p1.vx);
			var a2 = Math.atan2(p2.vy, p2.vx);
			var sx1 = (p1.vx >= 0) ? 1 : -1;
			var sy1 = (p1.vy >= 0) ? 1 : -1;
			var sx2 = (p2.vx >= 0) ? 1 : -1;
			var sy2 = (p2.vy >= 0) ? 1 : -1;
			v1 = Math.min(v1, 1);
			v2 = Math.min(v2, 1);
			p1.vx = Math.cos(a1)*v1;
			p1.vy = Math.sin(a1)*v1;
			p2.vx = Math.cos(a2)*v2;
			p2.vy = Math.sin(a2)*v2;
			// if(coll(p1.x, p1.y, p1.r, p2.x, p2.y, p2.r)){
			// 	var a = Math.atan2(p1.y-p2.y, p1.x-p2.x);

			// }
		}
	}
}

function redraw(dt) {
	gfx.clearRect(0,0,width,height);

	for(var i in particles){
		var part = particles[i];
		gfx.beginPath();
		gfx.arc(Math.floor(part.x), Math.floor(part.y), part.r, 0, 2*Math.PI, false);
		gfx.fillStyle = part.c;
		gfx.fill();
		gfx.stroke();
	}
}

function Particle(x, y, vx, vy, r, c){
	this.x = x;
	this.y = y;
	this.r = r;
	this.c = c;
	this.vx = vx;
	this.vy = vy;
}
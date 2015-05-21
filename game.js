//A lesson in game loops in Javascript/HTML

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
var now, dt = 0, last = timestamp(), step = 1/60;

function gameLoop1(){ //Terrible
	while(true){
		update(step);
		redraw(step);
	}
}

function gameLoop2(){ //Bad
	update(step);
	redraw(step);
	setTimeout(gl, step); 
}

function gameLoop3(){ //Bad
	update(step);
	redraw(step);
	requestAnimationFrame(gl)
}

function gameLoop4(){ //Okay, flawed
	now = timestamp();
	dt = (now - last) / 1000;
	update(dt);
	redraw(dt);
	last = now;
	requestAnimationFrame(gl);
}

function gameLoop4(){ //Good
	now = timestamp();
	dt = Math.min((now - last) / 1000, 0.5);
	update(dt);
	redraw(dt);
	last = now;
	requestAnimationFrame(gl);
}

function gameLoop5() { //Fixed
  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while(dt > step) {
    dt = dt - step;
    update(step);
  }
  redraw(dt);
  last = now;
  requestAnimationFrame(gl);
}
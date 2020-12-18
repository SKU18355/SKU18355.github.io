/**
 * The Physic Engine which runs on the load of the HTML
 *
 */
function init(){
	var Engine = Matter.Engine,
		Events = Matter.Events,
		Render = Matter.Render,
		Constraint = Matter.Constraint,
		World = Matter.World,
		Bodies = Matter.Bodies;

	// create an engine
	var engine = Engine.create();

	// create a renderer
	var render = Render.create({
		element: document.body,
		engine: engine,
		options: {
			width: 1200,
			height: 700,
			wireframes: false, // <-- important
			showAngleIndicator: false
		}
	});
	engine.world.gravity.y = 1.2;

	// create two boxes and a ground
	var boxA = Bodies.rectangle(100, 100, 80, 80, { render: {fillStyle: '#199e5e'}});
	var boxB = Bodies.rectangle(1100, 100, 80, 80, { render: {fillStyle: '#f56342'}});
	var ball = Bodies.circle(600, 30, 40, {frictionAir: 0.001, friction: 0.001, restitution: 1,render: {fillStyle: '#e3ad19'}});
	var ballb = Bodies.circle(600, 30, 100, {frictionAir: 0.001, friction: 0.001, restitution: 1 , isSensor: true, render : {visible: true, fillStyle: '#e3ad19', opacity: 0.01}});
	Matter.Body.setDensity(ball, 0.000001);
	Matter.Body.setDensity(ballb, 0.000001);
	var constraint = Constraint.create({
		bodyA: ball,
		bodyB: ballb,
		length: 0
	});
	var ground = Bodies.rectangle(600, 730, 1200, 120, { isStatic: true });
	var ground2 = Bodies.rectangle(600, 700, 1200, 60, { isStatic: true, isSensor: true });
	var goala = Bodies.rectangle(300, 700, 580, 61, { isStatic: true, isSensor: true, render : {visible: true }});
	var goalb = Bodies.rectangle(900, 700, 580, 61, { isStatic: true, isSensor: true, render : {visible: true }});

	var net = Bodies.rectangle(600, 540, 14, 260, {isStatic: true, render: {fillStyle: '#ffffff'}});
	var border1 = Bodies.rectangle(-10, -750, 20, 2700, {isStatic: true});
	var border2 = Bodies.rectangle(1210, -750,20, 2700, {isStatic: true});
	var border3 = Bodies.rectangle(-15, -750, 20, 2700, {isStatic: true});
	var border4 = Bodies.rectangle(1215, -750,20, 2700, {isStatic: true});


	var maxjumps = 10;
	var p1stats = [0, maxjumps, 0, 0, 0];//score & jumps left & kann springen & etwas &kann kicken &
	var p2stats = [0, maxjumps, 0, 0, 0];//score & jumps left

	// add all of the bodies to the world
	World.add(engine.world, [net, border1, border2, border3, border4, goala, goalb, ground, ground2, boxA, boxB,  ball, ballb, constraint]);

	// run the engine
	Engine.run(engine);

	// run the renderer

	Render.run(render);
	document.body.addEventListener("keydown", function(event) {
		if (event.keyCode == 38) {
			console.log("up");
			if(p1stats[1]>0){
				Matter.Body.applyForce(boxB, boxB.position, Matter.Vector.create(0, -0.2));
				p1stats[1]--;
			}
		}
		if (event.keyCode == 39&& p1stats[2]+100 < Matter.Common.now()) {
			console.log("right");
			Matter.Body.applyForce(boxB, boxB.position, Matter.Vector.create(0.1, 0));
			p1stats[2] = Matter.Common.now();
		}
		if (event.keyCode == 37 && p1stats[3]+100 < Matter.Common.now()) {
			console.log("left");
			Matter.Body.applyForce(boxB, boxB.position, Matter.Vector.create(-0.1, 0));
			p1stats[3] = Matter.Common.now();
		}
		if (event.keyCode == 40) {
			console.log("down");
			if(p1stats[1]>0){
				Matter.Body.applyForce(boxB, boxB.position, Matter.Vector.create(0, +0.2));
				p1stats[1]--;
			}
		}
		if (event.keyCode == 16 && p1stats[4]==1) {
			Matter.Body.applyForce(ball, boxB.position, Matter.Vector.mult(Matter.Vector.sub(ball.position, boxB.position), 0.0000145));
		}
		//BOX A
		if (event.keyCode == 87) {
			console.log("up");
			if(p2stats[1]>0){
				Matter.Body.applyForce(boxA, boxA.position, Matter.Vector.create(0, -0.2));
				p2stats[1]--;
			}
		}
		if (event.keyCode == 68 && p2stats[2]+100 < Matter.Common.now()) {
			console.log("right");
			Matter.Body.applyForce(boxA, boxA.position, Matter.Vector.create(0.1, 0));
			p2stats[2] = Matter.Common.now();
		}
		if (event.keyCode == 65 && p2stats[3]+100 < Matter.Common.now()) {
			console.log("left");
			Matter.Body.applyForce(boxA, boxA.position, Matter.Vector.create(-0.1, 0));
			p2stats[3] = Matter.Common.now();
		}
		if (event.keyCode == 83) {
			console.log("down");
			if(p2stats[1]>0){
				Matter.Body.applyForce(boxA, boxA.position, Matter.Vector.create(0, +0.2));
				p2stats[1]--;
			}
		}
		if (event.keyCode == 69 && p2stats[4]==1) {
			Matter.Body.applyForce(ball, boxA.position, Matter.Vector.mult(Matter.Vector.sub(ball.position, boxA.position), 0.0000145));
		}





	});
	Events.on(engine, 'afterUpdate', function(event) {


	});


	Events.on(engine, 'collisionStart', function(event) {
		var pairs = event.pairs;

		for (var i = 0, j = pairs.length; i != j; ++i) {
			var pair = pairs[i];
			if (pair.bodyA === boxB && pair.bodyB === ground) {
				p1stats[1] = maxjumps;
			}
			if (pair.bodyA === boxA && pair.bodyB === ground) {
				p2stats[1] = maxjumps;
			}

			if (pair.bodyA === boxA && pair.bodyB === ballb) {
				p2stats[4] = 1;
			}
			if (pair.bodyA === boxB && pair.bodyB === ballb) {
				p1stats[4] = 1;
			}


			if (pair.bodyA === boxA && pair.bodyB === ball) {
				Matter.Body.applyForce(ball, ball.position, Matter.Vector.mult(Matter.Vector.sub(ball.position, boxA.position), 2));
			}
			if (pair.bodyA === boxB && pair.bodyB === ball) {
				Matter.Body.applyForce(ball, ball.position, Matter.Vector.mult(Matter.Vector.sub(ball.position, boxB.position), 2));
			}

			if (pair.bodyA === ball && pair.bodyB === goala) {
				resetstate([boxA, boxB, ball, ballb]);
				p1stats[0]++;
			}
			if (pair.bodyA === ball && pair.bodyB === goalb) {
				resetstate([boxA, boxB, ball, ballb]);
				p2stats[0]++;

			}




		}
	});
	Events.on(engine, 'collisionEnd', function(event) {
		var pairs = event.pairs;

		for (var i = 0, j = pairs.length; i != j; ++i) {
			var pair = pairs[i];

			if (pair.bodyA === boxA && pair.bodyB === ballb) {
				p2stats[4] = 0;
			}
			if (pair.bodyA === boxB && pair.bodyB === ballb) {
				p1stats[4] = 0;
			}

		}
	});

	Events.on(render, "afterRender", function(event) {
		var cs = document.getElementsByTagName('canvas');
		var ctx = cs[0].getContext("2d");
		ctx.font = "50px Verdana";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(pad(p2stats[0], 2), 50, 100);
		ctx.fillText(pad(p1stats[0], 2), 1075, 100);
		for(var i = 1; i <= p2stats[1]; i++){
			ctx.fillRect(50+ i*20, 10, 20, 10);
		}
		for(var c = 1; c <= p1stats[1]; c++){
			ctx.fillRect(1075- c*20, 10, 20, 10);
		}
		
});



}

/**
 * If Value is a single digit add a zero before it
 * example num = 1
 * after method num = 01
 *
 * @param {number} num  - number which should be checked
 * @param {number} size - how long number should be
 * @return {number} 0+number
 */
function pad(num, size) {
	num = num.toString();
	if(num.length < size) num = "0" + num;
	return num;
}


/**
 * Resets the State of the box
 *
 * @param {object} x	- the object which should be reset
 */
function resetstate(x){

	Matter.Body.setPosition(x[0], Matter.Vector.create(100,100));
	Matter.Body.setAngularVelocity(x[0], 0);
	Matter.Body.setAngle(x[0], 0);
	Matter.Body.setVelocity(x[0], Matter.Vector.create(0,0));


	Matter.Body.setPosition(x[1], Matter.Vector.create(1100,100));
	Matter.Body.setAngularVelocity(x[1], 0);
	Matter.Body.setAngle(x[1], 0);
	Matter.Body.setVelocity(x[1], Matter.Vector.create(0,0));

	Matter.Body.setPosition(x[2], Matter.Vector.create(600,30));
	Matter.Body.setAngularVelocity(x[2], 0);
	Matter.Body.setAngle(x[2], 0);
	Matter.Body.setVelocity(x[2], Matter.Vector.create(0,0));

	Matter.Body.setPosition(x[3], Matter.Vector.create(600,30));
	Matter.Body.setAngularVelocity(x[3],0);
	Matter.Body.setAngle(x[3], 0);
	Matter.Body.setVelocity(x[3], Matter.Vector.create(0,0));


}

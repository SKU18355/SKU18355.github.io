
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
	  showAngleIndicator: true
    }
});

// create two boxes and a ground
var boxA = Bodies.rectangle(100, 100, 80, 80, { render: {fillStyle: '#199e5e'}});
var boxB = Bodies.rectangle(1100, 100, 80, 80, { render: {fillStyle: '#f56342'}});
var ball = Bodies.circle(600, 30, 40, {frictionAir: 0, friction: 0, restitution: 0.5 ,render: {fillStyle: '#0f2091'}});
var ballb = Bodies.circle(600, 30, 80, {frictionAir: 0, friction: 0, restitution: 0.5 , isSensor: true, render : {visible: false}});
Matter.Body.setDensity(ball, 0.000001);
Matter.Body.setDensity(ballb, 0.000001);
var constraint = Constraint.create({
        bodyA: ball,
        bodyB: ballb,
        length: 0
    });
var ground = Bodies.rectangle(600, 700, 1200, 60, { isStatic: true });
var ground2 = Bodies.rectangle(600, 700, 1200, 60, { isStatic: true, isSensor: true });
var net = Bodies.rectangle(600, 540, 10, 260, {isStatic: true, render: {fillStyle: '#ffffff'}});
var border1 = Bodies.rectangle(0, -750, 1, 2700, {isStatic: true});
var border2 = Bodies.rectangle(1200, -750, 1, 2700, {isStatic: true});


var maxjumps = 10;
var p1stats = [0, 100, 0, 0, 0];//score & jumps left & 
var p2stats = [0, 100, 0, 0, 0];//score & jumps left

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground, ground2, ball, ballb, constraint, net, border1, border2]);

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
	if (event.keyCode == 16 && p1stats[4]==1) {
		Matter.Body.applyForce(ball, boxB.position, Matter.Vector.mult(Matter.Vector.sub(ball.position, boxB.position), 0.0000045));
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
	if (event.keyCode == 69 && p2stats[4]==1) {
		Matter.Body.applyForce(ball, boxA.position, Matter.Vector.mult(Matter.Vector.sub(ball.position, boxA.position), 0.0000045));
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




}
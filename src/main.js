
function init(){
var Engine = Matter.Engine,
    Render = Matter.Render,
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
      wireframes: false // <-- important
    }
});

// create two boxes and a ground
var boxA = Bodies.rectangle(100, 100, 80, 80, { render: {fillStyle: '#199e5e'}});
var boxB = Bodies.rectangle(450, 50, 80, 80, { render: {fillStyle: '#0f2091'}});
var ground = Bodies.rectangle(600, 700, 1200, 60, { isStatic: true });
var ground2 = Bodies.rectangle(600, 700, 1200, 65, { isSensor: true });
var net = Bodies.rectangle(600, 540, 10, 260, {isStatic: true, render: {fillStyle: '#ffffff'}});
var border1 = Bodies.rectangle(0, -750, 1, 2700, {isStatic: true});
var border2 = Bodies.rectangle(1200, -750, 1, 2700, {isStatic: true});

var p1stats = [0, 2];//score & jumps left
// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground, ground2, net, border1, border2]);

// run the engine
Engine.run(engine);

// run the renderer

Render.run(render);
document.body.addEventListener("keydown", function(event) {
    //BOX B
	if (event.keyCode == 38) {
        console.log("up");
		if(p1stats[1]>0){
		Matter.Body.applyForce(boxB, boxB.position, Matter.Vector.create(0, -0.2))
		p1stats[1]++;
	}
	}
	if (event.keyCode == 39) {
        console.log("right");
		Matter.Body.applyForce(boxB, boxB.position, Matter.Vector.create(0.1, 0))
	}
	if (event.keyCode == 37) {
        console.log("left");
		Matter.Body.applyForce(boxB, boxB.position, Matter.Vector.create(-0.1, 0))
	}
	//BOX A
	if (event.keyCode == 87) {
        console.log("up");
		Matter.Body.applyForce(boxA, boxA.position, Matter.Vector.create(0, -0.2))
    }
	if (event.keyCode == 68) {
        console.log("right");
		Matter.Body.applyForce(boxA, boxA.position, Matter.Vector.create(0.1, 0))
	}
	if (event.keyCode == 65) {
        console.log("left");
		Matter.Body.applyForce(boxA, boxA.position, Matter.Vector.create(-0.1, 0))
	}
	
	
	
});


}
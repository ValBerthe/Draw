
// Façon conseillée de gérer les animations pour box2d
window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame    || 
                  window.oRequestAnimationFrame      || 
                  window.msRequestAnimationFrame     || 
                  function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                  };
    })();


// BOX2D

SCALE = 30;
// shorten the access to namespace-bound variables
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

// WORLD
// world représente le monde dans lequel évoluent nos objets
world = new b2World(
  new b2Vec2(0, 10)    //gravity
  ,  true                 //allow sleep
);

// GROUND
// first we define some properties that we will use
// a Fixture Definition defines the attributes of the object, such as density, friction, and restitution (bounciness).
var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

// now we position the ground
var bodyDef = new b2BodyDef;
bodyDef.type = b2Body.b2_staticBody;
// positions the center of the object (not upper left!)
bodyDef.position.x = 800 / 2 / SCALE;
bodyDef.position.y = 300 / SCALE;

// and we define the shape of the ground
// A Shape defines the actual 2D geometrical object, such as a circle or polygon. 
// For simple boxes, be sure to note that Box2D wants half-width and half-height as arguments.
fixDef.shape = new b2PolygonShape;
// half width, half height.
fixDef.shape.SetAsBox((600 / SCALE) / 2, (10/SCALE) / 2);

// With the static ground defined, we add it to the world:
world.CreateBody(bodyDef).CreateFixture(fixDef);


// FALLING OBJECTS
// This is quite similar, but we use dynamicBody

bodyDef.type = b2Body.b2_dynamicBody;
for(var i = 0; i < 10; ++i) {
    if(Math.random() > 0.5) {
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(
              Math.random() + 0.1 //half width
           ,  Math.random() + 0.1 //half height
        );
    } else {
        fixDef.shape = new b2CircleShape(
            Math.random() + 0.1 //radius
        );
    }
    bodyDef.position.x = Math.random() * 25;
    bodyDef.position.y = Math.random() * 10;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
}

// For visualization
// setup debug draw
var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(document.getElementById("c").getContext("2d"));
debugDraw.SetDrawScale(SCALE);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

// The function that will update the view
function update() {
	// define some properties of the world, velocity and position iteration can be lowered to increase performance
	world.Step(
	    1 / 60   //frame-rate
	    ,10      //velocity iterations
	    ,10      //position iterations
	);
	world.DrawDebugData();
	world.ClearForces();
	 
	requestAnimFrame(update);
}; // update()

// boom
requestAnimFrame(update);
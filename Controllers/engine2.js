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


var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

// Création du monde

var Physics = window.Physics = function(element,scale) {
    var gravity = new b2Vec2(0,9.8); // définition du vecteur gravité
    this.world = new b2World(gravity, true); // création du monde
    this.element = element;
    this.context = element.getContext("2d"); // Relatif au canvas
    this.scale = scale || 30; // l'échelle (combien de pixels/m ?)
    this.dtRemaining = 0;
    this.stepAmount = 1/60; // pour l'animation fixe (1/60ème de seconde)
};

// Ajout des propriétés du framerate fixe. Gère le switch entre le mode débug et le mode normal.

Physics.prototype.step = function (dt) {
    this.dtRemaining += dt;
    while (this.dtRemaining > this.stepAmount) {
        this.dtRemaining -= this.stepAmount;
        this.world.Step(this.stepAmount,8,3);
    }
    if (this.debugDraw) {
        this.world.DrawDebugData();
    }
    else {
    this.context.clearRect(0, 0, this.element.width, this.element.height);

    var obj = this.world.GetBodyList();

    this.context.save();
    this.context.scale(this.scale, this.scale);
    while (obj) {
        var body = obj.GetUserData();
        if (body) {
            body.draw(this.context);
        }

        obj = obj.GetNext();
    }
    this.context.restore();
    }
}

// Déclaration du débug

Physics.prototype.debug = function() {
    this.debugDraw = new b2DebugDraw();
    this.debugDraw.SetSprite(this.context);
    this.debugDraw.SetDrawScale(this.scale);
    this.debugDraw.SetFillAlpha(0.3);
    this.debugDraw.SetLineThickness(1.0);
    this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(this.debugDraw);
};

// gameLoop permet de gérer le focus ou non sur le jeu en cas d'alt+tab, en parallèle de requestAnimationFrame. 

var physics,
lastFrame = new Date().getTime();

window.gameLoop = function() {
    var tm = new Date().getTime();
    requestAnimationFrame(gameLoop);
    var dt = (tm - lastFrame) / 1000;
    if(dt > 1/15) { dt = 1/15; }
    physics.step(dt);
    lastFrame = tm;
};

// Constructeur pour les objets (rend beaucoup plus simple l'utilisation des classes de Box2D)

var Body = window.Body = function (physics, details) {
    this.details = details = details || {};

    // Créer la définition
    this.definition = new b2BodyDef();

    // "Définir" la définition

    for (var k in this.definitionDefaults) {
        this.definition[k] = details[k] || this.definitionDefaults[k];
    }
    this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
    this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
    this.definition.userData = this;
    this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

    // Création des éléments

    this.body = physics.world.CreateBody(this.definition);

    // Création des fixtures

    this.fixtureDef = new b2FixtureDef();
    for (var l in this.fixtureDefaults) {
        this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
    }


    details.shape = details.shape || this.defaults.shape;

    switch (details.shape) {
        case "circle":
            details.radius = details.radius || this.defaults.radius;
            this.fixtureDef.shape = new b2CircleShape(details.radius);
            break;
        case "polygon":
            this.fixtureDef.shape = new b2PolygonShape();
            this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
            break;
        case "block":
        default:
            details.width = details.width || this.defaults.width;
            details.height = details.height || this.defaults.height;

            this.fixtureDef.shape = new b2PolygonShape();
            this.fixtureDef.shape.SetAsBox(details.width / 2,
            details.height / 2);
            break;
    }

    this.body.CreateFixture(this.fixtureDef);
};

// Et enfin les paramètres par défaut tant attendus

Body.prototype.defaults = {
    shape: "block",
    width: 5,
    height: 5,
    radius: 2.5
};

Body.prototype.fixtureDefaults = {
    density: 2,
    friction: 1,
    restitution: 0.2
};

Body.prototype.definitionDefaults = {
    active: true,
    allowSleep: true,
    angle: 0,
    angularVelocity: 0,
    awake: true,
    bullet: false,
    fixedRotation: false
};


// Gestion de l'apparence en jeu (utilisation du contexte du canvas)

Body.prototype.draw = function (context) {
    var pos = this.body.GetPosition(),
        angle = this.body.GetAngle();

    context.save();

    context.translate(pos.x, pos.y); // Translation et rotation
    context.rotate(angle);

    if (this.details.color) {      // Dessine la forme, si on désire mettre une couleur
        context.fillStyle = this.details.color;

        switch (this.details.shape) {
            case "circle":
                context.beginPath();
                context.arc(0, 0, this.details.radius, 0, Math.PI * 2);
                context.fill();
                break;
            case "polygon":
                var points = this.details.points;
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                for (var i = 1; i < points.length; i++) {
                    context.lineTo(points[i].x, points[i].y);
                }
                context.fill();
                break;
            case "block":
                context.fillRect(-this.details.width / 2, -this.details.height / 2,
                this.details.width,
                this.details.height);
            default:
                break;
        }
    }

    if (this.details.image) { // Remplit à l'aide d'une image si on le désire
        context.drawImage(this.details.image, -this.details.width / 2, -this.details.height / 2,
        this.details.width,
        this.details.height);

    }

    if (this.details.border) {
        context.strokeStyle = this.details.border;
        context.lineWidth = this.details.borderWidth || 1/30;
        switch (this.details.shape) {
            case "circle":
                context.beginPath();
                context.arc(0, 0, this.details.radius, 0, Math.PI * 2);
                context.stroke();
                break;
            case "polygon":
                var points = this.details.points;
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                for (var i = 1; i < points.length; i++) {
                    context.lineTo(points[i].x, points[i].y);
                }
                context.stroke();
                break;
            case "block":
                context.strokeRect(-this.details.width / 2, -this.details.height / 2,
                this.details.width,
                this.details.height);
            default:
                break;
        }
    }


    context.restore();

};


Physics.prototype.click = function(callback) {
    var self = this;

    function handleClick(e) {
      e.preventDefault();
      var point = {
            x: (e.offsetX || e.layerX) / self.scale,
            y: (e.offsetY || e.layerY) / self.scale
          };

      self.world.QueryPoint(function(fixture) {
        callback(fixture.GetBody(),
                 fixture,
                 point);
      },point);
    }

    this.element.addEventListener("click",handleClick);
    this.element.addEventListener("touchstart",handleClick);

  };


  //La fonction permettant le drag & drop

  Physics.prototype.dragNDrop = function () {
    var self = this;
    var obj = null;
    var joint = null;

    function calculateWorldPosition(e) {    // On calcule la position de l'élément, converti en mètres
        return point = {
            x: (e.offsetX || e.layerX) / self.scale,
            y: (e.offsetY || e.layerY) / self.scale
        };
    }

    this.element.addEventListener("mousedown", function (e) {       // On chope l'élément en question avec QueryPoint (déjà utilisé lors du Physics.click)
        e.preventDefault();
        var point = calculateWorldPosition(e);
        self.world.QueryPoint(function (fixture) {
            obj = fixture.GetBody().GetUserData();
        }, point);
        if (obj) {
            obj.body.SetType("static");
        }
    });

    this.element.addEventListener("mousemove", function (e) {       // Lorsqu'on bouge la souris, on bouge l'élément
        if (!obj) {
            return;
        }
        var point = calculateWorldPosition(e);

        if (!joint) {
            var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();

            jointDefinition.bodyA = self.world.GetGroundBody();
            jointDefinition.bodyB = obj.body;
            jointDefinition.target.Set(obj.body.GetWorldCenter().x, obj.body.GetWorldCenter().y);
            jointDefinition.maxForce = 100000;
            jointDefinition.timeStep = self.stepAmount;
            joint = self.world.CreateJoint(jointDefinition);
        }

        joint.SetTarget(new b2Vec2(point.x, point.y));
    });

    this.element.addEventListener("mouseup", function (e) {     // Lorsqu'on lache le clic, on détruit le lien en supprimant la vitesse de l'objet
        if (obj){
            obj.body.SetLinearVelocity({x:0,y:0});
        }
        obj = null;
        if (joint) {
            self.world.DestroyJoint(joint);
            joint = null;
        }

    });

};


// CREATION DES ELEMENTS DES DIFFERENTS NIVEAUX, A METTRE DANS UN FICHIER A PART POUR CHAQUE NIVEAU PLUS TARD

function initi() {

    function toPixel(pos, hw) {
        return (pos*hw)/physics.scale;
    }

    var img = new Image();

    physics = window.physics = new Physics(document.getElementById("canvasb2"));
    var fullW = window.innerWidth * 0.999;
    var fullH = window.innerHeight * 0.998;
    physics.context.canvas.width  = fullW;
    physics.context.canvas.height = fullH;

    // floor = new Body(physics, {color: "green", border:"black", type: "static", x:0, y:fullH/physics.scale, height: (0.2*fullH)/physics.scale, width:2*fullW/physics.scale});
    block1 = new Body(physics, {type: "static", color:"red", border:"black", x: 15, y:toPixel(0.8,fullH), height: (0.1*fullH)/physics.scale, width: (0.3*fullW)/physics.scale});
    block2 = new Body(physics, {type: "static", color:"red", border:"black", x:40, y:toPixel(0.8,fullH)});
    block3 = new Body(physics, {type: "static", color:"blue", shape: "circle", border: "black", x:(0.6*fullW)/physics.scale, y:toPixel(0.8,fullH), radius: (0.05*fullH)/physics.scale});
    window.addEventListener("keypress", toon = new Body(physics, {color: "green", border: "black", x:toPixel(0.2,fullW), y: toPixel(0.5,fullH), vx: 10}));


    physics.dragNDrop();
    // physics.debug();
    requestAnimationFrame(gameLoop);
    img.src = "./Resources/Landscape/herbe.jpg";
}

window.addEventListener("load",initi);
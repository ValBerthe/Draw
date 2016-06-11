(function(window) {

    // Angular stuff

    var app = angular.module('runningBob', []); // main angularJS variable

    app.controller('NavbarController', function(){
        this.isSelected = function(checkLevel) {
            return level.num === checkLevel;
        };
        this.selectLevel = function(levelToLoad) {
            loadLevel(levelToLoad);
        };
    });

    app.controller('GameController', function(){
        this.addToon = function(start) {
            if (currentMouseJoint)
                this.destroyElement();
            toon = new physics.Body({
                type: "dynamic",
                color: "pink",
                border: "black",
                shape: "circle",
                x: start.x,
                y: start.y,
                radius: start.radius,
                vx: start.vx,
                vy: start.vy,
                friction: 0,
            });
        };
        // var addToon = function(start) {
        //     if (currentMouseJoint)
        //         this.destroyElement();
        //     toon = new physics.Body({
        //         type: "dynamic",
        //         color: "pink",
        //         border: "black",
        //         shape: "circle",
        //         x: start.x,
        //         y: start.y,
        //         radius: start.radius,
        //         vx: start.vx,
        //         vy: start.vy,
        //         friction: 0,
        //     });
        // };

        this.horizontal = function() {
            // We create a new grey horizontal rectangle and bind it to the mouse to be placed with another click on the canvas
            // See the callbacks defined at the end
            if (currentMouseJoint)
                this.destroyElement();
            var mouseElement = new physics.Body({
                type: "dynamic",
                color: "blue",
                draggable: true,
                sensor: true,
                x: currentMousePos.meterX, 
                y: currentMousePos.meterY, 
                predefined: "horizontal",
            });
            var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
            jointDefinition.bodyA = physics.world.GetGroundBody();
            jointDefinition.bodyB = mouseElement.body.solid;
            jointDefinition.target.Set(mouseElement.body.solid.GetWorldCenter().x, mouseElement.body.solid.GetWorldCenter().y);
            jointDefinition.maxForce = 100000;
            jointDefinition.timeStep = physics.stepAmount;
            jointDefinition.collideConnected = true;
            currentMouseJoint = physics.world.CreateJoint(jointDefinition);
            undoLimit += 1;
        };

        this.vertical = function() {
            // We create a new grey vertical rectangle and bind it to the mouse to be placed with another click on the canvas
            // See the callbacks defined at the end
            if (currentMouseJoint)
                this.destroyElement();
            var mouseElement = new physics.Body({
                type: "dynamic",
                color: "blue",
                draggable: true,
                sensor: true,
                x: currentMousePos.meterX, 
                y: currentMousePos.meterY, 
                predefined: "vertical",
            });
            var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
            jointDefinition.bodyA = physics.world.GetGroundBody();
            jointDefinition.bodyB = mouseElement.body.solid;
            jointDefinition.target.Set(mouseElement.body.solid.GetWorldCenter().x, mouseElement.body.solid.GetWorldCenter().y);
            jointDefinition.maxForce = 100000;
            jointDefinition.timeStep = physics.stepAmount;
            jointDefinition.collideConnected = true;
            currentMouseJoint = physics.world.CreateJoint(jointDefinition);
            undoLimit += 1;
        };

        this.tiltedDown = function() {
            // We create a new grey vertical rectangle and bind it to the mouse to be placed with another click on the canvas
            // See the callbacks defined at the end
            if (currentMouseJoint)
                this.destroyElement();
            var mouseElement = new physics.Body({
                type: "dynamic",
                color: "blue",
                draggable: true,
                sensor: true,
                x: currentMousePos.meterX, 
                y: currentMousePos.meterY,
                predefined: "tiltedDown",
            });
            var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
            jointDefinition.bodyA = physics.world.GetGroundBody();
            jointDefinition.bodyB = mouseElement.body.solid;
            jointDefinition.target.Set(mouseElement.body.solid.GetWorldCenter().x, mouseElement.body.solid.GetWorldCenter().y);
            jointDefinition.maxForce = 100000;
            jointDefinition.timeStep = physics.stepAmount;
            jointDefinition.collideConnected = true;
            currentMouseJoint = physics.world.CreateJoint(jointDefinition);
            undoLimit += 1;
        };

        this.tiltedUp = function() {
            // We create a new grey vertical rectangle and bind it to the mouse to be placed with another click on the canvas
            // See the callbacks defined at the end
            if (currentMouseJoint)
                this.destroyElement();
            var mouseElement = new physics.Body({
                type: "dynamic",
                color: "blue",
                draggable: true,
                sensor: true,
                x: currentMousePos.meterX, 
                y: currentMousePos.meterY, 
                height: 25, 
                width: 2,
                angle: 60,
                predefined: "tiltedUp",
            });
            var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
            jointDefinition.bodyA = physics.world.GetGroundBody();
            jointDefinition.bodyB = mouseElement.body.solid;
            jointDefinition.target.Set(mouseElement.body.solid.GetWorldCenter().x, mouseElement.body.solid.GetWorldCenter().y);
            jointDefinition.maxForce = 100000;
            jointDefinition.timeStep = physics.stepAmount;
            jointDefinition.collideConnected = true;
            currentMouseJoint = physics.world.CreateJoint(jointDefinition);
            undoLimit += 1;
        };

        this.undo = function() {
            if (currentMouseJoint)
                this.destroyElement();
            if (undoLimit === 0 || launchEnabled == 1) {
                return;
            }
            physics.world.DestroyBody(physics.world.GetBodyList());
            undoLimit -= 1;
        };


        this.reset = function() {
            if (launchEnabled == 1) {
                this.launch();
            }
            while (undoLimit !== 0) {
                this.undo();
            }
        };

        this.launch = function() {
            if (currentMouseJoint)
                this.destroyElement();
            if (launchEnabled === 0) {
                launchEnabled = 1;
                $('#launchButton').addClass('btn-danger');
                $('#launchButton').text('stop !');
                $('.launch-disabled').attr('disabled', true);
                $.playSound("http://www.freesound.org/people/denao270/sounds/346373/download/346373__denao270__throwing-whip-effect");
                blockCheck = physics.world.GetBodyList();
                while (blockCheck !== null) {
                    if (blockCheck.GetFixtureList() !== null) {
                        blockCheck.GetFixtureList().SetSensor(false);
                    }                   
                    blockCheck = blockCheck.GetNext();
                }
                blockCheck = null;
                start.body.solid.GetFixtureList().SetSensor(true);
                finish.body.solid.GetFixtureList().SetSensor(true);
                this.addToon(level.start);
            } else {
                stopGame();
            }
        };
        // var startGame = function() {
        //     if (currentMouseJoint)
        //         this.destroyElement();
        //     if (launchEnabled === 0) {
        //         launchEnabled = 1;
        //         $('#launchButton').addClass('btn-danger');
        //         $('#launchButton').text('stop !');
        //         $('.launch-disabled').attr('disabled', true);
        //         $.playSound("http://www.freesound.org/people/denao270/sounds/346373/download/346373__denao270__throwing-whip-effect");
        //         blockCheck = physics.world.GetBodyList();
        //         while (blockCheck !== null) {
        //             if (blockCheck.GetFixtureList() !== null) {
        //                 blockCheck.GetFixtureList().SetSensor(false);
        //             }                   
        //             blockCheck = blockCheck.GetNext();
        //         }
        //         blockCheck = null;
        //         start.body.solid.GetFixtureList().SetSensor(true);
        //         finish.body.solid.GetFixtureList().SetSensor(true);
        //         this.addToon(level.start);
        //     } else {
        //         stopGame();
        //     }
        // };

        this.keyPress = function($event) {
            var keyPressed = $event.keyCode;
            if (keyPressed === 32) // spacebar
                this.launch();
        };

        this.showSolution = function() {
            if (currentMouseJoint)
                this.destroyElement();
            if (!isShownSolution) {
                isShownSolution = true;
                $('#solutionButton').text('Hide solution');
                for(var num in level.solution) {
                    solutionBlocks.push(new physics.Body(level.solution[num]));
                }
            }
            else {
                isShownSolution = false;
                $('#solutionButton').text('Show solution');
                for(var blockNum in solutionBlocks) {
                    physics.world.DestroyBody(solutionBlocks[blockNum].body.solid);
                }
            }
        };

        this.destroyElement = function() {
            if (currentMouseJoint) {
                physics.world.DestroyJoint(currentMouseJoint);
                currentMouseJoint = null;
            }
            this.undo();
        };
    });


    // Global variables

    var canvas;
    var canvasWidth;
    var canvasHeight;
    var canvasOffset;
    // var img = new Image();
    // var metal = new Image();
    var currentMousePos = { 
        pixelX: -1, 
        pixelY: -1,
        meterX: -1,
        meterY: -1,
    };
    var currentMouseJoint = null;
    var launchEnabled = 0;
    var undoLimit = 0;
    var blockCheck = null;
    var start = null;
    var finish = null;
    var level = null;
    var isShownSolution = false;
    var solutionBlocks = [];
    var toon = null;

    var pastelColors = {
        red: "#DB3340",
        yellow: "#E8B71A",
        pink: "#F7EAC8",
        green: "#1FDA9A",
        blue: "#28ABE3",
        purple: "#8331d6",
    };

    var DEGREES_TO_RADIANS = Math.PI/180;



    // **** Module physics : pour gérer box2d ****
    var physics = function() {

        // We shorten the access names of the box2d variables
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
        var gravity = new b2Vec2(0,9.8); // définition du vecteur gravité
        var world = new b2World(gravity, true); // création du monde
        var element = $('#canvas').get(0);
        var context = element.getContext("2d");
        var scale = 30; // l'échelle (combien de pixels/m ?)
        var dtRemaining = 0;
        var stepAmount = 1/60; // pour l'animation fixe (1/60ème de seconde)
        var debugDraw;

        // Ajout des propriétés du framerate fixe. Gère le switch entre le mode débug et le mode normal.
        step = function(dt) {
            dtRemaining += dt;
            while (dtRemaining > stepAmount) {
                dtRemaining -= stepAmount;
                world.Step(stepAmount,8,3);
            }
            if (debugDraw) {
                world.DrawDebugData();
            }
            else {
            context.clearRect(0, 0, element.width, element.height);

            var obj = world.GetBodyList();

            context.save();
            context.scale(scale, scale);
            while (obj) {
                var body = obj.GetUserData();
                if (body) {
                    body.draw(context);
                }

                obj = obj.GetNext();
            }
            context.restore();
            }
        };

        // Déclaration du débug
        var debug = function() {
            debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(context);
            debugDraw.SetDrawScale(scale);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            world.SetDebugDraw(debugDraw);
        };

        // Constructeur pour les objets (rend beaucoup plus simple l'utilisation des classes de Box2D)
        var Body = function(detailsToSet) {
            // Defining defaults
            this.elementDefaults = {
                shape: "block",
                width: 5,
                height: 5,
                radius: 2.5
            };
            this.fixtureDefaults = {
                density: 2,
                friction: 0,
                restitution: 0.5,
                sensor: false
            };
            this.definitionDefaults = {
                active: true,
                allowSleep: true,
                angle: 0,
                angularVelocity: 0,
                awake: true,
                bullet: false,
                fixedRotation: false,
                draggable: false
            };
            this.details = detailsToSet || {};
            if (this.details.x === "center")
                this.details.x = canvasWidth / 2 / scale;
            if (this.details.y === "center")
                this.details.y = canvasHeight / 2 / scale;
            if (this.details.y === "floor")
                this.details.y = (canvasHeight / scale) - (this.details.height / 2);

            if (this.details.predefined) {
                switch (this.details.predefined) {
                    case "horizontal":
                        this.details.width = 20;
                        this.details.height = 3;
                        break;
                    case "vertical":
                        this.details.width = 2;
                        this.details.height = 25;
                        break;
                    case "tiltedUp":
                        this.details.width = 2;
                        this.details.height = 25;
                        this.details.angle = 60;
                        break;
                    case "tiltedDown":
                        this.details.width = 2;
                        this.details.height = 25;
                        this.details.angle = -60;
                        break;
                }
            }

            // Créer la définition
            this.definition = new b2BodyDef();

            // "Définir" la définition
            for (var k in this.definitionDefaults) {
                this.definition[k] = this.details[k] || this.definitionDefaults[k];
            }
            this.definition.position = new b2Vec2(toPixel(this.details.x, canvasWidth) || 0, toPixel(this.details.y, canvasHeight) || 0);
            this.definition.linearVelocity = new b2Vec2(toPixel(this.details.vx, Math.sqrt(canvasWidth)) || 0, toPixel(this.details.vy, Math.sqrt(canvasHeight)) || 0);
            // this.definition.linearVelocity = new b2Vec2(this.details.vx || 0, this.details.vy || 0);
            this.definition.userData = this;
            this.definition.type = this.details.type == "dynamic" ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;

            if (this.details.angle) {
                this.definition.angle = this.details.angle * DEGREES_TO_RADIANS;
            }

            // Création des éléments
            this.body = {
                solid: physics.world.CreateBody(this.definition),
                draggable: this.details.draggable || this.definitionDefaults.draggable
            };

            // Création des fixtures
            this.fixtureDef = new b2FixtureDef();
            this.fixtureDef.density = this.details.density || this.fixtureDefaults.density;
            this.fixtureDef.friction = this.details.friction || this.fixtureDefaults.friction;
            this.fixtureDef.restitution = this.details.restitution || this.fixtureDefaults.restitution;


            this.details.shape = this.details.shape || this.elementDefaults.shape;

            switch (this.details.shape) {
                case "circle":
                    this.details.radius = this.details.radius || this.elementDefaults.radius;
                    this.fixtureDef.shape = new b2CircleShape(toPixel(this.details.radius, canvasWidth));
                    break;
                case "polygon":
                    this.fixtureDef.shape = new b2PolygonShape();
                    this.fixtureDef.shape.SetAsArray(this.details.points, this.details.points.length);
                    break;
                // case "block":
                default:
                    this.details.width = this.details.width || this.elementDefaults.width;
                    this.details.height = this.details.height || this.elementDefaults.height;

                    this.fixtureDef.shape = new b2PolygonShape();
                    this.fixtureDef.shape.SetAsBox(toPixel(this.details.width, canvasWidth) / 2,
                    toPixel(this.details.height, canvasHeight) / 2);
                    break;
            }


            this.details.sensor = this.details.sensor || this.fixtureDefaults.sensor;
            if (this.details.sensor === true) {
                this.fixtureDef.isSensor = true;
            } else {
                this.fixtureDef.isSensor = false;
            }

            this.details.draggable = this.details.draggable || this.definitionDefaults.draggable;

            this.body.solid.CreateFixture(this.fixtureDef);


            // Gestion de l'apparence en jeu (utilisation du contexte du canvas)
            this.draw = function(context) {
                var pos = this.body.solid.GetPosition();
                var angle = this.body.solid.GetAngle();
                var points;
                var i;

                context.save();

                context.translate(pos.x, pos.y); // Translation et rotation
                context.rotate(angle);

                if (this.details.color) {      // Dessine la forme, si on désire mettre une couleur
                    context.fillStyle = pastelColors[this.details.color];

                    switch (this.details.shape) {
                        case "circle":
                            context.beginPath();
                            context.arc(0, 0, toPixel(this.details.radius, canvasWidth), 0, Math.PI * 2);
                            context.fill();
                            break;
                        case "polygon":
                            points = this.details.points;
                            context.beginPath();
                            context.moveTo(points[0].x, points[0].y);
                            for (i = 1; i < points.length; i++) {
                                context.lineTo(points[i].x, points[i].y);
                            }
                            context.fill();
                            break;
                        case "block":
                            context.fillRect(-toPixel(this.details.width, canvasWidth) / 2, -toPixel(this.details.height, canvasHeight) / 2,
                            toPixel(this.details.width, canvasWidth),
                            toPixel(this.details.height, canvasHeight));
                            break;
                        default:
                            break;
                    }
                }

                if (this.details.image) { // Remplit à l'aide d'une image si on le désire
                    context.drawImage(this.details.image, 10, 10, this.details.width*40, 
                        this.details.height*40, -this.details.width / 2, -this.details.height / 2, 
                        this.details.width, this.details.height);
                }

                if (this.details.border) {
                    context.strokeStyle = this.details.border;
                    context.lineWidth = this.details.borderWidth || 1/30;
                    switch (this.details.shape) {
                        case "circle":
                            context.beginPath();
                            context.arc(0, 0, toPixel(this.details.radius, canvasWidth), 0, Math.PI * 2);
                            context.stroke();
                            break;
                        case "polygon":
                            points = this.details.points;
                            context.beginPath();
                            context.moveTo(points[0].x, points[0].y);
                            for (i = 1; i < points.length; i++) {
                                context.lineTo(points[i].x, points[i].y);
                            }
                            context.stroke();
                            break;
                        case "block":
                            context.strokeRect(-toPixel(this.details.width, canvasWidth) / 2, -toPixel(this.details.height, canvasHeight) / 2,
                            toPixel(this.details.width, canvasWidth),
                            toPixel(this.details.height, canvasHeight));
                            break;
                        default:
                            break;
                    }
                }
                context.restore();
            };
        };


        //La fonction permettant le drag & drop
        var dragNDrop = function () {
            var obj = null;
            var joint = null;
            function calculateWorldPosition(e) {    // On calcule la position de l'élément, converti en mètres
                return {
                    x: (e.offsetX || e.layerX) / scale,
                    y: (e.offsetY || e.layerY) / scale
                };
            }

            element.addEventListener("mousedown", function (e) {       // On chope l'élément en question avec QueryPoint (déjà utilisé lors du Physics.click)
                e.preventDefault();
                if (launchEnabled == 1) {
                    return;
                }

                var point = calculateWorldPosition(e);
                world.QueryPoint(function (fixture) {
                    obj = fixture.GetBody().GetUserData();
                }, point);
                if (obj) {
                    if (obj.body.draggable === false) {
                        obj = null;
                    } else if (!currentMouseJoint) {
                        obj.body.solid.SetType(2);
                        var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
                        jointDefinition.bodyA = physics.world.GetGroundBody();
                        jointDefinition.bodyB = obj.body.solid;
                        jointDefinition.target.Set(obj.body.solid.GetWorldCenter().x, obj.body.solid.GetWorldCenter().y);
                        jointDefinition.maxForce = 100000;
                        jointDefinition.timeStep = physics.stepAmount;
                        jointDefinition.collideConnected = true;
                        currentMouseJoint = physics.world.CreateJoint(jointDefinition);
                    }
                }
            });

            element.addEventListener("mouseup", function (e) {     // Lorsqu'on lache le clic, on détruit le lien en supprimant la vitesse de l'objet
                if (obj) {
                    obj.body.solid.SetLinearVelocity({x:0,y:0});
                    obj.body.solid.SetType(0);
                }
                
                if (joint) {
                    world.DestroyJoint(joint);
                    joint = null;
                }

                if (currentMouseJoint) {
                    physics.world.DestroyJoint(currentMouseJoint);
                    currentMouseJoint = null;
                }

                //obj.body.solid.SetType(0);
                obj=null;  
            });
        };

        var collisionListener = new Box2D.Dynamics.b2ContactListener();
        collisionListener.BeginContact = function(contact) {
            var element1 = contact.GetFixtureA().GetBody().GetUserData().details;
            var element2 = contact.GetFixtureB().GetBody().GetUserData().details;
            var toonElement = null;
            var element = null;
            if (element1.color === "pink") {
                toonElement = element1;
                element = element2;
            }
            else {
                toonElement = element2;
                element = element1;
            }

            if (element.color === "red") {
                $("#myModal").modal("show");
            }
        };
        world.SetContactListener(collisionListener);

        var toPixel = function(pos, hw) {
            return (pos/100*hw)/scale;
        };

        // We return all the variables and function that we want to make accessible from outside the module !
        return {
            scale: scale,
            element: element,
            context: context,
            world: world,
            Body: Body,

            dragNDrop: dragNDrop,
            step: step,
            debug: debug,
            toPixel: toPixel,
        };
    }();

    // Everytime the mouse moves anywhere on the window, we get its position
    $(document).mousemove(function(event) {
        currentMousePos.pixelX = event.pageX;
        currentMousePos.pixelY = event.pageY;
        currentMousePos.meterX = (currentMousePos.pixelX - canvasOffset.left) / physics.scale;
        currentMousePos.meterY = (currentMousePos.pixelY - canvasOffset.top) / physics.scale;
        if (currentMouseJoint)
            currentMouseJoint.SetTarget({x: currentMousePos.meterX, y: currentMousePos.meterY});
    });

    // We inform the page that we want to use the RequestAnimationFrame method for the display (more efficient)
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

    var lastFrame = new Date().getTime();

    // gameLoop permet de gérer le focus ou non sur le jeu en cas d'alt+tab, en parallèle de requestAnimationFrame. 
    window.gameLoop = function() {
        var tm = new Date().getTime();
        requestAnimationFrame(gameLoop);
        var dt = (tm - lastFrame) / 1000;
        if(dt > 1/15) { dt = 1/15; }
        physics.step(dt);
        lastFrame = tm;
        checkToonPresence();
    };

    var checkToonPresence = function() {
        if (toon) {
            toonPosition = toon.body.solid.m_xf.position;
            var isOut = toonPosition.x > (canvasWidth/physics.scale) + 1 ||
                        toonPosition.x < -1 ||
                        toonPosition.y > (canvasHeight/physics.scale) + 1;
            if (isOut) {
                $("#ballIsOutAlert").slideDown(1000, function() {
                    window.setTimeout(function() { $("#ballIsOutAlert").slideUp(1000); }, 500);
                });
                stopGame();
            }
        }
    };

    var stopGame = function() {
        launchEnabled = 0;
        $('#launchButton').removeClass('btn-danger');
        $('#launchButton').text('launch !');
        $('.launch-disabled').attr('disabled', false);
        physics.world.DestroyBody(toon.body.solid);
        blockCheck = physics.world.GetBodyList();
        while (blockCheck !== null) {
            if (blockCheck.GetFixtureList() !== null) {
                blockCheck.GetFixtureList().SetSensor(true);
            }                   
            blockCheck = blockCheck.GetNext();
        }
        blockCheck = null;
        toon = null;
    };

    var loadLevel = function(levelToLoad) {
        level = levelToLoad;
        for(var num in level.blocks) {
            new physics.Body(level.blocks[num]);
        }
        start = new physics.Body(level.start);
        finish = new physics.Body(level.finish);
    };

    var goToNextLevel = function() {
        currentLevel = level.num;
        if (currentLevel < levels.length)
            location.href='?level=' + (level.num + 1);
        else
            location.reload();
    };

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results===null){
           return null;
        }
        else{
           return results[1] || 0;
        }
    };

    // CREATION DES ELEMENTS DES DIFFERENTS NIVEAUX, A METTRE DANS UN FICHIER A PART POUR CHAQUE NIVEAU PLUS TARD
    canvas = $('#canvas');
    // we set the canvas' height and width here so that the physics world size scales with the size of the canvas' container
    canvas.get(0).width = canvas.parent().width();
    canvas.get(0).height = canvas.parent().height();
    canvasWidth = canvas.width();
    canvasHeight = canvas.height();
    canvasOffset = canvas.offset();

    var levelPage = $.urlParam("level");
    if(levelPage)
        loadLevel(levels[Number(levelPage) - 1]);
    else
        loadLevel(levels[0]);

    physics.dragNDrop();
    // physics.debug();
    requestAnimationFrame(gameLoop);

    window.goToNextLevel = goToNextLevel;
})(window);



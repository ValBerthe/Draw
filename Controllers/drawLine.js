localStorage.setItem("prevPosX", 0);					// On est obligés de stocker la dernière position de la souris enregistrée lorsqu'on dessine, de sorte à pouvoir tracer des lignes entre les positions successives du mousemove..
localStorage.setItem("prevPosY", 0);					// Faire un simple draw de carré à chaque mousemove va dessiner un carré à chaque rafraîchissement du mousemove, ce qui donne des pointillés si on bouge la souris assez vite.

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function draw(evt) {									// Dessine le pixel.
	var pos = getMousePos(canvas, evt);
	var posx = pos.x;
	var posy = pos.y;
	ctx.beginPath;
	ctx.strokeStyle = "black";
	ctx.strokeWidth = 2;
	ctx.lineCap = "round";
	ctx.moveTo(Number(localStorage.getItem("prevPosX")), Number(localStorage.getItem("prevPosY")));
	ctx.lineTo(posx, posy);
	ctx.stroke();
	localStorage.setItem("prevPosX", posx);
	localStorage.setItem("prevPosY", posy);
}

function predraw(evt) { 
	var pos = getMousePos(canvas, evt);
	localStorage.setItem("prevPosX", pos.x)						// Permet de lancer la fonction draw quand la souris bouge
	localStorage.setItem("prevPosY", pos.y)
	window.addEventListener("mousemove", draw);
}

function removeDraw() {									// Supprime l'assignement d'événement "mousemove" à la fonction de dessin quand la souris est relâchée
	window.removeEventListener("mousemove", draw);
}


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

window.addEventListener("mousedown", predraw);			// Quand on clique, la fonction de predraw s'active


// Adrian

function init() {
	var stage = new createjs.Stage("canvas");
	var circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	circle.x = 100;
	circle.y = 100;
	stage.addChild(circle);

	stage.update();
}
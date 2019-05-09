var speed = 50;
var camera = rcScene.camera;
var lookatSphere = rcScene.lookatSphere;

function onDocumentKeyDown(event) {
	var keyCode = event.which;
	
	//move camera
	if (keyCode == 87) { //w
		camera.position.z -= speed;
	} else if (keyCode == 83) { //s
		camera.position.z += speed;
	} else if (keyCode == 65) { //a
		camera.position.x -= speed;
	} else if (keyCode == 68) { //d
		camera.position.x += speed;
	} else if (keyCode == 32) { //space
		camera.position.y += speed;
	}else if(keyCode == 17){ //ctrl
		camera.position.y -= speed;
		
	//move lookat
	}else if(keyCode == 37){ //left arrow
		lookatSphere.translate(-speed/2, 0, 0);
	}else if(keyCode == 39){ //right arrow
		lookatSphere.translate(speed/2, 0, 0);
	}else if(keyCode == 38){ //up arrow
		lookatSphere.translate(0, 0, -speed/2);
	}else if(keyCode == 40){ //down arrow
		lookatSphere.translate(0, 0, speed/2);
	}else if(keyCode == 33){ //page up
		lookatSphere.translate(0, speed/2, 0);
	}else if(keyCode == 34){ //right arrow
		lookatSphere.translate(0, -speed/2, 0);
	}
	
	camera.lookAt(lookatSphere.getPosition());
}

//makes camera and lookat moveable
document.addEventListener("keydown", onDocumentKeyDown);






EventsControls = new EventsControls( camera, renderer.domElement );

var largeCube = rcScene.largeCube;
var planes = [];
for(var x=0; x<3; x++){
	for(var y=0; y<3; y++){
		for(var z=0; z<3; z++){
			var smallCube = largeCube.smallCubes[x][y][z];
			for(var s=0; s<6; s++){
				var surface = smallCube.surfaces[s];
				for(var p=0; p<surface.planes.length; p++){
					plane = surface.planes[p];
					EventsControls.attach(plane.mesh);
					planes.push(plane);
				}
			}
		}
	}
}

var circle = rcScene.circle;
for(var i=0; i<circle.polygons.length; i++){
	EventsControls.attach(circle.polygons[i].mesh);
}


document.addEventListener("mousedown", function(event){
	if(!largeCube.isMouseOver && !circle.isMouseOver){
		rcScene.onMouseDown(event.pageX, event.pageY, null);
	}
});

document.addEventListener("mousemove", function(event){
	if(!largeCube.isMouseOver && !circle.isMouseOver){
		rcScene.onMouseMove(event.pageX, event.pageY, null);
	}
});

document.addEventListener("mouseup", function(event){
	if(!largeCube.isMouseOver && !circle.isMouseOver){
		rcScene.onMouseUp(event.pageX, event.pageY, null);
	}
});

function isMouseOverLargeCube(ec){
	return ec.event != null && ec.event.item > -1 && planes[ec.event.item];
}

function getSmallCube(ec){
	if(ec.event != null && ec.event.item > -1){
		return planes[ec.event.item].surface.smallCube;
	}else{
		return null;
	}
}


EventsControls.attachEvent('mouseMove', function(){
	if(!rcScene.isDragEnabled){
		if(isMouseOverLargeCube(this)){
			if(largeCube.isMouseOver) largeCube.onMouseMove(this._mouse.x, this._mouse.y, getSmallCube(this));
		}else{
			if(circle.isMouseOver) circle.onMouseMove(this._mouse.x, this._mouse.y);
		}
	}
});

EventsControls.attachEvent('mouseOver', function(){
	if(!rcScene.isDragEnabled){
		if(isMouseOverLargeCube(this)){
			largeCube.onMouseOver(this._mouse.x, this._mouse.y, getSmallCube(this));
		}else{
			circle.onMouseOver(this._mouse.x, this._mouse.y);
		}
	}
});

EventsControls.attachEvent('onclick', function(){
	if(!rcScene.isDragEnabled){
		if(isMouseOverLargeCube(this)){
			largeCube.onMouseDown(this._mouse.x, this._mouse.y, getSmallCube(this));
		}else{
			circle.onMouseDown(this._mouse.x, this._mouse.y);
		}
	}
});

EventsControls.attachEvent('mouseOut', function(){
	if(!rcScene.isDragEnabled){
		largeCube.onMouseOut(this._mouse.x, this._mouse.y);
		circle.onMouseOut(this._mouse.x, this._mouse.y);
	}
});

EventsControls.attachEvent('mouseUp', function(){
	if(!rcScene.isDragEnabled){
		if(isMouseOverLargeCube(this)){
			largeCube.onMouseUp(this._mouse.x, this._mouse.y, getSmallCube(this));
		}else{
			circle.onMouseUp(this._mouse.x, this._mouse.y);
		}
	}
});
class SmallCube{

	//ranges from (0,0,0) to (width, width, -width)
	constructor(width, scene, transforms){
		this.positionIndices = [];
        this.isDraggable = false;
        this.colors = [];
        
        this.surfaces = multiArray([6]);
		
		//front: from (0,0,0) to (width, width, 0)
		/*this.surfaces[0] = new Surface(width, width, this);
		this.surfaces[0].translate(-width, -width, -3*width/2);
		this.surfaces[0].rotate(0, Math.PI, 0);
		
		//back: from (0,0,-width) to (width, width, -width)
		this.surfaces[1] = new Surface(width, width, this);
		this.surfaces[1].translate(-width, -width, -width/2);
		
		//left: from (0,0,0) to (0, width, -width)
		this.surfaces[2] = new Surface(width, width, this);
		this.surfaces[2].translate(-3*width/2, -width, -width);
		this.surfaces[2].rotate(0, -Math.PI/2, 0);
		
		//right: from (1,0,0) to (1, width, -width)
		this.surfaces[3] = new Surface(width, width, this);
		this.surfaces[3].translate(-width/2, -width, -width);
		this.surfaces[3].rotate(0, -Math.PI/2, 0);
		
		//top: from (0,width,0) to (width, width, -width)
		this.surfaces[4] = new Surface(width, width, this);
		this.surfaces[4].translate(-width, -3*width/2, -width);
		this.surfaces[4].rotate(-Math.PI/2, 0, 0);
		
		//bottom: from (0,0,0) to (width, 0, -width)
		this.surfaces[5] = new Surface(width, width, this);
		this.surfaces[5].translate(-width, -width/2, -width);
		this.surfaces[5].rotate(Math.PI/2, 0, 0);*/
		
		//front: from (0,0,0) to (width, width, 0)
		var t = copyArray(transforms);
		t.push(new Translate(-width/2, -3*width/2, -3*width/2));
		t.push(new Rotate(Math.PI, axis.y));
		this.surfaces[0] = new Surface(width, width, this, t);
		
		//back: from (0,0,-width) to (width, width, -width)
		t = copyArray(transforms);
		t.push(new Translate(-width/2, -3*width/2, -width/2));
		t.push(new Rotate(Math.PI, axis.y));
		this.surfaces[1] = new Surface(width, width, this, t);
		
		//left: from (0,0,0) to (0, width, -width)
		t = copyArray(transforms);
		t.push(new Translate(-3*width/2, -3*width/2, -3*width/2));
		t.push(new Rotate(-Math.PI/2, axis.y));
		this.surfaces[2] = new Surface(width, width, this, t);
		
		//right: from (1,0,0) to (1, width, -width)
		t = copyArray(transforms);
		t.push(new Translate(-width/2, -3*width/2, -3*width/2));
		t.push(new Rotate(-Math.PI/2, axis.y));
		this.surfaces[3] = new Surface(width, width, this, t);
		
		//top: from (0,width,0) to (width, width, -width)
		t = copyArray(transforms);
		t.push(new Translate(-3*width/2, -3*width/2, -3*width/2));
		t.push(new Rotate(Math.PI/2, axis.x));
		this.surfaces[4] = new Surface(width, width, this, t);
		
		//bottom: from (0,0,0) to (width, 0, -width)
		t = copyArray(transforms);
		t.push(new Translate(-3*width/2, -width/2, -3*width/2));
		t.push(new Rotate(Math.PI/2, axis.x));
		this.surfaces[5] = new Surface(width, width, this, t);
		
		
		this.group = new THREE.Group();
		for(var i=0; i<this.surfaces.length; i++){
			this.surfaces[i].addToGroup(this.group);
		}
	}
	
	update(){
		for(var i=0; i<this.surfaces.length; i++){
			this.surfaces[i].update();
		}
	}
	
	addToGroup(group){
		group.add(this.group);
	}
	
	
	/*rotateX(angle){
		this.group.rotation.x = angle;
	}
	
	rotateY(angle){
		this.group.rotation.y = angle;
	}
	
	rotateZ(angle){
		this.group.rotation.z = angle;
	}*/
	
	/*rotate(rotateX, rotateY, rotateZ){
		this.group.rotateX(rotateX);
		this.group.rotateY(rotateY);
		this.group.rotateZ(rotateZ);
	}
	
	translate(translateX, translateY, translateZ){
		this.group.translateX(translateX);
		this.group.translateY(translateY);
		this.group.translateZ(translateZ);
	}*/
	
	getPositionIndices(){
        return this.positionIndices;
    }
    
    setPositionIndices(indices){
        this.positionIndices = indices;
    }
    
    getColor(surfaceIndex){
        return this.colors[surfaceIndex];
    }

	setColor(surfaceIndex, surfaceColor, saveColor){
		this.surfaces[surfaceIndex].setColor(surfaceColor);
		if(saveColor) this.colors[surfaceIndex] = surfaceColor;
	}

    /*setColor(surfaceColor, saveColor){
        for(var i=0; i<6; i++) this.setColorAt(i, surfaceColor, saveColor);
    }*/
	
    refreshColors(){
        for(var i=0; i<6; i++){
            if(colors[i]) this.surfaces[i].setColor(this.colors[i]);
        }
    }
    
    toString(){
        return "(" + this.positionIndices[0] + ", " + this.positionIndices[1] + ", " + this.positionIndices[2] + ")";
    }
	
	on(eventName, eventFunction){
		this.group.on(eventName, eventFunction);
	}

}
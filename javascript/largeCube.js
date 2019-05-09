class LargeCube{

	constructor(smallCubeWidth, rubiksCubeScene, transforms){
		this.rubiksCubeScene = rubiksCubeScene;
		
		this.isMouseOver = false;
		
		this.discRotate = multiArray([3, 3]);
        for(var i=0; i<3; i++){
            this.discRotate[0][i] = new Rotate(0, axis.x);
            this.discRotate[1][i] = new Rotate(0, axis.y);
            this.discRotate[2][i] = new Rotate(0, axis.z);
        }
		
        this.isDragEnabled = false;
        this.dragX = -1;
        this.dragY = -1;
        
        this.mouseDragDirection = -1;
        this.discIndex = -1;
        this.angle = null;
        this.clampedAngle = -1;
        this.stickyInterval = 10;
        this.isDiscSticky = false;
        
        this.unfinishedDiscRotateAxisIndex = -1;
        this.unfinishedDiscIndex = -1;
		
		this.frontVectorDirection = null; //which direction is the vector facing that initially points to the front (Z-)?
		this.topVectorDirection = null; //which direction is the vector facing that initially points to the top (Y-)?
		this.discRotateDirection = null; //around which axis is disc being rotated?
        
        //how to rotate small cubes' surface colors around X-axis
        this.surfaceColorMapX = [];
        this.surfaceColorMapX[sides.front] = sides.bottom;
        this.surfaceColorMapX[sides.top] = sides.front;
        this.surfaceColorMapX[sides.bottom] = sides.back;
        this.surfaceColorMapX[sides.left] = sides.left;
        this.surfaceColorMapX[sides.right] = sides.right;
        this.surfaceColorMapX[sides.back] = sides.top;
        
        //how to rotate small cubes' surface colors around Y-axis
        this.surfaceColorMapY = [];
        this.surfaceColorMapY[sides.front] = sides.left;
        this.surfaceColorMapY[sides.top] = sides.top;
        this.surfaceColorMapY[sides.bottom] = sides.bottom;
        this.surfaceColorMapY[sides.left] = sides.back;
        this.surfaceColorMapY[sides.right] = sides.front;
        this.surfaceColorMapY[sides.back] = sides.right;
        
        //how to rotate small cubes' surface colors around Z-axis
        this.surfaceColorMapZ = [];
        this.surfaceColorMapZ[sides.front] = sides.front;
        this.surfaceColorMapZ[sides.top] = sides.right;
        this.surfaceColorMapZ[sides.bottom] = sides.left;
        this.surfaceColorMapZ[sides.left] = sides.top;
        this.surfaceColorMapZ[sides.right] = sides.bottom;
        this.surfaceColorMapZ[sides.back] = sides.back;
		
		this.group = new THREE.Group();
		
		this.smallCubes = new Array(3);
		for(var x=0; x<3; x++){
			this.smallCubes[x] = new Array(3);
			for(var y=0; y<3; y++){
				this.smallCubes[x][y] = new Array(3);
				for(var z=0; z<3; z++){
					var t = copyArray(transforms);
					t.push(this.discRotate[0][x]);
					t.push(this.discRotate[1][y]);
					t.push(this.discRotate[2][z]);
					t.push(new Translate(
						x * smallCubeWidth,
						y * smallCubeWidth,
						z * smallCubeWidth
					));
					
					var smallCube = new SmallCube(smallCubeWidth, this.rubiksCubeScene.scene, t);
					this.smallCubes[x][y][z] = smallCube;
					smallCube.positionIndices = [x, y, z];
					smallCube.addToGroup(this.group);
				}
			}
		}
		
		this.setInitialSurfaceColors();
        this.identifyCubeOrientation();
	}
	
	update(){
		for(var x=0; x<3; x++){
			for(var y=0; y<3; y++){
				for(var z=0; z<3; z++){
					this.smallCubes[x][y][z].update();
				}
			}
		}
	}
	
	addToScene(scene){
		scene.add(this.group);
	}
	
	dragCube(smallCube, mouseX, mouseY){
        var delta = [ this.dragX - mouseX, mouseY - this.dragY ];
		
        if(this.mouseDragDirection == -1){
            switch(Math.floor(Math.sign(Math.abs(delta[1]) - Math.abs(delta[0])))){
                case -1:
                    this.mouseDragDirection = 0;
                    break;
                case 1:
                    this.mouseDragDirection = 1;
                    break;
            }

            if(this.mouseDragDirection > -1){
                this.discRotateDirection = this.getDiscRotateDirection();
            }

        }else if(this.discIndex == -1){
            this.discIndex = smallCube.getPositionIndices()[this.discRotateDirection.axisIndex];

        }else if(this.angle == null){
            this.angle = this.discRotate[this.discRotateDirection.axisIndex][this.discIndex].angle;

        //allow disc rotation only if it continues an unfinished disc rotation or there is no unfinished disc rotation
        }else if(this.unfinishedDiscRotateAxisIndex == -1 || (this.discRotateDirection.axisIndex == this.unfinishedDiscRotateAxisIndex && this.discIndex == this.unfinishedDiscIndex)){
            this.unfinishedDiscRotateAxisIndex = -1;
            this.unfinishedDiscIndex = -1;

            this.clampedAngle = this.clamp(this.angle + this.discRotateDirection.positivityFactor * 3000 * delta[this.mouseDragDirection] / (this.mouseDragDirection == 0 ? this.rubiksCubeScene.sceneWidth : this.rubiksCubeScene.sceneHeight));
            this.discRotate[this.discRotateDirection.axisIndex][this.discIndex].angle = this.clampedAngle;
        }
    }
	
    getDiscRotateDirection(){    
        
        if(this.topVectorDirection.axisIndex == 1){ //large cube has only been rotated around Y-axis (top is still top)
            
            switch(this.frontVectorDirection.toInt()){
                case 0: //front vector is towards X+
                    if(this.mouseDragDirection == 0) return new Axis(1, false);  //mouse is dragged right => disc is rotated along Y-
                    if(this.mouseDragDirection == 1) return new Axis(2, false);  //mouse is dragged down => disc is rotated along Z-
                    if(this.mouseDragDirection == 2) return new Axis(0, false);  //mouse drags circle clockwise => disc is rotated along X-
                    
                case 2: //front vector is towards Z+
                    if(this.mouseDragDirection == 0) return new Axis(1, false);  //mouse is dragged right => disc is rotated along Y-
                    if(this.mouseDragDirection == 1) return new Axis(0, false);  //mouse is dragged down => disc is rotated along X-
                    if(this.mouseDragDirection == 2) return new Axis(2, false);  //mouse drags circle clockwise => disc is rotated along Z-
                    
                case 3: //front vector is towards X-
                    if(this.mouseDragDirection == 0) return new Axis(1, false);  //mouse is dragged right => disc is rotated along Y-
                    if(this.mouseDragDirection == 1) return new Axis(2, true);   //mouse is dragged down => disc is rotated along Z+
                    if(this.mouseDragDirection == 2) return new Axis(0, true);  //mouse drags circle clockwise => disc is rotated along X+
                    
                case 5: //front vector is towards Z-
                    if(this.mouseDragDirection == 0) return new Axis(1, false);  //mouse is dragged right => disc is rotated along Y-
                    if(this.mouseDragDirection == 1) return new Axis(0, true);   //mouse is dragged down => disc is rotated along X+
                    if(this.mouseDragDirection == 2) return new Axis(2, true);  //mouse drags circle clockwise => disc is rotated along Z+
            }
            
        }else if(this.topVectorDirection.axisIndex == 2){ //top or bottom of large cube is now seen in front
            
            if(this.mouseDragDirection == 2) return new Axis(1, !this.topVectorDirection.isPositiveAxis);
            
            switch(this.frontVectorDirection.toInt()){
                case 0: //front vector is towards X+
                    if(this.mouseDragDirection == 0) return new Axis(0, !this.topVectorDirection.isPositiveAxis);  //mouse is dragged right => disc is rotated along Y-
                    if(this.mouseDragDirection == 1) return new Axis(2, false);  //mouse is dragged down => disc is rotated along Z-
                    
                case 1: //front vector is towards Y+
                    if(this.mouseDragDirection == 0) return new Axis(2,  false);  //mouse is dragged right => disc is rotated along Y-
                    if(this.mouseDragDirection == 1) return new Axis(0, this.topVectorDirection.isPositiveAxis);  //mouse is dragged down => disc is rotated along X-
                    
                case 3: //front vector is towards X-
                    if(this.mouseDragDirection == 0) return new Axis(0, this.topVectorDirection.isPositiveAxis);  //mouse is dragged right => disc is rotated along Y-
                    if(this.mouseDragDirection == 1) return new Axis(2, true);   //mouse is dragged down => disc is rotated along Z+
                    
                case 4: //front vector is towards Y-
                    if(this.mouseDragDirection == 0) return new Axis(2, true);  //mouse is dragged right => disc is rotated along Y-
                    if(this.mouseDragDirection == 1) return new Axis(0, !this.topVectorDirection.isPositiveAxis);   //mouse is dragged down => disc is rotated along X+
            }
            
        }
        
        return null;
    }
    
    //resets small cubes' inner position indices and transforms
    resetSmallCubes(){
        for(var i=0; i<3; i++){
            for(var j=0; j<3; j++){
				this.discRotate[i][j].angle = 0;
            }
        }
    }
    
    rotateColorsX(discIndex1){
        var temp = multiArray([3, 3, 6]);
		for(var i=0; i<3; i++){
			for(var j=0; j<3; j++){
                for(var k=0; k<6; k++){
                    temp[2 - j][i][this.surfaceColorMapX[k]] = this.smallCubes[discIndex1][i][j].getColor(k);
                }
            }
        }

        for(var i=0; i<3; i++){
            for(var j=0; j<3; j++){
                for(var k=0; k<6; k++){
                    this.smallCubes[discIndex1][i][j].setColor(k, temp[i][j][k], true);
                }
            }
        }
    }
    
    rotateColorsY(discIndex1){
        var temp = multiArray([3, 3, 6]);
		for(var i=0; i<3; i++){
			for(var j=0; j<3; j++){
                for(var k=0; k<6; k++){
                    temp[j][2 - i][this.surfaceColorMapY[k]] = this.smallCubes[i][discIndex1][j].getColor(k);
                }
            }
        }

        for(var i=0; i<3; i++){
            for(var j=0; j<3; j++){
                for(var k=0; k<6; k++){
                    this.smallCubes[i][discIndex1][j].setColor(k, temp[i][j][k], true);
                }
            }
        }
    }
    
    rotateColorsZ(discIndex1){
        var temp = multiArray([3, 3, 6]);
		for(var i=0; i<3; i++){
			for(var j=0; j<3; j++){
                for(var k=0; k<6; k++){
                    temp[2 - j][i][this.surfaceColorMapZ[k]] = this.smallCubes[i][j][discIndex1].getColor(k);
                }
            }
        }

        for(var i=0; i<3; i++){
            for(var j=0; j<3; j++){
                for(var k=0; k<6; k++){
                    this.smallCubes[i][j][discIndex1].setColor(k, temp[i][j][k], true);
                }
            }
        }
    }
    
    rotateColors(discRotateDirection1, discIndex1, angle1){
        var howManyRightAngles = Math.floor((rad2deg(angle1) / 90) % 4);
        if(howManyRightAngles < 0) howManyRightAngles += 4;
        
        if(discRotateDirection1 != null){
            switch(discRotateDirection1.axisIndex){
                case 0:
                    for(var i=0; i<howManyRightAngles; i++) this.rotateColorsX(discIndex1);
                    break;
                case 1:
                    for(var i=0; i<howManyRightAngles; i++) this.rotateColorsY(discIndex1);
                    break;
                case 2:
                    for(var i=0; i<howManyRightAngles; i++) this.rotateColorsZ(discIndex1);
                    break;
            }
        }
    }
	
    //causes the disc rotation to "stick" to multiples of 90°
    clamp(angle){
		angle = rad2deg(angle)
		
        var angleMod90 = angle % 90;
        if(angleMod90 < 0) angleMod90 += 90;
        
		var r;
        if(angleMod90 < this.stickyInterval){
            r = this.isDiscSticky ? angle - angleMod90 : angle;
        }else if(angleMod90 > 90 - this.stickyInterval){
            r = this.isDiscSticky ? angle + 90 - angleMod90 : angle;
        }else{
            this.isDiscSticky = true;
            r = angle;
        }
		
		return deg2rad(r);
    }
    
    //returns the axis along which given vector points after applying scene rotates to it
    getAxisAfterSceneRotates(p){
        p = this.rubiksCubeScene.cubeRotateY.transformPoint(p);
        p = this.rubiksCubeScene.cubeRotateX.transformPoint(p);
        
        var longest = Math.abs(p.x);
        var axis = new Axis(0, p.x >= 0);
        if(Math.abs(p.y) > longest){
            axis = new Axis(1, p.y >= 0);
            longest = Math.abs(p.y);
        }
        if(Math.abs(p.z) > longest){
            axis = new Axis(2, p.z >= 0);
        }
        
        return axis;
    }
    
    identifyCubeOrientation(){
        this.frontVectorDirection = this.getAxisAfterSceneRotates(new THREE.Vector3(0, 0, 1));
        this.topVectorDirection = this.getAxisAfterSceneRotates(new THREE.Vector3(0, 1, 0));
    }
    
    makeFrontSideDraggable(){
        this.identifyCubeOrientation();
        
		for(var i=0; i<this.smallCubes.length; i++){
            this.smallCubes[i].isDraggable = false;
        }
        
        if(this.topVectorDirection.axisIndex == 1){
            
            switch(this.frontVectorDirection.axisIndex){
                case 0:
                    for(var i=0; i<3; i++){
                        for(var j=0; j<3; j++){
                            this.smallCubes[this.frontVectorDirection.isPositiveAxis ? 0 : 2][i][j].isDraggable = true;
                        }
                    }
                    break;

                case 2:
                    for(var i=0; i<3; i++){
                        for(var j=0; j<3; j++){
                            this.smallCubes[i][j][this.frontVectorDirection.isPositiveAxis ? 2 : 0].isDraggable = true;
                        }
                    }
                    break;
            }
            
        }else if(this.topVectorDirection.axisIndex == 2){
            for(var i=0; i<3; i++){
                for(var j=0; j<3; j++){
                    this.smallCubes[i][this.topVectorDirection.isPositiveAxis ? 2 : 0][j].isDraggable = true;
                }
            }
        }
        
    }
    
    circleDragCube(deltaAngle){
        var b = false;
        if(this.topVectorDirection.axisIndex == 1){
            b = ((this.frontVectorDirection.axisIndex == 2) == this.frontVectorDirection.isPositiveAxis);
        }else if(this.topVectorDirection.axisIndex == 2){
            b = this.topVectorDirection.isPositiveAxis;
        }
        
        if(this.mouseDragDirection == -1){
            this.mouseDragDirection = 2;
            this.discRotateDirection = this.getDiscRotateDirection();

        }else if(this.discIndex == -1){
            this.discIndex = b ? 2 : 0;

        }else if(this.angle == null){
            this.angle = this.discRotate[this.discRotateDirection.axisIndex][this.discIndex].angle;

        }else if(this.unfinishedDiscRotateAxisIndex == -1 || (this.discRotateDirection.axisIndex == this.unfinishedDiscRotateAxisIndex && this.discIndex == this.unfinishedDiscIndex)){
            this.unfinishedDiscRotateAxisIndex = -1;
            this.unfinishedDiscIndex = -1;

            if(deltaAngle == null){
                this.clampedAngle = this.clamp(this.clampedAngle);
            }else{
                this.clampedAngle = this.clamp(this.angle + (b ? -deltaAngle : deltaAngle));
            }
            
            this.discRotate[this.discRotateDirection.axisIndex][this.discIndex].angle = this.clampedAngle;
        }
    }
 
    rotateFrontDisc(deltaAngle){
        //finish front disc rotation
        if(deltaAngle == null){
            
            //if disc rotation is almost finished, finish it
            this.isDiscSticky = true;
            this.circleDragCube(null);
            
            //if disc rotation is finished, set disc rotation parameters to inactive values
            if(Math.round(rad2deg(this.clampedAngle) % 90) == 0){
                this.unfinishedDiscRotateAxisIndex = -1;
                this.unfinishedDiscIndex = -1;

                if(this.discRotateDirection != null && this.discIndex > -1) this.rotateColors(this.discRotateDirection, this.discIndex, this.clampedAngle);
                this.resetSmallCubes();

            //if disc rotation is unfinished, save disc rotation parameters for later
            }else if(this.unfinishedDiscRotateAxisIndex == -1 && this.discRotateDirection != null){
                this.unfinishedDiscRotateAxisIndex = this.discRotateDirection.axisIndex;
                this.unfinishedDiscIndex = this.discIndex;
            }
                            
            this.discRotateDirection = null;
            this.mouseDragDirection = -1;
            this.discIndex = -1;
            this.angle = null;
            this.isDiscSticky = false;
            
        //run front disc rotation
        }else{
            this.circleDragCube(deltaAngle);
        }
    }
 
    reset1(){
        this.resetSmallCubes();
        this.unfinishedDiscRotateAxisIndex = -1;
        this.unfinishedDiscIndex = -1;
    }
	
	setInitialSurfaceColors(){
        //initial surface colors
        for(var i=0; i<3; i++){
            for(var j=0; j<3; j++){
                this.smallCubes[i][j][0].setColor(sides.front, colorsAsRgb.blue, true);
                this.smallCubes[i][j][2].setColor(sides.back, colorsAsRgb.green, true);
                this.smallCubes[0][i][j].setColor(sides.left, colorsAsRgb.red, true);
                this.smallCubes[2][i][j].setColor(sides.right, colorsAsRgb.orange, true);
                this.smallCubes[i][0][j].setColor(sides.top, colorsAsRgb.white, true);
                this.smallCubes[i][2][j].setColor(sides.bottom, colorsAsRgb.yellow, true);
            }
        }
    }
	
	onMouseMove(mouseX, mouseY, smallCube){
		if(this.isDragEnabled && smallCube.isDraggable){
			this.dragCube(smallCube, mouseX, mouseY);
		}
	}
	
	onMouseOver(mouseX, mouseY, smallCube){
		this.isMouseOver = true;
	}
	
	onMouseDown(mouseX, mouseY, smallCube){
		this.isDragEnabled = true;
		this.dragX = mouseX;
		this.dragY = mouseY;
	}
	
	onMouseOut(mouseX, mouseY){
		this.isMouseOver = false;
	}
	
	onMouseUp(mouseX, mouseY, smallCube){
		//if disc rotation is almost finished, finish it
		if(this.isDragEnabled && smallCube.isDraggable){
			this.isDiscSticky = true;
			this.dragCube(smallCube, mouseX, mouseY);
		}
		
		//if disc rotation is finished, set disc rotation parameters to inactive values
		if(Math.round(rad2deg(this.clampedAngle) % 90) == 0){
			this.unfinishedDiscRotateAxisIndex = -1;
			this.unfinishedDiscIndex = -1;
			
			if(this.discRotateDirection != null) this.rotateColors(this.discRotateDirection, this.discIndex, this.clampedAngle);
			this.resetSmallCubes();
			
		//if disc rotation is unfinished, save disc rotation parameters for later
		}else if(this.unfinishedDiscRotateAxisIndex == -1 && this.discRotateDirection != null){
			this.unfinishedDiscRotateAxisIndex = this.discRotateDirection.axisIndex;
			this.unfinishedDiscIndex = this.discIndex;
		}
		
		this.isDragEnabled = false;
		this.discRotateDirection = null;
		this.mouseDragDirection = -1;
		this.discIndex = -1;
		this.angle = null;
		this.isDiscSticky = false;
	}

}
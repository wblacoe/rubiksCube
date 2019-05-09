class Circle{
    
    //[radius] is the inner radius, [radius + width] is the outer radius
    constructor(radius, width, scene, largeCube){
        this.scene = scene;
        this.largeCube = largeCube;
        
        this.isMouseOver = false;
        this.resolution = 100;
        
        this.isDragEnabled = false;
        this.angleOnMousePressed = null;
        this.angle = null;
        
		this.polygons = multiArray([this.resolution]);
		this.group = new THREE.Group();
		
        for(var i=0; i<this.resolution; i++){
			var vertices = []
			vertices.push([
				radius * Math.cos(2 * Math.PI * i / this.resolution),
				radius * Math.sin(2 * Math.PI * i / this.resolution)
			]);
			vertices.push([
				(radius + width) * Math.cos(2 * Math.PI * i / this.resolution),
				(radius + width) * Math.sin(2 * Math.PI * i / this.resolution)
			]);
			vertices.push([
				(radius + width) * Math.cos(2 * Math.PI * (i + 1) / this.resolution),
				(radius + width) * Math.sin(2 * Math.PI * (i + 1) / this.resolution)
			]);
			vertices.push([
				radius * Math.cos(2 * Math.PI * (i + 1) / this.resolution),
				radius * Math.sin(2 * Math.PI * (i + 1) / this.resolution)
			]);
			
			var polygon = new Polygon(vertices, this);
			
            this.polygons[i] = polygon;
			polygon.addToGroup(this.group);
        }
		
		this.resetPolygons()
	}
	
	addToScene(scene){
		scene.add(this.group);
	}
		
	onMouseOver(mouseX, mouseY){
		this.isMouseOver = true;
		this.markPolygons(mouseX, mouseY);
	}
	
	onMouseMove(mouseX, mouseY){
		if(this.isDragEnabled){
			this.markPolygons(mouseX, mouseY);
			this.largeCube.rotateFrontDisc((this.angleOnMousePressed - this.angle));
		}else{
			if(this.isMouseOver) this.markPolygons(mouseX, mouseY);
		}
	}
	
	onMouseOut(mouseX, mouseY){
		this.isMouseOver = false;
		this.resetPolygons();
	}
	
	onMouseDown(mouseX, mouseY){
		this.isDragEnabled = true;
	}
	
	onMouseUp(mouseX, mouseY){
		this.isDragEnabled = false;
		this.angle = null;
		this.angleOnMousePressed = null;
		this.largeCube.rotateFrontDisc(null);
	}
    
    resetPolygons(){
        for(var i=0; i<this.polygons.length; i++){
            this.polygons[i].setColor(colorsAsRgb.cyan);
        }
    }
    
    markPolygons(mouseX, mouseY){
        this.resetPolygons();
        
        var mouseRadius = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

        this.angle = Math.acos(mouseX / mouseRadius);
        if(isNaN(this.angle)) this.angle = 0.0;
        if(mouseY < 0) this.angle = -this.angle;
        if(this.isDragEnabled && this.angleOnMousePressed == null) this.angleOnMousePressed = this.angle;
        
        var polygonIndex = Math.floor(Math.round(this.resolution * this.angle / (2 * Math.PI)));
        for(var i=-this.resolution/50; i<=this.resolution/50; i++){
            var pi = (polygonIndex + i) % this.resolution;
            if(pi < 0) pi += this.resolution;
            this.polygons[pi].setColor(colorsAsRgb.blue);
        }
    }
    
}

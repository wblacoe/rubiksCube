class Surface{

	constructor(width, height, smallCube, transforms){
		this.smallCube = smallCube;
		
		this.planes = [];
		
		this.planes.push(
			new Plane(
				{x: width*0.05, y: height*0.05},
				{x: width*0.95, y: height*0.95},
				colorsAsHex.orange,
				this,
				copyArray(transforms)
			)
		);
		
		this.planes.push(
			new Plane(
				{x: 0, y: 0},
				{x: width*0.05, y: height},
				colorsAsHex.black,
				this,
				copyArray(transforms)
			)
		);
		
		this.planes.push(
			new Plane(
				{x: width*0.95, y: 0},
				{x: width, y: height},
				colorsAsHex.black,
				this,
				copyArray(transforms)
			)
		);
		
		this.planes.push(
			new Plane(
				{x: 0, y: 0},
				{x: width, y: height*0.05},
				colorsAsHex.black,
				this,
				copyArray(transforms)
			)
		);
		
		this.planes.push(
			new Plane(
				{x: 0, y: height*0.95},
				{x: width, y: height},
				colorsAsHex.black,
				this,
				copyArray(transforms)
			)
		);
		
		this.group = new THREE.Group();
		for(var i=0; i<this.planes.length; i++){
			this.planes[i].addToGroup(this.group);
		}
	}
	
	update(){
		for(var i=0; i<this.planes.length; i++){
			this.planes[i].update();
		}
	}
	
	addToGroup(group){
		group.add(this.group);
	}
	
	setColor(color){
		this.planes[0].setColor(color);
	}
	
}
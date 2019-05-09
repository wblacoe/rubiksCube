class Plane{

	//assumes that point1.x < point2.x and point1.y < point2.y
	constructor(point1, point2, colorAsHex, surface, transforms){
		this.surface = surface;
		this.transforms = transforms;
		
		var width = point2.x - point1.x;
		var height = point2.y - point1.y;
		this.transforms.push(new Translate(point1.x, point1.y, 0));
		this.transforms.push(new Translate(width/2, height/2, 0)); //this counter-acts PlaneGeometry placing the plane such that the origin is in its center
		
		var geometry = new THREE.PlaneGeometry(width, height);
		var material = new THREE.MeshBasicMaterial({color: colorAsHex, side: THREE.DoubleSide});
		this.mesh = new THREE.Mesh(geometry, material);
	}
	
	//execute all transformations in order: scene, large cube, small cube, surface, plane
	update(){
		this.mesh.position.x = 0;
		this.mesh.position.y = 0;
		this.mesh.position.z = 0;
		this.mesh.rotation.x = 0;
		this.mesh.rotation.y = 0;
		this.mesh.rotation.z = 0;
	
		for(var i=0; i<this.transforms.length; i++){
			this.transforms[i].transformMesh(this.mesh);
		}
	}
	
	addToGroup(group){
		group.add(this.mesh);
	}
	
	setColor(color){
		//this.color = color;
		if(color != undefined){
			this.mesh.material.color.r = color.r;
			this.mesh.material.color.g = color.g;
			this.mesh.material.color.b = color.b;
		}
	}
	
}
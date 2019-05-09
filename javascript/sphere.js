class Sphere{

	constructor(){
		var geometry = new THREE.SphereGeometry(15, 50, 50);
		var material = new THREE.MeshBasicMaterial({color: colorsAsHex.grey, side: THREE.DoubleSide});
		this.mesh = new THREE.Mesh(geometry, material);
	}
	
	addToScene(scene){
		scene.add(this.mesh);
	}
	
	translate(translateX, translateY, translateZ){
		this.mesh.position.x += translateX;
		this.mesh.position.y += translateY;
		this.mesh.position.z += translateZ;
	}
	
	getPosition(){
		return this.mesh.position;
	}
	
}
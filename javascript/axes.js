class Axes{

	constructor(){
		var length = 100;
		
		this.group = new THREE.Group();
		
		var geometry = new THREE.BoxGeometry(length, length/10, length/10);
		var material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
		var axis = new THREE.Mesh(geometry, material);
		axis.translateX(length/2);
		this.group.add(axis);
		
		geometry = new THREE.BoxGeometry(length/10, length, length/10);
		material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
		axis = new THREE.Mesh(geometry, material);
		axis.translateY(length/2);
		this.group.add(axis);
		
		geometry = new THREE.BoxGeometry(length/10, length/10, length);
		material = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
		axis = new THREE.Mesh(geometry, material);
		axis.translateZ(length/2);
		this.group.add(axis);
	}
	
	addToScene(scene){
		scene.add(this.group);
	}
	
}
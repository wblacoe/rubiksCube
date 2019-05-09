class Translate extends Transform{
	
	constructor(translateX, translateY, translateZ){
		super();
		this.translateX = translateX;
		this.translateY = translateY;
		this.translateZ = translateZ;
	}
	
	transformPoint(p){
		return new THREE.Vector3(
			p.x + translateX,
			p.y + translateY,
			p.z + translateZ
		);
	}
	
	transformMesh(m){
		m.translateX(this.translateX);
		m.translateY(this.translateY);
		m.translateZ(this.translateZ);
	}

}
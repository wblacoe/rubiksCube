class Rotate extends Transform{

	constructor(angle, axisIndex){
		super();
		this.angle = angle;
		this.axisIndex = axisIndex;
	}
	
	transformPoint(p){
		switch(this.axisIndex){
			
			case axis.x:
				return new THREE.Vector3(
					p.x,
					Math.cos(this.angle) * p.y - Math.sin(this.angle) * p.z,
					Math.sin(this.angle) * p.y + Math.cos(this.angle) * p.z
				);
				
			case axis.y:
				return new THREE.Vector3(
					Math.cos(this.angle) * p.x + Math.sin(this.angle) * p.z,
					p.y,
					-Math.sin(this.angle) * p.x + Math.cos(this.angle) * p.z
				);
				
			case axis.z:
				return new THREE.Vector3(
					Math.cos(this.angle) * p.x - Math.sin(this.angle) * p.y,
					Math.sin(this.angle) * p.x + Math.cos(this.angle) * p.y,
					p.z
				);
				
		};
	}
	
	transformMesh(m){
		switch(this.axisIndex){
			case axis.x:
				m.rotateX(this.angle);
				break;
			case axis.y:
				m.rotateY(this.angle);
				break;
			case axis.z:
				m.rotateZ(this.angle);
				break;
		};
	}

}
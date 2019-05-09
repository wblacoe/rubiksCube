class Polygon{
	
	constructor(vertices, circle){
		this.circle = circle;
		
		this.shape = new THREE.Shape();
		
		//Start at the last vertex.                
		this.shape.moveTo.apply(this.shape, vertices[vertices.length - 1]);
		//Connect each vertex to the next in sequential order.
		for(var i=0; i<vertices.length; i++){
			this.shape.lineTo.apply(this.shape, vertices[i]);
		}
		var geometry = new THREE.ShapeGeometry(this.shape);
		
		var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
		this.mesh = new THREE.Mesh(geometry, material);
	}
	
	addToGroup(group){
		group.add(this.mesh);
	}
	
	
	setColor(colorAsRgb){
		if(colorAsRgb != undefined){
			this.mesh.material.color.r = colorAsRgb.r;
			this.mesh.material.color.g = colorAsRgb.g;
			this.mesh.material.color.b = colorAsRgb.b;
		}
	}

}
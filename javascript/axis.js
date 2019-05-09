class Axis{

	constructor(axisIndex, isPositiveAxis){
		this.axisIndex = axisIndex;
		this.positivityFactor = (isPositiveAxis ? 1 : -1);
		this.isPositiveAxis = isPositiveAxis;
	}
	
	toInt(){
		return this.axisIndex + (this.isPositiveAxis ? 0 : 3);
	}
	
	mirror(){
		return new Axis(this.axisIndex, !this.isPositiveAxis);
	}
	
	toString(){
		var axisNames = ["X", "Y", "Z"];
		return axisNames[this.axisIndex] + (this.isPositiveAxis ? "+" : "-");
	}

}
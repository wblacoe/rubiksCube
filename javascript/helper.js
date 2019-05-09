function removeFirst(array){
	var r = [];
	
	for(var i=1; i<array.length; i++){
		r.push(array[i]);
	}
	
	return r;
}

function multiArray(lengths){
	var r = null;
	
	if(lengths.length > 0){
		r = new Array(lengths[0]);
	}
	
	var lengthsAfterFirst = removeFirst(lengths);
	for(var i=0; i<lengths[0]; i++){
		r[i] = multiArray(lengthsAfterFirst);
	}
	
	return r;
}

function copyArray(a){
	//return array.slice(0, array.length);
	//return a.slice();
	return [...a];
}

function deg2rad(phi){
	return phi * Math.PI / 180;
}

function rad2deg(phi){
	return phi * 180 / Math.PI;
}
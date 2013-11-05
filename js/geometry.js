var Geometry = function(){

	this.getInscribedPoints = function(n, x, y, r){
		var rv = new Array();
		var aincr = (2*Math.PI)/n;
		var curangle = aincr;
		for(var i = 0; i < n; i++){
			var px = x+r*Math.cos(curangle);
			var py = y+r*Math.sin(curangle);
			rv[i] = [px,py];
			curangle += aincr;
		}
		return rv;
	}

}

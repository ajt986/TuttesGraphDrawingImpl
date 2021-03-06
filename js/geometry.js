var Geometry = function(){

	var precision = 0.000000001;

	this.getInscribedPoints = function(n, x, y, r){
		var rv = new Array();
		var aincr = (2*Math.PI)/n;
		var curangle = Math.PI/4;
		
		for(var i = 0; i < n; i++){
			var px = x+r*Math.cos(curangle);
			var py = y+r*Math.sin(curangle);
			rv[i] = [px,py];
			curangle += aincr;
		}
		return rv;
	};

	this.ccw = function(a,b,c){
		var la = new LinearAlgebra();
		var m = [[a[0], b[0], c[0]],
							[a[1], b[1], c[1]],
							[1,1,1]]
		var d = la.determinant3(m);

		if(d > precision){
			return 1;
		}
		else if(d < -precision){
			return -1;
		}
		else {
			return 0;
		}
	};

	this.intersect = function(a,b, c,d){
		return ((this.ccw(c,a,d) == -this.ccw(c,b,d)) && (this.ccw(a,b,d) == -this.ccw(a,b,c)));
	};

	this.inConvexPolygon = function(polygon, p){
		var test = this.ccw(polygon[0], polygon[1], polygon[2]);

		var l = polygon.length;
		for(var i = 0; i < l; i++){
			var p1 = polygon[i];
			var p2 = polygon[((i+1)%l)];
			if(this.ccw(p1,p2,p) != test){
				return false;
			}
		};
		return true;
	};

}

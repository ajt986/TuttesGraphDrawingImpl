var Edge = function(v1, v2){

	var v1 = v1;
	var v2 = v2;

	var color = "#000000";
	var width = 1;

	this.getAdjacentVertex = function(v){
		if(v == v1){
			return v2;
		}
		
		if(v == v2){
			return v1;
		}

		return null;
	}

	this.getV1 = function(){
		return v1;
	}

	this.getV2 = function(){
		return v2;
	}
	
	this.setColor = function(newcolor){
		color = newcolor;
	}

	this.setWidth = function(newwidth){
		width = newwidth;
	}

	this.draw = function(ctx){
		var p1 = v1.getPoint();
		var p2 = v2.getPoint();

		ctx.lineWidth = width;

		ctx.beginPath();
		
		ctx.moveTo(p1[0],p1[1]);
		ctx.lineTo(p2[0],p2[1]);

		ctx.stroke();
	}

}

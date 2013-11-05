var Vertex = function(apoint, alabel){

	var label = alabel || "";
	var point = apoint;
	var fillcolor = "#ffffff";
	var bordercolor = "#000000";
	var radius = 10;

	var visited = false;
	
	var edges = new Array();

	this.setFillColor = function(newcolor){
		fillcolor = newcolor;
	};

	this.setBorderColor = function(newcolor){
		bordercolor = newcolor;
	};

	this.setRadius = function(newradius){
		radius = newradius;
	};

	this.addEdge = function(edge){
		edges.push(edge);
	};

	this.getDegree = function(){
		return edges.length;
	};

	this.getEdges = function(){
		return edges;
	};

	this.getPoint = function(){
		return point;
	};

	this.setVisited = function(b){
		visited = b;
	};


	this.isVisited = function(){
		return visited;
	};
	
	this.draw = function(ctx){
		ctx.strokeStyle = bordercolor;
		ctx.fillStyle = fillcolor;

		ctx.beginPath();
		ctx.arc(point[0],point[1],radius,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = bordercolor;

		var mw = radius*2;

		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillText(label, point[0], point[1], mw-4);
	};

}

var Graph = function(src){

	var vertices = new Array();
	var edges = new Array();

	this.loadGraph = function(src){
		if(!src){
			return;
		}
		var sve = src.split("#");
		if(sve.length != 2){
			return;
		}

		vertices = new Array();
		edges = new Array();

		var svertices = sve[0].split("\n");
		var sedges = sve[1].split("\n");

		for(var i = 0; i < svertices.length; i++){
			var coords = svertices[i].split(",");
			var ncoords = new Array();
			for(var j = 0; j < coords.length; j++){
				ncoords[j] = parseInt(coords[j]);
			}
			vertices.push(new Vertex(ncoords, "v"+i));
		}

		for(var i = 0 ; i < sedges.length; i++){
			var connections = sedges[i].split(",");
			if(connections.length > 1){
				var edge = new Edge(vertices[parseInt(connections[0])],vertices[parseInt(connections[1])]);
				edges.push(edge);
			}
		}
	}

	this.fitVertices = function(w, h){
		//TODO: Fit the vertices to the size of the canvas
	}

	this.getVertices = function(){
		return vertices;
	}

	this.getEdges = function(){
		return edges;
	}

	this.draw = function(ctx){
		for(var i = 0; i < edges.length; i++){
			edges[i].draw(ctx);
		}
		for(var i = 0; i < vertices.length; i++){
			vertices[i].draw(ctx);
		}
	}

}

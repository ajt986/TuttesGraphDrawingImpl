var Graph = function(src){

	var vertices = new Array();
	var edges = new Array();
	var agencymatrix;

	//Reads the text with the following format:
	//n
	//v1, v2
	//v1, v2
	//...
	//Where n is the number of vertices, and v1 and v2 are
	//indices on the vertices saying that there is an undirected
	//edge from v1 to v2.
	var loadWithEdgeList = function(src, w, h){
		if(!src){
			return;
		}
		var lines = src.split("\n");
	
		if(lines .length <= 0){
			return;
		}

		var n = parseInt(lines[0].trim());
		vertices = new Array(n);
		agencymatrix = new Array(n);
		pointermatrix = new Array(n);

		//create the vertices and initialize the agency matrix
		for(var i = 0; i < n; i++){
			//create a vertex and place it randomly on the graph canvas
			var randx = Math.random()*w;
			var randy = Math.random()*h;
			vertices[i] = new Vertex([randx,randy], "V"+i);

			//initialize the agency matrix
			agencymatrix[i] = new Array(n);
			for(var j = 0; j < n; j++){
				agencymatrix[i][j] = 0;
			}
		};

		//add the edges
		edges = new Array();
		for(var i = 1; i < lines.length; i++){
			var s = lines[i].split(",");

			var v1i = parseInt(s[0].trim());
			var v2i = parseInt(s[1].trim());
			
			var v1 = vertices[v1i];
			var v2 = vertices[v2i];

			var newedge = new Edge(v1, v2);
			edges.push(newedge);
			v1.addEdge(newedge);
			v2.addEdge(newedge);

			agencymatrix[v1i][v2i] = 1;
			agencymatrix[v2i][v1i] = 1;
			
		};

	};

	this.loadGraph = function(src, w, h){
		loadWithEdgeList(src, w, h);
	};

	this.resetVisited = function(){
		for(var i = 0; i < vertices.length; i++){
			vertices[i].setVisited(false);
		}
	};

	var cycleRecursion = function(cycles, path){
		var vertex = path[path.length -1];
		var previous = path[path.length - 2];
		if(vertex.isVisited()){
			//find the cycle and push it
			var l = path.length;
			var newcycle = new Array();
			newcycle.push(vertex);
			for(var i = l-2; i >= 0; i++){
				if(path[i] == vertex){
					break;
				}
				newcycle.push(path[i]);
			}
			cycles.push(newcycle);
		}
		else {
			//continue search
			vertex.setVisited(true);
			var edges = vertex.getEdges();
			for(var i = 0; i < edges.length; i++){
				var dest = edges[i].getAdjacentVertex(vertex);
				if(dest != previous){
					path.push(dest);
					cycleRecursion(cycles, path);
					path.pop();
				}
			}
		}
	};

	//Assumes that the graph is connected
	this.getLargestCycle = function(){
		this.resetVisited();
		
		var cycles = new Array();
		var path = new Array();

		v0 = vertices[0];
		v0.setVisited(true);
		path.push(v0);
		
		edges = v0.getEdges();
		for(var i = 0; i < edges.length; i++){
			var dest = edges[i].getAdjacentVertex(v0);
			path.push(dest);
			cycleRecursion(cycles, path);
			path.pop();
		}

		var lci = 0;
		var lcs = cycles[0].length;

		for(var i = 1; i < cycles.length; i++){
			var nl = cycles[i].length;
			if(nl > lcs){
				lcs = nl;
				lci = i;
			}
		}

		lc = cycles[lci];
		var rv = new Array(lc.length);
		for(var i = 0; i < lc.length; i++){
			rv[i] = -1;
			for(var j = 0; j < vertices.length; j++){
				if(lc[i] == vertices[j]){
					rv[i] = j;
					break;
				}
			}
		}

		return rv;
	};

	this.getAgencyMatrix = function(){
		return agencymatrix;
	};

	this.getDegreeMatrix = function(){
		var rv = new Array();
		for(var i = 0; i < vertices.length; i++){
			rv[i] = new Array();
			for(var j = 0; j < vertices.length; j++){
				rv[i][j] = 0;
			}
			rv[i][i] = vertices[i].getDegree();
		}
		return rv;
	};

	this.getLaplacianMatrix = function(){
		var d = this.getDegreeMatrix();
		var a = this.getAgencyMatrix();
		var la = new LinearAlgebra();
		return la.matrixSubtraction(d,a);
	};

	this.getVertices = function(){
		return vertices;
	};


	this.getEdges = function(){
		return edges;
	};

	this.draw = function(ctx){
		for(var i = 0; i < edges.length; i++){
			edges[i].draw(ctx);
		}
		for(var i = 0; i < vertices.length; i++){
			vertices[i].draw(ctx);
		}
	};

}

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

	var loadWithMatrix = function(src, w, h){
			var cm = new ConvertMatrix();
			loadWithEdgeList(cm.convertmatrix(src), w, h);
	}

	this.loadGraph = function(src, w, h){
		var check = src.split("\n")[0].split(",");
		if(check.length > 1){
			loadWithMatrix(src, w, h);
		}
		else{
			loadWithEdgeList(src, w, h);
		}
	};

	this.resetVisited = function(){
		for(var i = 0; i < vertices.length; i++){
			vertices[i].setVisited(false);
		}
	};

	var cycleRecursion = function(cycles, path){
		var vertex = path[path.length - 1];
		var previous = path[path.length - 2];
		if(vertex.isVisited()){
			//find the cycle and push it
			var l = path.length;
			var newcycle = new Array();
			newcycle.push(vertex);
			for(var i = l-2; i >= 0; i--){
				if(path[i] == vertex){
					cycles.push(newcycle);
					break;
				}
				newcycle.push(path[i]);
			}
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
			vertex.setVisited(false);
		}
	};

	

	//Assumes that the graph is connected
	this.getShortestCycle = function(){
		this.resetVisited();
		
		var cycles = new Array();
		var path = new Array();

		v0 = vertices[0];
		v0.setVisited(true);
		path.push(v0);
		
		var edges = v0.getEdges();
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
			if(nl < lcs){
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

	var getDefaultOrder = function(){
		var order = new Array(l.length);	
		for(var i = 0; i < l.length; i++){
				order[i] = i;
		}
		return order;
	};

	this.getAgencyMatrix = function(order){
		order = order || getDefaultOrder();
		var l = order.length;
		var rv = new Array(l);
		for(var i = 0; i < l; i++){
			rv[i] = new Array(l);
			for(var j = 0; j < l; j++){
				rv[i][j] = agencymatrix[order[i]][order[j]];
			}
		};
		
		return rv;
	};

	this.getDegreeMatrix = function(order){
		order = order || getDefaultOrder();
		var rv = new Array();
		for(var i = 0; i < vertices.length; i++){
			rv[i] = new Array();
			for(var j = 0; j < vertices.length; j++){
				rv[i][j] = 0;
			}
			rv[i][i] = vertices[order[i]].getDegree();
		}
		return rv;
	};

	this.getLaplacianMatrix = function(order){
		var d = this.getDegreeMatrix(order);
		var a = this.getAgencyMatrix(order);
		var la = new LinearAlgebra();
		return la.matrixSubtraction(d,a);
	};

	var getClosestVertices = function(x, y){
		var distances = new Array();

		var calcdistance = function(x0, y0, x1, y1){
			return Math.pow((x1-x0), 2)+Math.pow((y1-y0),2);
		}

		for(var i = 0; i < vertices.length; i++){
			var vp = vertices[i].getPoint();
			distances[i] = [calcdistance(vp[0], vp[1], x, y), i];
		};

		distances.sort(function(a,b){return a[0]-b[0]});

		return distances;
	};

	var getOrderedFace = function(vlist){
		var rv = new Array();
		rv.push(vlist.pop());

		while(vlist.length > 0){
			var last = vertices[rv[rv.length-1]];
			var el = last.getEdges();
			var endloop = true;

			var l = vlist.length;
			var visited = new Array();
			for(var i = 0; i < l; i++){
				var cur = vlist.pop();
				var t = false;
				for(var j = 0; j < el.length; j++){
					var ev = el[j].getAdjacentVertex(last);
					if(ev == vertices[cur]){
						rv.push(cur);
						endloop = false;
						t = true;
					}
				}
				if(t){
					for(var k = i+1; k < l; k++){
						visited.push(vlist.pop());
					}
					break;
				}
				else{
					visited.push(cur);
				}
			}
			vlist = visited;
			if(endloop){
				return [];
			}
		}
		return rv;
	};

	this.getFace = function(x, y){
		var unordered = new Array();

		var geom = new Geometry();

		var t = geom.intersect([0,2], [2,2], [0,0], [1,1]);

		var p1 = [x,y];

		for(var i = 0; i < vertices.length; i++){
			var p2 = vertices[i].getPoint();
			var add = true;
			for(var j = 0; j < edges.length; j++){
				var v1 = edges[j].getV1();
				var v2 = edges[j].getV2();

				if(v1 == vertices[i] || v2 == vertices[i]){
					continue;
				}

				var p3 = v1.getPoint();
				var p4 = v2.getPoint();

				if(geom.intersect(p1,p2, p3,p4)){
					add = false;
					break;
				}
			}
			if(add){
				unordered.push(i);
			}
		}

		return getOrderedFace(unordered);
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

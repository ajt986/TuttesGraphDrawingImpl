var TuttesAlgorithm = function(){

	var setInitialPoints = function(vertices, cycle, w, h){
		var r = (Math.min(w,h)-50)/2;
		var cx = w/2;
		var cy = h/2;

		var geom = new Geometry();
		
		var coords = geom.getInscribedPoints(cycle.length, cx, cy, r);
		
		for(var i = 0; i < coords.length; i++){
			vertices[cycle[i]].setPoint(coords[i]);
		};
	}

	var reorderLaplacian = function(l, cycle){
		var la = new LinearAlgebra();		

		//TODO return a list of the new ordering
		for(i = 0; i < cycle.length; i++){
			la.swapRows(l, i, cycle[i]);
		};
	};

	this.drawGraph = function(ctx, g, w, h){
		var vertices = g.getVertices();
		var cycle = g.getShortestCycle();
		var edges = g.getEdges();
		setInitialPoints(vertices, cycle, w, h);

		var l = g.getLaplacianMatrix();
		reorderLaplacian(l, cycle);

		var la = new LinearAlgebra();
		var cl = cycles.length;
		var nr = l.length;
		var Br = nr-cl;
		
		var B = la.getSubsection(l,  cl, Br, 0, cl);
		var L2 = la.getSubsection(l, cl, Br, cl, Br);

		var L2i = la.getInverseMatrix(L2);

		var L2iB = la.MatrixMultiplication(L2i, B);

		//TODO initialize the x and y vectors and get the ordering of the vertices
		var v1x;
		var v1y;

		var v2x = la.MatrixMultiplication(L2iB, v1x);
		var v2y = la.MatrixMultiplication(L2iB, v1y);;

		g.draw(ctx);
	};

}

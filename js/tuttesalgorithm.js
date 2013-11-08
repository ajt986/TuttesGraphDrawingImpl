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

	var getOrder = function(cycle, l){
		var la = new LinearAlgebra();	
		var b = new Array(l);
		var cl = cycle.length;
		for(var i = 0; i < cl; i++){
				b[i] = false;
		}

		var order = new Array(l);	
		for(var i = 0; i < cl; i++){
				order[i] = cycle[i];
				b[cycle[i]] = true;
		}

		var rest = new Array();
		for(var i = 0; i < l; i++){
			if(!b[i]){
				rest.push(i);
			}
		}

		for(var i = 0; i < rest.length; i++){
			order[i+cl] = rest[i];
		};
		

		return order;
	};

	this.drawGraph = function(ctx, g, w, h){
		var vertices = g.getVertices();
		var cycle = g.getShortestCycle();

		setInitialPoints(vertices, cycle, w, h);

		var order = getOrder(cycle, vertices.length);
		var l = g.getLaplacianMatrix(order);

		var la = new LinearAlgebra();
		var cl = cycle.length;
		var nr = l.length;
		var Br = nr-cl;
		
		var B = la.getSubsection(l,  cl, Br, 0, cl);
		var L2 = la.getSubsection(l, cl, Br, cl, Br);

		var L2i = la.getInverseMatrix(L2);

		var L2iB = la.matrixMultiplication(la.matrixScalarMultiplication(L2i,-1), B);

		var v1x = new Array(cl);
		var v1y = new Array(cl);
		for(var i = 0; i < cl; i++){
			var p = vertices[cycle[i]].getPoint();
			v1x[i] = [p[0]];
			v1y[i] = [p[1]];
		};


		var v2x = la.matrixMultiplication(L2iB, v1x);
		var v2y = la.matrixMultiplication(L2iB, v1y);

		for(var i = 0; i < v2x.length; i++){
			var vi = order[cl+i];
			var v = vertices[vi];
			v.setPoint([v2x[i], v2y[i]]);
		}
		
		ctx.clearRect(0,0,w,h);
		g.draw(ctx);
	};

}

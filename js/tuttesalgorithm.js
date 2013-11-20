var TuttesAlgorithm = function(){

	var getInitialPoints = function(vertices, cycle, w, h){
		var r = (Math.min(w,h)-50)/2;
		var cx = w/2;
		var cy = h/2;

		var geom = new Geometry();
		
		return geom.getInscribedPoints(cycle.length, cx, cy, r);	
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

	this.getPoints = function(ctx, g, w, h, cycle){
		var vertices = g.getVertices();
		cycle = cycle || g.getShortestCycle();

		var initpoints = getInitialPoints(vertices, cycle, w, h);

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
			var p = initpoints[i]
			v1x[i] = [p[0]];
			v1y[i] = [p[1]];
		};


		var v2x = la.matrixMultiplication(L2iB, v1x);
		var v2y = la.matrixMultiplication(L2iB, v1y);

		for(var i = 0; i < v2x.length; i++){
			var vi = order[cl+i];
			var v = vertices[vi];
			initpoints.push([v2x[i][0], v2y[i][0]]);
		}

		var rv = new Array(order.length);
		for(var i = 0; i < order.length; i++){
			rv[order[i]] = initpoints[i];
		}
		
		return rv;
	};

}

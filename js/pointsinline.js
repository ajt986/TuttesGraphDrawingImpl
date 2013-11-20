var pointsinline = function(vertex, end_points,iteration){
	//assumption that the points will be fed in [x1,y1] and [x2,y2] formats
	
	var original_points = vertex.getPoint();
	
	var x_0 = original_points[0];
	var y_0 = original_points[1];
	var x_1 = end_points[0];
	var y_1 = end_points[1];
	
	var i = iterstion;
	
	var x_2, y_2;
	
	// we can calculate all the points that lie in between those two points if we know the ratio of the distance
	// let x_2 and y_2 be the x and y component of the new points
	
	// if we want to calculate the new one in 30 steps
	return function(s){
		x_2 = x_0*(1-s/i)+x_1*(s/i);
		y_2 = y_0*(1-s/i)+y_1*(s/i);
		
		var final_point[0]=x_2;
		final_point[1] = y_2;
		vertex.setPoint(final_point);
	}
	
}
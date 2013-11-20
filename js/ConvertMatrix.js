var ConvertMatrix = function(src){
		
		//Here we will just convert the matrix into 
		//same vertex form we already have
		this.convertmatrix = function(src){
			if(!src){
				return "";
			}
			var lines = src.split("\n");

			
			if(lines.length <= 0){
				return "";
			}
			var n = parseInt(lines.length);
			//adj_matrix = new Array(n);

			//now we can create a string similar to vertex input
			var output_string = n;
			//I expect there will be n^2 elements in the matrix
			for(var i = 0; i < n; i++){
				var row = lines[i].split(",");
				for(var j = i; j < row.length; j++){
					if ( parseInt(row[j]) > 0 && i != j){
						output_string += "\n"+i+","+j;
					}
				}	
			}
		return output_string;
	}
}

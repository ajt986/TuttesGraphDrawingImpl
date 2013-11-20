var ConvertMatrix = function(src){
		
		//Here we will just convert the matrix into 
		//same vertex form we already have
		this.convertmatrix = function(src){
			var newgraph = new Graph();
			if(!src){
				return;
			}
			var lines = src.split("\n");
			var nums = lines.replace(/\D/g,'');
			
			if(lines.length <= 0){
				return;
			}
			var n = parseInt(nums[0]);
			//adj_matrix = new Array(n);

			//now we can create a string similar to vertex input
			var row_count_str;
			var output_string = nums[0];
			output_string = output_string.concat("\n");
			//I expect there will be n^2 elements in the matrix
			for(int i = 1; i<=n;i++){
				for(int j = 1; j<=n; j++){
					row_count_str = i+'';
					row_count_str = row_count_str.concat(",");	
					if (parseInt(nums[(i-1)*n+j]) >= 1 && i != row_count){
						output_string = row_count_str.concat(nums[i]);
						output_string = row_count_str.concat("\n");
					}
				}	
			}
		newgraph.loadGraph(output_string,600,500);
}

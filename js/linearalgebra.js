var LinearAlgebra = function(){
	
	//Return a row vector by obtaining the row r from a scaled by scalar c.
	this.getScaledRow = function(a, r, c){
		var l = a[r].length;

		rv = new Array(l);
		for(var i = 0; i < l; i++){
			rv[i] = a[r][i]*c;
		}

		return rv;
	};

	//Swap rows ri and rj.
	this.swapRows = function(a, ri, rj){
		var temp = a[ri];
		a[ri] = a[rj];
		a[rj] = temp;
	};

	//Scale row r by a scalar c.
	this.scaleRow = function(a, r, c){
		a[r] = this.getScaledRow(a, r, c);
	};

	//Add row ri scaled by scalar c to row rj.
	this.addRows = function(a, ri, c, rj){
		var sr = this.getScaledRow(a, ri, c);
		
		var l = a[rj].length;
		for(var i = 0; i < l; i++){
			a[rj][i] = a[rj][i]+sr[i];
		}
	};


	this.guassJordanElimination = function(a, b){
		var nrows = a.length;
		if(nrows <= 0){
			return [];
		}
		var ncols = a[0].length;

		var rs = 0;
		for(var i = 0; i < ncols; i++){
			var ri = rs;
			var rj = -1;

			//Find the first row that's not zero in the current column			
			for(var j = ri; j < nrows; j++){
				if(Math.abs(a[j][i]) >= 0.000001){
					rj = j;
					break;
				}
			}

			//If every value over all rows in this column is 0, skip it
			if(rj == -1){
				continue;
			}

			this.swapRows(a, ri, rj);
			this.swapRows(b, ri, rj);
			rs++;
			
			//Denominator should not be 0 by the previous steps
			var c = 1/a[ri][i];		

			//scale the initial row to set it's first value to 1
			this.scaleRow(a, ri, c);
			this.scaleRow(b, ri, c);

			//Remove the variable from the subsequent rows that don't start with 0
			for(var j = ri+1; j < nrows; j++){
				if(Math.abs(a[j][i]) >= 0.000001){
					var c = -a[j][i];
					this.addRows(a, ri, c, j);
					this.addRows(b, ri, c, j);
				}
			}

			//Set the curent column values of the rows above to 0
			for(var j = ri-1; j > -1; j--){
				if(Math.abs(a[j][i]) >= 0.000001){
					var c = -a[j][i];
					this.addRows(a, ri, c, j);
					this.addRows(b, ri, c, j);
				}
			}

		}
	};


	this.matrixScalarMultiplication = function(matrix, c){
		var rv = new Array();
		for(var i = 0; i < matrix.length; i++){
			rv[i] = new Array();
			for(var j = 0; j < matrix[i].length; j++){
				rv[i][j] = matrix[i][j]*c;
			}
		}
		return rv;
	};

	this.matrixSubtraction = function(a, b){
		return this.matrixAddition(a, this.matrixScalarMultiplication(b, -1));
	};
	
	this.matrixAddition = function(a, b){
		var rv = new Array();
		for(var i = 0; i < a.length; i++){
			rv[i] = new Array();
			for(var j = 0; j < a[i].length; j++){
				rv[i][j] = a[i][j]+b[i][j];
			}
		}
		return rv;
	};

} 

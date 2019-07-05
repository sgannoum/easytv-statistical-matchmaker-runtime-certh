/**
 * Color converter functions
 */
const colorConverter = {
		toNum: function (hexString){
			var points = [];
			//red
			points.push(parseInt(hexString.substring(1, 3), 16));
			//green
			points.push(parseInt(hexString.substring(3, 5), 16));
			//blue
			points.push(parseInt(hexString.substring(5, 7), 16));

			return points;
		},
		componentToHex: function (c) {
		    var hex = c.toString(16);
		    return hex.length == 1 ? "0" + hex : hex;
		},
		toStr: function (rgb) {
		    return "#" + colorConverter.componentToHex(rgb[0]) + colorConverter.componentToHex(rgb[1]) + colorConverter.componentToHex(rgb[2]);
		}
}

/**
 * A dimension representation
 */
class Dimension {
	 constructor(missingValue = -1){
		this._missingValue = missingValue;
	 }
	 
	 get missingValue() {
		return this._missingValue;
	}
	 
	dissimilarity(a, b) {
		if(a == this._missingValue && a == b) 
			return [[0.0, 0.0]];
		
		return [[1.0, 0.0]];
	}
}

/**
 * 
 */
class SymmetricBinary extends Dimension {
	  constructor(missingValue = -1) {
		super(missingValue);
	  }
}

/**
 * Handler of Nominal attribute
 */
class Nominal extends Dimension {
	  constructor(states, missingValue = -1) {
		super(missingValue);
	    this._states = states;
	  }
	  
	  dissimilarity(a, b) {
		  
		//convert to numeric
		var ar = this._states.indexOf(a.toLowerCase());
		var br = this._states.indexOf(b.toLowerCase());

		if(ar != br) 
			return [[1.0, 1.0]];
		else if(ar != this._missingValue) 
			return [[1.0, 0.0]];
		
		return [[0.0, 0.0]];
		
	  }
}

/**
 * Handler of numeric attribute
 */
class Numeric extends Dimension {
	  constructor(max, min, missingValue = -1) {
		super(missingValue);
	    this._max = max;
	    this._min = min;
	  }
	  
	  dissimilarity(a, b) {
		 		  
		if(a == this._missingValue && a == b) 
			return [[0.0, 0.0]];
		
		return [[1.0, Math.abs(a - b)/ (this._max - this._min)]];
	  }
}

/**
 * Handler of ordinal attribute
 */
class Ordinal extends Numeric {
	  constructor(states, max, min, missingValue = -1) {
		super(max, min, missingValue);
		this._states = states;
	  }
	  
	  dissimilarity(a, b) {
		  
		//convert to numeric
		var na = this._states.indexOf(a.toLowerCase());
		var nb = this._states.indexOf(b.toLowerCase());	  
		var m = this._states.length
		var za = (na - 1) / (m - 1);
		var zb = (nb - 1) / (m - 1);
		
		return super.dissimilarity(za, zb);
	  }
}

/**
 * Handler of color attribute
 */
class Color extends Dimension {
	  constructor(red, green, blue) {
		super(0, 0);
		this._red = red
		this._green = green
		this._blue = blue
	  }
	  
	  dissimilarity(a, b) {
		  
		//convert to numeric
		var na = colorConverter.toNum(a);
		var nb = colorConverter.toNum(b);
		
		var delta_r = this._red.dissimilarity(na[0], nb[0]);
		var delta_g = this._green.dissimilarity(na[1], nb[1]);
		var delta_b = this._blue.dissimilarity(na[2], nb[2]);
		
		return [ delta_r[0], delta_g[0], delta_b[0]];
	  }
}

//Export classes
module.exports.Numeric = Numeric
module.exports.Nominal = Nominal
module.exports.Ordinal = Ordinal
module.exports.Color = Color
module.exports.SymmetricBinary = SymmetricBinary
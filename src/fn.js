var Formulae = Formulae || {};

Formulae.fn = (function () {

	var f = function () {
		return Formulae.fn;
	};

	var assertArgsAtLeast = function (args, amount) {
		if (args.length < amount) {
			throw 'Wrong number of arguments for function; should be at least ' + amount + ', found ' + args.length;
		}
	};

	var assertArgs = function (args, amount) {
		if (args.length != amount) {
			throw 'Wrong number of arguments for function; should be ' + amount + ', found ' + args.length;
		}
	};

	var assertNumber = function(el) {
		if (typeof el !== 'number') {
			throw 'Formula works only with numbers...';
		}
	};

	var api = {
		splat : function (args) {
			return args;
		},

		cat : function (args) {
			var i, str = '';
			for (i = 0; i < args.length; i++) {
				str += args[i];
			}
			return str;
		},
		tostring : function (args) {
			assertArgs(args, 1);
			return ('' + args[0]);
		},
		trim : function (args) {
			return f().tostring(args).trim();
		},
		clean : function (args) {
			return f().tostring(args).replaceAll(/\p{C}/, '');
		},

		pi : function (args) {
			assertArgs(args, 0);
			return Math.PI;
		},
		e : function (args) {
			assertArgs(args, 0);
			return Math.E;
		},
		radians : function (args) {
			assertArgs(args, 1);
			assertNumber(args[0]);
			return args[0] * (Math.PI/180);
		},
		degrees : function (args) {
			assertArgs(args, 1);
			assertNumber(args[0]);
			return args[0] * (180/Math.PI);
		},
		sum : function (args) {
			args.forEach(assertNumber);
			return args.reduce(function(sum, value) {
				return sum + value;
			}, 0);
		},
		product : function (args) {
			args.forEach(assertNumber);
			return args.reduce(function(prod, value) {
				return prod * value;
			}, 1);
		},
		divide : function (args) {
			assertArgs(args, 2);
			args.forEach(assertNumber);
			return args[0] / args[1];
		},
		inverse : function (args) {
			assertArgs(args, 1);
			return f().divide(1, args);
		},
		minus : function (args) {
			assertArgs(args, 2);
			args.forEach(assertNumber);
			return args[0] - args[1];
		},
		opposite : function (args) {
			assertArgs(args, 1);
			return f().minus(0, args);
		},
		pow : function (args) {
			assertArgs(args, 2);
			args.forEach(assertNumber);
			return Math.pow(args[0], args[1]);
		},
		stdev : function (args) {
			var avg = f().average(args);
  
			var squareDiffs = args.map(function (value) {
				var diff = value - avg;
				return diff * diff;
			});
  
			var avgSquareDiff = f().average(squareDiffs);
			return f().sqrt([avgSquareDiff]);
		},
		average : function (args) {
			return f().sum(args) / args.length;
		},
		min : function (args) {
			args.forEach(assertNumber);
			return Math.min.apply(null, args);
		},
		max : function (args) {
			args.forEach(assertNumber);
			return Math.max.apply(null, args);
		}
	};

	var trigs = Formulae.utils.flatten(['cos', 'sin', 'tan'].map(function (t) {
		return [t, 'a' + t, t + 'h', 'a' + t + 'h'];
	})).concat(['atan2']);
	var logs = [ 'log', 'log2', 'log10' ];
	var roundings = [ 'floor', 'ceil', 'round' ];
	var pows = [ 'sqrt', 'exp' ];
	Formulae.utils.flatten(trigs, logs, roundings, pows).forEach(function (mathFunction) {
		api[mathFunction] = function (args) {
			assertArgs(args, 1);
			assertNumber(args[0]);
			return Math[mathFunction](args[0]);
		};
	});

	api.int = api.trunc = api.floor;

	return api;
})();

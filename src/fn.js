define(function (require) {

	var errors = require('errors');
	var utils = require('utils');

	var fn = (function () {
	
		var assertArgsAtLeast = function (args, amount) {
			if (args.length < amount) {
				errors.message('wrong_number_of_args_at_least', [amount, args.length]);
			}
		};
	
		var assertArgs = function (args, amount) {
			if (args.length != amount) {
				errors.message('wrong_number_of_args', [amount, args.length]);
			}
		};
	
		var assertNumber = function(el) {
			if (typeof el !== 'number') {
				errors.message('wrong_arg_should_be_number', [el]);
			}
		};
	
		var assertBool = function (el) {
			if (typeof el !== 'boolean') {
				errors.message('wrong_arg_should_be_boolean', [el]);
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
				return this.tostring(args).trim();
			},
			clean : function (args) {
				return this.tostring(args).replaceAll(/\p{C}/, '');
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
				return this.divide(1, args);
			},
			minus : function (args) {
				assertArgs(args, 2);
				args.forEach(assertNumber);
				return args[0] - args[1];
			},
			opposite : function (args) {
				assertArgs(args, 1);
				return this.minus(0, args);
			},
			pow : function (args) {
				assertArgs(args, 2);
				args.forEach(assertNumber);
				return Math.pow(args[0], args[1]);
			},
			stdev : function (args) {
				var avg = this.average(args);
	  
				var squareDiffs = args.map(function (value) {
					var diff = value - avg;
					return diff * diff;
				});
	  
				var avgSquareDiff = this.average(squareDiffs);
				return this.sqrt([avgSquareDiff]);
			},
			average : function (args) {
				return this.sum(args) / args.length;
			},
			min : function (args) {
				args.forEach(assertNumber);
				return Math.min.apply(null, args);
			},
			max : function (args) {
				args.forEach(assertNumber);
				return Math.max.apply(null, args);
			},
	
			eq : function (args) {
				assertArgs(args, 2);
				return args[0] == args[1];
			},
			lt : function (args) {
				assertArgs(args, 2);
				args.forEach(assertNumber);
				return args[0] < args[1];
			},
			gt : function (args) {
				assertArgs(args, 2);
				args.forEach(assertNumber);
				return args[0] > args[1];
			},
			let : function (args) {
				assertArgs(args, 2);
				args.forEach(assertNumber);
				return args[0] <= args[1];
			},
			get : function (args) {
				assertArgs(args, 2);
				args.forEach(assertNumber);
				return args[0] >= args[1];
			},
			not : function (args) {
				assertArgs(args, 1);
				assertBool(args[0]);
				return !args[0];
			},
			and : function (args) {
				args.forEach(assertBool);
				return args.reduce(function(total, value) {
					return total && value;
				}, true);
			},
			or : function (args) {
				args.forEach(assertBool);
				return args.reduce(function(total, value) {
					return total || value;
				}, false);
			}
		};
	
		var trigs = utils.flatten(['cos', 'sin', 'tan'].map(function (t) {
			return [t, 'a' + t, t + 'h', 'a' + t + 'h'];
		})).concat(['atan2']);
		var logs = [ 'log', 'log2', 'log10' ];
		var roundings = [ 'floor', 'ceil', 'round' ];
		var pows = [ 'sqrt', 'exp' ];
		utils.flatten(trigs, logs, roundings, pows).forEach(function (mathFunction) {
			api[mathFunction] = function (args) {
				assertArgs(args, 1);
				assertNumber(args[0]);
				return Math[mathFunction](args[0]);
			};
		});
	
		api.int = api.trunc = api.floor;
		api['if'] = function (args) {
			assertArgs(args, 3);
			assertBool(args[0]);
			return args[args[0] ? 1 : 2];
		};
	
		return api;
	})();

	return fn;
});

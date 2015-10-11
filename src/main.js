define(function (require) {

	var errors = require('errors');
	var parser = require('parser');
	var utils = require('utils');
	var fns = require('fn');
	var cells = require('cells');

	var main = function (tableAccess) {

		var evaluate = function (value) {
			var result = parser(cells(tableAccess)).parseExpression(value);
			return unravel(result);
		};
	
		var unravel = function (result) {
			if (!Array.isArray(result)) {
				if (typeof result === 'function') {
					return result();
				}
				return result;
			}
	
			var name = result.shift();
			var args = utils.flatten(result.map(unravel));
	
			var fn = fns[name.toLowerCase()];
			if (!fn) {
				errors.fn(name, { message : 'unknown_function' });
			}
			try {
				return fn.bind(fns)(args);
			} catch (ex) {
				errors.fn(name, ex);
			}
		};
		
		return {
			evaluate : evaluate,
			unravel : unravel
		};

	};

	return main;
});

var Formulae = Formulae || {};

Formulae.evaluate = (function () {

	var evaluate = function (value) {
		if (value[0] !== '=') {
			throw 'Invalid value; should start with "="';
		}
		var result = Formulae.parseExpression(value.substr(1));
		return unravel(result);
	};

	var unravel = function (result) {
		if (!Array.isArray(result)) {
			return result;
		}

		var name = result.shift();
		var args = flatten(result.map(unravel));

		var fn = Formulae.fn[name.toLowerCase()];
		if (!fn) {
			throw 'Invalid function name "' + name + '".';
		}
		return fn(args);
	};

	var flatten = function (array) {
		return Array.concat.apply([], array);
	};

	return evaluate;
})();
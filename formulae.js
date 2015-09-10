var Formulae = Formulae || {};

Formulae.evaluate = (function () {

	var f = Formulae;

	var evaluate = function (value) {
		if (value[0] !== '=') {
			throw 'Invalid value; should start with "="';
		}
		var result = f.parseExpression(value.substr(1));
		return unravel(result);
	};

	var unravel = function (result) {
		if (!Array.isArray(result)) {
			return result;
		}

		var name = result.shift();
		var args = f.utils.flatten(result.map(unravel));

		var fn = f.fn[name.toLowerCase()];
		if (!fn) {
			throw 'Invalid function name "' + name + '".';
		}
		return fn(args);
	};

	return evaluate;
})();
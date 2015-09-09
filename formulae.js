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
		var src = Formulae.fn[name.toLowerCase()];
		if (!src) {
			throw 'Invalid function name "' + result + '".';
		}
		return src(result.map(unravel));
	};

	return evaluate;
})();
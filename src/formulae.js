var Formulae = Formulae || {};

Formulae.main = (function () {

	var f = Formulae;

	var evaluate = function (value) {
		var result = f.parseExpression(value);
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
		var args = f.utils.flatten(result.map(unravel));

		var fn = f.fn[name.toLowerCase()];
		if (!fn) {
			Formulae.errors.fn(name, { message : 'unknown_function' });
		}
		try {
			return fn(args);
		} catch (ex) {
			Formulae.errors.fn(name, ex);
		}
	};

	return {
		evaluate : evaluate,
		unravel : unravel
	};
})();

Formulae.evaluate = Formulae.main.evaluate;
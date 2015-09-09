var Formulae = Formulae || {};

Formulae.evaluate = (function () {

	var functions = {
		sum : function (args) {
			var i, total = 0;
			for (i = 0; i < args.length; i++) {
				if (typeof args[i] !== 'number') {
					throw 'SUM works only with numbers...';
				}
				total += args[i];
			}
			return total;
		},
		cat : function (args) {
			var i, str = '';
			for (i = 0; i < args.length; i++) {
				str += args[i];
			}
			return str;
		}
	};

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
		var fn_name = result.shift();
		var src = functions[fn_name.toLowerCase()];
		if (!src) {
			throw 'Invalid function name ' + result + '.';
		}
		return src(result.map(unravel));
	};

	return evaluate;
})();
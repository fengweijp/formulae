var Formulae = Formulae || {};

Formulae.parseExpression = (function () {

	var parsePrimitive = function (arg) {
		if (arg[0] === '"') {
			if (arg[arg.length - 1] != '"') {
				throw 'Weird string here! Should end with "';
			}
			return arg.substr(1, arg.length - 2);
		}

		if (!isNaN(arg)) {
			return parseFloat(arg);
		}

		if (arg.match(/^[a-zA-Z]+[0-9]+$/)) {
			return Formulae.cells.lazy.single(arg);
		}

		if (arg.match(/^[a-zA-Z]*[0-9]*\:[a-zA-Z]*[0-9]*$/) && arg.match(/^[a-zA-Z0-9]+\:[a-zA-Z0-9]+$/)) {
			return Formulae.cells.lazy.interval(arg);
		}

		throw 'This is not a number, string, nor cell. What the hell is "' + arg + '"?';
	};

	var parseExpression = function (exp) {
		if (exp.indexOf('(') === -1 && exp.indexOf(')') === -1) {
			return parsePrimitive(exp);
		} else {
			return parseFormula(exp);
		}
	};

	var parseFormula = function (formula) {
		if (formula[formula.length - 1] !== ')') {
			throw 'Invalid formula; should end with ")"';
		}
		if (formula.indexOf('(') === -1) {
			throw 'Invalid formula; should contain "("';
		}

		var i, fn = formula.substr(0, formula.length - 1);
		var fnName = '', args, currentArg = '';
		var stringMode = false, escapeNext = false;
		var deepnessCount = 0;
		for (i = 0; i < fn.length; i++) {
			var c = fn[i];
			if (stringMode) {
				if (escapeNext) {
					currentArg += c;
					escapeNext = false;
				} else if (c == '\\') {
					escapeNext = true;
				} else if (c == '"') {
					currentArg += '"';
					stringMode = false;
				} else {
					currentArg += c;
				}
				continue;
			}
			if (args) {
				if (c === '"') {
					currentArg += '"';
					stringMode = true;
				} else if (c === ',' && deepnessCount === 0) {
					args.push(currentArg.trim());
					currentArg = '';
				} else if (c === '(') {
					deepnessCount++;
					currentArg += c;
				} else if (c === ')') {
					if (deepnessCount === 0) {
						throw 'Cannot close ) without opening it.';
					}
					currentArg += c;
					deepnessCount--;
				} else {
					currentArg += c;
				}
			} else {
				if (c === '(') {
					args = [];
				} else {
					fnName += c;
				}
			}
		}
		if (stringMode || escapeNext) {
			throw 'Invalid formula, string left open.';
		}
		if (currentArg) {
			args.push(currentArg.trim());
		}
		return [fnName].concat(args.map(parseExpression));
	};

	return parseExpression;
})();

var Formulae = (function () {

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

	var getCellContent = function (cell) {
		// TODO
		return 1;
	};

	var parsePrimitive = function (arg) {
		if (arg[0] === '"') {
			if (arg[arg.length - 1] != '"') {
				throw 'Weird string here! Should end with "';
			}
			return arg.substr(1, arg.length - 2);
		}
		var tryFloat = parseFloat(arg);
		if (!isNaN(tryFloat)) {
			return tryFloat;
		}

		if (arg.match(/^[a-zA-Z]+[0-9]+$/)) {
			return getCellContent(arg);
		}

		throw 'This is not a number, string, nor cell. What the hell is "' + arg + '"?';
	};

	var parse = function (value) {
		if (value[0] !== '=') {
			throw 'Invalid value; should start with "="';
		}
		var result = parseExpression(value.substr(1));
		return evaluate(result);
	};

	var evaluate = function (result) {
		if (!Array.isArray(result)) {
			return result;
		}
		var fn_name = result.shift();
		var src = functions[fn_name.toLowerCase()];
		if (!src) {
			throw 'Invalid function name ' + result + '.';
		}
		return src(result.map(evaluate));
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
				} else if (c === ',' && deepnessCount == 0) {
					args.push(currentArg.trim());
					currentArg = '';
				} else if (c === '(') {
					deepnessCount++;
					currentArg += c;
				} else if (c === ')') {
					if (deepnessCount === 0) {
						throw 'Cannot close ) without opening it.'
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

	return {
		parse : parse
	};
})();
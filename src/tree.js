var Formulae = Formulae || {};

Formulae.tree = (function () {

	var transverser = function () {
		var i, j, d;
		var started = {};
		var resolved = {};

		Formulae.tree.cache = function (i, j) {
			return resolved[Formulae.cells.toCell(i, j)];
		};

		var resolve = function (i, j) {
			var cell = Formulae.cells.toCell(i, j);
			if (resolved[cell]) {
				return;
			}

			var content = Formulae.tableAccess.get(i, j);
			if (content[0] === '=') {
				started[cell] = true;
				var result = Formulae.parseExpression(content.substr(1));
				var dependencies = Formulae.utils.flatten(result).filter(function (el) {
					return typeof el === 'function';
				}).map(function (fn) {
					return fn.cell;
				});
				dependencies.forEach(function (dep) {
					if (typeof resolved[dep] === 'undefined') {
						if (started[dep]) {
							throw 'Warning! Cyclic dependency! Cells ' + cell + ' and ' + dep + ' are directly or inderctly linked cyclic.';
						}
						var arr = Formulae.cells.cellToArray(dep);
						resolve(arr[0], arr[1]);
					}
				});

				content = Formulae.main.unravel(result);
			}
			Formulae.tableAccess.set(i, j, content);
			resolved[cell] = content;
		};

		for (i = 1; i <= Formulae.tableAccess.columns(); i++) {
			for (j = 1; j <= Formulae.tableAccess.rows(); j++) {
				resolve(i, j);
			}
		}
	};

	return transverser;

})();
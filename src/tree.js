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
				var result;
				try {
					result = Formulae.parseExpression(content.substr(1));
				} catch (ex) {
					Formulae.errors.cell(cell, ex);
				}

				var dependencies = Formulae.utils.flatten(result).filter(function (el) {
					return typeof el === 'function';
				}).map(function (fn) {
					return fn.cell;
				});
				dependencies.forEach(function (dep) {
					if (typeof resolved[dep] === 'undefined') {
						if (started[dep]) {
							Formulae.errors.cell(cell, { message : 'cyclic_dependency', args: [ dep ] });
						}
						var arr = Formulae.cells.cellToArray(dep);
						resolve(arr[0], arr[1]);
					}
				});

				try {
					content = Formulae.main.unravel(result);
				} catch (ex) {
					Formulae.errors.cell(cell, ex);
				}
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
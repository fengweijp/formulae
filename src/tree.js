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
			var cell = Formulae.cells.toCell(i, j), content;
			if (resolved[cell]) {
				return;
			}

			started[cell] = true;
			content = resolveContent(i, j, cell);
			Formulae.tableAccess.set(i, j, content);
			resolved[cell] = content;
		};

		var resolveContent = function (i, j, cell) {
			var content = Formulae.tableAccess.get(i, j);
			if (content[0] !== '=') {
				return content;
			}

			var result;
			try {
				result = Formulae.parseExpression(content.substr(1));
			} catch (ex) {
				return Formulae.errors.cell(cell, ex);
			}

			var dependencies = Formulae.utils.flatten(result).filter(function (el) {
				return typeof el === 'function';
			}).map(function (fn) {
				return fn.cell;
			});

			try {
				dependencies.forEach(function (dep) {
					var arr = Formulae.cells.cellToArray(dep);
					if (typeof resolved[dep] === 'undefined') {
						if (started[dep]) {
							throw Formulae.errors.cell(cell, { message : 'cyclic_dependency', args: [ dep ] });
						}
						resolve(arr[0], arr[1]);
					}
					if (Formulae.tree.cache(arr[0], arr[1]).isError) {
						throw Formulae.errors.cell(cell, { message : 'error_in_dependency', args: [ dep ] });
					}
				});
			} catch (ex) {
				return ex;
			}

			try {
				return Formulae.main.unravel(result);
			} catch (ex) {
				return Formulae.errors.cell(cell, ex);
			}
		};

		for (i = 1; i <= Formulae.tableAccess.columns(); i++) {
			for (j = 1; j <= Formulae.tableAccess.rows(); j++) {
				resolve(i, j);
			}
		}
	};

	return transverser;

})();
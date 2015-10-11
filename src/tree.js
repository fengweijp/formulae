define(function (require) {

	var main = require('main');
	var errors = require('errors');
	var cells_base = require('cells');
	var parser = require('parser');
	var utils = require('utils');

	var tree = function (tableAccess) {

		var that = this;

		var transverser = function () {
			var i, j, d;
			var started = {};

			var cells = cells_base(tableAccess);
			cells.cache.clear();
	
			var resolve = function (i, j) {
				var cell = cells.toCell(i, j), content;
				if (cells.cache.get(i, j)) {
					return;
				}
	
				started[cell] = true;
				content = resolveContent(i, j, cell);
				tableAccess.set(i, j, content);
				cells.cache.set(i, j, content);
			};
	
			var resolveContent = function (i, j, cell) {
				var content = tableAccess.get(i, j);
				if (content[0] !== '=') {
					return content;
				}
	
				var result;
				try {
					result = parser(cells).parseExpression(content.substr(1));
				} catch (ex) {
					return errors.cell(cell, ex);
				}
	
				var dependencies = utils.flatten(result).filter(function (el) {
					return typeof el === 'function';
				}).map(function (fn) {
					return fn.cell;
				});
	
				try {
					dependencies.forEach(function (dep) {
						var arr = cells.cellToArray(dep);
						if (typeof cells.cache.get(arr[0], arr[1]) === 'undefined') {
							if (started[dep]) {
								throw errors.cell(cell, { message : 'cyclic_dependency', args: [ dep ] });
							}
							resolve(arr[0], arr[1]);
						}
						if (cells.cache.get(arr[0], arr[1]).isError) {
							throw errors.cell(cell, { message : 'error_in_dependency', args: [ dep ] });
						}
					});
				} catch (ex) {
					return ex;
				}
	
				try {
					return main(tableAccess).unravel(result);
				} catch (ex) {
					return errors.cell(cell, ex);
				}
			};
	
			for (i = 1; i <= tableAccess.columns(); i++) {
				for (j = 1; j <= tableAccess.rows(); j++) {
					resolve(i, j);
				}
			}
		};
	
		return transverser;
	
	};

	return tree;
});

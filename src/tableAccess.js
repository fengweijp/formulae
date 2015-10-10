define(function () {
	var tableAccess = (function () {

		var error = function () {
			throw 'Not set up! To access cells, you must override Formulae.tableAccess methods (get, set, rows and columns)';
		};

		return {
			get : error,
			set : error,
			rows : error,
			columns : error
		};
	})();

	return tableAccess;
});

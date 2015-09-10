var Formulae = Formulae || {};

Formulae.tableAccess = (function () {

	var throwError = function () {
		return 42;
		throw 'Not set up! To access cells, you must override Formulae.tableAccess methods (get, set, rows and columns)'
	};

	return {
		get : throwError,
		set : throwError,
		rows : throwError,
		columns : throwError
	};
})();

define(function (require) {

	var main_base = require('main');
	var tree_base = require('tree');

	var cells = require('cells');
	var errors = require('errors');
	var fn = require('fn');
	var parser = require('parser');
	var tableAccessMock = require('tableAccess');
	var utils = require('utils');

	return function (tableAccess) {
		tableAccess = tableAccess || tableAccessMock;

		var tree = tree_base(tableAccess);
		var main = main_base(tableAccess);

		return {
			tree : tree,
			evaluate : main.evaluate,
			unravel : main.unravel,
	
			tableAccess : tableAccess,
			errors : errors,
			fn : fn,
			parser : parser,
			utils : utils
		};

	};

});

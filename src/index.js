define(function (require) {

	var main = require('main');
	var tree = require('tree');

	var cells = require('cells');
	var errors = require('errors');
	var fn = require('fn');
	var parser = require('parser');
	var tableAccess = require('tableAccess');
	var utils = require('utils');

	var Formulae = {
		tree : tree,
		evaluate : main.evaluate,
		unravel : main.unravel,

		cells : cells,
		errors : errors,
		fn : fn,
		parser : parser,
		tableAccess : tableAccess,
		utils : utils
	};

	return Formulae;

});

var Formulae = Formulae || {};

Formulae.errors = (function () {

	var exceptions = {};

	exceptions.cell = function (cell, fn) {
		this.cell = cell;
		this.fn = fn.fn;
		this.message = fn.message;
		this.args = fn.args;
	};

	exceptions.fn = function (fn, message) {
		this.fn = fn;
		this.message = message.message;
		this.args = message.args;
	};

	exceptions.message = function (message, args) {
		this.message = message;
		this.args = args;
	};

	var format = function (pattern, args) {
		return pattern.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== 'undefined' ? args[number]  : match;
		});
	};

	return {
		cell : function (cell, fn) {
			throw new exceptions.cell(cell, fn);
		},

		fn : function (fn, message) {
			throw new exceptions.fn(fn, message);
		},

		message : function (message, args) {
			throw new exceptions.message(message, args);
		},

		format : format,

		messages : {
			string_should_end_with_quote : 'Weird string here! Should end with a quote.',
			what_is_this : 'This is not a number, string, boolean, nor cell ref. What the heck is "{0}"?',
			formula_should_end_with_closing_bracket : 'Invalid formula; should end with ")".',
			formula_should_contains_opening_bracket : 'Invalid formula; should contain "(".',
			unbalanced_bracket : 'Cannot close ")" without opening it.',
			wrong_number_of_args_at_least : 'Wrong number of arguments; should be at least {0}, found {1}.',
			wrong_number_of_args_exactly : 'Wrong number of arguments; should be at exactly {0}, found {1}.',
			wrong_arg_should_be_number : 'Wrong argument: should be number, found "{0}".',
			wrong_arg_should_be_boolean : 'Wrong argument: should be boolean, found "{0}".',
			unknown_function : 'Unknown function',
			cyclic_dependency : 'Cyclic dependency (direct or indirect) with other cell {0}.'
		}
	};
})();
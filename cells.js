var Formulae = Formulae || {};

Formulae.cells = (function () {

	var f = Formulae;

	var single = function (cell) {
		var a = cellToArray(cell);
		var text = Formulae.tableAccess.get(a[0], a[1]);
		if (isNaN(text)) {
			return text;
		}
		return parseFloat(text);
	};

	var interval = function (str) {
		return ['splat'].concat(expand(str).map(single));
	};

	var cellToArray = function (cell) {
		var r = /^([A-Z]+)([0-9]+)$/.exec(cell).slice(1, 3);
		return r.map(function (t) {
			if (t.match(/^([A-Z]+)$/)) {
				return toNumber(t);
			}
			return t;
		});
	};

	var permissiveCellToArray = function (cell) {
		var r = /^([A-Z]*)([0-9]*)$/.exec(cell).slice(1, 3);
		if (r[0] === '') {
			r[0] = '' + Formulae.tableAccess.columns();
		}
		if (r[1] === '') {
			r[1] = '' + Formulae.tableAccess.rows();
		}
		return r.map(function (t) {
			if (t.match(/^([A-Z]+)$/)) {
				return toNumber(t);
			}
			return t;
		});
	};

	var expand = function (interval) {
		var borders = interval.toUpperCase().split(':');
		var it = f.utils.transpose(borders.map(function (b) {
			return permissiveCellToArray(b);
		})).map(function (r) {
			return r.sort();
		});
		var expand = [];
		for (var letter = it[0][0]; letter <= it[0][1]; letter++) {
			for (var number = it[1][0]; number <= it[1][1]; number++) {
				expand.push(toCell(letter, number));
			}
		}
		return expand;
	};

	var toNumber = function (letters) {
		var i, sum = 0, firstLetter = 'A'.charCodeAt();

		for (i = 0; i < letters.length; i++) {
			sum *= 26;
			sum += (letters[i].charCodeAt() - firstLetter + 1);
		}

		return sum;
	};

	var toLetters = function (number) {
		var dividend = number, columnName = '';
		var modulo;

		while (dividend > 0) {
			modulo = (dividend - 1) % 26;
			columnName = String.fromCharCode(65 + modulo) + columnName;
			dividend = Math.floor((dividend - modulo) / 26);
		}

		return columnName;
	};

	var toCell = function (column, row) {
		return toLetters(column) + row;
	};

	var lazy = {
		single : function (cell) {
			var r =  function () {
				return single(cell);
			};
			r.cell = cell;
			return r;
		},
		interval : function (str) {
			return ['splat'].concat(expand(str).map(lazy.single));
		}
	};

	return {
		expand : expand,
		single : single,
		interval : interval,
		toNumber : toNumber,
		toLetters : toLetters,
		toCell : toCell,
		cellToArray : cellToArray,
		lazy : lazy
	};
})();
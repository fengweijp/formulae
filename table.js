var Formulae = Formulae || {};

// TODO this

Formulae.table = (function () {

	var f = Formulae;

	var cellContent = function (cell) {
		return 42;
	};

	var splat = function (interval) {
		var borders = interval.toUpperCase().split(':');
		var it = f.utils.transpose(borders.map(function (b) {
			var r = /^([A-Z]+)([0-9]+)$/.exec(b);
			r.shift();
			return r;
		})).map(function (r) {
			return r.map(function (t) {
				if (t.match(/^([A-Z]+)$/)) {
					return toNumber(t);
				}
				return t;
			}).sort();
		});
		var letters = it[0];
		var numbers = it[1];
		var splat = [];
		for (var letter = letters[0]; letter <= letters[1]; letter++) {
			for (var number = numbers[0]; number <= numbers[1]; number++) {
				splat.push(toLetters(letter) + number);
			}
		}
		return splat;
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

	return {
		splat : splat,
		cellContent : cellContent
	};
})();
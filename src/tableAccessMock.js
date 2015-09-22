var Formulae = Formulae || {};

Formulae.tableAccess = (function () {

	var table = [
		['1', 2, '=SUM(1,2)'],
		['=SUM(B2, 13)', '=SUM(A1:1)', 'huez'],
		['=PI()', '=AVERAGE(A1:1)', '=STDEV(A3:B3)'],
		['=TRUE', '=IF(A4,"true","false")', '=IF(GET(B1, C1), B1, C1)'],
		['=ANDx(TRUE, FALSE)', '=IF(OR(TRUE,A5),A3,E())', 'huez']
	];

	var result = [[], [], [], [], []];

	return {
		get : function (i, j) {
			return table[parseInt(j) - 1][parseInt(i) - 1];
		},
		set : function (i, j, v) {
			result[parseInt(j) - 1][parseInt(i) - 1] = v;
		},
		rows : function () {
			return table.length;
		},
		columns : function () {
			return table[0].length;
		},

		table : table,
		result : result
	};
})();

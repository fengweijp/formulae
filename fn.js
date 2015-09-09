var Formulae = Formulae || {};

Formulae.fn = {
	sum : function (args) {
		var i, total = 0;
		for (i = 0; i < args.length; i++) {
			if (typeof args[i] !== 'number') {
				throw 'SUM works only with numbers...';
			}
			total += args[i];
		}
		return total;
	},
	cat : function (args) {
		var i, str = '';
		for (i = 0; i < args.length; i++) {
			str += args[i];
		}
		return str;
	}
};

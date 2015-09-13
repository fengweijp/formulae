var Formulae = Formulae || {};

Formulae.utils = {
	transpose : function (a) {
		return a[0].map(function (_, c) {
			return a.map(function (r) {
				return r[c];
			});
		});
	},

	flatten : function () {
		var flat = [], i;
		for (i = 0; i < arguments.length; i++) {
			if (arguments[i] instanceof Array) {
				flat = flat.concat(Formulae.utils.flatten.apply(null, arguments[i]));
			} else {
				flat.push(arguments[i]);
			}
		}
		return flat;
	}

 };
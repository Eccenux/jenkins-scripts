/**
 * Adds a notice for users that are not logged in with upper case letter.
 *
 * @author Maciej "Nux" Jaros
 *
 * Licensed under (at ones choosing)
 * <li>MIT License: http://www.opensource.org/licenses/mit-license
 * <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 *
 * @requires jQueryMini or Actual jQuery.
 */
(function ($) {
	$('#j_username').each(function(){
		$.on(this, 'change', function() {
			var login = this.value;
			if (login.length && login[0].toLowerCase() === login[0]) {
				alert('Login MUSI być wpisany z dużej litery!'
					+'\n\nInaczej nie będziesz mieć normalnych uprawnień.'
					+'\n\nPrzykład: józefk - źle, JózefK - dobrze.'
				);
			}
		});
	});
})(jQueryMini);
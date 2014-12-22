/**
 * Adds a notice for users that are not logged in with upper case letter.
 *
 * @author Maciej "Nux" Jaros
 *
 * Licensed under (at ones choosing)
 * <li>MIT License: http://www.opensource.org/licenses/mit-license
 * <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 *
 * @requires jQueryMini or an actual jQuery library.
 */
(function ($) {
	$(function(){
		$('#j_username').each(function(){
			// on change check and info
			$.on(this, 'change', function() {
				var login = this.value;
				if (login.length && login[0].toLowerCase() === login[0]) {
					alert('Login MUSI być wpisany z dużej litery!'
						+'\n\nInaczej nie będziesz mieć normalnych uprawnień.'
						+'\n\nPrzykład: józefk - źle, JózefK - dobrze.'
					);
				}
			});
			// immediate info
			var el = document.createElement('span');
			el.textContent = ' Login MUSI być wpisany z dużej litery (józefk - źle, JózefK - dobrze).';
			this.parentNode.appendChild(el);
		});
	});
})(jQueryMini);
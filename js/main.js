// for 1.1.0

function ready(fn) {
	if (document.readyState != 'loading') fn();
	else document.addEventListener('DOMContentLoaded', fn);
}

ready(function(){
	BrickCols.layout_optimization('.sorted_table', '.sorted_table__col', '.sorted_table__block', function(){
		var body = document.querySelector('body'),
			className = 'm--sorted';
		if (body.classList)
			body.classList.add(className);
		else
			body.className += ' ' + className;
	});

	window.onresize = function() {
		BrickCols.layout_optimization('.sorted_table', '.sorted_table__col', '.sorted_table__block');
	};
});
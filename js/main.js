// for 2.1.0

function ready(fn) {
	if (document.readyState != 'loading') fn();
	else document.addEventListener('DOMContentLoaded', fn);
}

ready(function(){
	BrickCols.layout_optimization('.sorted_table', '.sorted_table__col', '.sorted_table__block', function(err){
		if (err){
			console.log(err);
			return false;
		}
		var body = document.querySelector('body'),
			className = 'm--sorted';
		if (body.classList)
			body.classList.add(className);
		else
			body.className += ' ' + className;
	});

	window.onresize = function(){
		BrickCols.layout_optimization('.sorted_table', '.sorted_table__col', '.sorted_table__block');
	};

	document.querySelector('.add_new__button').onclick = function(){
		var header = document.querySelector('.add_new__header'),
			content = document.querySelector('.add_new__content'),
			priority = document.querySelector('.add_new__priority');
		header = header.value;
		content = content.value;
		priority = priority.value;
		BrickCols.add_new('.sorted_table.m--1', '.sorted_table__col', [['header', 'html', header], ['this', 'class', 'm--added'], ['content', 'html', content]], priority);
		// if (priority)
			BrickCols.layout_optimization('.sorted_table', '.sorted_table__col', '.sorted_table__block');
	};
});
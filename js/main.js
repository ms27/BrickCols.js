$(document).ready(function(){
	BrickCols.layout_optimization('.sorted_table', '.sorted_table__col', '.sorted_table__block', function(ready){
		if (ready)
			$('body').addClass('m--sorted');
	});
	
	$(window).resize(function(){
		setTimeout(function(){
			BrickCols.layout_optimization('.sorted_table', '.sorted_table__col', '.sorted_table__block');
		}, 100);
	});
});

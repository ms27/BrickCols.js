/*! BrickCols.js v1.0.0 | (c) Magomedov Said | The MIT License (MIT) */

var BrickCols = {
	init: function(){
		this._name = 'BrickCols';
		this._description = 'Cascading grid layout without absolute positioning. You don\'t need to use any JS code to set stylesheet properties.';
		this._version = '1.0.0';
		this._autor = 'Magomedov Said';
		
		this.auto_prioritize = function(wrap, element){
			$(wrap).each(function(){
				var p = 1,
					this_wrap = this;
				$(this_wrap).find(element + ':not([data-priority])').each(function(){
					while ($(this_wrap).find(element + '[data-priority="' + p + '"]').length){
						p++;
					}
					$(this).attr('data-priority', p);
				});
			});
		};
		this.layout_optimization = function(wrap, cell, element, callback){
			callback = callback || false;
			wrap += ' ';
			var tm = this;
			$(wrap).each(function(){
				var this_wrap = this,
					this_cell = $(this).find(cell),
					this_element = $(this).find(element);
				
				if ($(this_wrap).find(element + ':not([data-priority])').length)
					tm.auto_prioritize(this_wrap, element);
				// кол-во активных колонок:
				var active_col = parseInt($(this_wrap).outerWidth() / $(this_cell).outerWidth(true));
				// высоты колонок вывода:
				// var col_h = Array(active_col);
				var col_h = [];
				// не получилось сделать по нормальному - написал говнокод:
				for (var i = 0; i < active_col; i++){
					col_h[i] = 0;
				}
				// Если нет нужного числа колонок, то создаю их
				for (var i = $(this_cell).length; i < active_col; i++){
					$($(this_cell)[0]).clone().html('').appendTo(this_wrap);
				}

				var el_count = $(this_element).length,
					p = 1;
				while (el_count > 0) {
					var el = $(this_wrap).find(element + '[data-priority="' + p + '"]');

					if (el.length){
						$(el).each(function(){
							// дефолтная минимальная колонка - первая:
							var min = col_h[0],	// значение высоты
								col_i = 0;	// индекс
							// перебираю каждую колонку в поисках наименьшей
							for (var i = 1; i < active_col; i++){
								if (col_h[i] < min){
								// обратная сортировка:
								// if (col_h[i] - 1 < min){
									min = col_h[i];
									col_i = i;
								}
							}
							// увеличиваю значение высоты колонки
							col_h[col_i] += $(this).outerHeight(true);
							// добавляю элемент в нужную колонку
							$(this_wrap).find(cell + ':nth-child(' + ++col_i + ')')
								.append($(this));
							el_count -= 1;
						});
					}
					p++;
				}
			});
			if (callback) callback(true);
		};
	}
};

var BrickCols = new BrickCols.init();
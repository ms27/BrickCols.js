/*! BrickCols.js v2.0.1 | (c) Magomedov Said | The MIT License (MIT) */

var BrickCols = {
	init: function(){
		this._name = 'BrickCols';
		this._description = 'Cascading grid layout without absolute positioning. You don\'t need to use any JS code to set stylesheet properties.';
		this._version = '2.0.1';
		this._autor = 'Magomedov Said';

        function outer(el, property){
            var val, style = getComputedStyle(el);
            switch (property) {
                case 'width':
                    val = el.offsetWidth;
                    val += parseInt(style.marginLeft) + parseInt(style.marginRight);
                    break;
                case 'height':
                    val = el.offsetHeight;
                    val += parseInt(style.marginTop) + parseInt(style.marginBottom);
                    break;
                default: break;
            }
            return val;
        }

		this.auto_prioritize = function(wrap, element){
			[wrap].forEach(function(this_wrap){
				var p = 1;
				Array.prototype.slice.call(this_wrap.querySelectorAll(element + ':not([data-priority])'))
                    .forEach(function(this_element){
                        while (this_wrap.querySelectorAll(element + '[data-priority="' + p + '"]').length){
                            p++;
                        }
                        this_element.setAttribute('data-priority', p);
				});
			});
		};
		this.layout_optimization = function(wrap, col, element, callback){
	
            var tm = this;

			// Array.prototype.slice.call() - решает! после использования данной функции, скрипт заработал и в IE с Edge
            Array.prototype.slice.call(document.querySelectorAll(wrap)).forEach(function(this_wrap){
                var wrap_col = this_wrap.querySelectorAll(col),
                    wrap_element = this_wrap.querySelectorAll(element);

                if (this_wrap.querySelectorAll(element + ':not([data-priority])').length)
                    tm.auto_prioritize(this_wrap, element);
				// кол-во активных колонок:
				var active_col = parseInt(this_wrap.offsetWidth / outer(wrap_col[0], 'width'));
				// высоты колонок вывода:
				// var col_h = Array(active_col);
				var col_h = [];
				// не получилось сделать по нормальному - написал говнокод:
				for (var i = 0; i < active_col; i++){
					col_h[i] = 0;
				}
				// Если нет нужного числа колонок, то создаю их
				for (var i = wrap_col.length; i < active_col; i++){
                    var new_col = wrap_col[0].cloneNode(true);
                    new_col.innerHTML = '';
                    this_wrap.appendChild(new_col);
				}
                
				var el_count = wrap_element.length,
					p = 1;
                while (el_count > 0) {
                    wrap_element = this_wrap.querySelectorAll(element + '[data-priority="' + p + '"]');

					if (wrap_element.length){
						[wrap_element].forEach(function(this_element){
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
							col_h[col_i] += outer(this_element[0], 'height');
							// добавляю элемент в нужную колонку
							var this_col = this_wrap.querySelector(col + ':nth-child(' + ++col_i + ')');
								this_col.appendChild(this_element[0]);
							el_count -= 1;
						});
                    }
					p++;
                }
            });
			if (callback)
                callback();
		};
	}
};

var BrickCols = new BrickCols.init();
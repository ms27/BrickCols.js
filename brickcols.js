/*!
 * BrickCols.js v2.1.0 | (c) Magomedov Said | The MIT License (MIT)
 */

var BrickCols = {
	init: function(){
		this._name = 'BrickCols';
		this._description = 'Cascading grid layout without absolute positioning. You don\'t need to use any JS code to set stylesheet properties.';
		this._version = '2.1.0';
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
                    val += Math.max(parseInt(style.marginTop), parseInt(style.marginBottom)); // используется max, так как отступы и подряд идущих блоков совмещаются
                    break;
                default: break;
            }
            return val;
        }
        function add_prop(template_el, prop, val){
			switch (prop) {
				case 'html':
					template_el.innerHTML = val;
					break;
				case 'href':
					template_el.setAttribute('href', val);
					break;
				case 'src':
					template_el.setAttribute('src', val);
					break;
				case 'class':
					if (template_el.classList) template_el.classList.add(val); else template_el.className += ' ' + val;
					break;
				case 'remove_class':
					if (template_el.classList) template_el.classList.remove(val); else template_el.className = template_el.className.replace(new RegExp('(^|\\b)' + val.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
					break;
			}
        }

		this.add_new = function(wrap, col, content, priority, template){
			if (!Array.isArray(content))
				return false;
			wrap = document.querySelector(wrap);
			if (template)
				template = document.querySelector('[data-brickcols-template="'+ template +'"]');
			else
				template = wrap.querySelector('.brickcols_template');
			if (!template)
				return false;
			template = template.cloneNode(true);
			content.forEach(function(child, item){
				if (!(child[0] && child[1] && child[2])) return false;
				if (child[0] == 'this'){
					add_prop(template, child[1], child[2]);
					return false;
				}
				var template_el = template.querySelectorAll('[data-bc-t="'+ child[0] +'"');
				Array.prototype.slice.call(template_el).forEach(function(template_el){ // fuck this line
					add_prop(template_el, child[1], child[2]);
				});
			});
			priority = priority || '';
			template.setAttribute('data-priority', priority);
			template.classList.remove('brickcols_template');
			var col_min_index = 0,
				col_min_height = wrap.querySelector(col).offsetHeight;
			Array.prototype.slice.call(wrap.querySelectorAll(col +':not(:empty)'))
				.forEach(function(this_col, i){
					if (this_col.offsetHeight < col_min_height){
						col_min_height = this_col.offsetHeight;
						col_min_index = i;
					}
			});
			var wrap_col = wrap.querySelector(col + ':nth-child('+ (++col_min_index) +')');
			wrap_col.appendChild(template);
			return true;
		};
		this.auto_prioritize = function(wrap, element){
			[wrap].forEach(function(this_wrap){
				var p = 1;
				Array.prototype.slice.call(this_wrap.querySelectorAll(element))
                    .forEach(function(this_element){
						var this_element_priority = this_element.getAttribute('data-priority'),
							is_int = parseInt(this_element_priority);
						if (is_int && is_int == this_element_priority)
							return false;
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
                
                tm.auto_prioritize(this_wrap, element);
				var el_count = wrap_element.length,
					p = 1;

				var err = 200; // ограничиваются разницу в приоритетах, нефиг так разбрасываться ими :)
                while (el_count > 0) {
                    wrap_element = Array.prototype.slice.call(this_wrap.querySelectorAll(element + '[data-priority="' + p + '"]'));
					if (wrap_element.length){
						wrap_element.forEach(function(this_element){
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
							// увеличиваю значение высоты колонки 		// заметка: использовать outerHeight, если будут заметны погрешности.
							col_h[col_i] += this_element.offsetHeight;	// причём, outerHeight только с максимальным из вертикальных отступов
							// добавляю элемент в нужную колонку
							var this_col = this_wrap.querySelector(col + ':nth-child(' + ++col_i + ')');
								this_col.appendChild(this_element);
							err = 200;
							--el_count;
						});
                    } else {
						if (!(--err)){
							el_count = 0;
							if (callback)
								callback('Разница между индексами приоритетов больше 200');
						}
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
/* =========================================================
 * bootstrap-datepicker.js
 * https://github.com/ArsenBespalov/bootstrap-datapicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Localization: Arsen Bespalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ) {

	// Picker object

	var Datepicker = function(element, options){
		this.element = $(element);
		this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||'mm/dd/yyyy');
		this.picker = $(DPGlobal.template)
							.appendTo('body')
							.on({
								click: $.proxy(this.click, this),
								mousedown: $.proxy(this.mousedown, this)
							});
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on') : false;

		if (this.isInput) {
			this.element.on({
				focus: $.proxy(this.show, this),
				blur: $.proxy(this.hide, this),
				keyup: $.proxy(this.update, this)
			});
		} else {
			if (this.component){
				this.component.on('click', $.proxy(this.show, this));
			} else {
				this.element.on('click', $.proxy(this.show, this));
			}
		}
		this.minViewMode = options.minViewMode||this.element.data('date-minviewmode')||0;
		if (typeof this.minViewMode === 'string') {
			switch (this.minViewMode) {
				case 'months':
					this.minViewMode = 1;
					break;
				case 'years':
					this.minViewMode = 2;
					break;
				default:
					this.minViewMode = 0;
					break;
			}
		}
		this.viewMode = options.viewMode||this.element.data('date-viewmode')||0;
		if (typeof this.viewMode === 'string') {
			switch (this.viewMode) {
				case 'months':
					this.viewMode = 1;
					break;
				case 'years':
					this.viewMode = 2;
					break;
				default:
					this.viewMode = 0;
					break;
			}
		}
		this.language = options.language||this.element.data('date-language')||'en';
		this.startViewMode = this.viewMode;
		this.weekStart = options.weekStart||this.element.data('date-weekstart')||0;
		this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (!this.isInput) {
				$(document).on('mousedown', $.proxy(this.hide, this));
			}
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},

		hide: function(){
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}
			this.set();
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		set: function() {
			var formated = DPGlobal.formatDate(this.date, this.format);
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').prop('value', formated);
				}
				this.element.data('date', formated);
			} else {
				this.element.prop('value', formated);
			}
		},

		setValue: function(newDate) {
			if (typeof newDate === 'string') {
				this.date = DPGlobal.parseDate(newDate, this.format);
			} else {
				this.date = new Date(newDate);
			}
			this.set();
			this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
			this.fill();
		},

		place: function(){
			var offset = this.component ? this.component.offset() : this.element.offset();
			this.picker.css({
				top: offset.top + this.height,
				left: offset.left
			});
		},

		update: function(newDate){
			this.date = DPGlobal.parseDate(
				typeof newDate === 'string' ? newDate : (this.isInput ? this.element.prop('value') : this.element.data('date')),
				this.format
			);
			this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.weekStart;
			var lng = this.language;
			var html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">'+DPGlobal.dates[lng].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '';
			var i = 0;
			var lng = this.language;
			while (i < 12) {
				html += '<span class="month">'+DPGlobal.dates[lng].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').append(html);
		},

		fill: function() {
			var d = new Date(this.viewDate),
				year = d.getFullYear(),
				month = d.getMonth(),
				currentDate = this.date.valueOf();
			var lng = this.language;
			this.picker.find('.datepicker-days th:eq(1)')
						.text(DPGlobal.dates[lng].months[month]+' '+year);
			var prevMonth = new Date(year, month-1, 28,0,0,0,0),
				day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
			prevMonth.setDate(day);
			prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setDate(nextMonth.getDate() + 42);
			nextMonth = nextMonth.valueOf();
			html = [];
			var clsName;
			while(prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getDay() === this.weekStart) {
					html.push('<tr>');
				}
				clsName = '';
				if (prevMonth.getMonth() < month) {
					clsName += ' old';
				} else if (prevMonth.getMonth() > month) {
					clsName += ' new';
				}
				if (prevMonth.valueOf() === currentDate) {
					clsName += ' active';
				}
				html.push('<td class="day'+clsName+'">'+prevMonth.getDate() + '</td>');
				if (prevMonth.getDay() === this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setDate(prevMonth.getDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date.getFullYear();

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear === year) {
				months.eq(this.date.getMonth()).addClass('active');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i === -1 || i === 10 ? ' old' : '')+(currentYear === year ? ' active' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th');
			if (target.length === 1) {
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								this.viewDate['set'+DPGlobal.modes[this.viewMode].navFnc].call(
									this.viewDate,
									this.viewDate['get'+DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate) +
									DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1)
								);
								this.fill();
								this.set();
								break;
						}
						break;
					case 'span':
						if (target.is('.month')) {
							var month = target.parent().find('span').index(target);
							this.viewDate.setMonth(month);
						} else {
							var year = parseInt(target.text(), 10)||0;
							this.viewDate.setFullYear(year);
						}
						if (this.viewMode !== 0) {
							this.date = new Date(this.viewDate);
							this.element.trigger({
								type: 'changeDate',
								date: this.date,
								viewMode: DPGlobal.modes[this.viewMode].clsName
							});
						}
						this.showMode(-1);
						this.fill();
						this.set();
						break;
					case 'td':
						if (target.is('.day')){
							var day = parseInt(target.text(), 10)||1;
							var month = this.viewDate.getMonth();
							if (target.is('.old')) {
								month -= 1;
							} else if (target.is('.new')) {
								month += 1;
							}
							var year = this.viewDate.getFullYear();
							this.date = new Date(year, month, day,0,0,0,0);
							this.viewDate = new Date(year, month, Math.min(28, day),0,0,0,0);
							this.fill();
							this.set();
							this.element.trigger({
								type: 'changeDate',
								date: this.date,
								viewMode: DPGlobal.modes[this.viewMode].clsName
							});
						}
						break;
				}
			}
		},

		mousedown: function(e){
			e.stopPropagation();
			e.preventDefault();
		},

		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
		}
	};

	$.fn.datepicker = function ( option, val ) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data) {
				$this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
			}
			if (typeof option === 'string') data[option](val);
		});
	};

	$.fn.datepicker.defaults = {
	};
	$.fn.datepicker.Constructor = Datepicker;

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		dates:{
			/* Adding other language to this block */
			en:{ // English 100%
				days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			ab:{ // Abkhaz 100%
				days: ["амҽыш", "ашәахь", "аҩаш", "ахаш", "аҧшьаш", "ахәуаш", "асабш", "амҽыш"],
				daysShort: ["амҽ", "ашә", "аҩа", "аха", "аҧш", "ахә", "аса", "амҽ"],
				daysMin: ["ам", "аш", "аҩ", "ах", "аҧ", "ах", "ас", "ам"],
				months: ["ажьырныҳәа", "жәабран", "хәажәкыр", "мшаҧы", "лаҵара", "рашәара", "ҧхынгәы", "нанҳәа", "цәыббра", "жьҭаара", "абҵара", "ҧхынҷкәын"],
				monthsShort: ["ажь", "жәа", "хәа", "мша", "лаҵ", "раш", "ҧхы", "нан", "цәы", "жьҭ", "абҵ", "ҧхы"]
			},
			af:{ // Afrikaans 100%
				days: ["Sondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrydag", "Saterdag", "Sondag"],
				daysShort: ["Son", "Maa", "Din", "Woe", "Don", "Vry", "Sat", "Son"],
				daysMin: ["So", "Ma", "Di", "Wo", "Do", "Vr", "Sa", "So"],
				months: ["januarie", "februarie", "maart", "april", "mei", "junie", "julie", "augustus", "september", "oktober", "november", "desember"],
				monthsShort: ["jan", "feb", "maa", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "des"]
			},
			sq:{ // Albanian !!!! 16%
				days: ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë", "e diel"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			am:{ // Amharic 42%
				days: ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ", "እሑድ"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ጃንዩዌሪ", "ፌብሩወሪ", "ማርች", "ኤፕረል", "መይ", "ጁን", "ጁላይ", "ኦገስት", "ሰፕቴምበር", "ኦክተውበር", "ኖቬምበር", "ዲሴምበር"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			ar:{ // Arabic 42%
				days: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			hy:{ // Armenian 42%
				days: ["կիրակի", "երկուշաբթի", "երեքշաբթի", "չորեքշաբթի", "հինգշաբթի", "ուրբաթ", "շաբաթ", "կիրակի"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["հունվար", "փետրվար", "մարտ", "ապրիլ", "մայիս", "հունիս", "հուլիս", "օգոստոս", "սեպտեմբեր", "հոկտեմբեր", "նոյեմբեր", "դեկտեմբեր"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			az:{ // Azeri !!!! 16%
				days: ["bazar", "bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə", "bazar"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			be:{ // Belarusian 100%
				days: ["нядзеля", "панядзелак", "аўторак", "серада", "чацвер", "пятніца", "субота", "нядзеля"],
				daysShort: ["няд", "пан", "аўт", "сер", "чац", "пят", "суб", "няд"],
				daysMin: ["нд", "пн", "ат", "ср", "чц", "пт", "сб", "нд"],
				months: ["студзень", "люты", "сакавiк", "красавiк", "травень", "чэрвень", "лiпень", "жнiвень", "верасень", "кастрычнiк", "лiстапад", "снежань"],
				monthsShort: ["сту", "лют", "сак", "кра", "тра", "чэр", "лiп", "жнi", "вер", "кас", "лiс", "сне"]
			},
			bn:{ // Bengali 42%
				days: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার", "রবিবার"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টবর", "নভেম্বর", "ডিসেম্বর"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			bs:{ // Bosnian 100%
				days: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota", "nedjelja"],
				daysShort: ["ned", "pon", "uto", "sri", "čet", "pet", "sub", "ned"],
				daysMin: ["nd", "pn", "uo", "si", "čt", "pt", "sb", "nd"],
				months: ["januar", "februar", "mart", "april", "maj", "juni", "juli", "august", "septembar", "oktobar", "novembar", "decembar"],
				monthsShort: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
			},
			bg:{ // Bulgarian 100%
				days: ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота", "неделя"],
				daysShort: ["нед", "пон", "вто", "сря", "чет", "пет", "съб", "нед"],
				daysMin: ["нд", "пн", "вт", "ср", "чт", "пт", "сб", "нд"],
				months: ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември"],
				monthsShort: ["яну", "фев", "мар", "апр", "май", "юни", "юли", "авг", "сеп", "окт", "ное", "дек"]
			},
			my:{ // Burmese 42%
				days: ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ", "တနင်္ဂနွေ"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			ca:{ // Catalan !!!! 16%
				days: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte", "diumenge"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			ce:{ // Chechen 100%
				days: ["кIиранде", "оршот", "шинара", "кхаара", "еара", "пIераска", "шот", "кIиранде"],
				daysShort: ["кIи", "орш", "шин", "кха", "еар", "пIе", "шот", "кIи"],
				daysMin: ["кI", "ор", "ши", "кх", "еа", "пI", "шо", "кI"],
				months: ["гьер", "эхем", "ибне", "нава", "тIул", "къамуг", "чиле", "пахун", "мара", "баскIум", "цIехуьл", "фандукI"],
				monthsShort: ["гье", "эхе", "ибн", "нав", "тIу", "къа", "чил", "пах", "мар", "бас", "цIе", "фан"]
			},
			chr:{ // Cherokee 42%
				days: ["ᎤᎾᏙᏓᏆᏍᎬᎢ", "ᎤᎾᏙᏓᏉᏅᎯ", "ᏔᎵᏁ ᎢᎦ", "ᏦᎢᏁ ᎢᎦ", "ᏅᎩᏁ ᎢᎦ", "ᏧᎾᎩᎶᏍᏗ", "ᎤᎾᏙᏓᏈᏕᎾ", "ᎤᎾᏙᏓᏆᏍᎬᎢ"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ᏚᏃᎸᏔᏂ", "ᎧᎦᎵ", "ᎤᏄᎳᎯ", "ᏥᎶᏂ", "ᎠᏅᎢᏍᎬᏘ", "ᏓᏣᎷᏂ", "ᎫᏰᏉᏂ", "ᎦᎶᏂ", "ᏚᎵᏍᏗ", "ᏚᏂᏅᏗ", "ᏄᏓᏕᏆ", "ᎥᏍᎩᎦ"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			zh:{ // Chinese 100%
				days: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"],
				daysShort: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"],
				daysMin: ["天", "一", "二", "三", "四", "五", "六", "天"],
				months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
				monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
			},
			cr:{ // Cree !!!! 16%
				days: ["ᐊᔦᒥᐅᑭᔨᑲ", "ᐊᓄᑭᐃᑶᑭᑲ", "ᑭᒋᐊᓄᑭᐃᑶᑭᑲ", "ᐊᐱᑕᐘᐣ", "ᑭᒋᐊᐱᑕᐘᐣ", "ᐸᔦᔱᑲᓂᑭᔨᑲ", "ᒪᑎᓇᐅᑶᔨᑲ", "ᐊᔦᒥᐅᑭᔨᑲ"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			hrv:{ // Croatian 100%
				days: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota", "nedjelja"],
				daysShort: ["ned", "pon", "uto", "sri", "čet", "pet", "sub", "ned"],
				daysMin: ["nd", "pn", "ut", "sr", "čt", "pt", "sb", "nd"],
				months: ["siječanj", "veljača", "ožujak", "travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac"],
				monthsShort: ["sij", "vel", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro"]
			},
			cs:{ // Czech 100%
				days: ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota", "neděle"],
				daysShort: ["ned", "pon", "úte", "stř", "čtv", "pát", "sob", "ned"],
				daysMin: ["nd", "pn", "út", "st", "čt", "pt", "sb", "nd"],
				months: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"],
				monthsShort: ["led", "úno", "bře", "dub", "kvě", "čer", "čer", "srp", "zář", "říj", "lis", "pro"]
			},
			da:{ // Danish 100%
				days: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"],
				daysShort: ["søn", "man", "tir", "ons", "tor", "fre", "lør", "søn"],
				daysMin: ["sø", "ma", "ti", "on", "to", "fr", "lø", "sø"],
				months: ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"],
				monthsShort: ["jan", "feb", "mar", "fpr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
			},
			nl:{ // Dutch 100%
				days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"],
				daysShort: ["zon", "maa", "din", "woe", "don", "vri", "zat", "zon"],
				daysMin: ["zo", "ma", "di", "wo", "do", "vr", "za", "zo"],
				months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
				monthsShort: ["jan", "feb", "maa", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
			},
			eo:{ // Esperanto 100%
				days: ["dimanĉo", "lundo", "mardo", "merkredo", "ĵaŭdo", "vendredo", "sabato", "dimanĉo"],
				daysShort: ["dim", "lun", "mar", "mer", "ĵaŭ", "ven", "sab", "dim"],
				daysMin: ["di", "lu", "ma", "me", "ĵa", "ve", "sa", "di"],
				months: ["januaro", "februaro", "marto", "aprilo", "majo", "junio", "julio", "aŭgusto", "septembro", "oktobro", "novembro", "decembro"],
				monthsShort: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aŭg", "sep", "okt", "nov", "dec"]
			},
			et:{ // Estonian 100%
				days: ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev", "pühapäev"],
				daysShort: ["püh", "esm", "tei", "kol", "nel", "ree", "lau", "püh"],
				daysMin: ["pü", "es", "te", "ko", "ne", "re", "la", "pü"],
				months: ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"],
				monthsShort: ["jaa", "vee", "mär", "apr", "mai", "juu", "juu", "aug", "sep", "okt", "nov", "det"]
			},
			fo:{ // Faroese 100%
				days: ["sunnudagur", "mánadagur", "týsdagur", "mikudagur", "hósdagur", "fríggjadagur", "leygardagur", "sunnudagur"],
				daysShort: ["sun", "mán", "týs", "mik", "hós", "frí", "ley", "sun"],
				daysMin: ["su", "má", "tý", "mi", "hó", "fr", "le", "su"],
				months: ["januar", "februar", "mars", "apríl", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
				monthsShort: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"]
			},
			fi:{ // Finnish 100%
				days: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai", "sunnuntai"],
				daysShort: ["sun", "maa", "tii", "kes", "tor", "per", "lau", "sun"],
				daysMin: ["su", "ma", "ti", "ke", "to", "pe", "la", "su"],
				months: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
				monthsShort: ["tam", "hel", "maa", "huh", "tou", "kes", "hei", "elo", "syy", "lok", "mar", "jou"]
			},
			fr:{ // French 100%
				days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
				daysShort: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam", "dim"],
				daysMin: ["di", "le", "ma", "me", "je", "ve", "sa", "di"],
				months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
				monthsShort: ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"]
			},
			gl:{ // Galician 100%
				days: ["domingo", "luns", "martes", "mércores", "xoves", "venres", "sábado", "domingo"],
				daysShort: ["dom", "lun", "mar", "mér", "xov", "ven", "sáb", "dom"],
				daysMin: ["do", "lu", "ma", "mé", "xo", "ve", "sá", "do"],
				months: ["xaneiro", "febreiro", "marzo", "abril", "maio", "xuño", "xullo", "agosto", "setembro", "outubro", "novembro", "decembro"],
				monthsShort: ["xan", "feb", "mar", "abr", "mai", "xuñ", "xul", "ago", "set", "out", "nov", "dec"]
			},
			ka:{ // Georgian 42%
				days: ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი", "კვირა"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			de:{ // German 100%
				days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Sonnabend", "Sonntag"],
				daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"],
				daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
				months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
				monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
			},
			el:{ // Greek 100%
				days: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο", "Κυριακή"],
				daysShort: ["Κυρ", "Δευ", "Τρί", "Τετ", "Πέμ", "Παρ", "Σάβ", "Κυρ"],
				daysMin: ["Κυ", "Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά", "Κυ"],
				months: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
				monthsShort: ["Ιαν", "Φεβ", "Μάρ", "Απρ", "Μάι", "Ιον", "Ιολ", "Αύγ", "Σεπ", "Οκτ", "Νοέ", "Δεκ"]
			},
			ht:{ // Haitian Creole 100%
				days: ["dimanch", "lendi", "madi", "mèkredi", "jedi", "vandredi", "samdi", "dimanch"],
				daysShort: ["dim", "len", "mad", "mèk", "jed", "van", "sam", "dim"],
				daysMin: ["di", "le", "ma", "mè", "je", "va", "sa", "di"],
				months: ["janvye", "fevriye", "mas", "avril", "me", "jen", "jiyè", "out", "septanm", "oktòb", "novanm", "desanm"],
				monthsShort: ["jan", "fev", "mas", "avr", "me", "jen", "jiy", "out", "sep", "okt", "nov", "des"]
			},
			haw:{ // Hawaiian 67%
				days: ["Lāpule", "Pōʻakahi", "Pōʻalua", "Pōʻakolu", "Pōʻahā", "Pōʻalima", "Pōʻaono", "Lāpule"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["Ianuali", "Pepeluali", "Malaki", "ʻApelila", "Mei", "Iune", "Iulai", "ʻAukake", "Kepakemapa", "ʻOkakopa", "Nowemapa", "Kēkēmapa"],
				monthsShort: ["Ian", "Pep", "Mal", "Ape", "Mei", "Iun", "Iul", "Auk", "Kep", "Oka", "Now", "Kēk"]
			},
			he:{ // Hebrew 42%
				days: ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת", "יום ראשון"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			hi:{ // Hindi 42%
				days: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरूवार", "शुक्रवार", "शनिवार", "रविवार"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			hu:{ // Hungarian 100%
				days: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"],
				daysShort: ["vas", "hét", "ked", "sze", "csü", "pén", "szo", "vas"],
				daysMin: ["va", "hé", "ke", "sz", "cs", "pé", "sz", "va"],
				months: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
				monthsShort: ["jan", "feb", "már", "ápr", "máj", "jún", "júl", "aug", "sze", "okt", "nov", "dec"]
			},
			is:{ // Icelandic 100%
				days: ["sunnudagur", "mánudagur", "þriðjudagur", "miðvikudagur", "fimmtudagur", "föstudagur", "laugardagur", "sunnudagur"],
				daysShort: ["sun", "mán", "þri", "mið", "fim", "fös", "lau", "sun"],
				daysMin: ["su", "má", "þr", "mi", "fi", "fö", "la", "su"],
				months: ["janúar", "febrúar", "mars", "apríl", "maí", "júní", "júlí", "ágúst", "september", "október", "nóvember", "desember"],
				monthsShort: ["jan", "feb", "mar", "apr", "maí", "jún", "júl", "ágú", "sep", "okt", "nóv", "des"]
			},
			io:{ // Ido !!!! 16%
				days: ["sundio", "lundio", "mardio", "merkurdio", "jovdio", "venerdio", "saturdio", "sundio"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			id:{ // Indonesian 83%
				days: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"],
				daysShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Aha"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["bulan Januari", "bulan Februari", "bulan Maret", "bulan April", "bulan Mei", "bulan Juni", "bulan Juli", "bulan Agustus", "bulan September", "bulan Oktober", "bulan November", "bulan Desember"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
			},
			ia:{ // Interlingua !!!! 50%
				days: ["dominica", "lunedi", "martedi", "mercuridi", "jovedi", "venerdi", "sabbato", "dominica"],
				daysShort: ["dom", "lun", "mar", "mer", "jov", "ven", "sab", "dom"],
				daysMin: ["do", "lu", "ma", "me", "jo", "ve", "sa", "do"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			ga:{ // Irish 100%
				days: ["Domhnach", "Luan", "Máirt", "Céadaoin", "Déardaoin", "Aoine", "Satharn", "Domhnach"],
				daysShort: ["Dom", "Lua", "Mái", "Céa", "Déa", "Aoi", "Sat", "Dom"],
				daysMin: ["Do", "Lu", "Má", "Cé", "Dé", "Ao", "Sa", "Do"],
				months: ["Eanáir", "Feabhra", "Márta", "Aibreán", "Bealtaine", "Meitheamh", "Iúil", "Lúnasa", "Meán Fómhair", "Deireadh Fómhair", "Samhain", "Mí na Nollag"],
				monthsShort: ["Ean", "Fea", "Már", "Aib", "Bea", "Mei", "Iúi", "Lún", "Meá", "Dei", "Sam", "Mí"]
			},
			it:{ // Italian 100%
				days: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"],
				daysShort: ["dom", "lun", "mar", "mer", "gio", "ven", "sab", "dom"],
				daysMin: ["do", "lu", "ma", "me", "gi", "ve", "sa", "do"],
				months: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
				monthsShort: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"]
			},
			ja:{ // Japanese 100%
				days: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"],
				daysShort: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"],
				daysMin: ["日", "月", "火", "水", "木", "金", "土", "日"],
				months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
				monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
			},
			roa:{ // Jèrriais !!!! 50%
				days: ["Dînmanche", "Lundi", "Mardi", "Mêcrédi", "Jeudi", "Vendrédi", "Sanm'di", "Dînmanche"],
				daysShort: ["Dîn", "Lun", "Mar", "Mêc", "Jeu", "Ven", "San", "Dîn"],
				daysMin: ["Dî", "Lu", "Ma", "Mê", "Je", "Ve", "Sa", "Dî"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			krl:{ // Karelian !!!! 33%
				days: ["ööpä", "maööpä", "toisarki", "kolmasarki", "nelläspäivä", "piätniččä", "suovatta", "ööpä"],
				daysShort: ["ööp", "maö", "toi", "kol", "nel", "piä", "suo", "ööp"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			kk:{ // Kazakh !!!! 33%
				days: ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі", "жексенбі"],
				daysShort: ["жек", "дүй", "сей", "сәр", "бей", "жұм", "сен", "жек"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			km:{ // Khmer 67%
				days: ["ថ្ងៃអាទិត្យ", "ថ្ងៃច័ន្ទ", "ថ្ងៃអង្គារ", "ថ្ងៃពុធ", "ថ្ងៃព្រហស្បតិ៍", "ថ្ងៃសុក្រ", "ថ្ងៃសៅរ៏", "ថ្ងៃអាទិត្យ"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
				monthsShort: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"]
			},
			ko:{ // Korean 100%
				days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
				daysShort: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
				daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
				months: ["일월", "이월", "삼월", "사월", "오월", "유월", "칠월", "팔월", "구월", "시월", "십일월", "십이월"],
				monthsShort: ["일월", "이월", "삼월", "사월", "오월", "유월", "칠월", "팔월", "구월", "시월", "십일월", "십이월"]
			},
			ky:{ // Kyrgyz !!!!  33%
				days: ["жекшемби", "дүйшөмбү", "шейшемби", "шаршемби", "бейшемби", "жума", "ишемби", "жекшемби"],
				daysShort: ["жек", "дүй", "шей", "шар", "бей", "жум", "ише", "жек"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			lo:{ // Lao 42%
				days: ["ວັນອາທິດ", "ວັນຈັນ", "ວັນອັງຄານ", "ວັນພຸດ", "ວັນພະຫັດ", "ວັນສຸກ", "ວັນເສົາ", "ວັນອາທິດ"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ມັງກອນ", "ກຸມພາ", "ມີນາ", "ເມສາ", "ພຶດສະພາ", "ມີຖຸນາ", "ກໍລະກົດ", "ສິງຫາ", "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			la:{ // Latin 100%
				days: ["dīēs Sōlis", "dīēs Lūnae", "dīēs Mārtis", "dīēs Mercuriī", "dīēs Iovis", "dīēs Veneris", "dīēs Saturnī", "dīēs Sōlis"],
				daysShort: ["Sōl", "Lūn", "Mār", "Mer", "Iov", "Ven", "Sat", "Sōl"],
				daysMin: ["Sō", "Lū", "Mā", "Me", "Io", "Ve", "Sa", "Sō"],
				months: ["iānuārius", "februārius", "mārtius", "aprīlis", "māius", "iūnius", "iūlius", "augustus", "september", "octōber", "november", "december"],
				monthsShort: ["iān", "feb", "mār", "apr", "māi", "iūn", "iūl", "aug", "sep", "oct", "nov", "dec"]
			},
			lv:{ // Latvian 100%
				days: ["svētdiena", "pirmdiena", "otrdiena", "trešdiena", "ceturtdiena", "piektdiena", "sestdiena", "svētdiena"],
				daysShort: ["svē", "pir", "otr", "tre", "cet", "pie", "ses", "svē"],
				daysMin: ["sv", "pi", "ot", "tr", "ce", "pi", "se", "sv"],
				months: ["janvāris", "februāris", "marts", "aprīlis", "maijs", "jūnijs", "jūlijs", "augusts", "septembris", "oktobris", "novembris", "decembris"],
				monthsShort: ["jan", "feb", "mar", "apr", "mai", "jūn", "jūl", "aug", "sep", "okt", "nov", "dec"]
			},
			lez:{ // Lezgi 100%
				days: ["гьяд", "ислен", "саласа", "арбе", "хемис", "жумя", "киш", "гьяд"],
				daysShort: ["гья", "исл", "сал", "арб", "хем", "жум", "киш", "гья"],
				daysMin: ["гд", "ис", "сл", "ар", "хм", "жм", "кш", "гд"],
				months: ["гьер", "эхем", "ибне", "нава", "тӀул", "къамуг", "чиле", "пахун", "мара", "баскIум", "цIехуьл", "фандукI"],
				monthsShort: ["гье", "эхе", "ибн", "нав", "тӀу", "къа", "чил", "пах", "мар", "бас", "цIе", "фан"]
			},
			lt:{ // Lithuanian !!!! 50%
				days: ["sekmadienis", "pirmadienis", "antradienis", "trečiadienis", "ketvirtadienis", "penktadienis", "šeštadienis", "sekmadienis"],
				daysShort: ["sek", "pir", "ant", "tre", "ket", "pen", "šeš", "sek"],
				daysMin: ["se", "pi", "an", "tr", "ke", "pe", "še", "se"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			liv:{ // Livonian !!!! 50%
				days: ["pivāpǟva", "ežžõmpǟva", "tuoiznapǟva", "kuolmõndpǟva", "neļļõndpǟva", "brēćig", "pūolpǟva", "pivāpǟva"],
				daysShort: ["piv", "ežž", "tuo", "kuo", "neļ", "brē", "pūo", "piv"],
				daysMin: ["pi", "ež", "tu", "ku", "ne", "br", "pū", "pi"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			jbo:{ // Lojban !!!! 50%
				days: ["nondei", "pavdei", "reldei", "cibdei", "vondei", "mumdei", "xavdei", "zeldei"],
				daysShort: ["non", "pav", "rel", "cib", "von", "mum", "xav", "zel"],
				daysMin: ["no", "pa", "re", "ci", "vo", "mu", "xa", "ze"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			lb:{ // Luxembourgish 100%
				days: ["Sonndeg", "Méindeg", "Dënschdeg", "Mëttwoch", "Donneschdeg", "Freideg", "Samschdeg", "Sonndeg"],
				daysShort: ["Son", "Méi", "Dën", "Mët", "Don", "Fre", "Sam", "Son"],
				daysMin: ["So", "Mé", "Dë", "Më", "Do", "Fr", "Sa", "So"],
				months: ["Januar", "Februar", "Mäerz", "Abrëll", "Mee", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
				monthsShort: ["Jan", "Feb", "Mäe", "Abr", "Mee", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
			},
			mk:{ // Macedonian 100%
				days: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота", "недела"],
				daysShort: ["нед", "пон", "вто", "сре", "чет", "пет", "саб", "нед"],
				daysMin: ["нд", "пн", "вт", "ср", "чт", "пт", "сб", "нд"],
				months: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
				monthsShort: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"]
			},
			ms:{ // Malay 100%
				days: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu", "Minggu"],
				daysShort: ["Aha", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Min"],
				daysMin: ["Ah", "Is", "Se", "Ra", "Kh", "Ju", "Sa", "Mi"],
				months: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"],
				monthsShort: ["Jan", "Feb", "Mac", "Apr", "Mai", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"]
			},
			ml:{ // Malayalam 42%
				days: ["ഞായര്", "തിങ്കള്", "ചൊവ്വ", "ബുധന്", "വ്യാഴം", "വെള്ളി", "ശനി", "ഞായര്"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ജനുവരി", "ഫെബ്രുവരി", "മാര്ച്ച്", "ഏപ്രില്", "മേയ്", "ജൂണ്", "ജൂലൈ", "ആഗസ്റ്റ്", "സെപ്റ്റംബര്", "ഒക്ടോബര്", "നവംബര്", "ഡിസംബര്"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			mt:{ // Maltese !!!! 33%
				days: ["il-Ħadd", "it-Tnejn", "it-Tlieta", "l-Erbgħa", "il-Ħamis", "il-Ġimgħa", "is-Sibt", "il-Ħadd"],
				daysShort: ["Ħad", "Tne", "Tli", "Erb", "Ħam", "Ġim", "Sib", "Ħad"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			mn:{ // Mongolian !!!! 50%
				days: ["ням", "даваа", "мягмар", "лхагва", "пүрэв", "баасан", "бямба", "ням"],
				daysShort: ["ням", "дав", "мяг", "лха", "пүр", "баа", "бям", "ням"],
				daysMin: ["нм", "дв", "мг", "лх", "пр", "ба", "бм", "нм"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			nv:{ // Navajo 42%
				days: ["Damóo", "Damóo Biiskání", "Naakijį́ Ndaʼanish", "Tágíjį́ Ndaʼanish", "Dį́ʼíjį́ Ndaʼanish", "Ndaʼiiníísh", "Yiską́ Damóo", "Damóo"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["Yas Niłtʼees", "Atsá Biyáázh", "Wóózhchʼį́į́d", "Tʼą́ą́chil", "Tʼą́ą́tsoh", "Yaʼiishjááshchilí", "Yaʼiishjáástsoh", "Biniʼantʼą́ą́tsʼózí", "Biniʼantʼą́ą́tsoh", "Ghąąjįʼ", "Níłchʼitsʼósí", "Níłchʼitsoh"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			no:{ // Norwegian (Bokmål) 100%
				days: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"],
				daysShort: ["søn", "man", "tir", "ons", "tor", "fre", "lør", "søn"],
				daysMin: ["sø", "ma", "ti", "on", "to", "fr", "lø", "sø"],
				months: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
				monthsShort: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"]
			},
			nob:{ // Norwegian (Bokmål) 100%
				days: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"],
				daysShort: ["søn", "man", "tir", "ons", "tor", "fre", "lør", "søn"],
				daysMin: ["sø", "ma", "ti", "on", "to", "fr", "lø", "sø"],
				months: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
				monthsShort: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"]
			},
			nmo:{ // Norwegian (Nynorsk) 100%
				days: ["sundag", "måndag", "tysdag", "onsdag", "torsdag", "fredag", "laurdag", "sundag"],
				daysShort: ["sun", "mån", "tys", "ons", "tor", "fre", "lau", "sun"],
				daysMin: ["su", "må", "ty", "on", "to", "fr", "la", "su"],
				months: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
				monthsShort: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"]
			},
			nov:{ // Novial !!!! 50%
				days: ["sundie", "lundie", "mardie", "merkurdie", "jodie", "venerdie", "saturdie", "sundie"],
				daysShort: ["sun", "lun", "mar", "mer", "jod", "ven", "sat", "sun"],
				daysMin: ["su", "lu", "ma", "me", "jo", "ve", "sa", "su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			oj:{ // Ojibwe 42%
				days: ["anami'egiizhigad", "ishkwaa-anami'egiizhigad", "niizhogiizhigad", "aabitoose", "niiyogiizhigad", "naanogiizhigad", "ishkwaajanokii-giizhigad", "anami'egiizhigad"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["gichi-manidoo-giizis", "namebini-giizis", "onaabani-giizis", "iskigamizige-giizis", "zaagibagaa-giizis", "ode'imini-giizis", "aabita-niibino-giizis", "manoominike-giizis", "waatebagaa-giizis", "binaakwe-giizis", "gashkadino-giizis", "manidoo-giizisoons"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			ang:{ // Old English 75%
				days: ["sunnandæġ", "mōnandæġ", "Tīwesdæġ", "Wōdnesdæġ", "Þunresdæġ", "Frīġedæġ", "Sæterndæġ", "sunnandæġ"],
				daysShort: ["sun", "mōn", "Tīw", "Wōd", "Þun", "Frī", "Sæt", "sun"],
				daysMin: ["su", "mō", "Tī", "Wō", "Þu", "Fr", "Sæ", "su"],
				months: ["se æfterra ġēola", "solmōnaþ", "hreþmōnaþ", "ēastermōnaþ", "þrimilce", "se ǣrra līþa", "se æfterra līþa", "wēodmōnaþ", "hærfestmōnaþ", "winterfylleþ", "blōtmōnaþ", "se ǣrra ġēola"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			prg:{ // Old Prussian 100%
				days: ["nadīli", "panadīli", "wisasīdis", "pussisawaiti", "ketwirtiks", "pēntniks", "sabbatika", "nadīli"],
				daysShort: ["nad", "pan", "wis", "pus", "ket", "pēn", "sab", "nad"],
				daysMin: ["na", "pa", "wi", "pu", "ke", "pē", "sa", "na"],
				months: ["Janwārs", "Februārs", "Mārts", "Aprīls", "Maījs", "Jūnijs", "Jūlijs", "August", "Septēmberis", "Uktōberijs", "Nuwēmberis", "Decēmberis"],
				monthsShort: ["Jan", "Feb", "Mār", "Apr", "Maī", "Jūn", "Jūl", "Aug", "Sep", "Ukt", "Nuw", "Dec"]
			},
			os:{ // Ossetian (Digor dialect) !!!! 50%
				days: ["авдисæр", "косгифиццагбон", "æртиккæг", "цуппæрæн", "майрæнбон", "сабат", "хуцаубон", "авдисæр"],
				daysShort: ["авд", "кос", "æрт", "цуп", "май", "саб", "хуц", "авд"],
				daysMin: ["aв", "кс", "æр", "цп", "ма", "сб", "хц", "ав"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			osd:{ // Ossetian (Digor dialect) !!!! 50%
				days: ["авдисæр", "косгифиццагбон", "æртиккæг", "цуппæрæн", "майрæнбон", "сабат", "хуцаубон", "авдисæр"],
				daysShort: ["авд", "кос", "æрт", "цуп", "май", "саб", "хуц", "авд"],
				daysMin: ["aв", "кс", "æр", "цп", "ма", "сб", "хц", "ав"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			osi:{ // Ossetian (Iron dialect) !!!! 17%
				days: ["къуырисæр", "дыццæг", "æртыццæг", "цыппæрæм", "майрæмбон", "сабат", "хуыцаубон", "къуырисæр"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			fa:{ // Persian !!!! 17%
				days: ["یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "آدینه", "شنبه", "یک‌شنبه"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			pl:{ // Polish 100%
				days: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"],
				daysShort: ["nie", "pon", "wto", "śro", "czw", "pią", "sob", "nie"],
				daysMin: ["ni", "po", "wt", "śr", "cz", "pi", "so", "ni"],
				months: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"],
				monthsShort: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"]
			},
			pt:{ // Portuguese 100%
				days: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"],
				daysShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb", "dom"],
				daysMin: ["dm", "sg", "tr", "qa", "qi", "sx", "sb", "dm"],
				months: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
				monthsShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
			},
			ro:{ // Romanian 100%
				days: ["duminică", "luni", "marţi", "miercuri", "joi", "vineri", "sâmbătă", "duminică"],
				daysShort: ["dum", "lun", "mar", "mie", "joi", "vin", "sâm", "dum"],
				daysMin: ["du", "lu", "ma", "mi", "jo", "vi", "sâ", "du"],
				months: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
				monthsShort: ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "noi", "dec"]
			},
			ru:{ // Russian 100%
				days: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"],
				daysShort: ["вос", "пон", "вто", "сре", "чет", "пят", "суб", "вос"],
				daysMin: ["вс", "пн", "вт", "ср", "чт", "пт", "сб", "вс"],
				months: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
				monthsShort: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
			},
			sco:{ // Scots !!!! 50%
				days: ["Sunday", "Monday", "Tuesday", "Wadnesday", "Thursday", "Friday", "Seturday", "Sunday"],
				daysShort: ["Sun", "Mon", "Tue", "Wad", "Thu", "Fri", "Set", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "Wa", "Th", "Fr", "Se", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			si:{ // Sinhalese 42%
				days: ["ඉරිදා", "සඳුදා", "අඟහරුවාදා", "බදාදා", "බ්‍රහස්පතින්දා", "සිකුරාදා", "සෙනසුරාදා", "ඉරිදා"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ජනවාරි", "පෙබරවාරි", "මාර්‍තු", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝස්‍තු", "සැප්‍තැම්‍බර්", "ඔක්‍තෝබර්", "නොවැම්‍බර්", "දෙසැම්‍බර්"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			sk:{ // Slovak 100%
				days: ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota", "nedeľa"],
				daysShort: ["ned", "pon", "uto", "str", "štv", "pia", "sob", "ned"],
				daysMin: ["ne", "po", "ut", "st", "št", "pi", "so", "ne"],
				months: ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"],
				monthsShort: ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec"]
			},
			sl:{ // Slovene (Slovenian) 75%
				days: ["nedelja", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota", "nedelja"],
				daysShort: ["ned", "pon", "tor", "sre", "čet", "pet", "sob", "ned"],
				daysMin: ["ne", "po", "to", "sr", "če", "pe", "so", "ne"],
				months: ["prosinec", "svečan", "sušec", "mali traven", "veliki traven", "rožnik", "mali srpan", "veliki srpan", "kimovec", "vinotok", "listopad", "gruden"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			sr:{ // Serbian 100%
				days: ["недеља", "понедељак", "уторак", "среда", "четвртак", "петак", "субота", "недеља"],
				daysShort: ["нед", "пон", "уто", "сре", "чет", "пет", "суб", "нед"],
				daysMin: ["нд", "пн", "ут", "ср", "чт", "пт", "сб", "нд"],
				months: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"],
				monthsShort: ["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец"]
			},
			es:{ // Spanish 100%
				days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"],
				daysShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb", "dom"],
				daysMin: ["do", "lu", "ma", "mi", "ju", "vi", "sá", "do"],
				months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
				monthsShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
			},
			sv:{ // Swedish 100%
				days: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"],
				daysShort: ["sön", "mån", "tis", "ons", "tor", "fre", "lör", "sön"],
				daysMin: ["sö", "må", "ti", "on", "to", "fr", "lö", "sö"],
				months: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
				monthsShort: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
			},
			tl:{ // Tagalog 100%
				days: ["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado", "Linggo"],
				daysShort: ["Lin", "Lun", "Mar", "Miy", "Huw", "Biy", "Sab", "Lin"],
				daysMin: ["Li", "Lu", "Ma", "Mi", "Hu", "Bi", "Sa", "Li"],
				months: ["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre"],
				monthsShort: ["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"]
			},
			tg:{ // Tajik !!!! 50%
				days: ["якшанбе", "душанбе", "сешанбе", "чаҳоршанбе", "панҷшанбе", "ҷумъа", "шанбе", "якшанбе"],
				daysShort: ["якш", "душ", "сеш", "чаҳ", "пан", "ҷум", "шан", "якш"],
				daysMin: ["як", "дш", "сш", "чҳ", "пн", "ҷм", "шн", "як"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			ta:{ // Tamil 42%
				days: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி", "ஞாயிறு"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ஜனவரி", "பெப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			tt:{ // Tatar 100%
				days: ["yäkşämbe", "düşämbe", "sişämbe", "çärşämbe", "pänceşämbe", "comğa", "şimbä", "yäkşämbe"],
				daysShort: ["yäk", "düş", "siş", "çär", "pän", "com", "şim", "yäk"],
				daysMin: ["yk", "dş", "sş", "çr", "pn", "cm", "şm", "yk"],
				months: ["ğínwar", "febräl", "mart", "äpril", "may", "yün", "yül", "august", "sentäber", "öktäber", "nöyäber", "dekäber"],
				monthsShort: ["ğín", "feb", "mar", "äpr", "may", "yün", "yül", "aug", "sen", "ökt", "nöy", "dek"]
			},
			te:{ // Telugu 42%
				days: ["ఆదివారం", "సోమవారము", "మంగళవారము", "బుధవారము", "గురువారము", "శుక్రవారము", "శనివారం", "ఆదివారం"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగష్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			th:{ // Thai 42%
				days: ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัส", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "กันยายน", "พฤศจิกายน", "ธันวาคม"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			tpi:{ // Tok Pisin !!!! 50%
				days: ["Sande", "Mande", "Tunde", "Trinde", "Fonde", "Fraide", "Sarere", "Sande"],
				daysShort: ["San", "Man", "Tun", "Tri", "Fon", "Fra", "Sar", "San"],
				daysMin: ["Sa", "Ma", "Tu", "Tr", "Fo", "Fr", "Sr", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			tr:{ // Turkish 67%
				days: ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi", "pazar"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"],
				monthsShort: ["oca", "şub", "mar", "nis", "may", "haz", "tem", "ağu", "eyl", "eki", "kas", "ara"]
			},
			tk:{ // Turkmen !!!! 50%
				days: ["ýekşenbe", "duşenbe", "sişenbe", "çarşenbe", "penşenbe", "anna", "şenbe", "ýekşenbe"],
				daysShort: ["ýek", "duş", "siş", "çar", "pen", "ann", "şen", "ýek"],
				daysMin: ["ýk", "dş", "sş", "çr", "pn", "an", "şn", "ýk"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			uk:{ // Ukrainian 100%
				days: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п'ятниця", "субота", "неділя"],
				daysShort: ["нед", "пон", "вів", "сер", "чет", "п'я", "суб", "нед"],
				daysMin: ["нд", "пн", "вв", "ср", "чт", "пт", "сб", "нд"],
				months: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"],
				monthsShort: ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"]
			},
			ur:{ // Urdu !!!! 17%
				days: ["اتوار", "پیر", "منگل", "پدھ", "جمعرات", "جمعہ", "ہفتہ", "اتوار"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			uz:{ // Uzbek !!!! 50%
				days: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba", "yakshanba"],
				daysShort: ["yak", "dus", "ses", "cho", "pay", "jum", "sha", "yak"],
				daysMin: ["yk", "ds", "ss", "ch", "py", "jm", "sh", "yk"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			vi:{ // Vietnamese 42%
				days: ["chủ nhật", "thứ hai", "thứ ba", "thứ tư", "thứ năm", "thứ sáu", "thứ bảy", "chủ nhật"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["tháng một", "tháng hai", "tháng ba", "tháng tư", "tháng năm", "tháng sáu", "tháng bảy", "tháng tám", "tháng chín", "tháng mười", "tháng mười một", "tháng mười hai"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			vo:{ // Volapük !!!! 50%
				days: ["sudel", "mudel", "tudel", "vedel", "dödel", "fridel", "zädel", "sudel"],
				daysShort: ["sud", "mud", "tud", "ved", "död", "fri", "zäd", "sud"],
				daysMin: ["sd", "md", "td", "vd", "dd", "fr", "zd", "sd"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			wa:{ // Walloon 100%
				days: ["dimegne", "londi", "mårdi", "mierkidi", "djudi", "vénrdi", "semdi", "dimegne"],
				daysShort: ["dim", "lon", "mår", "mie", "dju", "vén", "sem", "dim"],
				daysMin: ["di", "lo", "må", "mi", "dj", "vé", "se", "di"],
				months: ["djanvî", "fevrî", "måss", "avri", "may", "djun", "djulete", "awousse", "setimbe", "octôbe", "nôvimbe", "decimbe"],
				monthsShort: ["dja", "fev", "mås", "avr", "may", "dju", "dju", "awo", "set", "oct", "nôv", "dec"]
			},
			cy:{ // Welsh 100%
				days: ["Sul", "Llun", "Mawrth", "Mercher", "Iau", "Gwener", "Sadwrn", "Sul"],
				daysShort: ["Sul", "Llu", "Maw", "Mer", "Iau", "Gwe", "Sad", "Sul"],
				daysMin: ["Su", "Ll", "Ma", "Me", "Ia", "Gw", "Sa", "Su"],
				months: ["Ionawr", "Chwefror", "Mawrth", "Ebrill", "Mai", "Mehefin", "Gorffennaf", "Awst", "Medi", "Hydref", "Tachwedd", "Rhagfyr"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			fy:{ // West Frisian 42%
				days: ["snein", "moandei", "tiisdei", "woansdei", "tongersdei", "freed", "sneon", "snein"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["jannewaris", "febrewaris", "maart", "april", "maaie", "juny", "july", "augustus", "septimber", "oktober", "novimber", "desimber"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			yi:{ // Yiddish 42%
				days: ["זונטיק", "מאָנטיק", "דינסטיק", "מיטוואָך", "דאָנערשטיק", "פֿרײַטיק", "שבת", "זונטיק"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["יאנואר", "פעברואר", "מארץ", "אפריל", "מײַ", "יוני", "יולי", "אויגוסט", "סעפטעמבער", "אקטאבער", "נאוועמבער", "דעצעמבער"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			esu:{ // Yup'ik 75%
				days: ["Agayuneq", "Pekyun", "Aipirin", "Pingayirin", "Cetamirin", "Tallimirin", "Maqineq", "Agayuneq"],
				daysShort: ["Aga", "Pek", "Aip", "Pin", "Cet", "Tal", "Maq", "Aga"],
				daysMin: ["Ag", "Pe", "Ai", "Pi", "Ce", "Ta", "Ma", "Ag"],
				months: ["Kanruyauciq", "Kep'nerciq", "Tengmiirviguaq", "Tengmiirvik", "Qusiirvik", "Kaugun", "Ingun", "Amirairun", "Amiraayaaq", "Nulirun", "Cauyarvik", "Uivik"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			}
		},
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		parseFormat: function(format){
			var separator = format.match(/[.\/\-\s].*?/),
				parts = format.split(/\W+/);
			if (!separator || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separator: separator, parts: parts};
		},
		parseDate: function(date, format) {
			var parts = date.split(format.separator),
				date = new Date(),
				val;
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			if (parts.length === format.parts.length) {
				for (var i=0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10)||1;
					switch(format.parts[i]) {
						case 'dd':
						case 'd':
							date.setDate(val);
							break;
						case 'mm':
						case 'm':
							date.setMonth(val - 1);
							break;
						case 'yy':
							date.setFullYear(2000 + val);
							break;
						case 'yyyy':
							date.setFullYear(val);
							break;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format){
			var val = {
				d: date.getDate(),
				m: date.getMonth() + 1,
				yy: date.getFullYear().toString().substring(2),
				yyyy: date.getFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			var date = [];
			for (var i=0, cnt = format.parts.length; i < cnt; i++) {
				date.push(val[format.parts[i]]);
			}
			return date.join(format.separator);
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev">&lsaquo;</th>'+
								'<th colspan="5" class="switch"></th>'+
								'<th class="next">&rsaquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
	};
	DPGlobal.template = '<div class="datepicker dropdown-menu">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
								'</table>'+
							'</div>'+
						'</div>';

}( window.jQuery )

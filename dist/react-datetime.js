/*
react-datetime v2.6.0
https://github.com/arqex/react-datetime
MIT: https://github.com/arqex/react-datetime/raw/master/LICENSE
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("moment"), require("ReactDOM"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "moment", "ReactDOM"], factory);
	else if(typeof exports === 'object')
		exports["Datetime"] = factory(require("React"), require("moment"), require("ReactDOM"));
	else
		root["Datetime"] = factory(root["React"], root["moment"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_9__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(1),
		React = __webpack_require__(2),
		DaysView = __webpack_require__(3),
		MonthsView = __webpack_require__(5),
		YearsView = __webpack_require__(6),
		TimeView = __webpack_require__(7),
		moment = __webpack_require__(4)
	;

	var TYPES = React.PropTypes;
	var Datetime = React.createClass({
		mixins: [
			__webpack_require__(8)
		],
		viewComponents: {
			days: DaysView,
			months: MonthsView,
			years: YearsView,
			time: TimeView
		},
		propTypes: {
			// value: TYPES.object | TYPES.string,
			// defaultValue: TYPES.object | TYPES.string,
			onFocus: TYPES.func,
			onBlur: TYPES.func,
			onChange: TYPES.func,
			onViewChange: TYPES.func,
			locale: TYPES.string,
			input: TYPES.bool,
			// dateFormat: TYPES.string | TYPES.bool,
			// timeFormat: TYPES.string | TYPES.bool,
			inputProps: TYPES.object,
			timeConstraints: TYPES.object,
			viewMode: TYPES.oneOf(['years', 'months', 'days', 'time']),
			currentView: TYPES.oneOf(['years', 'months', 'days', 'time']),
			isValidDate: TYPES.func,
			open: TYPES.bool,
			strictParsing: TYPES.bool,
			closeOnSelect: TYPES.bool,
			closeOnTab: TYPES.bool
		},

		getDefaultProps: function() {
			var nof = function(){};
			return {
				className: '',
				defaultValue: '',
				inputProps: {},
				input: true,
				onFocus: nof,
				onBlur: nof,
				onChange: nof,
				onViewChange: nof,
				timeFormat: true,
				timeConstraints: {},
				dateFormat: true,
				strictParsing: true,
				closeOnSelect: false,
				closeOnTab: true
			};
		},

		getInitialState: function() {
			var state = this.getStateFromProps( this.props );

			if ( state.open === undefined )
				state.open = !this.props.input;

			state.currentView = this.props.dateFormat ? (this.props.viewMode || state.updateOn || 'days') : 'time';

			return state;
		},

		getStateFromProps: function( props ){
			var formats = this.getFormats( props ),
				date = props.value || props.defaultValue,
				selectedDate, viewDate, updateOn, inputValue
			;

			if ( date && typeof date === 'string' )
				selectedDate = this.localMoment( date, formats.datetime );
			else if ( date )
				selectedDate = this.localMoment( date );

			if ( selectedDate && !selectedDate.isValid() )
				selectedDate = null;

			viewDate = selectedDate ?
				selectedDate.clone().startOf('month') :
				this.localMoment().startOf('month')
			;

			updateOn = this.getUpdateOn(formats);

			if ( selectedDate )
				inputValue = selectedDate.format(formats.datetime);
			else if ( date.isValid && !date.isValid() )
				inputValue = '';
			else
				inputValue = date || '';

			return {
				updateOn: updateOn,
				inputFormat: formats.datetime,
				viewDate: viewDate,
				selectedDate: selectedDate,
				inputValue: inputValue,
				open: props.open
			};
		},

		getUpdateOn: function(formats){
			if ( formats.date.match(/[lLD]/) ){
				return 'days';
			}
			else if ( formats.date.indexOf('M') !== -1 ){
				return 'months';
			}
			else if ( formats.date.indexOf('Y') !== -1 ){
				return 'years';
			}

			return 'days';
		},

		getFormats: function( props ){
			var formats = {
					date: props.dateFormat || '',
					time: props.timeFormat || ''
				},
				locale = this.localMoment( props.date ).localeData()
			;

			if ( formats.date === true ){
				formats.date = locale.longDateFormat('L');
			}
			else if ( this.getUpdateOn(formats) !== 'days' ){
				formats.time = '';
			}

			if ( formats.time === true ){
				formats.time = locale.longDateFormat('LT');
			}

			formats.datetime = formats.date && formats.time ?
				formats.date + ' ' + formats.time :
				formats.date || formats.time
			;

			return formats;
		},

		componentWillReceiveProps: function(nextProps) {
			var formats = this.getFormats( nextProps ),
				update = {}
			;

			if ( nextProps.value !== this.props.value ){
				update = this.getStateFromProps( nextProps );
			}
			if ( formats.datetime !== this.getFormats( this.props ).datetime ) {
				update.inputFormat = formats.datetime;
			}

			if ( update.open === undefined ){
				if ( this.props.closeOnSelect && this.state.currentView !== 'time' ){
					update.open = false;
				}
				else {
					update.open = this.state.open;
				}
			}


			this.setState( update );
		},

		onInputChange: function( e ) {
			var value = e.target === null ? e : e.target.value,
				localMoment = this.localMoment( value, this.state.inputFormat ),
				update = { inputValue: value }
			;

			if ( localMoment.isValid() && !this.props.value ) {
				update.selectedDate = localMoment;
				update.viewDate = localMoment.clone().startOf('month');
			}
			else {
				update.selectedDate = null;
			}

			return this.setState( update, function() {
				return this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue );
			});
		},

		onInputKey: function( e ){
			if ( e.which === 9 && this.props.closeOnTab ){
				this.closeCalendar();
			}
		},

		showView: function( view ){
			var me = this;
			return function(){
				me.setState({ currentView: view });
				me.props.onViewChange(view);
			};
		},

		setDate: function( type ){
			var me = this,
				nextViews = {
					month: 'days',
					year: 'months'
				}
			;
			return function( e ){
				me.setState({
					viewDate: me.state.viewDate.clone()[ type ]( parseInt(e.target.getAttribute('data-value'), 10) ).startOf( type ),
					currentView: nextViews[ type ]
				});
			};
		},

		addTime: function( amount, type, toSelected ){
			return this.updateTime( 'add', amount, type, toSelected );
		},

		subtractTime: function( amount, type, toSelected ){
			return this.updateTime( 'subtract', amount, type, toSelected );
		},

		updateTime: function( op, amount, type, toSelected ){
			var me = this;

			return function(){
				var update = {},
					date = toSelected ? 'selectedDate' : 'viewDate'
				;

				update[ date ] = me.state[ date ].clone()[ op ]( amount, type );

				me.setState( update );
			};
		},

		allowedSetTime: ['hours', 'minutes', 'seconds', 'milliseconds'],
		setTime: function( type, value ){
			var index = this.allowedSetTime.indexOf( type ) + 1,
				state = this.state,
				date = (state.selectedDate || state.viewDate).clone(),
				nextType
			;

			// It is needed to set all the time properties
			// to not to reset the time
			date[ type ]( value );
			for (; index < this.allowedSetTime.length; index++) {
				nextType = this.allowedSetTime[index];
				date[ nextType ]( date[nextType]() );
			}

			if ( !this.props.value ){
				this.setState({
					selectedDate: date,
					inputValue: date.format( state.inputFormat )
				});
			}
			this.props.onChange( date );
		},

		updateSelectedDate: function( e, close ) {
			var target = e.target,
				modifier = 0,
				viewDate = this.state.viewDate,
				currentDate = this.state.selectedDate || viewDate,
				date
	    ;

			if (target.className.indexOf('rdtDay') !== -1){
				if (target.className.indexOf('rdtNew') !== -1)
					modifier = 1;
				else if (target.className.indexOf('rdtOld') !== -1)
					modifier = -1;

				date = viewDate.clone()
					.month( viewDate.month() + modifier )
					.date( parseInt( target.getAttribute('data-value'), 10 ) );
			} else if (target.className.indexOf('rdtMonth') !== -1){
				date = viewDate.clone()
					.month( parseInt( target.getAttribute('data-value'), 10 ) )
					.date( currentDate.date() );
			} else if (target.className.indexOf('rdtYear') !== -1){
				date = viewDate.clone()
					.month( currentDate.month() )
					.date( currentDate.date() )
					.year( parseInt( target.getAttribute('data-value'), 10 ) );
			}

			date.hours( currentDate.hours() )
				.minutes( currentDate.minutes() )
				.seconds( currentDate.seconds() )
				.milliseconds( currentDate.milliseconds() );

			if ( !this.props.value ){
				this.setState({
					selectedDate: date,
					viewDate: date.clone().startOf('month'),
					inputValue: date.format( this.state.inputFormat ),
					open: !(this.props.closeOnSelect && close )
				});
			} else {
				if (this.props.closeOnSelect && close) {
					this.closeCalendar();
				}
			}

			this.props.onChange( date );
		},

		openCalendar: function() {
			if (!this.state.open) {
				this.props.onFocus();
				this.setState({ open: true });
			}
		},

		closeCalendar: function() {
			this.setState({ open: false });
			this.props.onBlur( this.state.selectedDate || this.state.inputValue );
		},

		handleClickOutside: function(){
			if ( this.props.input && this.state.open && !this.props.open ){
				this.setState({ open: false });
				this.props.onBlur( this.state.selectedDate || this.state.inputValue );
			}
		},

		localMoment: function( date, format ){
			var m = moment( date, format, this.props.strictParsing );
			if ( this.props.locale )
				m.locale( this.props.locale );
			return m;
		},

		componentProps: {
			fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
			fromState: ['viewDate', 'selectedDate', 'updateOn'],
			fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment']
		},

		getComponentProps: function(){
			var me = this,
				formats = this.getFormats( this.props ),
				props = {dateFormat: formats.date, timeFormat: formats.time}
			;

			this.componentProps.fromProps.forEach( function( name ){
				props[ name ] = me.props[ name ];
			});
			this.componentProps.fromState.forEach( function( name ){
				props[ name ] = me.state[ name ];
			});
			this.componentProps.fromThis.forEach( function( name ){
				props[ name ] = me[ name ];
			});

			return props;
		},

		render: function() {
			var currentView = this.props.currentView || this.state.currentView;
			var Component = this.viewComponents[ currentView ],
				DOM = React.DOM,
				className = 'rdt' + (this.props.className ?
	                  ( Array.isArray( this.props.className ) ?
	                  ' ' + this.props.className.join( ' ' ) : ' ' + this.props.className) : ''),
				children = []
			;

			if ( this.props.input ){
				children = [ DOM.input( assign({
					key: 'i',
					type:'text',
					className: 'form-control',
					onFocus: this.openCalendar,
					onChange: this.onInputChange,
					onKeyDown: this.onInputKey,
					value: this.state.inputValue
				}, this.props.inputProps ))];
			} else {
				className += ' rdtStatic';
			}

			if ( this.props.opened || this.state.open )
				className += ' rdtOpen';

			return DOM.div({className: className}, children.concat(
				DOM.div(
					{ key: 'dt', className: 'rdtPicker' },
					React.createElement( Component, this.getComponentProps())
				)
			));
		}
	});

	// Make moment accessible through the Datetime class
	Datetime.moment = moment;

	module.exports = Datetime;


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function ownEnumerableKeys(obj) {
		var keys = Object.getOwnPropertyNames(obj);

		if (Object.getOwnPropertySymbols) {
			keys = keys.concat(Object.getOwnPropertySymbols(obj));
		}

		return keys.filter(function (key) {
			return propIsEnumerable.call(obj, key);
		});
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = ownEnumerableKeys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2),
		moment = __webpack_require__(4)
	;

	var DOM = React.DOM;
	var DateTimePickerDays = React.createClass({

		render: function() {
			var footer = this.renderFooter(),
				date = this.props.viewDate,
				locale = date.localeData(),
				tableChildren
			;

			tableChildren = [
				DOM.thead({ key: 'th'}, [
					DOM.tr({ key: 'h'}, [
						DOM.th({ key: 'p', className: 'rdtPrev' }, DOM.span({onClick: this.props.subtractTime(1, 'months')}, '‹')),
						DOM.th({ key: 's', className: 'rdtSwitch', onClick: this.props.showView('months'), colSpan: 5, 'data-value': this.props.viewDate.month() }, locale.months( date ) + ' ' + date.year() ),
						DOM.th({ key: 'n', className: 'rdtNext' }, DOM.span({onClick: this.props.addTime(1, 'months')}, '›'))
					]),
					DOM.tr({ key: 'd'}, this.getDaysOfWeek( locale ).map( function( day, index ){ return DOM.th({ key: day + index, className: 'dow'}, day ); }) )
				]),
				DOM.tbody({key: 'tb'}, this.renderDays())
			];

			if ( footer )
				tableChildren.push( footer );

			return DOM.div({ className: 'rdtDays' },
				DOM.table({}, tableChildren )
			);
		},

		/**
		 * Get a list of the days of the week
		 * depending on the current locale
		 * @return {array} A list with the shortname of the days
		 */
		getDaysOfWeek: function( locale ){
			var days = locale._weekdaysMin,
				first = locale.firstDayOfWeek(),
				dow = [],
				i = 0
			;

			days.forEach( function( day ){
				dow[ (7 + (i++) - first) % 7 ] = day;
			});

			return dow;
		},

		renderDays: function() {
			var date = this.props.viewDate,
				selected = this.props.selectedDate && this.props.selectedDate.clone(),
				prevMonth = date.clone().subtract( 1, 'months' ),
				currentYear = date.year(),
				currentMonth = date.month(),
				weeks = [],
				days = [],
				renderer = this.props.renderDay || this.renderDay,
				isValid = this.props.isValidDate || this.isValidDate,
				classes, disabled, dayProps, currentDate
			;

			// Go to the last week of the previous month
			prevMonth.date( prevMonth.daysInMonth() ).startOf('week');
			var lastDay = prevMonth.clone().add(42, 'd');

			while ( prevMonth.isBefore( lastDay ) ){
				classes = 'rdtDay';
				currentDate = prevMonth.clone();

				if ( ( prevMonth.year() === currentYear && prevMonth.month() < currentMonth ) || ( prevMonth.year() < currentYear ) )
					classes += ' rdtOld';
				else if ( ( prevMonth.year() === currentYear && prevMonth.month() > currentMonth ) || ( prevMonth.year() > currentYear ) )
					classes += ' rdtNew';

				if ( selected && prevMonth.isSame(selected, 'day') )
					classes += ' rdtActive';

				if (prevMonth.isSame(moment(), 'day') )
					classes += ' rdtToday';

				disabled = !isValid( currentDate, selected );
				if ( disabled )
					classes += ' rdtDisabled';

				dayProps = {
					key: prevMonth.format('M_D'),
					'data-value': prevMonth.date(),
					className: classes
				};
				if ( !disabled )
					dayProps.onClick = this.updateSelectedDate;

				days.push( renderer( dayProps, currentDate, selected ) );

				if ( days.length === 7 ){
					weeks.push( DOM.tr( {key: prevMonth.format('M_D')}, days ) );
					days = [];
				}

				prevMonth.add( 1, 'd' );
			}

			return weeks;
		},

		updateSelectedDate: function( event ) {
			this.props.updateSelectedDate(event, true);
		},

		renderDay: function( props, currentDate ){
			return DOM.td( props, currentDate.date() );
		},

		renderFooter: function(){
			if ( !this.props.timeFormat )
				return '';

			var date = this.props.selectedDate || this.props.viewDate;

			return DOM.tfoot({ key: 'tf'},
				DOM.tr({},
					DOM.td({ onClick: this.props.showView('time'), colSpan: 7, className: 'rdtTimeToggle'}, date.format( this.props.timeFormat ))
				)
			);
		},
		isValidDate: function(){ return 1; }
	});

	module.exports = DateTimePickerDays;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var DOM = React.DOM;
	var DateTimePickerMonths = React.createClass({
		render: function() {
			return DOM.div({ className: 'rdtMonths' }, [
				DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({}, [
					DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.span({onClick: this.props.subtractTime(1, 'years')}, '‹')),
					DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2, 'data-value': this.props.viewDate.year()}, this.props.viewDate.year() ),
					DOM.th({ key: 'next', className: 'rdtNext' }, DOM.span({onClick: this.props.addTime(1, 'years')}, '›'))
				]))),
				DOM.table({ key: 'months'}, DOM.tbody({ key: 'b'}, this.renderMonths()))
			]);
		},

		renderMonths: function() {
			var date = this.props.selectedDate,
				month = this.props.viewDate.month(),
				year = this.props.viewDate.year(),
				rows = [],
				i = 0,
				months = [],
				renderer = this.props.renderMonth || this.renderMonth,
				classes, props
			;

			while (i < 12) {
				classes = 'rdtMonth';
				if ( date && i === month && year === date.year() )
					classes += ' rdtActive';

				props = {
					key: i,
					'data-value': i,
					className: classes,
					onClick: this.props.updateOn === 'months'? this.updateSelectedMonth : this.props.setDate('month')
				};

				months.push( renderer( props, i, year, date && date.clone() ));

				if ( months.length === 4 ){
					rows.push( DOM.tr({ key: month + '_' + rows.length }, months) );
					months = [];
				}

				i++;
			}

			return rows;
		},

		updateSelectedMonth: function( event ) {
			this.props.updateSelectedDate(event, true);
		},

		renderMonth: function( props, month ) {
			var monthsShort = this.props.viewDate.localeData()._monthsShort;
			return DOM.td( props, monthsShort.standalone
				? capitalize( monthsShort.standalone[ month ] )
				: monthsShort[ month ]
			);
		}
	});

	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	module.exports = DateTimePickerMonths;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var DOM = React.DOM;
	var DateTimePickerYears = React.createClass({
		render: function() {
			var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

			return DOM.div({ className: 'rdtYears' }, [
				DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({}, [
					DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.span({onClick: this.props.subtractTime(10, 'years')}, '‹')),
					DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2 }, year + '-' + (year + 9) ),
					DOM.th({ key: 'next', className: 'rdtNext'}, DOM.span({onClick: this.props.addTime(10, 'years')}, '›'))
					]))),
				DOM.table({ key: 'years'}, DOM.tbody({}, this.renderYears( year )))
			]);
		},

		renderYears: function( year ) {
			var years = [],
				i = -1,
				rows = [],
				renderer = this.props.renderYear || this.renderYear,
				selectedDate = this.props.selectedDate,
				classes, props
			;

			year--;
			while (i < 11) {
				classes = 'rdtYear';
				if ( i === -1 | i === 10 )
					classes += ' rdtOld';
				if ( selectedDate && selectedDate.year() === year )
					classes += ' rdtActive';

				props = {
					key: year,
					'data-value': year,
					className: classes,
					onClick: this.props.updateOn === 'years' ? this.updateSelectedYear : this.props.setDate('year')
				};

				years.push( renderer( props, year, selectedDate && selectedDate.clone() ));

				if ( years.length === 4 ){
					rows.push( DOM.tr({ key: i }, years ) );
					years = [];
				}

				year++;
				i++;
			}

			return rows;
		},

		updateSelectedYear: function( event ) {
			this.props.updateSelectedDate(event, true);
		},

		renderYear: function( props, year ){
			return DOM.td( props, year );
		}
	});

	module.exports = DateTimePickerYears;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2),
		assign = __webpack_require__(1);

	var DOM = React.DOM;
	var DateTimePickerTime = React.createClass({
		getInitialState: function(){
			return this.calculateState( this.props );
		},
		calculateState: function( props ){
			var date = props.selectedDate || props.viewDate,
				format = props.timeFormat,
				counters = []
			;

			if ( format.indexOf('H') !== -1 || format.indexOf('h') !== -1 ){
				counters.push('hours');
				if ( format.indexOf('m') !== -1 ){
					counters.push('minutes');
					if ( format.indexOf('s') !== -1 ){
						counters.push('seconds');
					}
				}
			}

			var daypart = false;
			if ( this.props.timeFormat.indexOf(' A') !== -1  && this.state !== null ){
				daypart = ( this.state.hours >= 12 ) ? 'PM' : 'AM';
			}

			return {
				hours: date.format('H'),
				minutes: date.format('mm'),
				seconds: date.format('ss'),
				milliseconds: date.format('SSS'),
				daypart: daypart,
				counters: counters
			};
		},
		renderCounter: function( type ){
			if (type !== 'daypart') {
				var value = this.state[ type ];
				if (type === 'hours' && this.props.timeFormat.indexOf(' A') !== -1) {
					value = (value - 1) % 12 + 1;

					if (value === 0) {
						value = 12;
					}
				}
				return DOM.div({ key: type, className: 'rdtCounter'}, [
					DOM.span({ key:'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'increase', type ) }, '▲' ),
					DOM.div({ key:'c', className: 'rdtCount' }, value ),
					DOM.span({ key:'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'decrease', type ) }, '▼' )
				]);
			}
			return '';
		},
		renderDayPart: function() {
			return DOM.div({ className: 'rdtCounter', key: 'dayPart'}, [
				DOM.span({ key:'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▲' ),
				DOM.div({ key: this.state.daypart, className: 'rdtCount'}, this.state.daypart ),
				DOM.span({ key:'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▼' )
			]);
		},
		render: function() {
			var me = this,
				counters = []
			;

			this.state.counters.forEach( function(c){
				if ( counters.length )
					counters.push( DOM.div( {key: 'sep' + counters.length, className: 'rdtCounterSeparator' }, ':' ));
				counters.push( me.renderCounter( c ) );
			});

			if (this.state.daypart !== false) {
				counters.push( me.renderDayPart() );
			}

			if ( this.state.counters.length === 3 && this.props.timeFormat.indexOf('S') !== -1 ){
				counters.push( DOM.div( {className: 'rdtCounterSeparator', key: 'sep5' }, ':' ));
				counters.push(
					DOM.div( {className: 'rdtCounter rdtMilli', key:'m'},
						DOM.input({ value: this.state.milliseconds, type: 'text', onChange: this.updateMilli })
						)
					);
			}

			return DOM.div( {className: 'rdtTime'},
				DOM.table( {}, [
					this.renderHeader(),
					DOM.tbody({key: 'b'}, DOM.tr({}, DOM.td({},
						DOM.div({ className: 'rdtCounters' }, counters )
					)))
				])
			);
		},
		componentWillMount: function() {
			var me = this;
			me.timeConstraints = {
				hours: {
					min: 0,
					max: 23,
					step: 1
				},
				minutes: {
					min: 0,
					max: 59,
					step: 1
				},
				seconds: {
					min: 0,
					max: 59,
					step: 1,
				},
				milliseconds: {
					min: 0,
					max: 999,
					step: 1
				}
			};
			['hours', 'minutes', 'seconds', 'milliseconds'].forEach(function(type) {
				assign(me.timeConstraints[type], me.props.timeConstraints[type]);
			});
			this.setState( this.calculateState( this.props ) );
		},
		componentWillReceiveProps: function( nextProps ){
			this.setState( this.calculateState( nextProps ) );
		},
		updateMilli: function( e ){
			var milli = parseInt( e.target.value, 10 );
			if ( milli === e.target.value && milli >= 0 && milli < 1000 ){
				this.props.setTime( 'milliseconds', milli );
				this.setState({ milliseconds: milli });
			}
		},
		renderHeader: function(){
			if ( !this.props.dateFormat )
				return null;

			var date = this.props.selectedDate || this.props.viewDate;
			return DOM.thead({ key: 'h'}, DOM.tr({},
				DOM.th( {className: 'rdtSwitch', colSpan: 4, onClick: this.props.showView('days')}, date.format( this.props.dateFormat ) )
			));
		},
		onStartClicking: function( action, type ){
			var me = this;

			return function(){
				var update = {};
				update[ type ] = me[ action ]( type );
				me.setState( update );

				me.timer = setTimeout( function(){
					me.increaseTimer = setInterval( function(){
						update[ type ] = me[ action ]( type );
						me.setState( update );
					}, 70);
				}, 500);

				me.mouseUpListener = function(){
					clearTimeout( me.timer );
					clearInterval( me.increaseTimer );
					me.props.setTime( type, me.state[ type ] );
					document.body.removeEventListener('mouseup', me.mouseUpListener);
				};

				document.body.addEventListener('mouseup', me.mouseUpListener);
			};
		},
		padValues: {
			hours: 1,
			minutes: 2,
			seconds: 2,
			milliseconds: 3
		},
		toggleDayPart: function( type ){ // type is always 'hours'
			var value = parseInt(this.state[ type ], 10) + 12;
			if ( value > this.timeConstraints[ type ].max )
				value = this.timeConstraints[ type ].min + (value - (this.timeConstraints[ type ].max + 1));
			return this.pad( type, value );
		},
		increase: function( type ){
			var value = parseInt(this.state[ type ], 10) + this.timeConstraints[ type ].step;
			if ( value > this.timeConstraints[ type ].max )
				value = this.timeConstraints[ type ].min + ( value - ( this.timeConstraints[ type ].max  + 1) );
			return this.pad( type, value );
		},
		decrease: function( type ){
			var value = parseInt(this.state[ type ], 10) - this.timeConstraints[ type ].step;
			if ( value < this.timeConstraints[ type ].min )
				value = this.timeConstraints[ type ].max + 1 - ( this.timeConstraints[ type ].min - value );
			return this.pad( type, value );
		},
		pad: function( type, value ){
			var str = value + '';
			while ( str.length < this.padValues[ type ] )
				str = '0' + str;
			return str;
		}
	});

	module.exports = DateTimePickerTime;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// This is extracted from https://github.com/Pomax/react-onclickoutside
	// And modified to support react 0.13 and react 0.14

	var React = __webpack_require__(2),
		version = React.version && React.version.split('.')
	;

	if ( version && ( version[0] > 0 || version[1] > 13 ) )
		React = __webpack_require__(9);

	// Use a parallel array because we can't use
	// objects as keys, they get toString-coerced
	var registeredComponents = [];
	var handlers = [];

	var IGNORE_CLASS = 'ignore-react-onclickoutside';

	var isSourceFound = function(source, localNode) {
	 if (source === localNode) {
	   return true;
	 }
	 // SVG <use/> elements do not technically reside in the rendered DOM, so
	 // they do not have classList directly, but they offer a link to their
	 // corresponding element, which can have classList. This extra check is for
	 // that case.
	 // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
	 // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
	 if (source.correspondingElement) {
	   return source.correspondingElement.classList.contains(IGNORE_CLASS);
	 }
	 return source.classList.contains(IGNORE_CLASS);
	};

	module.exports = {
	 componentDidMount: function() {
	   if (typeof this.handleClickOutside !== 'function')
	     throw new Error('Component lacks a handleClickOutside(event) function for processing outside click events.');

	   var fn = this.__outsideClickHandler = (function(localNode, eventHandler) {
	     return function(evt) {
	       evt.stopPropagation();
	       var source = evt.target;
	       var found = false;
	       // If source=local then this event came from "somewhere"
	       // inside and should be ignored. We could handle this with
	       // a layered approach, too, but that requires going back to
	       // thinking in terms of Dom node nesting, running counter
	       // to React's "you shouldn't care about the DOM" philosophy.
	       while (source.parentNode) {
	         found = isSourceFound(source, localNode);
	         if (found) return;
	         source = source.parentNode;
	       }
	       eventHandler(evt);
	     };
	   }(React.findDOMNode(this), this.handleClickOutside));

	   var pos = registeredComponents.length;
	   registeredComponents.push(this);
	   handlers[pos] = fn;

	   // If there is a truthy disableOnClickOutside property for this
	   // component, don't immediately start listening for outside events.
	   if (!this.props.disableOnClickOutside) {
	     this.enableOnClickOutside();
	   }
	 },

	 componentWillUnmount: function() {
	   this.disableOnClickOutside();
	   this.__outsideClickHandler = false;
	   var pos = registeredComponents.indexOf(this);
	   if ( pos>-1) {
	     if (handlers[pos]) {
	       // clean up so we don't leak memory
	       handlers.splice(pos, 1);
	       registeredComponents.splice(pos, 1);
	     }
	   }
	 },

	 /**
	  * Can be called to explicitly enable event listening
	  * for clicks and touches outside of this element.
	  */
	 enableOnClickOutside: function() {
	   var fn = this.__outsideClickHandler;
	   document.addEventListener('mousedown', fn);
	   document.addEventListener('touchstart', fn);
	 },

	 /**
	  * Can be called to explicitly disable event listening
	  * for clicks and touches outside of this element.
	  */
	 disableOnClickOutside: function() {
	   var fn = this.__outsideClickHandler;
	   document.removeEventListener('mousedown', fn);
	   document.removeEventListener('touchstart', fn);
	 }
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-datetime.js.map
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWFjdC1kYXRldGltZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJSZWFjdFwiKSwgcmVxdWlyZShcIm1vbWVudFwiKSwgcmVxdWlyZShcIlJlYWN0RE9NXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIlJlYWN0XCIsIFwibW9tZW50XCIsIFwiUmVhY3RET01cIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXRpbWVcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJSZWFjdFwiKSwgcmVxdWlyZShcIm1vbWVudFwiKSwgcmVxdWlyZShcIlJlYWN0RE9NXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRldGltZVwiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdLCByb290W1wibW9tZW50XCJdLCByb290W1wiUmVhY3RET01cIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzlfXykge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG5cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG5cblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHZhciBhc3NpZ24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLFxyXG5cdFx0UmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxyXG5cdFx0RGF5c1ZpZXcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpLFxyXG5cdFx0TW9udGhzVmlldyA9IF9fd2VicGFja19yZXF1aXJlX18oNSksXHJcblx0XHRZZWFyc1ZpZXcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpLFxyXG5cdFx0VGltZVZpZXcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpLFxyXG5cdFx0bW9tZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KVxyXG5cdDtcclxuXHJcblx0dmFyIFRZUEVTID0gUmVhY3QuUHJvcFR5cGVzO1xyXG5cdHZhciBEYXRldGltZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRcdG1peGluczogW1xyXG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKDgpXHJcblx0XHRdLFxyXG5cdFx0dmlld0NvbXBvbmVudHM6IHtcclxuXHRcdFx0ZGF5czogRGF5c1ZpZXcsXHJcblx0XHRcdG1vbnRoczogTW9udGhzVmlldyxcclxuXHRcdFx0eWVhcnM6IFllYXJzVmlldyxcclxuXHRcdFx0dGltZTogVGltZVZpZXdcclxuXHRcdH0sXHJcblx0XHRwcm9wVHlwZXM6IHtcclxuXHRcdFx0Ly8gdmFsdWU6IFRZUEVTLm9iamVjdCB8IFRZUEVTLnN0cmluZyxcclxuXHRcdFx0Ly8gZGVmYXVsdFZhbHVlOiBUWVBFUy5vYmplY3QgfCBUWVBFUy5zdHJpbmcsXHJcblx0XHRcdG9uRm9jdXM6IFRZUEVTLmZ1bmMsXHJcblx0XHRcdG9uQmx1cjogVFlQRVMuZnVuYyxcclxuXHRcdFx0b25DaGFuZ2U6IFRZUEVTLmZ1bmMsXHJcblx0XHRcdG9uVmlld0NoYW5nZTogVFlQRVMuZnVuYyxcclxuXHRcdFx0bG9jYWxlOiBUWVBFUy5zdHJpbmcsXHJcblx0XHRcdGlucHV0OiBUWVBFUy5ib29sLFxyXG5cdFx0XHQvLyBkYXRlRm9ybWF0OiBUWVBFUy5zdHJpbmcgfCBUWVBFUy5ib29sLFxyXG5cdFx0XHQvLyB0aW1lRm9ybWF0OiBUWVBFUy5zdHJpbmcgfCBUWVBFUy5ib29sLFxyXG5cdFx0XHRpbnB1dFByb3BzOiBUWVBFUy5vYmplY3QsXHJcblx0XHRcdHRpbWVDb25zdHJhaW50czogVFlQRVMub2JqZWN0LFxyXG5cdFx0XHR2aWV3TW9kZTogVFlQRVMub25lT2YoWyd5ZWFycycsICdtb250aHMnLCAnZGF5cycsICd0aW1lJ10pLFxyXG5cdFx0XHRjdXJyZW50VmlldzogVFlQRVMub25lT2YoWyd5ZWFycycsICdtb250aHMnLCAnZGF5cycsICd0aW1lJ10pLFxyXG5cdFx0XHRpc1ZhbGlkRGF0ZTogVFlQRVMuZnVuYyxcclxuXHRcdFx0b3BlbjogVFlQRVMuYm9vbCxcclxuXHRcdFx0c3RyaWN0UGFyc2luZzogVFlQRVMuYm9vbCxcclxuXHRcdFx0Y2xvc2VPblNlbGVjdDogVFlQRVMuYm9vbCxcclxuXHRcdFx0Y2xvc2VPblRhYjogVFlQRVMuYm9vbFxyXG5cdFx0fSxcclxuXHJcblx0XHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgbm9mID0gZnVuY3Rpb24oKXt9O1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGNsYXNzTmFtZTogJycsXHJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiAnJyxcclxuXHRcdFx0XHRpbnB1dFByb3BzOiB7fSxcclxuXHRcdFx0XHRpbnB1dDogdHJ1ZSxcclxuXHRcdFx0XHRvbkZvY3VzOiBub2YsXHJcblx0XHRcdFx0b25CbHVyOiBub2YsXHJcblx0XHRcdFx0b25DaGFuZ2U6IG5vZixcclxuXHRcdFx0XHRvblZpZXdDaGFuZ2U6IG5vZixcclxuXHRcdFx0XHR0aW1lRm9ybWF0OiB0cnVlLFxyXG5cdFx0XHRcdHRpbWVDb25zdHJhaW50czoge30sXHJcblx0XHRcdFx0ZGF0ZUZvcm1hdDogdHJ1ZSxcclxuXHRcdFx0XHRzdHJpY3RQYXJzaW5nOiB0cnVlLFxyXG5cdFx0XHRcdGNsb3NlT25TZWxlY3Q6IGZhbHNlLFxyXG5cdFx0XHRcdGNsb3NlT25UYWI6IHRydWVcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21Qcm9wcyggdGhpcy5wcm9wcyApO1xyXG5cclxuXHRcdFx0aWYgKCBzdGF0ZS5vcGVuID09PSB1bmRlZmluZWQgKVxyXG5cdFx0XHRcdHN0YXRlLm9wZW4gPSAhdGhpcy5wcm9wcy5pbnB1dDtcclxuXHJcblx0XHRcdHN0YXRlLmN1cnJlbnRWaWV3ID0gdGhpcy5wcm9wcy5kYXRlRm9ybWF0ID8gKHRoaXMucHJvcHMudmlld01vZGUgfHwgc3RhdGUudXBkYXRlT24gfHwgJ2RheXMnKSA6ICd0aW1lJztcclxuXHJcblx0XHRcdHJldHVybiBzdGF0ZTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0U3RhdGVGcm9tUHJvcHM6IGZ1bmN0aW9uKCBwcm9wcyApe1xyXG5cdFx0XHR2YXIgZm9ybWF0cyA9IHRoaXMuZ2V0Rm9ybWF0cyggcHJvcHMgKSxcclxuXHRcdFx0XHRkYXRlID0gcHJvcHMudmFsdWUgfHwgcHJvcHMuZGVmYXVsdFZhbHVlLFxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZSwgdmlld0RhdGUsIHVwZGF0ZU9uLCBpbnB1dFZhbHVlXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdGlmICggZGF0ZSAmJiB0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgKVxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZSA9IHRoaXMubG9jYWxNb21lbnQoIGRhdGUsIGZvcm1hdHMuZGF0ZXRpbWUgKTtcclxuXHRcdFx0ZWxzZSBpZiAoIGRhdGUgKVxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZSA9IHRoaXMubG9jYWxNb21lbnQoIGRhdGUgKTtcclxuXHJcblx0XHRcdGlmICggc2VsZWN0ZWREYXRlICYmICFzZWxlY3RlZERhdGUuaXNWYWxpZCgpIClcclxuXHRcdFx0XHRzZWxlY3RlZERhdGUgPSBudWxsO1xyXG5cclxuXHRcdFx0dmlld0RhdGUgPSBzZWxlY3RlZERhdGUgP1xyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJykgOlxyXG5cdFx0XHRcdHRoaXMubG9jYWxNb21lbnQoKS5zdGFydE9mKCdtb250aCcpXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdHVwZGF0ZU9uID0gdGhpcy5nZXRVcGRhdGVPbihmb3JtYXRzKTtcclxuXHJcblx0XHRcdGlmICggc2VsZWN0ZWREYXRlIClcclxuXHRcdFx0XHRpbnB1dFZhbHVlID0gc2VsZWN0ZWREYXRlLmZvcm1hdChmb3JtYXRzLmRhdGV0aW1lKTtcclxuXHRcdFx0ZWxzZSBpZiAoIGRhdGUuaXNWYWxpZCAmJiAhZGF0ZS5pc1ZhbGlkKCkgKVxyXG5cdFx0XHRcdGlucHV0VmFsdWUgPSAnJztcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlucHV0VmFsdWUgPSBkYXRlIHx8ICcnO1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHR1cGRhdGVPbjogdXBkYXRlT24sXHJcblx0XHRcdFx0aW5wdXRGb3JtYXQ6IGZvcm1hdHMuZGF0ZXRpbWUsXHJcblx0XHRcdFx0dmlld0RhdGU6IHZpZXdEYXRlLFxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZTogc2VsZWN0ZWREYXRlLFxyXG5cdFx0XHRcdGlucHV0VmFsdWU6IGlucHV0VmFsdWUsXHJcblx0XHRcdFx0b3BlbjogcHJvcHMub3BlblxyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRVcGRhdGVPbjogZnVuY3Rpb24oZm9ybWF0cyl7XHJcblx0XHRcdGlmICggZm9ybWF0cy5kYXRlLm1hdGNoKC9bbExEXS8pICl7XHJcblx0XHRcdFx0cmV0dXJuICdkYXlzJztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICggZm9ybWF0cy5kYXRlLmluZGV4T2YoJ00nKSAhPT0gLTEgKXtcclxuXHRcdFx0XHRyZXR1cm4gJ21vbnRocyc7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoIGZvcm1hdHMuZGF0ZS5pbmRleE9mKCdZJykgIT09IC0xICl7XHJcblx0XHRcdFx0cmV0dXJuICd5ZWFycyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiAnZGF5cyc7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldEZvcm1hdHM6IGZ1bmN0aW9uKCBwcm9wcyApe1xyXG5cdFx0XHR2YXIgZm9ybWF0cyA9IHtcclxuXHRcdFx0XHRcdGRhdGU6IHByb3BzLmRhdGVGb3JtYXQgfHwgJycsXHJcblx0XHRcdFx0XHR0aW1lOiBwcm9wcy50aW1lRm9ybWF0IHx8ICcnXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRsb2NhbGUgPSB0aGlzLmxvY2FsTW9tZW50KCBwcm9wcy5kYXRlICkubG9jYWxlRGF0YSgpXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdGlmICggZm9ybWF0cy5kYXRlID09PSB0cnVlICl7XHJcblx0XHRcdFx0Zm9ybWF0cy5kYXRlID0gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KCdMJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoIHRoaXMuZ2V0VXBkYXRlT24oZm9ybWF0cykgIT09ICdkYXlzJyApe1xyXG5cdFx0XHRcdGZvcm1hdHMudGltZSA9ICcnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIGZvcm1hdHMudGltZSA9PT0gdHJ1ZSApe1xyXG5cdFx0XHRcdGZvcm1hdHMudGltZSA9IGxvY2FsZS5sb25nRGF0ZUZvcm1hdCgnTFQnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9ybWF0cy5kYXRldGltZSA9IGZvcm1hdHMuZGF0ZSAmJiBmb3JtYXRzLnRpbWUgP1xyXG5cdFx0XHRcdGZvcm1hdHMuZGF0ZSArICcgJyArIGZvcm1hdHMudGltZSA6XHJcblx0XHRcdFx0Zm9ybWF0cy5kYXRlIHx8IGZvcm1hdHMudGltZVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHRyZXR1cm4gZm9ybWF0cztcclxuXHRcdH0sXHJcblxyXG5cdFx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XHJcblx0XHRcdHZhciBmb3JtYXRzID0gdGhpcy5nZXRGb3JtYXRzKCBuZXh0UHJvcHMgKSxcclxuXHRcdFx0XHR1cGRhdGUgPSB7fVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHRpZiAoIG5leHRQcm9wcy52YWx1ZSAhPT0gdGhpcy5wcm9wcy52YWx1ZSApe1xyXG5cdFx0XHRcdHVwZGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tUHJvcHMoIG5leHRQcm9wcyApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggZm9ybWF0cy5kYXRldGltZSAhPT0gdGhpcy5nZXRGb3JtYXRzKCB0aGlzLnByb3BzICkuZGF0ZXRpbWUgKSB7XHJcblx0XHRcdFx0dXBkYXRlLmlucHV0Rm9ybWF0ID0gZm9ybWF0cy5kYXRldGltZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCB1cGRhdGUub3BlbiA9PT0gdW5kZWZpbmVkICl7XHJcblx0XHRcdFx0aWYgKCB0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgdGhpcy5zdGF0ZS5jdXJyZW50VmlldyAhPT0gJ3RpbWUnICl7XHJcblx0XHRcdFx0XHR1cGRhdGUub3BlbiA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHVwZGF0ZS5vcGVuID0gdGhpcy5zdGF0ZS5vcGVuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoIHVwZGF0ZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRvbklucHV0Q2hhbmdlOiBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0dmFyIHZhbHVlID0gZS50YXJnZXQgPT09IG51bGwgPyBlIDogZS50YXJnZXQudmFsdWUsXHJcblx0XHRcdFx0bG9jYWxNb21lbnQgPSB0aGlzLmxvY2FsTW9tZW50KCB2YWx1ZSwgdGhpcy5zdGF0ZS5pbnB1dEZvcm1hdCApLFxyXG5cdFx0XHRcdHVwZGF0ZSA9IHsgaW5wdXRWYWx1ZTogdmFsdWUgfVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHRpZiAoIGxvY2FsTW9tZW50LmlzVmFsaWQoKSAmJiAhdGhpcy5wcm9wcy52YWx1ZSApIHtcclxuXHRcdFx0XHR1cGRhdGUuc2VsZWN0ZWREYXRlID0gbG9jYWxNb21lbnQ7XHJcblx0XHRcdFx0dXBkYXRlLnZpZXdEYXRlID0gbG9jYWxNb21lbnQuY2xvbmUoKS5zdGFydE9mKCdtb250aCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHVwZGF0ZS5zZWxlY3RlZERhdGUgPSBudWxsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRTdGF0ZSggdXBkYXRlLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy5vbkNoYW5nZSggbG9jYWxNb21lbnQuaXNWYWxpZCgpID8gbG9jYWxNb21lbnQgOiB0aGlzLnN0YXRlLmlucHV0VmFsdWUgKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9uSW5wdXRLZXk6IGZ1bmN0aW9uKCBlICl7XHJcblx0XHRcdGlmICggZS53aGljaCA9PT0gOSAmJiB0aGlzLnByb3BzLmNsb3NlT25UYWIgKXtcclxuXHRcdFx0XHR0aGlzLmNsb3NlQ2FsZW5kYXIoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRzaG93VmlldzogZnVuY3Rpb24oIHZpZXcgKXtcclxuXHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0bWUuc2V0U3RhdGUoeyBjdXJyZW50VmlldzogdmlldyB9KTtcclxuXHRcdFx0XHRtZS5wcm9wcy5vblZpZXdDaGFuZ2Uodmlldyk7XHJcblx0XHRcdH07XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGU6IGZ1bmN0aW9uKCB0eXBlICl7XHJcblx0XHRcdHZhciBtZSA9IHRoaXMsXHJcblx0XHRcdFx0bmV4dFZpZXdzID0ge1xyXG5cdFx0XHRcdFx0bW9udGg6ICdkYXlzJyxcclxuXHRcdFx0XHRcdHllYXI6ICdtb250aHMnXHJcblx0XHRcdFx0fVxyXG5cdFx0XHQ7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZSApe1xyXG5cdFx0XHRcdG1lLnNldFN0YXRlKHtcclxuXHRcdFx0XHRcdHZpZXdEYXRlOiBtZS5zdGF0ZS52aWV3RGF0ZS5jbG9uZSgpWyB0eXBlIF0oIHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpLCAxMCkgKS5zdGFydE9mKCB0eXBlICksXHJcblx0XHRcdFx0XHRjdXJyZW50VmlldzogbmV4dFZpZXdzWyB0eXBlIF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cdFx0YWRkVGltZTogZnVuY3Rpb24oIGFtb3VudCwgdHlwZSwgdG9TZWxlY3RlZCApe1xyXG5cdFx0XHRyZXR1cm4gdGhpcy51cGRhdGVUaW1lKCAnYWRkJywgYW1vdW50LCB0eXBlLCB0b1NlbGVjdGVkICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHN1YnRyYWN0VGltZTogZnVuY3Rpb24oIGFtb3VudCwgdHlwZSwgdG9TZWxlY3RlZCApe1xyXG5cdFx0XHRyZXR1cm4gdGhpcy51cGRhdGVUaW1lKCAnc3VidHJhY3QnLCBhbW91bnQsIHR5cGUsIHRvU2VsZWN0ZWQgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dXBkYXRlVGltZTogZnVuY3Rpb24oIG9wLCBhbW91bnQsIHR5cGUsIHRvU2VsZWN0ZWQgKXtcclxuXHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHJcblx0XHRcdHJldHVybiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciB1cGRhdGUgPSB7fSxcclxuXHRcdFx0XHRcdGRhdGUgPSB0b1NlbGVjdGVkID8gJ3NlbGVjdGVkRGF0ZScgOiAndmlld0RhdGUnXHJcblx0XHRcdFx0O1xyXG5cclxuXHRcdFx0XHR1cGRhdGVbIGRhdGUgXSA9IG1lLnN0YXRlWyBkYXRlIF0uY2xvbmUoKVsgb3AgXSggYW1vdW50LCB0eXBlICk7XHJcblxyXG5cdFx0XHRcdG1lLnNldFN0YXRlKCB1cGRhdGUgKTtcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cdFx0YWxsb3dlZFNldFRpbWU6IFsnaG91cnMnLCAnbWludXRlcycsICdzZWNvbmRzJywgJ21pbGxpc2Vjb25kcyddLFxyXG5cdFx0c2V0VGltZTogZnVuY3Rpb24oIHR5cGUsIHZhbHVlICl7XHJcblx0XHRcdHZhciBpbmRleCA9IHRoaXMuYWxsb3dlZFNldFRpbWUuaW5kZXhPZiggdHlwZSApICsgMSxcclxuXHRcdFx0XHRzdGF0ZSA9IHRoaXMuc3RhdGUsXHJcblx0XHRcdFx0ZGF0ZSA9IChzdGF0ZS5zZWxlY3RlZERhdGUgfHwgc3RhdGUudmlld0RhdGUpLmNsb25lKCksXHJcblx0XHRcdFx0bmV4dFR5cGVcclxuXHRcdFx0O1xyXG5cclxuXHRcdFx0Ly8gSXQgaXMgbmVlZGVkIHRvIHNldCBhbGwgdGhlIHRpbWUgcHJvcGVydGllc1xyXG5cdFx0XHQvLyB0byBub3QgdG8gcmVzZXQgdGhlIHRpbWVcclxuXHRcdFx0ZGF0ZVsgdHlwZSBdKCB2YWx1ZSApO1xyXG5cdFx0XHRmb3IgKDsgaW5kZXggPCB0aGlzLmFsbG93ZWRTZXRUaW1lLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdG5leHRUeXBlID0gdGhpcy5hbGxvd2VkU2V0VGltZVtpbmRleF07XHJcblx0XHRcdFx0ZGF0ZVsgbmV4dFR5cGUgXSggZGF0ZVtuZXh0VHlwZV0oKSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoICF0aGlzLnByb3BzLnZhbHVlICl7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0XHRzZWxlY3RlZERhdGU6IGRhdGUsXHJcblx0XHRcdFx0XHRpbnB1dFZhbHVlOiBkYXRlLmZvcm1hdCggc3RhdGUuaW5wdXRGb3JtYXQgKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMucHJvcHMub25DaGFuZ2UoIGRhdGUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dXBkYXRlU2VsZWN0ZWREYXRlOiBmdW5jdGlvbiggZSwgY2xvc2UgKSB7XHJcblx0XHRcdHZhciB0YXJnZXQgPSBlLnRhcmdldCxcclxuXHRcdFx0XHRtb2RpZmllciA9IDAsXHJcblx0XHRcdFx0dmlld0RhdGUgPSB0aGlzLnN0YXRlLnZpZXdEYXRlLFxyXG5cdFx0XHRcdGN1cnJlbnREYXRlID0gdGhpcy5zdGF0ZS5zZWxlY3RlZERhdGUgfHwgdmlld0RhdGUsXHJcblx0XHRcdFx0ZGF0ZVxyXG5cdCAgICA7XHJcblxyXG5cdFx0XHRpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdyZHREYXknKSAhPT0gLTEpe1xyXG5cdFx0XHRcdGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3JkdE5ldycpICE9PSAtMSlcclxuXHRcdFx0XHRcdG1vZGlmaWVyID0gMTtcclxuXHRcdFx0XHRlbHNlIGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3JkdE9sZCcpICE9PSAtMSlcclxuXHRcdFx0XHRcdG1vZGlmaWVyID0gLTE7XHJcblxyXG5cdFx0XHRcdGRhdGUgPSB2aWV3RGF0ZS5jbG9uZSgpXHJcblx0XHRcdFx0XHQubW9udGgoIHZpZXdEYXRlLm1vbnRoKCkgKyBtb2RpZmllciApXHJcblx0XHRcdFx0XHQuZGF0ZSggcGFyc2VJbnQoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSwgMTAgKSApO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZigncmR0TW9udGgnKSAhPT0gLTEpe1xyXG5cdFx0XHRcdGRhdGUgPSB2aWV3RGF0ZS5jbG9uZSgpXHJcblx0XHRcdFx0XHQubW9udGgoIHBhcnNlSW50KCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyksIDEwICkgKVxyXG5cdFx0XHRcdFx0LmRhdGUoIGN1cnJlbnREYXRlLmRhdGUoKSApO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZigncmR0WWVhcicpICE9PSAtMSl7XHJcblx0XHRcdFx0ZGF0ZSA9IHZpZXdEYXRlLmNsb25lKClcclxuXHRcdFx0XHRcdC5tb250aCggY3VycmVudERhdGUubW9udGgoKSApXHJcblx0XHRcdFx0XHQuZGF0ZSggY3VycmVudERhdGUuZGF0ZSgpIClcclxuXHRcdFx0XHRcdC55ZWFyKCBwYXJzZUludCggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpLCAxMCApICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGRhdGUuaG91cnMoIGN1cnJlbnREYXRlLmhvdXJzKCkgKVxyXG5cdFx0XHRcdC5taW51dGVzKCBjdXJyZW50RGF0ZS5taW51dGVzKCkgKVxyXG5cdFx0XHRcdC5zZWNvbmRzKCBjdXJyZW50RGF0ZS5zZWNvbmRzKCkgKVxyXG5cdFx0XHRcdC5taWxsaXNlY29uZHMoIGN1cnJlbnREYXRlLm1pbGxpc2Vjb25kcygpICk7XHJcblxyXG5cdFx0XHRpZiAoICF0aGlzLnByb3BzLnZhbHVlICl7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0XHRzZWxlY3RlZERhdGU6IGRhdGUsXHJcblx0XHRcdFx0XHR2aWV3RGF0ZTogZGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJyksXHJcblx0XHRcdFx0XHRpbnB1dFZhbHVlOiBkYXRlLmZvcm1hdCggdGhpcy5zdGF0ZS5pbnB1dEZvcm1hdCApLFxyXG5cdFx0XHRcdFx0b3BlbjogISh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgY2xvc2UgKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgY2xvc2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuY2xvc2VDYWxlbmRhcigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5wcm9wcy5vbkNoYW5nZSggZGF0ZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRvcGVuQ2FsZW5kYXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIXRoaXMuc3RhdGUub3Blbikge1xyXG5cdFx0XHRcdHRoaXMucHJvcHMub25Gb2N1cygpO1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBvcGVuOiB0cnVlIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGNsb3NlQ2FsZW5kYXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgb3BlbjogZmFsc2UgfSk7XHJcblx0XHRcdHRoaXMucHJvcHMub25CbHVyKCB0aGlzLnN0YXRlLnNlbGVjdGVkRGF0ZSB8fCB0aGlzLnN0YXRlLmlucHV0VmFsdWUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0aGFuZGxlQ2xpY2tPdXRzaWRlOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoIHRoaXMucHJvcHMuaW5wdXQgJiYgdGhpcy5zdGF0ZS5vcGVuICYmICF0aGlzLnByb3BzLm9wZW4gKXtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgb3BlbjogZmFsc2UgfSk7XHJcblx0XHRcdFx0dGhpcy5wcm9wcy5vbkJsdXIoIHRoaXMuc3RhdGUuc2VsZWN0ZWREYXRlIHx8IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGxvY2FsTW9tZW50OiBmdW5jdGlvbiggZGF0ZSwgZm9ybWF0ICl7XHJcblx0XHRcdHZhciBtID0gbW9tZW50KCBkYXRlLCBmb3JtYXQsIHRoaXMucHJvcHMuc3RyaWN0UGFyc2luZyApO1xyXG5cdFx0XHRpZiAoIHRoaXMucHJvcHMubG9jYWxlIClcclxuXHRcdFx0XHRtLmxvY2FsZSggdGhpcy5wcm9wcy5sb2NhbGUgKTtcclxuXHRcdFx0cmV0dXJuIG07XHJcblx0XHR9LFxyXG5cclxuXHRcdGNvbXBvbmVudFByb3BzOiB7XHJcblx0XHRcdGZyb21Qcm9wczogWyd2YWx1ZScsICdpc1ZhbGlkRGF0ZScsICdyZW5kZXJEYXknLCAncmVuZGVyTW9udGgnLCAncmVuZGVyWWVhcicsICd0aW1lQ29uc3RyYWludHMnXSxcclxuXHRcdFx0ZnJvbVN0YXRlOiBbJ3ZpZXdEYXRlJywgJ3NlbGVjdGVkRGF0ZScsICd1cGRhdGVPbiddLFxyXG5cdFx0XHRmcm9tVGhpczogWydzZXREYXRlJywgJ3NldFRpbWUnLCAnc2hvd1ZpZXcnLCAnYWRkVGltZScsICdzdWJ0cmFjdFRpbWUnLCAndXBkYXRlU2VsZWN0ZWREYXRlJywgJ2xvY2FsTW9tZW50J11cclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0Q29tcG9uZW50UHJvcHM6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBtZSA9IHRoaXMsXHJcblx0XHRcdFx0Zm9ybWF0cyA9IHRoaXMuZ2V0Rm9ybWF0cyggdGhpcy5wcm9wcyApLFxyXG5cdFx0XHRcdHByb3BzID0ge2RhdGVGb3JtYXQ6IGZvcm1hdHMuZGF0ZSwgdGltZUZvcm1hdDogZm9ybWF0cy50aW1lfVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHR0aGlzLmNvbXBvbmVudFByb3BzLmZyb21Qcm9wcy5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApe1xyXG5cdFx0XHRcdHByb3BzWyBuYW1lIF0gPSBtZS5wcm9wc1sgbmFtZSBdO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5jb21wb25lbnRQcm9wcy5mcm9tU3RhdGUuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKXtcclxuXHRcdFx0XHRwcm9wc1sgbmFtZSBdID0gbWUuc3RhdGVbIG5hbWUgXTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMuY29tcG9uZW50UHJvcHMuZnJvbVRoaXMuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKXtcclxuXHRcdFx0XHRwcm9wc1sgbmFtZSBdID0gbWVbIG5hbWUgXTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gcHJvcHM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBjdXJyZW50VmlldyA9IHRoaXMucHJvcHMuY3VycmVudFZpZXcgfHwgdGhpcy5zdGF0ZS5jdXJyZW50VmlldztcclxuXHRcdFx0dmFyIENvbXBvbmVudCA9IHRoaXMudmlld0NvbXBvbmVudHNbIGN1cnJlbnRWaWV3IF0sXHJcblx0XHRcdFx0RE9NID0gUmVhY3QuRE9NLFxyXG5cdFx0XHRcdGNsYXNzTmFtZSA9ICdyZHQnICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lID9cclxuXHQgICAgICAgICAgICAgICAgICAoIEFycmF5LmlzQXJyYXkoIHRoaXMucHJvcHMuY2xhc3NOYW1lICkgP1xyXG5cdCAgICAgICAgICAgICAgICAgICcgJyArIHRoaXMucHJvcHMuY2xhc3NOYW1lLmpvaW4oICcgJyApIDogJyAnICsgdGhpcy5wcm9wcy5jbGFzc05hbWUpIDogJycpLFxyXG5cdFx0XHRcdGNoaWxkcmVuID0gW11cclxuXHRcdFx0O1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLnByb3BzLmlucHV0ICl7XHJcblx0XHRcdFx0Y2hpbGRyZW4gPSBbIERPTS5pbnB1dCggYXNzaWduKHtcclxuXHRcdFx0XHRcdGtleTogJ2knLFxyXG5cdFx0XHRcdFx0dHlwZTondGV4dCcsXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdmb3JtLWNvbnRyb2wnLFxyXG5cdFx0XHRcdFx0b25Gb2N1czogdGhpcy5vcGVuQ2FsZW5kYXIsXHJcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5vbklucHV0Q2hhbmdlLFxyXG5cdFx0XHRcdFx0b25LZXlEb3duOiB0aGlzLm9uSW5wdXRLZXksXHJcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5pbnB1dFZhbHVlXHJcblx0XHRcdFx0fSwgdGhpcy5wcm9wcy5pbnB1dFByb3BzICkpXTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjbGFzc05hbWUgKz0gJyByZHRTdGF0aWMnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMucHJvcHMub3BlbmVkIHx8IHRoaXMuc3RhdGUub3BlbiApXHJcblx0XHRcdFx0Y2xhc3NOYW1lICs9ICcgcmR0T3Blbic7XHJcblxyXG5cdFx0XHRyZXR1cm4gRE9NLmRpdih7Y2xhc3NOYW1lOiBjbGFzc05hbWV9LCBjaGlsZHJlbi5jb25jYXQoXHJcblx0XHRcdFx0RE9NLmRpdihcclxuXHRcdFx0XHRcdHsga2V5OiAnZHQnLCBjbGFzc05hbWU6ICdyZHRQaWNrZXInIH0sXHJcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCBDb21wb25lbnQsIHRoaXMuZ2V0Q29tcG9uZW50UHJvcHMoKSlcclxuXHRcdFx0XHQpXHJcblx0XHRcdCkpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQvLyBNYWtlIG1vbWVudCBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIERhdGV0aW1lIGNsYXNzXHJcblx0RGF0ZXRpbWUubW9tZW50ID0gbW9tZW50O1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IERhdGV0aW1lO1xyXG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5cdGZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRcdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gT2JqZWN0KHZhbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvd25FbnVtZXJhYmxlS2V5cyhvYmopIHtcblx0XHR2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0a2V5cyA9IGtleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtleXMuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBwcm9wSXNFbnVtZXJhYmxlLmNhbGwob2JqLCBrZXkpO1xuXHRcdH0pO1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHRcdHZhciBmcm9tO1xuXHRcdHZhciBrZXlzO1xuXHRcdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0XHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRcdGtleXMgPSBvd25FbnVtZXJhYmxlS2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0bztcblx0fTtcblxuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXztcblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKSxcclxuXHRcdG1vbWVudCA9IF9fd2VicGFja19yZXF1aXJlX18oNClcclxuXHQ7XHJcblxyXG5cdHZhciBET00gPSBSZWFjdC5ET007XHJcblx0dmFyIERhdGVUaW1lUGlja2VyRGF5cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZm9vdGVyID0gdGhpcy5yZW5kZXJGb290ZXIoKSxcclxuXHRcdFx0XHRkYXRlID0gdGhpcy5wcm9wcy52aWV3RGF0ZSxcclxuXHRcdFx0XHRsb2NhbGUgPSBkYXRlLmxvY2FsZURhdGEoKSxcclxuXHRcdFx0XHR0YWJsZUNoaWxkcmVuXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdHRhYmxlQ2hpbGRyZW4gPSBbXHJcblx0XHRcdFx0RE9NLnRoZWFkKHsga2V5OiAndGgnfSwgW1xyXG5cdFx0XHRcdFx0RE9NLnRyKHsga2V5OiAnaCd9LCBbXHJcblx0XHRcdFx0XHRcdERPTS50aCh7IGtleTogJ3AnLCBjbGFzc05hbWU6ICdyZHRQcmV2JyB9LCBET00uc3Bhbih7b25DbGljazogdGhpcy5wcm9wcy5zdWJ0cmFjdFRpbWUoMSwgJ21vbnRocycpfSwgJ+KAuScpKSxcclxuXHRcdFx0XHRcdFx0RE9NLnRoKHsga2V5OiAncycsIGNsYXNzTmFtZTogJ3JkdFN3aXRjaCcsIG9uQ2xpY2s6IHRoaXMucHJvcHMuc2hvd1ZpZXcoJ21vbnRocycpLCBjb2xTcGFuOiA1LCAnZGF0YS12YWx1ZSc6IHRoaXMucHJvcHMudmlld0RhdGUubW9udGgoKSB9LCBsb2NhbGUubW9udGhzKCBkYXRlICkgKyAnICcgKyBkYXRlLnllYXIoKSApLFxyXG5cdFx0XHRcdFx0XHRET00udGgoeyBrZXk6ICduJywgY2xhc3NOYW1lOiAncmR0TmV4dCcgfSwgRE9NLnNwYW4oe29uQ2xpY2s6IHRoaXMucHJvcHMuYWRkVGltZSgxLCAnbW9udGhzJyl9LCAn4oC6JykpXHJcblx0XHRcdFx0XHRdKSxcclxuXHRcdFx0XHRcdERPTS50cih7IGtleTogJ2QnfSwgdGhpcy5nZXREYXlzT2ZXZWVrKCBsb2NhbGUgKS5tYXAoIGZ1bmN0aW9uKCBkYXksIGluZGV4ICl7IHJldHVybiBET00udGgoeyBrZXk6IGRheSArIGluZGV4LCBjbGFzc05hbWU6ICdkb3cnfSwgZGF5ICk7IH0pIClcclxuXHRcdFx0XHRdKSxcclxuXHRcdFx0XHRET00udGJvZHkoe2tleTogJ3RiJ30sIHRoaXMucmVuZGVyRGF5cygpKVxyXG5cdFx0XHRdO1xyXG5cclxuXHRcdFx0aWYgKCBmb290ZXIgKVxyXG5cdFx0XHRcdHRhYmxlQ2hpbGRyZW4ucHVzaCggZm9vdGVyICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gRE9NLmRpdih7IGNsYXNzTmFtZTogJ3JkdERheXMnIH0sXHJcblx0XHRcdFx0RE9NLnRhYmxlKHt9LCB0YWJsZUNoaWxkcmVuIClcclxuXHRcdFx0KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBHZXQgYSBsaXN0IG9mIHRoZSBkYXlzIG9mIHRoZSB3ZWVrXHJcblx0XHQgKiBkZXBlbmRpbmcgb24gdGhlIGN1cnJlbnQgbG9jYWxlXHJcblx0XHQgKiBAcmV0dXJuIHthcnJheX0gQSBsaXN0IHdpdGggdGhlIHNob3J0bmFtZSBvZiB0aGUgZGF5c1xyXG5cdFx0ICovXHJcblx0XHRnZXREYXlzT2ZXZWVrOiBmdW5jdGlvbiggbG9jYWxlICl7XHJcblx0XHRcdHZhciBkYXlzID0gbG9jYWxlLl93ZWVrZGF5c01pbixcclxuXHRcdFx0XHRmaXJzdCA9IGxvY2FsZS5maXJzdERheU9mV2VlaygpLFxyXG5cdFx0XHRcdGRvdyA9IFtdLFxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdGRheXMuZm9yRWFjaCggZnVuY3Rpb24oIGRheSApe1xyXG5cdFx0XHRcdGRvd1sgKDcgKyAoaSsrKSAtIGZpcnN0KSAlIDcgXSA9IGRheTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZG93O1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZW5kZXJEYXlzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGRhdGUgPSB0aGlzLnByb3BzLnZpZXdEYXRlLFxyXG5cdFx0XHRcdHNlbGVjdGVkID0gdGhpcy5wcm9wcy5zZWxlY3RlZERhdGUgJiYgdGhpcy5wcm9wcy5zZWxlY3RlZERhdGUuY2xvbmUoKSxcclxuXHRcdFx0XHRwcmV2TW9udGggPSBkYXRlLmNsb25lKCkuc3VidHJhY3QoIDEsICdtb250aHMnICksXHJcblx0XHRcdFx0Y3VycmVudFllYXIgPSBkYXRlLnllYXIoKSxcclxuXHRcdFx0XHRjdXJyZW50TW9udGggPSBkYXRlLm1vbnRoKCksXHJcblx0XHRcdFx0d2Vla3MgPSBbXSxcclxuXHRcdFx0XHRkYXlzID0gW10sXHJcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnByb3BzLnJlbmRlckRheSB8fCB0aGlzLnJlbmRlckRheSxcclxuXHRcdFx0XHRpc1ZhbGlkID0gdGhpcy5wcm9wcy5pc1ZhbGlkRGF0ZSB8fCB0aGlzLmlzVmFsaWREYXRlLFxyXG5cdFx0XHRcdGNsYXNzZXMsIGRpc2FibGVkLCBkYXlQcm9wcywgY3VycmVudERhdGVcclxuXHRcdFx0O1xyXG5cclxuXHRcdFx0Ly8gR28gdG8gdGhlIGxhc3Qgd2VlayBvZiB0aGUgcHJldmlvdXMgbW9udGhcclxuXHRcdFx0cHJldk1vbnRoLmRhdGUoIHByZXZNb250aC5kYXlzSW5Nb250aCgpICkuc3RhcnRPZignd2VlaycpO1xyXG5cdFx0XHR2YXIgbGFzdERheSA9IHByZXZNb250aC5jbG9uZSgpLmFkZCg0MiwgJ2QnKTtcclxuXHJcblx0XHRcdHdoaWxlICggcHJldk1vbnRoLmlzQmVmb3JlKCBsYXN0RGF5ICkgKXtcclxuXHRcdFx0XHRjbGFzc2VzID0gJ3JkdERheSc7XHJcblx0XHRcdFx0Y3VycmVudERhdGUgPSBwcmV2TW9udGguY2xvbmUoKTtcclxuXHJcblx0XHRcdFx0aWYgKCAoIHByZXZNb250aC55ZWFyKCkgPT09IGN1cnJlbnRZZWFyICYmIHByZXZNb250aC5tb250aCgpIDwgY3VycmVudE1vbnRoICkgfHwgKCBwcmV2TW9udGgueWVhcigpIDwgY3VycmVudFllYXIgKSApXHJcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0T2xkJztcclxuXHRcdFx0XHRlbHNlIGlmICggKCBwcmV2TW9udGgueWVhcigpID09PSBjdXJyZW50WWVhciAmJiBwcmV2TW9udGgubW9udGgoKSA+IGN1cnJlbnRNb250aCApIHx8ICggcHJldk1vbnRoLnllYXIoKSA+IGN1cnJlbnRZZWFyICkgKVxyXG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdE5ldyc7XHJcblxyXG5cdFx0XHRcdGlmICggc2VsZWN0ZWQgJiYgcHJldk1vbnRoLmlzU2FtZShzZWxlY3RlZCwgJ2RheScpIClcclxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRBY3RpdmUnO1xyXG5cclxuXHRcdFx0XHRpZiAocHJldk1vbnRoLmlzU2FtZShtb21lbnQoKSwgJ2RheScpIClcclxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRUb2RheSc7XHJcblxyXG5cdFx0XHRcdGRpc2FibGVkID0gIWlzVmFsaWQoIGN1cnJlbnREYXRlLCBzZWxlY3RlZCApO1xyXG5cdFx0XHRcdGlmICggZGlzYWJsZWQgKVxyXG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdERpc2FibGVkJztcclxuXHJcblx0XHRcdFx0ZGF5UHJvcHMgPSB7XHJcblx0XHRcdFx0XHRrZXk6IHByZXZNb250aC5mb3JtYXQoJ01fRCcpLFxyXG5cdFx0XHRcdFx0J2RhdGEtdmFsdWUnOiBwcmV2TW9udGguZGF0ZSgpLFxyXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBjbGFzc2VzXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoICFkaXNhYmxlZCApXHJcblx0XHRcdFx0XHRkYXlQcm9wcy5vbkNsaWNrID0gdGhpcy51cGRhdGVTZWxlY3RlZERhdGU7XHJcblxyXG5cdFx0XHRcdGRheXMucHVzaCggcmVuZGVyZXIoIGRheVByb3BzLCBjdXJyZW50RGF0ZSwgc2VsZWN0ZWQgKSApO1xyXG5cclxuXHRcdFx0XHRpZiAoIGRheXMubGVuZ3RoID09PSA3ICl7XHJcblx0XHRcdFx0XHR3ZWVrcy5wdXNoKCBET00udHIoIHtrZXk6IHByZXZNb250aC5mb3JtYXQoJ01fRCcpfSwgZGF5cyApICk7XHJcblx0XHRcdFx0XHRkYXlzID0gW107XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRwcmV2TW9udGguYWRkKCAxLCAnZCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHdlZWtzO1xyXG5cdFx0fSxcclxuXHJcblx0XHR1cGRhdGVTZWxlY3RlZERhdGU6IGZ1bmN0aW9uKCBldmVudCApIHtcclxuXHRcdFx0dGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZERhdGUoZXZlbnQsIHRydWUpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZW5kZXJEYXk6IGZ1bmN0aW9uKCBwcm9wcywgY3VycmVudERhdGUgKXtcclxuXHRcdFx0cmV0dXJuIERPTS50ZCggcHJvcHMsIGN1cnJlbnREYXRlLmRhdGUoKSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZW5kZXJGb290ZXI6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmICggIXRoaXMucHJvcHMudGltZUZvcm1hdCApXHJcblx0XHRcdFx0cmV0dXJuICcnO1xyXG5cclxuXHRcdFx0dmFyIGRhdGUgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSB8fCB0aGlzLnByb3BzLnZpZXdEYXRlO1xyXG5cclxuXHRcdFx0cmV0dXJuIERPTS50Zm9vdCh7IGtleTogJ3RmJ30sXHJcblx0XHRcdFx0RE9NLnRyKHt9LFxyXG5cdFx0XHRcdFx0RE9NLnRkKHsgb25DbGljazogdGhpcy5wcm9wcy5zaG93VmlldygndGltZScpLCBjb2xTcGFuOiA3LCBjbGFzc05hbWU6ICdyZHRUaW1lVG9nZ2xlJ30sIGRhdGUuZm9ybWF0KCB0aGlzLnByb3BzLnRpbWVGb3JtYXQgKSlcclxuXHRcdFx0XHQpXHJcblx0XHRcdCk7XHJcblx0XHR9LFxyXG5cdFx0aXNWYWxpZERhdGU6IGZ1bmN0aW9uKCl7IHJldHVybiAxOyB9XHJcblx0fSk7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZVRpbWVQaWNrZXJEYXlzO1xyXG5cblxuLyoqKi8gfSxcbi8qIDQgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV80X187XG5cbi8qKiovIH0sXG4vKiA1ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XHJcblxyXG5cdHZhciBET00gPSBSZWFjdC5ET007XHJcblx0dmFyIERhdGVUaW1lUGlja2VyTW9udGhzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdFx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIERPTS5kaXYoeyBjbGFzc05hbWU6ICdyZHRNb250aHMnIH0sIFtcclxuXHRcdFx0XHRET00udGFibGUoeyBrZXk6ICdhJ30sIERPTS50aGVhZCh7fSwgRE9NLnRyKHt9LCBbXHJcblx0XHRcdFx0XHRET00udGgoeyBrZXk6ICdwcmV2JywgY2xhc3NOYW1lOiAncmR0UHJldicgfSwgRE9NLnNwYW4oe29uQ2xpY2s6IHRoaXMucHJvcHMuc3VidHJhY3RUaW1lKDEsICd5ZWFycycpfSwgJ+KAuScpKSxcclxuXHRcdFx0XHRcdERPTS50aCh7IGtleTogJ3llYXInLCBjbGFzc05hbWU6ICdyZHRTd2l0Y2gnLCBvbkNsaWNrOiB0aGlzLnByb3BzLnNob3dWaWV3KCd5ZWFycycpLCBjb2xTcGFuOiAyLCAnZGF0YS12YWx1ZSc6IHRoaXMucHJvcHMudmlld0RhdGUueWVhcigpfSwgdGhpcy5wcm9wcy52aWV3RGF0ZS55ZWFyKCkgKSxcclxuXHRcdFx0XHRcdERPTS50aCh7IGtleTogJ25leHQnLCBjbGFzc05hbWU6ICdyZHROZXh0JyB9LCBET00uc3Bhbih7b25DbGljazogdGhpcy5wcm9wcy5hZGRUaW1lKDEsICd5ZWFycycpfSwgJ+KAuicpKVxyXG5cdFx0XHRcdF0pKSksXHJcblx0XHRcdFx0RE9NLnRhYmxlKHsga2V5OiAnbW9udGhzJ30sIERPTS50Ym9keSh7IGtleTogJ2InfSwgdGhpcy5yZW5kZXJNb250aHMoKSkpXHJcblx0XHRcdF0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZW5kZXJNb250aHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZGF0ZSA9IHRoaXMucHJvcHMuc2VsZWN0ZWREYXRlLFxyXG5cdFx0XHRcdG1vbnRoID0gdGhpcy5wcm9wcy52aWV3RGF0ZS5tb250aCgpLFxyXG5cdFx0XHRcdHllYXIgPSB0aGlzLnByb3BzLnZpZXdEYXRlLnllYXIoKSxcclxuXHRcdFx0XHRyb3dzID0gW10sXHJcblx0XHRcdFx0aSA9IDAsXHJcblx0XHRcdFx0bW9udGhzID0gW10sXHJcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnByb3BzLnJlbmRlck1vbnRoIHx8IHRoaXMucmVuZGVyTW9udGgsXHJcblx0XHRcdFx0Y2xhc3NlcywgcHJvcHNcclxuXHRcdFx0O1xyXG5cclxuXHRcdFx0d2hpbGUgKGkgPCAxMikge1xyXG5cdFx0XHRcdGNsYXNzZXMgPSAncmR0TW9udGgnO1xyXG5cdFx0XHRcdGlmICggZGF0ZSAmJiBpID09PSBtb250aCAmJiB5ZWFyID09PSBkYXRlLnllYXIoKSApXHJcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0QWN0aXZlJztcclxuXHJcblx0XHRcdFx0cHJvcHMgPSB7XHJcblx0XHRcdFx0XHRrZXk6IGksXHJcblx0XHRcdFx0XHQnZGF0YS12YWx1ZSc6IGksXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6IGNsYXNzZXMsXHJcblx0XHRcdFx0XHRvbkNsaWNrOiB0aGlzLnByb3BzLnVwZGF0ZU9uID09PSAnbW9udGhzJz8gdGhpcy51cGRhdGVTZWxlY3RlZE1vbnRoIDogdGhpcy5wcm9wcy5zZXREYXRlKCdtb250aCcpXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0bW9udGhzLnB1c2goIHJlbmRlcmVyKCBwcm9wcywgaSwgeWVhciwgZGF0ZSAmJiBkYXRlLmNsb25lKCkgKSk7XHJcblxyXG5cdFx0XHRcdGlmICggbW9udGhzLmxlbmd0aCA9PT0gNCApe1xyXG5cdFx0XHRcdFx0cm93cy5wdXNoKCBET00udHIoeyBrZXk6IG1vbnRoICsgJ18nICsgcm93cy5sZW5ndGggfSwgbW9udGhzKSApO1xyXG5cdFx0XHRcdFx0bW9udGhzID0gW107XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpKys7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiByb3dzO1xyXG5cdFx0fSxcclxuXHJcblx0XHR1cGRhdGVTZWxlY3RlZE1vbnRoOiBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0XHRcdHRoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWREYXRlKGV2ZW50LCB0cnVlKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0cmVuZGVyTW9udGg6IGZ1bmN0aW9uKCBwcm9wcywgbW9udGggKSB7XHJcblx0XHRcdHZhciBtb250aHNTaG9ydCA9IHRoaXMucHJvcHMudmlld0RhdGUubG9jYWxlRGF0YSgpLl9tb250aHNTaG9ydDtcclxuXHRcdFx0cmV0dXJuIERPTS50ZCggcHJvcHMsIG1vbnRoc1Nob3J0LnN0YW5kYWxvbmVcclxuXHRcdFx0XHQ/IGNhcGl0YWxpemUoIG1vbnRoc1Nob3J0LnN0YW5kYWxvbmVbIG1vbnRoIF0gKVxyXG5cdFx0XHRcdDogbW9udGhzU2hvcnRbIG1vbnRoIF1cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHIpIHtcclxuXHRcdHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XHJcblx0fVxyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IERhdGVUaW1lUGlja2VyTW9udGhzO1xyXG5cblxuLyoqKi8gfSxcbi8qIDYgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcclxuXHJcblx0dmFyIERPTSA9IFJlYWN0LkRPTTtcclxuXHR2YXIgRGF0ZVRpbWVQaWNrZXJZZWFycyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB5ZWFyID0gcGFyc2VJbnQodGhpcy5wcm9wcy52aWV3RGF0ZS55ZWFyKCkgLyAxMCwgMTApICogMTA7XHJcblxyXG5cdFx0XHRyZXR1cm4gRE9NLmRpdih7IGNsYXNzTmFtZTogJ3JkdFllYXJzJyB9LCBbXHJcblx0XHRcdFx0RE9NLnRhYmxlKHsga2V5OiAnYSd9LCBET00udGhlYWQoe30sIERPTS50cih7fSwgW1xyXG5cdFx0XHRcdFx0RE9NLnRoKHsga2V5OiAncHJldicsIGNsYXNzTmFtZTogJ3JkdFByZXYnIH0sIERPTS5zcGFuKHtvbkNsaWNrOiB0aGlzLnByb3BzLnN1YnRyYWN0VGltZSgxMCwgJ3llYXJzJyl9LCAn4oC5JykpLFxyXG5cdFx0XHRcdFx0RE9NLnRoKHsga2V5OiAneWVhcicsIGNsYXNzTmFtZTogJ3JkdFN3aXRjaCcsIG9uQ2xpY2s6IHRoaXMucHJvcHMuc2hvd1ZpZXcoJ3llYXJzJyksIGNvbFNwYW46IDIgfSwgeWVhciArICctJyArICh5ZWFyICsgOSkgKSxcclxuXHRcdFx0XHRcdERPTS50aCh7IGtleTogJ25leHQnLCBjbGFzc05hbWU6ICdyZHROZXh0J30sIERPTS5zcGFuKHtvbkNsaWNrOiB0aGlzLnByb3BzLmFkZFRpbWUoMTAsICd5ZWFycycpfSwgJ+KAuicpKVxyXG5cdFx0XHRcdFx0XSkpKSxcclxuXHRcdFx0XHRET00udGFibGUoeyBrZXk6ICd5ZWFycyd9LCBET00udGJvZHkoe30sIHRoaXMucmVuZGVyWWVhcnMoIHllYXIgKSkpXHJcblx0XHRcdF0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZW5kZXJZZWFyczogZnVuY3Rpb24oIHllYXIgKSB7XHJcblx0XHRcdHZhciB5ZWFycyA9IFtdLFxyXG5cdFx0XHRcdGkgPSAtMSxcclxuXHRcdFx0XHRyb3dzID0gW10sXHJcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnByb3BzLnJlbmRlclllYXIgfHwgdGhpcy5yZW5kZXJZZWFyLFxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZSA9IHRoaXMucHJvcHMuc2VsZWN0ZWREYXRlLFxyXG5cdFx0XHRcdGNsYXNzZXMsIHByb3BzXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdHllYXItLTtcclxuXHRcdFx0d2hpbGUgKGkgPCAxMSkge1xyXG5cdFx0XHRcdGNsYXNzZXMgPSAncmR0WWVhcic7XHJcblx0XHRcdFx0aWYgKCBpID09PSAtMSB8IGkgPT09IDEwIClcclxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRPbGQnO1xyXG5cdFx0XHRcdGlmICggc2VsZWN0ZWREYXRlICYmIHNlbGVjdGVkRGF0ZS55ZWFyKCkgPT09IHllYXIgKVxyXG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdEFjdGl2ZSc7XHJcblxyXG5cdFx0XHRcdHByb3BzID0ge1xyXG5cdFx0XHRcdFx0a2V5OiB5ZWFyLFxyXG5cdFx0XHRcdFx0J2RhdGEtdmFsdWUnOiB5ZWFyLFxyXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBjbGFzc2VzLFxyXG5cdFx0XHRcdFx0b25DbGljazogdGhpcy5wcm9wcy51cGRhdGVPbiA9PT0gJ3llYXJzJyA/IHRoaXMudXBkYXRlU2VsZWN0ZWRZZWFyIDogdGhpcy5wcm9wcy5zZXREYXRlKCd5ZWFyJylcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR5ZWFycy5wdXNoKCByZW5kZXJlciggcHJvcHMsIHllYXIsIHNlbGVjdGVkRGF0ZSAmJiBzZWxlY3RlZERhdGUuY2xvbmUoKSApKTtcclxuXHJcblx0XHRcdFx0aWYgKCB5ZWFycy5sZW5ndGggPT09IDQgKXtcclxuXHRcdFx0XHRcdHJvd3MucHVzaCggRE9NLnRyKHsga2V5OiBpIH0sIHllYXJzICkgKTtcclxuXHRcdFx0XHRcdHllYXJzID0gW107XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR5ZWFyKys7XHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gcm93cztcclxuXHRcdH0sXHJcblxyXG5cdFx0dXBkYXRlU2VsZWN0ZWRZZWFyOiBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0XHRcdHRoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWREYXRlKGV2ZW50LCB0cnVlKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0cmVuZGVyWWVhcjogZnVuY3Rpb24oIHByb3BzLCB5ZWFyICl7XHJcblx0XHRcdHJldHVybiBET00udGQoIHByb3BzLCB5ZWFyICk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZVRpbWVQaWNrZXJZZWFycztcclxuXG5cbi8qKiovIH0sXG4vKiA3ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMiksXHJcblx0XHRhc3NpZ24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xyXG5cclxuXHR2YXIgRE9NID0gUmVhY3QuRE9NO1xyXG5cdHZhciBEYXRlVGltZVBpY2tlclRpbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0XHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiB0aGlzLmNhbGN1bGF0ZVN0YXRlKCB0aGlzLnByb3BzICk7XHJcblx0XHR9LFxyXG5cdFx0Y2FsY3VsYXRlU3RhdGU6IGZ1bmN0aW9uKCBwcm9wcyApe1xyXG5cdFx0XHR2YXIgZGF0ZSA9IHByb3BzLnNlbGVjdGVkRGF0ZSB8fCBwcm9wcy52aWV3RGF0ZSxcclxuXHRcdFx0XHRmb3JtYXQgPSBwcm9wcy50aW1lRm9ybWF0LFxyXG5cdFx0XHRcdGNvdW50ZXJzID0gW11cclxuXHRcdFx0O1xyXG5cclxuXHRcdFx0aWYgKCBmb3JtYXQuaW5kZXhPZignSCcpICE9PSAtMSB8fCBmb3JtYXQuaW5kZXhPZignaCcpICE9PSAtMSApe1xyXG5cdFx0XHRcdGNvdW50ZXJzLnB1c2goJ2hvdXJzJyk7XHJcblx0XHRcdFx0aWYgKCBmb3JtYXQuaW5kZXhPZignbScpICE9PSAtMSApe1xyXG5cdFx0XHRcdFx0Y291bnRlcnMucHVzaCgnbWludXRlcycpO1xyXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXQuaW5kZXhPZigncycpICE9PSAtMSApe1xyXG5cdFx0XHRcdFx0XHRjb3VudGVycy5wdXNoKCdzZWNvbmRzJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgZGF5cGFydCA9IGZhbHNlO1xyXG5cdFx0XHRpZiAoIHRoaXMucHJvcHMudGltZUZvcm1hdC5pbmRleE9mKCcgQScpICE9PSAtMSAgJiYgdGhpcy5zdGF0ZSAhPT0gbnVsbCApe1xyXG5cdFx0XHRcdGRheXBhcnQgPSAoIHRoaXMuc3RhdGUuaG91cnMgPj0gMTIgKSA/ICdQTScgOiAnQU0nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGhvdXJzOiBkYXRlLmZvcm1hdCgnSCcpLFxyXG5cdFx0XHRcdG1pbnV0ZXM6IGRhdGUuZm9ybWF0KCdtbScpLFxyXG5cdFx0XHRcdHNlY29uZHM6IGRhdGUuZm9ybWF0KCdzcycpLFxyXG5cdFx0XHRcdG1pbGxpc2Vjb25kczogZGF0ZS5mb3JtYXQoJ1NTUycpLFxyXG5cdFx0XHRcdGRheXBhcnQ6IGRheXBhcnQsXHJcblx0XHRcdFx0Y291bnRlcnM6IGNvdW50ZXJzXHJcblx0XHRcdH07XHJcblx0XHR9LFxyXG5cdFx0cmVuZGVyQ291bnRlcjogZnVuY3Rpb24oIHR5cGUgKXtcclxuXHRcdFx0aWYgKHR5cGUgIT09ICdkYXlwYXJ0Jykge1xyXG5cdFx0XHRcdHZhciB2YWx1ZSA9IHRoaXMuc3RhdGVbIHR5cGUgXTtcclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2hvdXJzJyAmJiB0aGlzLnByb3BzLnRpbWVGb3JtYXQuaW5kZXhPZignIEEnKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRcdHZhbHVlID0gKHZhbHVlIC0gMSkgJSAxMiArIDE7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdHZhbHVlID0gMTI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBET00uZGl2KHsga2V5OiB0eXBlLCBjbGFzc05hbWU6ICdyZHRDb3VudGVyJ30sIFtcclxuXHRcdFx0XHRcdERPTS5zcGFuKHsga2V5Oid1cCcsIGNsYXNzTmFtZTogJ3JkdEJ0bicsIG9uTW91c2VEb3duOiB0aGlzLm9uU3RhcnRDbGlja2luZyggJ2luY3JlYXNlJywgdHlwZSApIH0sICfilrInICksXHJcblx0XHRcdFx0XHRET00uZGl2KHsga2V5OidjJywgY2xhc3NOYW1lOiAncmR0Q291bnQnIH0sIHZhbHVlICksXHJcblx0XHRcdFx0XHRET00uc3Bhbih7IGtleTonZG8nLCBjbGFzc05hbWU6ICdyZHRCdG4nLCBvbk1vdXNlRG93bjogdGhpcy5vblN0YXJ0Q2xpY2tpbmcoICdkZWNyZWFzZScsIHR5cGUgKSB9LCAn4pa8JyApXHJcblx0XHRcdFx0XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0fSxcclxuXHRcdHJlbmRlckRheVBhcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRE9NLmRpdih7IGNsYXNzTmFtZTogJ3JkdENvdW50ZXInLCBrZXk6ICdkYXlQYXJ0J30sIFtcclxuXHRcdFx0XHRET00uc3Bhbih7IGtleTondXAnLCBjbGFzc05hbWU6ICdyZHRCdG4nLCBvbk1vdXNlRG93bjogdGhpcy5vblN0YXJ0Q2xpY2tpbmcoICd0b2dnbGVEYXlQYXJ0JywgJ2hvdXJzJykgfSwgJ+KWsicgKSxcclxuXHRcdFx0XHRET00uZGl2KHsga2V5OiB0aGlzLnN0YXRlLmRheXBhcnQsIGNsYXNzTmFtZTogJ3JkdENvdW50J30sIHRoaXMuc3RhdGUuZGF5cGFydCApLFxyXG5cdFx0XHRcdERPTS5zcGFuKHsga2V5OidkbycsIGNsYXNzTmFtZTogJ3JkdEJ0bicsIG9uTW91c2VEb3duOiB0aGlzLm9uU3RhcnRDbGlja2luZyggJ3RvZ2dsZURheVBhcnQnLCAnaG91cnMnKSB9LCAn4pa8JyApXHJcblx0XHRcdF0pO1xyXG5cdFx0fSxcclxuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBtZSA9IHRoaXMsXHJcblx0XHRcdFx0Y291bnRlcnMgPSBbXVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHR0aGlzLnN0YXRlLmNvdW50ZXJzLmZvckVhY2goIGZ1bmN0aW9uKGMpe1xyXG5cdFx0XHRcdGlmICggY291bnRlcnMubGVuZ3RoIClcclxuXHRcdFx0XHRcdGNvdW50ZXJzLnB1c2goIERPTS5kaXYoIHtrZXk6ICdzZXAnICsgY291bnRlcnMubGVuZ3RoLCBjbGFzc05hbWU6ICdyZHRDb3VudGVyU2VwYXJhdG9yJyB9LCAnOicgKSk7XHJcblx0XHRcdFx0Y291bnRlcnMucHVzaCggbWUucmVuZGVyQ291bnRlciggYyApICk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc3RhdGUuZGF5cGFydCAhPT0gZmFsc2UpIHtcclxuXHRcdFx0XHRjb3VudGVycy5wdXNoKCBtZS5yZW5kZXJEYXlQYXJ0KCkgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCB0aGlzLnN0YXRlLmNvdW50ZXJzLmxlbmd0aCA9PT0gMyAmJiB0aGlzLnByb3BzLnRpbWVGb3JtYXQuaW5kZXhPZignUycpICE9PSAtMSApe1xyXG5cdFx0XHRcdGNvdW50ZXJzLnB1c2goIERPTS5kaXYoIHtjbGFzc05hbWU6ICdyZHRDb3VudGVyU2VwYXJhdG9yJywga2V5OiAnc2VwNScgfSwgJzonICkpO1xyXG5cdFx0XHRcdGNvdW50ZXJzLnB1c2goXHJcblx0XHRcdFx0XHRET00uZGl2KCB7Y2xhc3NOYW1lOiAncmR0Q291bnRlciByZHRNaWxsaScsIGtleTonbSd9LFxyXG5cdFx0XHRcdFx0XHRET00uaW5wdXQoeyB2YWx1ZTogdGhpcy5zdGF0ZS5taWxsaXNlY29uZHMsIHR5cGU6ICd0ZXh0Jywgb25DaGFuZ2U6IHRoaXMudXBkYXRlTWlsbGkgfSlcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIERPTS5kaXYoIHtjbGFzc05hbWU6ICdyZHRUaW1lJ30sXHJcblx0XHRcdFx0RE9NLnRhYmxlKCB7fSwgW1xyXG5cdFx0XHRcdFx0dGhpcy5yZW5kZXJIZWFkZXIoKSxcclxuXHRcdFx0XHRcdERPTS50Ym9keSh7a2V5OiAnYid9LCBET00udHIoe30sIERPTS50ZCh7fSxcclxuXHRcdFx0XHRcdFx0RE9NLmRpdih7IGNsYXNzTmFtZTogJ3JkdENvdW50ZXJzJyB9LCBjb3VudGVycyApXHJcblx0XHRcdFx0XHQpKSlcclxuXHRcdFx0XHRdKVxyXG5cdFx0XHQpO1xyXG5cdFx0fSxcclxuXHRcdGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdG1lLnRpbWVDb25zdHJhaW50cyA9IHtcclxuXHRcdFx0XHRob3Vyczoge1xyXG5cdFx0XHRcdFx0bWluOiAwLFxyXG5cdFx0XHRcdFx0bWF4OiAyMyxcclxuXHRcdFx0XHRcdHN0ZXA6IDFcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG1pbnV0ZXM6IHtcclxuXHRcdFx0XHRcdG1pbjogMCxcclxuXHRcdFx0XHRcdG1heDogNTksXHJcblx0XHRcdFx0XHRzdGVwOiAxXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRzZWNvbmRzOiB7XHJcblx0XHRcdFx0XHRtaW46IDAsXHJcblx0XHRcdFx0XHRtYXg6IDU5LFxyXG5cdFx0XHRcdFx0c3RlcDogMSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG1pbGxpc2Vjb25kczoge1xyXG5cdFx0XHRcdFx0bWluOiAwLFxyXG5cdFx0XHRcdFx0bWF4OiA5OTksXHJcblx0XHRcdFx0XHRzdGVwOiAxXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRbJ2hvdXJzJywgJ21pbnV0ZXMnLCAnc2Vjb25kcycsICdtaWxsaXNlY29uZHMnXS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUpIHtcclxuXHRcdFx0XHRhc3NpZ24obWUudGltZUNvbnN0cmFpbnRzW3R5cGVdLCBtZS5wcm9wcy50aW1lQ29uc3RyYWludHNbdHlwZV0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSggdGhpcy5jYWxjdWxhdGVTdGF0ZSggdGhpcy5wcm9wcyApICk7XHJcblx0XHR9LFxyXG5cdFx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24oIG5leHRQcm9wcyApe1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKCB0aGlzLmNhbGN1bGF0ZVN0YXRlKCBuZXh0UHJvcHMgKSApO1xyXG5cdFx0fSxcclxuXHRcdHVwZGF0ZU1pbGxpOiBmdW5jdGlvbiggZSApe1xyXG5cdFx0XHR2YXIgbWlsbGkgPSBwYXJzZUludCggZS50YXJnZXQudmFsdWUsIDEwICk7XHJcblx0XHRcdGlmICggbWlsbGkgPT09IGUudGFyZ2V0LnZhbHVlICYmIG1pbGxpID49IDAgJiYgbWlsbGkgPCAxMDAwICl7XHJcblx0XHRcdFx0dGhpcy5wcm9wcy5zZXRUaW1lKCAnbWlsbGlzZWNvbmRzJywgbWlsbGkgKTtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgbWlsbGlzZWNvbmRzOiBtaWxsaSB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHJlbmRlckhlYWRlcjogZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKCAhdGhpcy5wcm9wcy5kYXRlRm9ybWF0IClcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHRcdHZhciBkYXRlID0gdGhpcy5wcm9wcy5zZWxlY3RlZERhdGUgfHwgdGhpcy5wcm9wcy52aWV3RGF0ZTtcclxuXHRcdFx0cmV0dXJuIERPTS50aGVhZCh7IGtleTogJ2gnfSwgRE9NLnRyKHt9LFxyXG5cdFx0XHRcdERPTS50aCgge2NsYXNzTmFtZTogJ3JkdFN3aXRjaCcsIGNvbFNwYW46IDQsIG9uQ2xpY2s6IHRoaXMucHJvcHMuc2hvd1ZpZXcoJ2RheXMnKX0sIGRhdGUuZm9ybWF0KCB0aGlzLnByb3BzLmRhdGVGb3JtYXQgKSApXHJcblx0XHRcdCkpO1xyXG5cdFx0fSxcclxuXHRcdG9uU3RhcnRDbGlja2luZzogZnVuY3Rpb24oIGFjdGlvbiwgdHlwZSApe1xyXG5cdFx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHVwZGF0ZSA9IHt9O1xyXG5cdFx0XHRcdHVwZGF0ZVsgdHlwZSBdID0gbWVbIGFjdGlvbiBdKCB0eXBlICk7XHJcblx0XHRcdFx0bWUuc2V0U3RhdGUoIHVwZGF0ZSApO1xyXG5cclxuXHRcdFx0XHRtZS50aW1lciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRtZS5pbmNyZWFzZVRpbWVyID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdHVwZGF0ZVsgdHlwZSBdID0gbWVbIGFjdGlvbiBdKCB0eXBlICk7XHJcblx0XHRcdFx0XHRcdG1lLnNldFN0YXRlKCB1cGRhdGUgKTtcclxuXHRcdFx0XHRcdH0sIDcwKTtcclxuXHRcdFx0XHR9LCA1MDApO1xyXG5cclxuXHRcdFx0XHRtZS5tb3VzZVVwTGlzdGVuZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCBtZS50aW1lciApO1xyXG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCggbWUuaW5jcmVhc2VUaW1lciApO1xyXG5cdFx0XHRcdFx0bWUucHJvcHMuc2V0VGltZSggdHlwZSwgbWUuc3RhdGVbIHR5cGUgXSApO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbWUubW91c2VVcExpc3RlbmVyKTtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtZS5tb3VzZVVwTGlzdGVuZXIpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHRcdHBhZFZhbHVlczoge1xyXG5cdFx0XHRob3VyczogMSxcclxuXHRcdFx0bWludXRlczogMixcclxuXHRcdFx0c2Vjb25kczogMixcclxuXHRcdFx0bWlsbGlzZWNvbmRzOiAzXHJcblx0XHR9LFxyXG5cdFx0dG9nZ2xlRGF5UGFydDogZnVuY3Rpb24oIHR5cGUgKXsgLy8gdHlwZSBpcyBhbHdheXMgJ2hvdXJzJ1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBwYXJzZUludCh0aGlzLnN0YXRlWyB0eXBlIF0sIDEwKSArIDEyO1xyXG5cdFx0XHRpZiAoIHZhbHVlID4gdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5tYXggKVxyXG5cdFx0XHRcdHZhbHVlID0gdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5taW4gKyAodmFsdWUgLSAodGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5tYXggKyAxKSk7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhZCggdHlwZSwgdmFsdWUgKTtcclxuXHRcdH0sXHJcblx0XHRpbmNyZWFzZTogZnVuY3Rpb24oIHR5cGUgKXtcclxuXHRcdFx0dmFyIHZhbHVlID0gcGFyc2VJbnQodGhpcy5zdGF0ZVsgdHlwZSBdLCAxMCkgKyB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLnN0ZXA7XHJcblx0XHRcdGlmICggdmFsdWUgPiB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1heCApXHJcblx0XHRcdFx0dmFsdWUgPSB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1pbiArICggdmFsdWUgLSAoIHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWF4ICArIDEpICk7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhZCggdHlwZSwgdmFsdWUgKTtcclxuXHRcdH0sXHJcblx0XHRkZWNyZWFzZTogZnVuY3Rpb24oIHR5cGUgKXtcclxuXHRcdFx0dmFyIHZhbHVlID0gcGFyc2VJbnQodGhpcy5zdGF0ZVsgdHlwZSBdLCAxMCkgLSB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLnN0ZXA7XHJcblx0XHRcdGlmICggdmFsdWUgPCB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1pbiApXHJcblx0XHRcdFx0dmFsdWUgPSB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1heCArIDEgLSAoIHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWluIC0gdmFsdWUgKTtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFkKCB0eXBlLCB2YWx1ZSApO1xyXG5cdFx0fSxcclxuXHRcdHBhZDogZnVuY3Rpb24oIHR5cGUsIHZhbHVlICl7XHJcblx0XHRcdHZhciBzdHIgPSB2YWx1ZSArICcnO1xyXG5cdFx0XHR3aGlsZSAoIHN0ci5sZW5ndGggPCB0aGlzLnBhZFZhbHVlc1sgdHlwZSBdIClcclxuXHRcdFx0XHRzdHIgPSAnMCcgKyBzdHI7XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZVRpbWVQaWNrZXJUaW1lO1xyXG5cblxuLyoqKi8gfSxcbi8qIDggKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gVGhpcyBpcyBleHRyYWN0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vUG9tYXgvcmVhY3Qtb25jbGlja291dHNpZGVcclxuXHQvLyBBbmQgbW9kaWZpZWQgdG8gc3VwcG9ydCByZWFjdCAwLjEzIGFuZCByZWFjdCAwLjE0XHJcblxyXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMiksXHJcblx0XHR2ZXJzaW9uID0gUmVhY3QudmVyc2lvbiAmJiBSZWFjdC52ZXJzaW9uLnNwbGl0KCcuJylcclxuXHQ7XHJcblxyXG5cdGlmICggdmVyc2lvbiAmJiAoIHZlcnNpb25bMF0gPiAwIHx8IHZlcnNpb25bMV0gPiAxMyApIClcclxuXHRcdFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg5KTtcclxuXHJcblx0Ly8gVXNlIGEgcGFyYWxsZWwgYXJyYXkgYmVjYXVzZSB3ZSBjYW4ndCB1c2VcclxuXHQvLyBvYmplY3RzIGFzIGtleXMsIHRoZXkgZ2V0IHRvU3RyaW5nLWNvZXJjZWRcclxuXHR2YXIgcmVnaXN0ZXJlZENvbXBvbmVudHMgPSBbXTtcclxuXHR2YXIgaGFuZGxlcnMgPSBbXTtcclxuXHJcblx0dmFyIElHTk9SRV9DTEFTUyA9ICdpZ25vcmUtcmVhY3Qtb25jbGlja291dHNpZGUnO1xyXG5cclxuXHR2YXIgaXNTb3VyY2VGb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZSwgbG9jYWxOb2RlKSB7XHJcblx0IGlmIChzb3VyY2UgPT09IGxvY2FsTm9kZSkge1xyXG5cdCAgIHJldHVybiB0cnVlO1xyXG5cdCB9XHJcblx0IC8vIFNWRyA8dXNlLz4gZWxlbWVudHMgZG8gbm90IHRlY2huaWNhbGx5IHJlc2lkZSBpbiB0aGUgcmVuZGVyZWQgRE9NLCBzb1xyXG5cdCAvLyB0aGV5IGRvIG5vdCBoYXZlIGNsYXNzTGlzdCBkaXJlY3RseSwgYnV0IHRoZXkgb2ZmZXIgYSBsaW5rIHRvIHRoZWlyXHJcblx0IC8vIGNvcnJlc3BvbmRpbmcgZWxlbWVudCwgd2hpY2ggY2FuIGhhdmUgY2xhc3NMaXN0LiBUaGlzIGV4dHJhIGNoZWNrIGlzIGZvclxyXG5cdCAvLyB0aGF0IGNhc2UuXHJcblx0IC8vIFNlZTogaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvc3RydWN0Lmh0bWwjSW50ZXJmYWNlU1ZHVXNlRWxlbWVudFxyXG5cdCAvLyBEaXNjdXNzaW9uOiBodHRwczovL2dpdGh1Yi5jb20vUG9tYXgvcmVhY3Qtb25jbGlja291dHNpZGUvcHVsbC8xN1xyXG5cdCBpZiAoc291cmNlLmNvcnJlc3BvbmRpbmdFbGVtZW50KSB7XHJcblx0ICAgcmV0dXJuIHNvdXJjZS5jb3JyZXNwb25kaW5nRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoSUdOT1JFX0NMQVNTKTtcclxuXHQgfVxyXG5cdCByZXR1cm4gc291cmNlLmNsYXNzTGlzdC5jb250YWlucyhJR05PUkVfQ0xBU1MpO1xyXG5cdH07XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0ge1xyXG5cdCBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcblx0ICAgaWYgKHR5cGVvZiB0aGlzLmhhbmRsZUNsaWNrT3V0c2lkZSAhPT0gJ2Z1bmN0aW9uJylcclxuXHQgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IGxhY2tzIGEgaGFuZGxlQ2xpY2tPdXRzaWRlKGV2ZW50KSBmdW5jdGlvbiBmb3IgcHJvY2Vzc2luZyBvdXRzaWRlIGNsaWNrIGV2ZW50cy4nKTtcclxuXHJcblx0ICAgdmFyIGZuID0gdGhpcy5fX291dHNpZGVDbGlja0hhbmRsZXIgPSAoZnVuY3Rpb24obG9jYWxOb2RlLCBldmVudEhhbmRsZXIpIHtcclxuXHQgICAgIHJldHVybiBmdW5jdGlvbihldnQpIHtcclxuXHQgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdCAgICAgICB2YXIgc291cmNlID0gZXZ0LnRhcmdldDtcclxuXHQgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcblx0ICAgICAgIC8vIElmIHNvdXJjZT1sb2NhbCB0aGVuIHRoaXMgZXZlbnQgY2FtZSBmcm9tIFwic29tZXdoZXJlXCJcclxuXHQgICAgICAgLy8gaW5zaWRlIGFuZCBzaG91bGQgYmUgaWdub3JlZC4gV2UgY291bGQgaGFuZGxlIHRoaXMgd2l0aFxyXG5cdCAgICAgICAvLyBhIGxheWVyZWQgYXBwcm9hY2gsIHRvbywgYnV0IHRoYXQgcmVxdWlyZXMgZ29pbmcgYmFjayB0b1xyXG5cdCAgICAgICAvLyB0aGlua2luZyBpbiB0ZXJtcyBvZiBEb20gbm9kZSBuZXN0aW5nLCBydW5uaW5nIGNvdW50ZXJcclxuXHQgICAgICAgLy8gdG8gUmVhY3QncyBcInlvdSBzaG91bGRuJ3QgY2FyZSBhYm91dCB0aGUgRE9NXCIgcGhpbG9zb3BoeS5cclxuXHQgICAgICAgd2hpbGUgKHNvdXJjZS5wYXJlbnROb2RlKSB7XHJcblx0ICAgICAgICAgZm91bmQgPSBpc1NvdXJjZUZvdW5kKHNvdXJjZSwgbG9jYWxOb2RlKTtcclxuXHQgICAgICAgICBpZiAoZm91bmQpIHJldHVybjtcclxuXHQgICAgICAgICBzb3VyY2UgPSBzb3VyY2UucGFyZW50Tm9kZTtcclxuXHQgICAgICAgfVxyXG5cdCAgICAgICBldmVudEhhbmRsZXIoZXZ0KTtcclxuXHQgICAgIH07XHJcblx0ICAgfShSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSwgdGhpcy5oYW5kbGVDbGlja091dHNpZGUpKTtcclxuXHJcblx0ICAgdmFyIHBvcyA9IHJlZ2lzdGVyZWRDb21wb25lbnRzLmxlbmd0aDtcclxuXHQgICByZWdpc3RlcmVkQ29tcG9uZW50cy5wdXNoKHRoaXMpO1xyXG5cdCAgIGhhbmRsZXJzW3Bvc10gPSBmbjtcclxuXHJcblx0ICAgLy8gSWYgdGhlcmUgaXMgYSB0cnV0aHkgZGlzYWJsZU9uQ2xpY2tPdXRzaWRlIHByb3BlcnR5IGZvciB0aGlzXHJcblx0ICAgLy8gY29tcG9uZW50LCBkb24ndCBpbW1lZGlhdGVseSBzdGFydCBsaXN0ZW5pbmcgZm9yIG91dHNpZGUgZXZlbnRzLlxyXG5cdCAgIGlmICghdGhpcy5wcm9wcy5kaXNhYmxlT25DbGlja091dHNpZGUpIHtcclxuXHQgICAgIHRoaXMuZW5hYmxlT25DbGlja091dHNpZGUoKTtcclxuXHQgICB9XHJcblx0IH0sXHJcblxyXG5cdCBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0ICAgdGhpcy5kaXNhYmxlT25DbGlja091dHNpZGUoKTtcclxuXHQgICB0aGlzLl9fb3V0c2lkZUNsaWNrSGFuZGxlciA9IGZhbHNlO1xyXG5cdCAgIHZhciBwb3MgPSByZWdpc3RlcmVkQ29tcG9uZW50cy5pbmRleE9mKHRoaXMpO1xyXG5cdCAgIGlmICggcG9zPi0xKSB7XHJcblx0ICAgICBpZiAoaGFuZGxlcnNbcG9zXSkge1xyXG5cdCAgICAgICAvLyBjbGVhbiB1cCBzbyB3ZSBkb24ndCBsZWFrIG1lbW9yeVxyXG5cdCAgICAgICBoYW5kbGVycy5zcGxpY2UocG9zLCAxKTtcclxuXHQgICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHMuc3BsaWNlKHBvcywgMSk7XHJcblx0ICAgICB9XHJcblx0ICAgfVxyXG5cdCB9LFxyXG5cclxuXHQgLyoqXHJcblx0ICAqIENhbiBiZSBjYWxsZWQgdG8gZXhwbGljaXRseSBlbmFibGUgZXZlbnQgbGlzdGVuaW5nXHJcblx0ICAqIGZvciBjbGlja3MgYW5kIHRvdWNoZXMgb3V0c2lkZSBvZiB0aGlzIGVsZW1lbnQuXHJcblx0ICAqL1xyXG5cdCBlbmFibGVPbkNsaWNrT3V0c2lkZTogZnVuY3Rpb24oKSB7XHJcblx0ICAgdmFyIGZuID0gdGhpcy5fX291dHNpZGVDbGlja0hhbmRsZXI7XHJcblx0ICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZm4pO1xyXG5cdCAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmbik7XHJcblx0IH0sXHJcblxyXG5cdCAvKipcclxuXHQgICogQ2FuIGJlIGNhbGxlZCB0byBleHBsaWNpdGx5IGRpc2FibGUgZXZlbnQgbGlzdGVuaW5nXHJcblx0ICAqIGZvciBjbGlja3MgYW5kIHRvdWNoZXMgb3V0c2lkZSBvZiB0aGlzIGVsZW1lbnQuXHJcblx0ICAqL1xyXG5cdCBkaXNhYmxlT25DbGlja091dHNpZGU6IGZ1bmN0aW9uKCkge1xyXG5cdCAgIHZhciBmbiA9IHRoaXMuX19vdXRzaWRlQ2xpY2tIYW5kbGVyO1xyXG5cdCAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZuKTtcclxuXHQgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZm4pO1xyXG5cdCB9XHJcblx0fTtcclxuXG5cbi8qKiovIH0sXG4vKiA5ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfOV9fO1xuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWFjdC1kYXRldGltZS5qcy5tYXAiXSwiZmlsZSI6InJlYWN0LWRhdGV0aW1lLmpzIn0=

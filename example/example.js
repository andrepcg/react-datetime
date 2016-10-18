var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');
var onClickOutside = require('../src/onClickOutside');

if (typeof window !== 'undefined') {
    window.React = React;
}

var DateTimeWrapper = onClickOutside(React.createClass({

	getInitialState() {
		return {
			currentView: null,
			open: false
		}
	},

	setView(view) {
		this.setState({ currentView: view, open: true });
	},

	handleOnBlur() {
		console.debug("onBlur")
		this.setState({ open: false });
	},

	handleClickOutside: function(){
		this.handleOnBlur();
	},

	handleViewChange(view) {
		if (this.state.currentView !== view) {
			this.setState({ currentView: view });
		}
	},

	render() {
		const { currentView, open } = this.state;
		return (
			<div>
				<button type="button" onClick={() => this.setView('time')} >Time</button>
				<button type="button" onClick={() => this.setView('days')} >Date</button>
				<DateTime
					closeOnSelect
					currentView={currentView}
					onBlur={this.handleOnBlur}
					opened={open}
					onViewChange={this.handleViewChange}
				/>
			</div>
		);

	}
}));


ReactDOM.render(
  <DateTimeWrapper />,
  document.getElementById('datetime')
);

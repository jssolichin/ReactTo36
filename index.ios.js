'use strict';

var React = require('react-native');
var LargeView = require('./LargeView.ios');
var AllQuestions = require('./AllQuestions.ios');
var Information = require('./Information.ios');
var KillScreen = require('./KillScreen.ios');

var questions = require('./questions');
var {
	AsyncStorage,
	Navigator
} = React;

var STORAGE_KEY = '@AsyncStorageExample:key';

var ReactTo36 = React.createClass({
	getInitialState: function (){
		return ({
			totalRead:1
		});
	},
	componentDidMount: function (){
		AsyncStorage.getItem(STORAGE_KEY+'Total')
			.then((value) => {
				if (value !== null)
					this.setState({totalRead: parseInt(value)});
			})
			.done();
	},
	editTotalRead: function(){
		var that = this;
		return {
			add: function (){
				that.setState({totalRead: that.state.totalRead+1});
				AsyncStorage.setItem(STORAGE_KEY+'Total', ''+that.state.totalRead);
			},
			subtract: function (){
				that.setState({totalRead: that.state.totalRead-1});
				AsyncStorage.setItem(STORAGE_KEY+'Total', ''+that.state.totalRead);
			},
			reset: function (){
				AsyncStorage.setItem(STORAGE_KEY+'Total', '0');

				for (var i = 1; i <= questions.length; i++){
					AsyncStorage.setItem(STORAGE_KEY+i, 'true')
						.done();
				}

				that.setState({totalRead: 0});
			},
		};
	},
	renderScene: function (route,nav){
		switch(route.id){
			case 'Helper':
				return <Information navigator={nav} />
			case 'KillScreen':
				return <KillScreen navigator={nav} totalRead={this.state.totalRead} editTotalRead={this.editTotalRead}/>;
			case 'AllQuestions':
				return <AllQuestions navigator={nav} questions={questions} totalRead={this.totalRead} editTotalRead={this.editTotalRead} />;
			default:
				if(route.pageNo)
					return <LargeView navigator={nav} questions={questions} pullBeyondLimit='1' pageNo={route.pageNo} totalRead={this.state.totalRead} editTotalRead={this.editTotalRead} />;
				else
					return <LargeView navigator={nav} questions={questions} pullBeyondLimit='1' totalRead={this.state.totalRead} editTotalRead={this.editTotalRead} />;
		};
	},

	render() {
		return (
			<Navigator
				initialRoute={{name: 'Starting Screen', index: 0}}
				renderScene={this.renderScene}
			/>
		);
	}
});

React.AppRegistry.registerComponent('ReactTo36', function() { return ReactTo36; });

/**
 * React To 36 App
 * https://jssolichin.com
 */

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var {
	AsyncStorage,
	ListView,
	TouchableOpacity,
	AppRegistry,
	StyleSheet,
	Text,
	View,
} = React;

var STORAGE_KEY = '@AsyncStorageExample:key';

var AllQuestions = React.createClass({
	getInitialState: function (){
		return {
			questions: this.props.questions,
		}
	},
	unreadAll: function (){
		this.props.editTotalRead().reset();
		this.setState({questions: this.props.questions});
	},
	goBack: function (){
		this.props.navigator.pop();		
	},
	_onPress: function (index){
		var i = index || 1;
		this.props.navigator.replacePrevious({
			id: undefined,
			pageNo: i
		});
		this.props.navigator.pop();
	},
	render() {
		return (
			<View
				style={[styles.listView, {width: width, height: height}]} >
				<HeaderControl goBack={this.goBack} unreadAll={this.unreadAll} />
				<TheList onPress={this._onPress} questions={this.state.questions}/>
			</View>
		);
	}
});

var HeaderControl = React.createClass({
	render() {
		return (
			<View style={[styles.container, styles.containerMini]}>

				<TouchableOpacity onPress={this.props.goBack}>
					<View style={styles.buttonWrapper}>
						<Text style={styles.button}>BACK</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.props.unreadAll}>
					<View style={[styles.buttonWrapper]}>
						<View style={[styles.circle, styles.circleEmpty, styles.circleMini]} />
						<Text style={styles.button}>UNREAD ALL</Text>
					</View>
				</TouchableOpacity>

			</View>
		);
	}
});

var TheList = React.createClass({
	ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
	getInitialState: function() {
		return {
			dataSource: this.ds.cloneWithRows(this.props.questions),
		};
	},
	componentWillReceiveProps: function(){
		this.setState({dataSource: this.ds.cloneWithRows(this.props.questions)});
	},
	render(){
		return (
			<ListView
				dataSource={this.state.dataSource}
				renderRow={(d, a, i) => <ListItem onPress={this.props.onPress} index={parseInt(i)+1} rowData={d} />}
			/>
		);
	}
});

var ListItem = React.createClass({
	getInitialState() {
		return {
			messages: [],
			isNotRead: true,
		};
	},
	componentDidMount() {
		this._updateCircle();
	  },
	componentWillReceiveProps: function(){
		this._updateCircle();
	},
	_updateCircle: function (){
		AsyncStorage.getItem(STORAGE_KEY+this.props.index)
			.then((value) => {
				if (value !== null)
					this.setState({isNotRead: value === 'true' });
			})
			.done();
	},
	_handlePress: function(){
		this.props.onPress(this.props.index);
	},
	render: function (){
		return (
			<TouchableOpacity
				onPress={this._handlePress}
			>
				<View style={styles.container}>
					<View style={[styles.circle, this.state.isNotRead && styles.circleEmpty ]}>
						<Text style={styles.counter}>{this.props.index}</Text>
					</View>
					<View style={styles.rightContainer}><Text style={styles.question}>{this.props.rowData}</Text></View>
				</View>
			</TouchableOpacity>
		);
	}
});

var styles = StyleSheet.create({
	listView: {
		backgroundColor: '#EEE',
		paddingTop:20,
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10,
	},
	containerMini: {
		flex: 0,
		padding: 10,
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderColor: '#fff',
	},
	circle: {
		backgroundColor: '#fff',
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 36,
		width: 72,
		height:72,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	circleEmpty: {
	   backgroundColor: '#eee',
	   borderWidth: 1,
	   borderColor: '#fff',
	},
	circleMini:{
		width: 15,
		height: 15,
		borderRadius: 7,
		marginRight: 5,
	},
	buttonWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 5,
	},
	button: {
		color: '#777',
		fontSize: 14,
	},
	counter: {
		fontSize: 30,
		fontFamily: 'HelveticaNeue-Thin',
	},
	rightContainer: {
		flex: 1,
		paddingLeft: 15,
	},
	question: {
		fontSize: 14,
		textAlign: 'left',
	},
});

module.exports = AllQuestions;

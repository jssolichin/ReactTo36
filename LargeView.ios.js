/**
 * React To 36 App
 * https://jssolichin.com
 */

'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var {
	AsyncStorage,
	Navigator,
	TouchableOpacity,
	ScrollView,
	AppRegistry,
	StyleSheet,
	Text,
	View,
} = React;

var STORAGE_KEY = '@AsyncStorageExample:key';
var readableTimeout = 10;

var LargeView = React.createClass({
	mixins: [TimerMixin],
	getInitialState: function (){
		return {
			isNotRead: true,
			isReadable: false,
			timeout: this.setTimeout(this._setReadable, readableTimeout),
			pageNo: 1,
		}
	},
	componentDidMount: function (){

		//check read status of first page
		AsyncStorage.getItem(STORAGE_KEY+this.state.pageNo)
			.then((value) => {
				if (value !== null)
					this.setState({isNotRead: value === 'true' });
			})
			.done();

		if(this.props.pageNo == undefined){
			AsyncStorage.getItem(STORAGE_KEY+'LastRead')
				.then((value) => {
					if (value !== null )
						this.setState({pageNo: parseInt(value)});
				})
				.done();
		}
		else {
			this.setState({pageNo: parseInt(this.props.pageNo)});
		}

	},
	componentWillReceiveProps: function (){
		this._checkReadStatus();
	},
	_setReadable: function(value){
		//Question is readable if we have stayed in question for some milliseconds.
		if(value == undefined)
			value = true;
		else if(value == false) {
			clearTimeout(this.state.timeout)
			this.state.timeout = this.setTimeout(this._setReadable, readableTimeout);
		}

		this.setState({isReadable: value});
	},
	_readPage: function (pageWeLeft){
		var pageWeLeftKey = STORAGE_KEY+pageWeLeft;

		AsyncStorage.getItem(pageWeLeftKey)
			.then((value) => {
				if(value != 'false') {
					AsyncStorage.setItem(pageWeLeftKey, 'false');
					this.props.editTotalRead().add();
				}
			})
   },
	_unreadPage: function (){
		this._setReadable(false);
		AsyncStorage.setItem(STORAGE_KEY+this.state.pageNo, 'true')
			.then((value) => {
				this.setState({isNotRead: true})
				this.props.editTotalRead().subtract();
			})
			.done();
	},
	_checkReadStatus: function (){
		AsyncStorage.getItem(STORAGE_KEY+(this.state.pageNo))
			.then((value) => {
				if (value !== null)
					this.setState({isNotRead: value === 'true' });
			})
			.done();

		AsyncStorage.setItem(STORAGE_KEY+'LastRead', ''+this.state.pageNo)
			.done();
	},
	_changePage: function (event){
		var goingBackward = false;
		var didntChange = false;

		//figure out current page and direction
		if(event){
			var offset = event.nativeEvent.contentOffset.x;
			var index = Math.floor((offset - width/2) / width) + 1;

			goingBackward = index+1 < this.state.pageNo;
			didntChange = index+1 == this.state.pageNo;

			this.setState({pageNo: index+1});
		}

		//figure out what page we were last on based on current page and direction
		var pageWeLeft;
		if(goingBackward){
			pageWeLeft = this.state.pageNo+1;
		}
		else {
			//first and last page is a special case:
			//in special case of being currently on the last page, and going forward
			//or going forward from first page the page to mark as read is still the last page.
			if((this.state.pageNo != 1 && this.state.pageNo != 36) || (this.state.pageNo == 36 && !didntChange))
				pageWeLeft = this.state.pageNo-1;
			else {
				pageWeLeft = this.state.pageNo;
			}
		}

		if(this.state.isReadable == true)
			this._readPage(pageWeLeft);

		this._checkReadStatus();
		this._setReadable(false);
		this._maybeGoToKillScreen();
	},
	_advancePage: function (){
		if(this.state.pageNo < 36){
			if(this.state.isReadable == true)
				this._readPage(this.state.pageNo);

			this.setState({pageNo: this.state.pageNo+1})
			
		}
		else if(this.state.pageNo == 36){
			if(this.state.isReadable == true)
				this._readPage(36);
		}

		this._checkReadStatus();
		this._setReadable(false);
		this._maybeGoToKillScreen();
	},
	_maybeGoToKillScreen: function(){
		if(this.props.totalRead >= 36){
			this.props.navigator.push({
				id: 'KillScreen'
			});
		}
	},
	render: function() {
		var showUnreadButton;
		if(!this.state.isNotRead)
			showUnreadButton = <UnreadButton onPress={this._unreadPage} />
		else
			showUnreadButton = undefined;

		return (
			<View>
				<BackgroundIndicator totalRead={this.props.totalRead}/>
				<ScrollView
					contentOffset={{x:width*(this.state.pageNo-1), y:0}}
					horizontal={true}
					pagingEnabled={true}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					onMomentumScrollEnd={this._changePage}
				>
					{this.props.questions.map((question,index) =>
						<TouchableOpacity key={index} onPress={this._advancePage}>
						<View>
						<Question
							text={question}
							width={width}
							height={height}
							>
						</Question></View></TouchableOpacity>)
					}
				</ScrollView>
				<InformationButton navigator={this.props.navigator} />
				{showUnreadButton}
				<PageNumber navigator={this.props.navigator}
					index={this.state.pageNo}
					divisor={this.props.questions.length}
				/>
			</View>
		);
	}
});

var BackgroundIndicator = React.createClass({
	render: function (){
		var offset = 56 //styles.circle.bottom+styles.circle.width/2
		var percentage = (this.props.totalRead/36);
		var diameter = width * percentage  + 30;
		diameter = Math.pow(diameter,1.205);

		return (
			<View style={styles.background}>
				<View style={[styles.backgroundIndicator,
				{
					width: diameter,
					height: diameter,
					borderRadius: diameter/2,
					bottom: - diameter/2 + offset,
					right: - diameter/2 + offset,
				}]}/>
			</View>
		);
	}
});

var Question = React.createClass({
	getInitialState: function (){
		return {
			textTooLong: this.props.text.length > 120
		};
	},
	render: function (){
		return (
			<View style={[styles.container, {width: this.props.width, height: this.props.height}]}>
				<Text style={[styles.heading, this.state.textTooLong && styles.smallerHeading]}>{this.props.text}</Text>
			</View>
		);
	}
});

var PageNumber = React.createClass({
	_onPress: function (){
		this.props.navigator.push({
			id: 'AllQuestions'
		});
	},
	render: function (){
		return(
			<TouchableOpacity onPress={this._onPress}>
				<View style={styles.circle} >
					<Text style={styles.counter}>{this.props.index}</Text>
					<Text style={[styles.counter, styles.counterDivider]}>/</Text>
					<Text style={[styles.counter, styles.counterDivisor]}>{this.props.divisor}</Text>
				</View>
			</TouchableOpacity>
		);
	}
});

var InformationButton = React.createClass({
	_onPress: function (){
		this.props.navigator.push({
			id: 'Helper',
		});
	},

	render: function (){
		return(
			<TouchableOpacity onPress={this._onPress} >
				<View style={styles.circleButtonWrapper}>
					<Text style={styles.circleButtonText}>?</Text>
				</View>
			</TouchableOpacity>
		);
	}
});

var UnreadButton = React.createClass({
	render: function (){
		return(
			<TouchableOpacity onPress={this.props.onPress} >
				<View style={styles.unreadWrapper}>
					<Text style={styles.unreadText}>UNREAD</Text>
				</View>
			</TouchableOpacity>
		);
	}
});

var styles = StyleSheet.create({
	unreadWrapper: {
		position: 'absolute',
		bottom: 20,
		right: 105,
		height: 72,
		justifyContent: 'center',
   },
	unreadText: {
		color: '#777',
		fontSize: 14,
	},
	circleButtonWrapper: {
		width: 72,
		height:72,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		bottom: 20,
		left: 20,
	},
	circleButtonText: {
		fontSize: 16,
		color: '#777'
	},
	background: {
		height: height,
		width: width,
		backgroundColor: '#eee',
		position: 'absolute',
		top: 0,
		left: 0,
	},
	backgroundIndicator: {
		backgroundColor: '#FFD3E0',
		borderWidth: 0,
		position: 'absolute',
	},
	circle: {
		backgroundColor: '#fff',
		borderWidth: 0,
		borderRadius: 36,
		width: 72,
		height:72,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		bottom: 20,
		right: 20,
	},
	counter: {
		fontSize: 20,
		fontFamily: 'HelveticaNeue-Thin',
		marginTop: -20,
	},
	counterDivider: {
		fontSize: 40,
		color: '#777',
		marginTop: 0,
	},
	counterDivisor: {
		marginTop: 10
	},
	heading: {
		fontSize: 40,
		fontFamily: 'HelveticaNeue-Thin',
	},
	smallerHeading: {
		fontSize: 30,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
});

module.exports = LargeView

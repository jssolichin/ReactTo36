/**
 * React To 36 App
 * https://jssolichin.com
 */

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var {
	LinkingIOS,
	ListView,
	TouchableOpacity,
	AppRegistry,
	StyleSheet,
	Text,
	View,
} = React;

var KillScreen = React.createClass({
	render() {
		return (
			<View >
				<View style={[styles.container]}>
					<View style={styles.paragraph}>
						<Text style={styles.normalText}>
							<Text style={styles.linkText}>
								Congratulations!
							</Text>
						</Text>
					</View>

					<View style={styles.paragraph}>
						<Text style={styles.normalText}>
							<Text>
								You and your partner are now in love.
							</Text>
						</Text>
					</View>

					<SmallParagraph>
						Money back guarantee.
					</SmallParagraph>
					</View>

					<ResetButton navigator={this.props.navigator}  editTotalRead={this.props.editTotalRead}  />
			</View>
		);
	}
});

var SmallParagraph = React.createClass({
	render: function (){
		return (
			<View style={styles.paragraph}>
				<Text style={[styles.normalText, styles.small]}>
					<Text>
						{this.props.children}
					</Text>
				</Text>
			</View>
		);
	}
})

var ResetButton = React.createClass({
	_onPress: function (){
		this.props.editTotalRead().reset();
		this.props.navigator.push({
			pageNo: 1
		});
	},
	render: function (){
		return(
			<TouchableOpacity onPress={this._onPress} underlayColor='#ccc'>
				<View style={styles.circle} >
					<Text style={styles.counter}>Restart</Text>
				</View>
			</TouchableOpacity>
		)
	}
})

var styles = StyleSheet.create({
	circle: {
		borderColor: '#fff',
		borderWidth: 1,
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
		fontSize: 18,
		fontFamily: 'HelveticaNeue-Thin',
	},
	paragraph: {
		marginBottom: 20 ,
		width: width-40
	},
	normalText: {
		fontSize: 20,
		fontFamily: 'HelveticaNeue-Light'
	},
	small:{
		fontSize: 12,
	},
	linkText: {
		fontFamily: 'HelveticaNeue-Bold',
		color: '#333',
	},
	container: {
		width: width,
		height: height,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFD3E0',
		padding: 20,
	},
});

module.exports = KillScreen;

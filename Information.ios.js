/**
 * React To 36 App
 * https://jssolichin.com
 */

'use strict';

var questions = require('./questions');
var React = require('react-native');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var {
	TouchableOpacity,
	LinkingIOS,
	ListView,
	AppRegistry,
	StyleSheet,
	Text,
	View,
} = React;

var Information = React.createClass({
	_onPress: function(){
		this.props.navigator.pop();
	 },
	_openNYT: function(){
		LinkingIOS.openURL('http://www.nytimes.com/2015/01/11/fashion/modern-love-to-fall-in-love-with-anyone-do-this.html');
	},
	_openStudy: function(){
		LinkingIOS.openURL('http://psp.sagepub.com/content/23/4/363.full.pdf+html')
	},
  render() {
	return (
		<View style={[styles.container]}>
			<View style={styles.circleButtonWrapper}>
				<TouchableOpacity onPress={this._onPress}>
					<Text style={styles.circleButtonText}>BACK</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.paragraph}>
				<Text style={styles.normalText}>
					<Text>
						Popularized by a New York Times
					</Text>
					<Text style={styles.linkText} onPress={this._openNYT}>
						&nbsp;article&nbsp;
					</Text>
					<Text>
						and based on a
					</Text>
					<Text style={styles.linkText} onPress={this._openStudy}>
						&nbsp;scientific study
					</Text>
					<Text>
						, the 36 questions presented here are designed to make two participants fall (deeper) in love.
					</Text>
				</Text>
			</View>
			<View style={styles.paragraph}>
				<Text style={styles.normalText}>
					<Text>
						Take turns reading questions with your partner, with both of you answering each question.
					</Text>
				</Text>
			</View>

			<SmallParagraph>
				Press the page number to access the list of all the questions and to see which ones you have done.
			</SmallParagraph>

			<SmallParagraph>
				Questions are marked-as-read after being on a question for more than 3 second and swiping. 
			</SmallParagraph>

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

var styles = StyleSheet.create({
	paragraph: {
		marginBottom: 20 ,
		width: width-40
	},
	normalText: {
		fontSize: 20,
		fontFamily: 'HelveticaNeue-Light',
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
		backgroundColor: '#eee',
		padding: 20,
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
		fontSize: 14,
		color: '#777',
	},
});

module.exports = Information;

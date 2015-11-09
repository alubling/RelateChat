/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Main = require('./App/Components/Main.js');
var Splash = require('./App/Components/Splash.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  View
} = React;

class RelateChat extends React.Component{
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Relate',
          component: Splash,
        }}
        //navigationBarHidden={true}
        //translucent={true}
        //barTintColor='#33CCCC'
        //titleTextColor='white'
        //tintColor='white'
        //shadowHidden={true}
        />
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#33CCCC',
    //opacity: 0.1
  }
});

AppRegistry.registerComponent('RelateChat', () => RelateChat);

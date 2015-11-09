import React from 'react-native';
import api from '../Utils/api.js';
import Select from './Select';
import Chat from './Chat';
import Signup from './Signup';
import Login from './Login';

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

class Splash extends React.Component{

  handleSignUp() {
    this.setState({
      isLoading: true
    });
    this.props.navigator.push({
      title: "Signup",
      component: Signup
    });
    this.setState({
      isLoading: false,
      error: false
    })
  }
  handleLogin() {
    this.setState({
      isLoading: true
    });
    this.props.navigator.push({
      title: "Login",
      component: Login
    });
    this.setState({
      isLoading: false,
      error: false
    })
  }
  // <Text style={styles.smallText}>Have an account?</Text>
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Welcome to Relate Chat</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSignUp.bind(this)}
          underlayColor="white">
            <Text style={styles.buttonText}> Sign Up </Text>
        </TouchableHighlight>

          <TouchableHighlight
            style={styles.button}
            onPress={this.handleLogin.bind(this)}
            underlayColor="white">
              <Text style={styles.buttonText}> Log In </Text>
          </TouchableHighlight>
      </View>
    )
  }
};

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#33CCCC'
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  smallText: {
    fontSize: 18,
    color: 'white'
  },
  smallTextEmphasis: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});


export default Splash;

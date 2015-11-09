import React from 'react-native';
import api from '../Utils/api.js';
import Select from './Select';
import Messages from './Messages';
import Test from './Test';
import Chat from './Chat';
import Rebase from 're-base';

var base = Rebase.createClass('https://relate-chat.firebaseio.com/');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      isLoading: false,
      error: false
    }
  }
  handleChange(event) {
    this.setState({
      username: event.nativeEvent.text
    });
  }
  handleSubmit() {
    // update spinner
    this.setState({
      isLoading: true
    });
    console.log('SUBMIT', this.state.username);

    // REWRITING the API calls to Firebase using their package

    // OR AM I??? MUAHHAHAHAHAHAHAH

    // these two api calls work
    // api.createUser(this.state.username)
    //   .then((res) => {
    //     console.log("creating johnny hopefully: ", res);
    //     this.setState({
    //       isLoading: false
    //     })
    //   })
    // api.getUser(this.state.username)
    //   .then((res) => {
    //     console.log("made it here with:", res);
    //     return res.json();
    //   })

    // fetch user if they exist
    api.getUser(this.state.username)
      .then((res) => {
        // if the user is not found, create a new user and reset the loader. Then get the relaters and pass them AND navigate to Select screen
        if (!res) {
          api.createUser(this.state.username)
            .then((user) => {
              var myUser = user;
              api.getRelaters()
                .then((relaters) => {
                  this.props.navigator.push({
                    title: "Select a Relater",
                    component: Select,
                    passProps: {
                      userInfo: myUser,
                      relaters: relaters
                    }
                  });
                  // also clear the loader, error, and username field
                  this.setState({
                    isLoading: false,
                    error: false,
                    username: ''
                  })
                })
            })
        } else {

          // if the user is found, we need to authenticate here with touch id, and THEN reroute to the messages screen passing through the user object and their data
          var userInfo = res;
          console.log("this is the magic userInfo that we're passing: ", userInfo);
          api.getMessages(userInfo.handle)
            .then((data) => {
              console.log("this should be the fucking data:", data);

              // Clever trick learned from Chris, if you can isolate the problem to one line of code, run a try catch to see what the error is!

              // try {
              //   data = data.json();
              // }
              // catch(e) {
              //   console.log("this is the error", e);
              // }

              this.props.navigator.push({
                title: `Chatting with ${userInfo.relater}`,
                component: Chat,
                passProps: {
                  user: userInfo,
                  messages: data
                }
              });

              // also clear the loader, error, and username field
              this.setState({
                isLoading: false,
                error: false,
                username: ''
              })
            })
          // this.props.navigator.push({
          //   title: `Chatting with ${userInfo.relater}`,
          //   component: Chat,
          //   passProps: {
          //     user: userInfo,
          //     messages: api.getMessages(userInfo.handle)
          //   }
          // });
          // // also clear the loader, error, and username field
          // this.setState({
          //   isLoading: false,
          //   error: false,
          //   username: ''
          // })
          // base.fetch(`messages/${userInfo.handle}`, {
          //   context: this,
          //   asArray: true,
          //   then(data) {
          //     console.log("Did i log anything??????");
          //     this.props.navigator.push({
          //       title: `Chatting with ${userInfo.relater}`,
          //       component: Chat,
          //       passProps: {
          //         user: userInfo,
          //         messages: data
          //       }
          //     });
          //     // also clear the loader, error, and username field
          //     this.setState({
          //       isLoading: false,
          //       error: false,
          //       username: ''
          //     })
          //   }
          // });
        }
      })
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}> Please enter a username </Text>
        <TextInput
          style={styles.searchInput}
          value={this.state.username}
          onChange={this.handleChange.bind(this)} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor="white">
            <Text style={styles.buttonText}> SUBMIT </Text>
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
});


export default Main;

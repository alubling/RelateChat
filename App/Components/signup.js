import React from 'react-native';
import api from '../Utils/api.js';
import Select from './Select';
import Messages from './Messages';
import Test from './Test';
import Chat from './Chat';
import Rebase from 're-base';
import Firebase from 'firebase';

var base = Rebase.createClass('https://relate-chat.firebaseio.com/');
var ref = new Firebase('https://relate-chat.firebaseio.com');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AsyncStorage
} = React;

class Signup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      //uid: '',
      //authData: '',
      isLoading: false,
      error: false
    }
  }
  handleChangeToName(event) {
    this.setState({
      name: event.nativeEvent.text
    });
  }
  handleChangeToEmail(event) {
    this.setState({
      email: event.nativeEvent.text
    });
  }
  handleChangeToPassword(event) {
    this.setState({
      password: event.nativeEvent.text
    });
  }
  handleSubmit() {
    var that = this;
    // update spinner
    this.setState({
      isLoading: true
    });
    var firstname = /(^\w+)/g.exec(this.state.name);
    console.log('SUBMIT', this.state.name);
    console.log('this is the first name:', firstname[1]);

    // Create User Account via Firebase, get back unique user id
    ref.createUser({
      email    : that.state.email,
      password : that.state.password,
      //name     : that.state.name,
      //firstName: firstname
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        console.log("lets test that we have context: ", that.state.email);
        //that.setState({uid: userData.uid});
        //console.log("here is the uid again, on the state this time:", that.state.uid);
        // Log the User In, get back authData
        ref.authWithPassword({
          email    : that.state.email,
          password : that.state.password
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);

            // Write authData (or just the id) to local storage
            AsyncStorage.setItem("relateChatKey", authData.uid);
            //   .then(() => {
            //     that.setState({"authData": authData.uid});
            //   })
            //
            // console.log("is authData getting set on the state:", that.state.authData);

            // now create the user record using the uid and put the properties there
            api.createUser(authData.uid, that.state.email, firstname[1])
              .then((user) => {
                console.log("did a user get created on signup? If so they should be here:", user);
                var myUser = user;
                // Get the current Relaters, get the user, and navigate to the Select Component to select a relater
                api.getRelaters()
                  .then((relaters) => {
                    that.props.navigator.push({
                      title: "Select",
                      component: Select,
                      passProps: {
                        userInfo: myUser,
                        relaters: relaters,
                        uid: authData.uid
                      }
                    });
                    // also clear the loader, error, and username field
                    that.setState({
                      isLoading: false,
                      error: false,
                      email: '',
                      password: ''
                    })
                  })
              })
            // Get the current Relaters, get the user, and navigate to the Select Component to select a relater
            // api.getRelaters()
            //  .then((data) => {
            //    var relaters = data;
            //    api.getUser(that.state.authData.uid)
            //     .then((user) => {
            //       that.props.navigator.push({
            //         title: "Select a Relater",
            //         component: Select,
            //         passProps: {
            //           userInfo: user,
            //           relaters: relaters
            //         }
            //       });
            //       // clear the loader, error, and name fields
            //       that.setState({
            //         isLoading: false,
            //         error: false,
            //         name: '',
            //         email: '',
            //         password: ''
            //       })
            //     })
            //  });
          }
        });
      }
    });

    // Log the User In, get back authData

    // Write authData (or just the id) to local storage

    // Navigate to the Select Component to select a relater

  //   // fetch user if they exist
  //   api.getUser(this.state.username)
  //     .then((res) => {
  //       // if the user is not found, create a new user and reset the loader. Then get the relaters and pass them AND navigate to Select screen
  //       if (!res) {
  //         api.createUser(this.state.username)
  //           .then((user) => {
  //             var myUser = user;
  //             api.getRelaters()
  //               .then((relaters) => {
  //                 this.props.navigator.push({
  //                   title: "Select a Relater",
  //                   component: Select,
  //                   passProps: {
  //                     userInfo: myUser,
  //                     relaters: relaters
  //                   }
  //                 });
  //                 // also clear the loader, error, and username field
  //                 this.setState({
  //                   isLoading: false,
  //                   error: false,
  //                   username: ''
  //                 })
  //               })
  //           })
  //       } else {
  //
  //         // if the user is found, we need to authenticate here with touch id, and THEN reroute to the messages screen passing through the user object and their data
  //         var userInfo = res;
  //         console.log("this is the magic userInfo that we're passing: ", userInfo);
  //         api.getMessages(userInfo.handle)
  //           .then((data) => {
  //             console.log("this should be the fucking data:", data);
  //
  //             this.props.navigator.push({
  //               title: `Chatting with ${userInfo.relater}`,
  //               component: Chat,
  //               passProps: {
  //                 user: userInfo,
  //                 messages: data
  //               }
  //             });
  //
  //             // also clear the loader, error, and username field
  //             this.setState({
  //               isLoading: false,
  //               error: false,
  //               username: ''
  //             })
  //           })
  //       }
  //     })
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}> Create an Account </Text>
        <TextInput
          style={styles.searchInput}
          value={this.state.name}
          placeholder='Full Name'
          onChange={this.handleChangeToName.bind(this)} />
        <TextInput
          style={styles.searchInput}
          value={this.state.email}
          placeholder='Email'
          onChange={this.handleChangeToEmail.bind(this)} />
        <TextInput
          style={styles.searchInput}
          value={this.state.password}
          placeholder='Password'
          secureTextEntry={true}
          onChange={this.handleChangeToPassword.bind(this)} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor="white">
            <Text style={styles.buttonText}> SUBMIT </Text>
        </TouchableHighlight>
        <ActivityIndicatorIOS
          style={styles.loader}
          animating={this.state.isLoading}
          color='#111'
          size='large'>
        </ActivityIndicatorIOS>
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
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 5,
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
  loader: {
    justifyContent: 'center'
  }
});


export default Signup;

'use strict';

var React = require('react-native');
var Main = require('./App/Components/Main.js');
var Splash = require('./App/Components/Splash.js');
var Messages = require('./App/Components/Messages.js');
var Loader = require('./App/Components/Loader.js');
var Chat = require('./App/Components/Chat.js');
var api = require('./App/Utils/api.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  AsyncStorage,
  View
} = React;

// need to make this an if that does the local storage auth check and if found, sends to that users messages directly
// there are many ways to do this, if this doesn't work because async operation doesn't succeed before the page renders, try putting this in componentwill or componentdidmount
// var whichRoute;
// AsyncStorage.getItem("relateChatKey").then((value) => {
//   if (value) {
//     whichRoute = {title: `Chatting with ${value.relater}`, component: Messages};
//     this.setState({"relateChatKey": value});
//   } else {
//     whichRoute = {title: 'Relate', component: Splash};
//   }
// }).done();
var whichRoute;

class RelateChat extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      whichRoute: {},
      relateChatKey: {},
      loaded: false
    }
  }
  // delayLoader() {
  //   var authedRoute = {title: `Chatting with ${value.relater}`, component: Chat, passProps: {relateChatKey: value}};
  //   var nonAuthedRoute = {title: 'Relate', component: Splash}, loaded: true }
  //   setTimeout();
  // }
  handleLogout() {
    // Logout means make sure the user's id is there, then remove it from local storage
    AsyncStorage.getItem("relateChatKey").then((value) => {
      console.log("found a key!", value);
    }).then(() => {
      AsyncStorage.removeItem("relateChatKey").then((value) => {
        console.log("removed the key, but what is this value?", value);
      })
    })
    // then try to get back to the login or splash screen
    // this.props.navigator.replace({
    //   title: "Relate",
    //   component: Splash
    // });
    this.props.navigator.pop(); // used this instead of .replace because that doesn't reset the nav bar
  }
  // replaceRoute() {
  //   this.props.navigator.replace({
  //     title: "Relate",
  //     component: Splash
  //   })
  // }
  componentWillMount() {
    // interesting strategy for loading a splash screen, call timeout first, dont wait for results
    setTimeout(
      () => {
        this.setState({ loaded: true })
      },
      2500,
    );

    // Using this sequence just to make sure AsyncStorage is working and remove keys prior to having a logout button
    // AsyncStorage.getItem("relateChatKey").then((value) => {
    //   console.log("found a key!", value);
    // }).then(() => {
    //   AsyncStorage.removeItem("relateChatKey").then((value) => {
    //     console.log("removed the key, but what is this value?", value);
    //   })
    // })

    // This is the actual routing sequence, which checks if there is a key in local storage and if so takes the user directly to messages, if not takes them to splash page for signup or login
    AsyncStorage.getItem("relateChatKey").then((value) => {
      var uid = value;
      if (value) {
        // need to pass in the right props to chat if we found the user, perfect opportunity to let data load while we show loader
        api.getUser(uid)
          .then((userData) => {
            console.log("get the authedUser:", userData);
            var user = userData;
            api.getMessages(uid)
              .then((messagesData) => {
                console.log("got the authedUser's messages:", messagesData);
                this.setState({
                  whichRoute: {
                    title: `Chatting with ${user.relater.name}`,
                    component: Chat,
                    rightButtonTitle: 'Logout',
                    onRightButtonPress: () => this.handleLogout(),
                    passProps: {user: user, messages: messagesData, uid: uid, navigator: this.props.navigator}},
                  relateChatKey: value,
                  //loaded: true
                })
              });
          })

      } else {
        console.log("making it past async storage because there is no authed user");
        this.setState({ whichRoute: {title: 'Relate', component: Splash}, }) // took out loaded: true to let the setTimeout control the splash screen
      }
    }).done();

  }
  render() {
    console.log("what is whichroute at the render:", this.state.whichRoute);
    if (!this.state.loaded) {
      return (
        this.renderLoading()
      )
    }
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={this.state.whichRoute}
        // initialRoute={{
        //   title: 'Relate',
        //   component: Splash,
        // }}
        //navigationBarHidden={true}
        //translucent={true}
        //barTintColor='#33CCCC'
        //titleTextColor='white'
        //tintColor='white'
        //shadowHidden={true}
        />
    );
  }
  renderLoading() {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    )
  }




}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#33CCCC',
    //opacity: 0.1
  }
});

AppRegistry.registerComponent('RelateChat', () => RelateChat);

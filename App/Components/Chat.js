var React = require('react-native');
var api = require('../Utils/api');
var Rebase = require('re-base');

var {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBarIOS,
  TouchableHighlight,
  TextInput,
  ListView
} = React;

var base = Rebase.createClass('https://relate-chat.firebaseio.com/');

class Chat extends React.Component{
  constructor(props){
    super(props);
    var username = this.props.user.handle;
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      newMessage: '',
      dataSource: this.ds.cloneWithRows(this.props.messages)
    }
    // base.fetch(`messages/${username}/`, {
    //   context: this,
    //   asArray: true,
    //   then(data) {
    //     this.state = {
    //       dataSource: this.ds.cloneWithRows(data),
    //       newMessage: '',
    //     };
    //   }
    // });
    // api.getMessages(this.props.user.handle)
    //   .then((messages) => {
    //     this.state = {
    //       dataSource: this.ds.cloneWithRows(data),
    //       newMessage: ''
    //     }
    //   });

  }
  init() {
    this.ref = base.bindToState(`messages/${this.props.user.handle}`, {
      context: this,
      asArray: true,
      state: 'messages'
    });
  }
  componentWillMount() {
    // both base.fetch and api call don't get rowData in time here, why not?

    // base.fetch(`messages/${this.props.user.handle}/`, {
    //   context: this,
    //   asArray: true,
    //   then(data) {
    //     this.setState({
    //       dataSource: this.ds.cloneWithRows(data),
    //       newMessage: '',
    //     });
    //   }
    // });
    // api.getMessages(this.props.user.handle)
    //   .then((messages) => {
    //     this.state = {
    //       dataSource: this.ds.cloneWithRows(data),
    //       newMessage: ''
    //     }
    //   });
  }
  componentDidMount() {
    this.init();
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  componentWillReceiveProps() {
    base.removeBinding(this.ref);
    this.init();
  }
  addMessage() {
    var message = this.state.newMessage;
    this.setState({
      newMessage: ''
    })
    var username = this.props.user.handle;
    var relater = this.props.user.relater;
    var timestamp = new Date();
    console.log("adding a message for: ", username, "which goes to:", relater);

    // api call to create a message, then get the new messages list
    api.addMessage(relater, username, message, timestamp)
      .then((key) => {
        console.log("just added a message, this should be its key:", key);
        console.log("just check the this context for getting messages again:", this);
        base.fetch(`messages/${username}`, {
              context: this,
              asArray: true,
              then(data) {
                this.setState({
                  dataSource: this.ds.cloneWithRows(data)
                })
              }
            })
      })
    // replace this base.post with api call so that it creates an id

    // base.post(`messages/${username}/`, {
    //   data: {
    //     message: message,
    //     receiver: this.props.user.relater,
    //     sender: this.props.user.handle,
    //     timestamp: timestamp
    //   },
    //   then() {
    //     base.fetch(`messages/${username}`, {
    //       context: messages,
    //       asArray: true,
    //       then(data) {
    //         this.setState({
    //           dataSource: this.ds.cloneWithRows(data)
    //         })
    //       }
    //     })
    //   }
    // })
  }
  handleChange(e){
    this.setState({
      newMessage: e.nativeEvent.text
    })
  }
  footer(){
    return (
      <View style={styles.footerContainer}>
        <TextInput
            style={styles.searchInput}
            value={this.state.newMessage}
            onChange={this.handleChange.bind(this)}
            placeholder="Type Message Here" />
        <TouchableHighlight
            style={styles.button}
            onPress={this.addMessage.bind(this)}
            underlayColor="#88D4F5">
              <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    )
  }

// <Image source={{uri: 'https://wallpaperscraft.com/image/glare_light_glitter_backgrounds_15928_3840x2160.jpg'}} style={styles.backgroundImage}/>
// <Image source={{uri: 'background', isStatic: true}} style={styles.backgroundImage}/>

  render() {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.bgImageWrapper}>
              <Image source={{uri: 'https://wallpaperscraft.com/image/glare_light_glitter_backgrounds_15928_3840x2160.jpg'}} style={styles.backgroundImage}/>
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow.bind(this)} />
                {this.footer()}
            </View>
        </View>
    )
  }
  renderRow(rowData) {
    console.log("this is the rowData: ", rowData);
    // Here we want to split the renderRow:
      // If the rowData.sender is the relater, render to the left
      // If the rowData.sender is the user, render to the right
    return (
      <View style={styles.rowContainer}>
        <View style={styles.row}>
          <Text style={styles.messageText}>{rowData.text}</Text>
        </View>
        <View style={styles.separator}/>
      </View>
    )
  }
}

Chat.propTypes = {
  user: React.PropTypes.object.isRequired,
  messages: React.PropTypes.object.isRequired
}

  var styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      flexDirection: 'column',
      resizeMode: 'cover' // or 'stretch'
    },
    bgImageWrapper: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    inputcontainer: {
      marginTop: 5,
      padding: 10,
      flexDirection: 'row'
    },
    mainContainer: {
      flex: 1,
      flexDirection: 'column',
      //backgroundColor: '#33CCCC'
    },
    nameText: {
      fontSize: 23,
      color: 'white',
      paddingTop: 10,
      textAlign: 'center'
    },
    rowContainer: {
      padding: 20,
    },
    backDrop: {
      backgroundColor: 'rgba(0,0,0,0)'
    },
    image: {
      borderColor: 'white',
      borderWidth: 1,
      height: 50,
      borderRadius: 25
    },
    input: {
      height: 36,
      padding: 4,
      marginRight: 5,
      flex: 4,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#48afdb',
      borderRadius: 4,
      color: '#48BBEC'
    },
    row: {
      flexDirection: 'row',
      padding: 12,
      height: 44
    },
    separator: {
      height: 1,
      backgroundColor: '#CCCCCC',
    },
    messageText: {
      flex: 1,
    },
    buttonText: {
    fontSize: 18,
    color: 'white'
    },
    button: {
      height: 60,
      backgroundColor: '#48BBEC',
      flex: 3,
      alignItems: 'center',
      justifyContent: 'center'
    },
    searchInput: {
      height: 60,
      padding: 10,
      fontSize: 18,
      color: '#111',
      flex: 10
    },
    rowContainer: {
      padding: 10,
    },
    footerContainer: {
      backgroundColor: '#E3E3E3',
      alignItems: 'center',
      flexDirection: 'row'
    }
  });

export default Chat;
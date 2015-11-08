var React = require('react-native');
var api = require('../Utils/api');
var Firebase = require('firebase');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  ListView
} = React;

class Messages extends React.Component{
  constructor(props){
    super(props);
    var mainRef = new Firebase('https://relate-chat.firebaseio.com');
    var username = this.props.user.handle;
    this.messagesRef = mainRef.child(`messages/${username}`);
    //this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      //messageSource: this.ds.cloneWithRows(this.props.conversations.key()),
      messageSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      newMessage: ''
    };

    this.messages = [];
  }
  componentWillMount() {
    console.log("Messages will mount!");
    this.messagesRef.on('child_added', (dataSnapshot) => {
      console.log(dataSnapshot);
      this.messages.push({id: dataSnapshot.key(), messageObj: dataSnapshot.val() });
      this.setState({
        messageSource: this.state.messageSource.cloneWithRows(this.messages)
      })
    })
  }
  componentDidMount() {

  }
  addMessage() {
    if (this.state.newMessage !== '') {
      this.messagesRef.push({
        message: this.state.newMessage,
        receiver: this.props.user.relater,
        sender: this.props.user.handle,
        timestamp: new Date()
      });
      this.setState({
        newMessage: ''
      })
    }
  }
  render() {
    return (
        <View style={styles.mainContainer}>
          <Image source={require('image!background')} style={styles.backgroundImage} />
          <View style={styles.inputcontainer}>
            <TextInput style={styles.input} onChangeText={(text) => this.setState({newMessage: text})} value={this.state.newMessage}/>
            <TouchableHighlight
              onPress={() => this.addMessage()}
              underlayColor='#ddddd'>
              <Text>Send</Text>
            </TouchableHighlight>
          </View>
          <ListView
            dataSource={this.state.messageSource}
            renderRow={this.renderRow.bind(this)} />
        </View>
    )
  }
  renderRow(rowData) {
    console.log("this is the rowData: ", rowData);
    return (
      <View style={styles.rowContainer}>
        <View style={styles.row}>
          <Text style={styles.messageText}>{rowData.messageObj.message}</Text>
        </View>
        <View style={styles.separator}/>
      </View>
    )
  }
}

Messages.propTypes = {
  user: React.PropTypes.object.isRequired,
}

  var styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      flexDirection: 'row',
      resizeMode: 'cover' // or 'stretch'
    },
    inputcontainer: {
      marginTop: 5,
      padding: 10,
      flexDirection: 'row'
    },
    mainContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#33CCCC'
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
    }
  });

export default Messages;

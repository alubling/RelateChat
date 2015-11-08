var React = require('react-native');
var api = require('../Utils/api');
var Messages = require('./Messages');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  ListView
} = React;

class Select extends React.Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      dataSource: this.ds.cloneWithRows(this.props.relaters)
      // relater: '',
      // error: ''
    }
  }
  // pickRelater will grab that specific relater and attach them to that user and then navigate to messaging
  pickRelater(relater){
    console.log("this is the relater that we just clicked on: ", relater);
    var user = this.props.userInfo;
    console.log("and we want to attach them to this user: ", user);
    api.setRelater(user, relater)
      .then((data) => {
        this.props.navigator.push({
          component: Messages,
          title: 'Messages',
          passProps: {
            user: data // will the user have the relater here yet?
          }
        });
      });
  }
  // what gets returned in renderRow will be the ui for each item in the list
  renderRow(rowData){
    console.log("this is the row data: ", rowData);
    console.log("this is this: ", this);
    return (
        <TouchableHighlight
            //onPress={this.pickRelater.bind(this, rowData)}
            // onPress={this.pickRelater(rowData)}
            // style={styles.button}
            onPress={() => this.pickRelater(rowData)}>
            <View style={styles.rowContainer}>
                <Image style={styles.image} source={{uri: rowData.avatar }}>
                  <View style={styles.backDrop}>
                    <Text style={styles.nameText}> {rowData.name} </Text>
                  </View>
                </Image>
              </View>
          </TouchableHighlight>
    )
  }
  render() {
    return (
      <View style={styles.mainContainer}>
          <ListView
              dataSource={this.state.dataSource} // datasource is from the initial state
              renderRow={this.renderRow.bind(this)} // renderRow is the UI for every item in the data source
              // this header will show up at the top of the list view (actually doesn't, no idea why)
              renderHeader={() => {<Text style={styles.nameText}>Hello {this.props.userInfo.name}, please select a Relater </Text>}} />
      </View>
    )
  }
}

Select.propTypes = {
  userInfo: React.PropTypes.object.isRequired,
  relaters: React.PropTypes.object.isRequired
}

  var styles = StyleSheet.create({
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
    button: {
      borderColor: 'white',
      borderWidth: 1
    }
  });

export default Select;

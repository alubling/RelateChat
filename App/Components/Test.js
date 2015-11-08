import React from 'react-native';

var {
  View,
  Text,
  StyleSheet
} = React;

class Test extends React.Component{
  componentWillMount(){
    console.log("will this component mount? It should have this user: ", this.props.user);
    console.log("also curious what's going on with the navigator: ", this.props.navigator);
  }
  render(){
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.text}>HELLO WORLD!</Text>
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
  text: {
    fontSize: 21,
    color: 'blue'
  }
});

Test.propTypes = {
  user: React.PropTypes.object.isRequired,
}

export default Test;

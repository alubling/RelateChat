import React from 'react-native';
import api from '../Utils/api.js';
import Dimensions from 'Dimensions';

var {
  width,
  height
} = Dimensions.get('window');

var {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicatorIOS,
  Animated,
  Easing
} = React;

class Loader extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      slidingAnimationValue: new Animated.ValueXY({ x: width / 2 - 90, y: height})
      //slidingAnimationValue: new Animated.ValueXY()
      // isLoading: false,
      // error: false
    }
  }
  // getStyle() {
  //   return [
  //     styles.logoImage,
  //     {
  //       transform: this.state.slidingAnimationValue.getTranslateTransform()
  //     }
  //   ]
  // }
  componentDidMount() {
    console.log("width:", width, " and height:", height);
    var animationConfig = {
      duration: 1000, // milliseconds
      delay: 500, // milliseconds
      //easing: Easing.in(Easing.bounce)
      //easing: Easing.in(Easing.ease)
      easing: Easing.in(Easing.quad)
    }
    var value = this.state.slidingAnimationValue;
    var slidingInAnimation = Animated.timing(value, {
      ...animationConfig, // ES6 spread operator
      toValue: {
        x: width / 2 - 90,
        y: height / 2
      },
    }).start();
  }
  // this is just a text header if we want one
  // <Text style={styles.title}> Welcome to Relate </Text>

  // this is the static view that is working with the relate logo in the middle of the screen
  // <View style={styles.mainContainer}>
  //   <Image source={require('./RelateLogo.png')} style={styles.logoImage}/>
  // </View>

  // this is an attempt at animation but the view is what is animated, the image is static so need to work with this to get the image IN the view somehow
  // <View style={styles.mainContainer}>
  //   <Animated.View style={slidingAnimationStyle}>
  //     <Image source={require('./RelateLogo.png')} style={styles.logoImage}/>
  //   </Animated.View>
  // </View>

  render() {
    var slidingAnimationStyle = this.state.slidingAnimationValue.getTranslateTransform(); // get the initial transform style
    return (
      <View style={styles.mainContainer}>
        <Animated.Image
          source={require('./RelateLogo.png')}
          style={{
            height: 100,
            width: 180,
            transform: slidingAnimationStyle
          }}
        />
      </View>
    )
  }
};

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    //padding: 30,
    //marginTop: 65,
    //flexDirection: 'column',
    //justifyContent: 'center',
    backgroundColor: '#33CCCC',
    //alignItems: 'center'
  },
  // title: {
  //   marginTop: 50,
  //   //marginBottom: 20,
  //   fontSize: 25,
  //   textAlign: 'center',
  //   color: '#fff'
  // },
  logoImage: {
    height: 100,
    width: 180,
    //marginTop: 30,
  }
});


export default Loader;

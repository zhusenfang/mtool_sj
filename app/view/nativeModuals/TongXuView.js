import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ListView,
    AppState,
    ScrollView,
    Button,
    requireNativeComponent,
    NativeModules,
    findNodeHandle
} from 'react-native';
const MapViews=requireNativeComponent('ConverSationsView')
var time=''
export default class TongXuView extends Component{
      constructor(props){
          super(props)

      }
    render(){
        return(<MapViews
            style={{flex:1}}
        />)
    }

}
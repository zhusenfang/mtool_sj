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
const MapViews=requireNativeComponent('RCTAMapView')
export default class MapView extends Component{
render(){
    return(<MapViews
       style={{flex:1}}
    />)
}
startLocation(){
   NativeModules.MyMap.startLocation(findNodeHandle(this))
}
}
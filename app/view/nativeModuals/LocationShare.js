import React, { Component} from 'react';
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
// const MapView=requireNativeComponent('RnMapView')
// const MapView=requireNativeComponent('RCTAMapView')
// var findNodeHandle = require('findNodeHandle');

var LocationShareView = requireNativeComponent('LocationShareView');
export default class LocationShare extends Component{

    render(){
        return(<LocationShareView style={{flex:1}}/>)
    }
    // startLocation() {
    //     NativeModules.UtilModule.startLocation(findNodeHandle(this));
    // }
    //
    // reloadMarker() {
    //     NativeModules.UtilModule.reloadMarker(findNodeHandle(this));
    // }
}
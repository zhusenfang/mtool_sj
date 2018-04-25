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

var MapView = requireNativeComponent('RNAddressLocateView');
export default class AndroidMap extends Component{

    render(){
        return(<MapView style={{flex:1}}/>)
    }
    // startLocation() {
    //     NativeModules.UtilModule.startLocation(findNodeHandle(this));
    // }
    //
    // reloadMarker() {
    //     NativeModules.UtilModule.reloadMarker(findNodeHandle(this));
    // }
}
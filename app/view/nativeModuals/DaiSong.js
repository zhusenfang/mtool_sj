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
const MapView = requireNativeComponent('RNDaisongView',DaiSong);
export default class DaiSong extends Component{

    render(){
        return(<MapView style={{flex:1}}/>)
    }
    setShopLocation(latitude,longtitude){
        NativeModules.DaisongModual.setShopLocation(findNodeHandle(this),latitude,longtitude)
    }
}
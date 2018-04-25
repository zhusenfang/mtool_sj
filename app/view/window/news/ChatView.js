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
const MapView=requireNativeComponent('ChatView',ChatView)

export default class ChatView extends Component{
    render(){
        return(<MapView
            style={{flex:1}}
        />)
    }
    initChatView(hxId,chatType){
        NativeModules.ChatModule.initChatView(findNodeHandle(this),hxId,chatType)
    }
    setQuickReply(json){
        NativeModules.ChatModule.setQuickReply(findNodeHandle(this),json)
    }
    sendShareMessage(id,title,picurl){
        NativeModules.ChatModule.sendShareMessage(findNodeHandle(this),id,title,picurl)
    }
}
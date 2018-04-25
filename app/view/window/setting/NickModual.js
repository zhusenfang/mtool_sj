import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Button,
    ListView,
    ScrollView,
    Platform,
    Switch,
    BackHandler,
    ActivityIndicator,
    DeviceEventEmitter,

} from 'react-native';
import Modal from 'react-native-modal';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Toast from "react-native-easy-toast";
export default class NickModual extends Component{
    constructor(props){
        super(props)
        this.state={
            content:''
        }
    }
    render(){
        return(<View>

                <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                    <Text style={[comstyle.text,{margin:10}]}>{this.props.title}</Text>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                        <TextInput
                            ref={e=>this._input=e}
                            style={{   backgroundColor: "#FFFFFF",
                                textAlign: "center",
                                height:40,
                                borderWidth:1,
                                borderColor:'#E5E5E5',
                                width:Contants.Screen.width-80,
                                // marginLeft:10,
                                marginRight:40,}}
                            placeholder={this.props.default}
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(text)=>{this.changeText(text)}}
                            value={this.state.content}
                            maxLength={11}
                        />
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity  onPress={()=>{
                           this.props.cancle()
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity onPress={()=>{
                           this.props.sure()

                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toasty = e
                }}
                       position='center'
                />
        </View>)
    }
    changeText(text){

        this.setState({

            content:text,
        })
    }
}
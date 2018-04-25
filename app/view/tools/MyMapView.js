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
    DeviceEventEmitter,
    BackAndroid
} from 'react-native';
import Contants from '../../common/Contants'
// import AMap from 'react-native-smart-amap'
import AndroidMap from '../nativeModuals/AndroidMap'
import MyMap from '../nativeModuals/MyMap'
export default class MyMapView extends Component{
    constructor(props){
        super(props)
        this.state={
            address:'',
            latitude:'',
            longitude:'',

        }
        // this.props.navigation.state.params.callbacks()
    }
    componentWillMount(){
        // BackAndroid.addEventListener('hardwareBackPress',this.onBackAndroid);
    }
    onBackAndroid=()=>{
        this.props.navigation.goBack();
    }
    componentDidMount() {
         // MyMap.toMapActivity();
        DeviceEventEmitter.addListener('data',this.onResult)
    }
     componentWillUnmount(){
        // BackAndroid.removeEventListener('hardwareBackPress',this.onBackAndroid)
     }

    onResult=(e)=>{
        // alert(e.address)
        this.setState({
            address:e.address,
            latitude:e.latitude,
            longitude:e.longitude,
        })
        // this.props.navigation.navigate('HeXiaoView')
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    render(){
        if(this.state.address!=''){
            // this.props.navigation.state.params.callbacks(this.state.address)

            this.props.navigation.goBack();
        }
        return(<View >

           <View style={{width:Contants.Screen.width,height:Contants.Screen.height-60-StatusBar.currentHeight}}>
           <AndroidMap style={{width:Contants.Screen.width,height:Contants.Screen.height}}/>
           </View>
        </View>)
    }

}
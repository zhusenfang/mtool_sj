import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
export default class GuanZhuView extends Component{
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }
    render(){
        return(<View style={[comstyle.con,{flexDirection:'column'}]}>
            <TouchableOpacity style={[comstyle.item,{marginTop:20}]} onPress={this.guanzhuyong.bind(this)}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/order/mine.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>关注的用户</Text>
                </View>
                <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
            </TouchableOpacity>
        </View>)
    }
    guanzhuyong(){
        this.props.navigation.navigate('GuanZhuUser')
    }
}
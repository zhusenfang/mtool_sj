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
export default class TongXunLu extends Component{
    constructor(props){
        super(props)

    }
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
    }

    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    render(){
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9',flexDirection:'column'}]}>
            <TouchableOpacity style={[comstyle.item,{marginTop:20}]} onPress={this.guanzhu.bind(this)}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/pinglun/guanzhu.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>关  注</Text>
                </View>
             <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
            </TouchableOpacity>
            <View style={comstyle.heng}/>
            <TouchableOpacity style={[comstyle.item]} onPress={this.fens.bind(this)}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/pinglun/fensi.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>粉  丝</Text>
                </View>
                <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
            </TouchableOpacity>
            <View style={comstyle.heng}/>
            <TouchableOpacity style={[comstyle.item]} onPress={this.biaoqian.bind(this)}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/pinglun/biaoqian.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>标签管理</Text>
                </View>
                <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
            </TouchableOpacity>
            <View style={comstyle.heng}/>
            <TouchableOpacity style={[comstyle.item]} onPress={this.pingbi.bind(this)}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/pinglun/buzaikan.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>屏蔽管理</Text>
                </View>
                <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
            </TouchableOpacity>
            <View style={comstyle.heng}/>
        </View>)
    }
    guanzhu(){
      this.props.navigation.navigate('GuanZhuView')
    }
    biaoqian(){
        this.props.navigation.navigate('BiaoQianManage')
    }
    pingbi(){
        this.props.navigation.navigate('PingBiManage')
    }
    fens(){
        this.props.navigation.navigate('FensView')
    }
}
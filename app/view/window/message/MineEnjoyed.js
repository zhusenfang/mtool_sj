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
export default class MineEnjoyed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account: 0
        }
    }

    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    render(){
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
            <TouchableOpacity style={[comstyle.item,{marginTop:20}]} onPress={()=>{this.props.navigation.navigate('ShouCangDong',{data:''})}}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/pinglun/pinglun.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>动  态</Text>
                </View>
             <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ShouCangDong',{data:''})}}>
               <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
             </TouchableOpacity>
            </TouchableOpacity>
          {/*<Text style={styles.fenl}>*/}
            {/*收藏分类*/}
          {/*</Text>*/}
            {/*<View style={[comstyle.item,{marginTop:0}]}>*/}
                {/*<View style={comstyle.rightview}>*/}
                    {/*<Image source={require('../../../img/window/tianjiafen.png')} style={comstyle.maleft}/>*/}
            {/*<Text style={comstyle.mesg}>添加分类</Text>*/}
                {/*</View>*/}
                {/*<Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>*/}
            {/*</View>*/}

            {/*<View style={[comstyle.item,{marginTop:10}]}>*/}
                {/*<Text>自定义分类名称</Text>*/}
                {/*<Text> >      </Text>*/}
            {/*</View>*/}
        </View>)
    }
}
const styles=StyleSheet.create({
    fenl:{
        marginTop:26,
        marginLeft:15,
        marginBottom:15,
        fontSize:14,
        color:'#282828'
    }
})
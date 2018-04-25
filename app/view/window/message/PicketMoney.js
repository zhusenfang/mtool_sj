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
export default class PicketMoney extends Component{
    constructor(props){
        super(props)
        this.state={
            account:0
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

    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}

        // postFetch(API.PickerYuE,null,(result)=>{
        //     alert(JSON.stringify(result))
        // })
    }
    render(){
        const list=this.props.navigation.state.params.data
        const lists=this.props.navigation.state.params.fix
        // alert(JSON.stringify(list))
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
            {/*<View style={[comstyle.item,{marginTop:20}]}>*/}

                    {/*<Text>  账户余额：{list}</Text>*/}
                    {/*<Image source={require('../../../img/window/picker.png')} style={[comstyle.img,{marginRight:20}]}/>*/}

            {/*</View>*/}
            {/*<View style={[comstyle.item,{marginTop:20}]}>*/}

                {/*<Text >  收支记录</Text>*/}
               {/*<Text onPress={()=>{*/}
                   {/*this.props.navigation.navigate('AccountInCom')}*/}
               {/*}> >     </Text>*/}

            {/*</View>*/}
            {/*<View style={[comstyle.item,{marginTop:20}]}>*/}

                {/*<Text>  消费者保障金</Text>*/}
                {/*<Text onPress={()=>{*/}
               {/*this.props.navigation.navigate('ConsumerMoney',{data:lists})*/}
                {/*}}> >     </Text>*/}

            {/*</View>*/}
            <View style={styles.iamge}>
            <Image source={require('../../../img/shezhi/lingqian.png')}/>
                <Text style={styles.text}>我的零钱</Text>
               <View style={styles.ling}>
                   <Image source={require('../../../img/shezhi/renmb.png')} style={{width:26,height:28}}/>
                   <Text style={styles.textc}>{list}</Text>
               </View>
            </View>
            <TouchableOpacity style={styles.chong} onPress={()=>{this.props.navigation.navigate('ChargeRemaind')}}>
            <Image
            source={require('../../../img/shezhi/chongzhi.png')}
            style={styles.chong}
            >
                <Text style={styles.zhi}>充值</Text>
            </Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chong} onPress={()=>{this.props.navigation.navigate('TiXianView')}}>
                <Image
                    source={require('../../../img/shezhi/tixian.png')}
                    style={styles.chong}
                >
                    <Text style={styles.text}>提现</Text>
                </Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chong} onPress={()=>{this.props.navigation.navigate('ZhangMingXi')}}>
                <Image
                    source={require('../../../img/shezhi/tixian.png')}
                    style={styles.chong}
                >
                    <Text style={styles.text}>账单明细</Text>
                </Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chong} onPress={()=>{
                this.props.navigation.navigate('ConsumerMoney',{data:lists})
            }}>
                <Image
                    source={require('../../../img/shezhi/tixian.png')}
                    style={styles.chong}
                >
                    <Text style={styles.text}>消费者保障金</Text>
                </Image>
            </TouchableOpacity>
        </View>)
    }
}
const styles=StyleSheet.create({
    iamge:{
        flexDirection:'column',
        marginTop:50,
        justifyContent:'center',
        alignItems:'center',

    },
    text:{
        fontSize:14,
        color:'#282828'
    },
    ling:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

    },
    textc:{
        color:'#FF305E',
         fontSize:28
    },
    chong:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    zhi:{
        color:'white',
    },


})
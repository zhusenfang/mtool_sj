import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    TextInput,
    BackHandler,
    Platform
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants'
import Toast from 'react-native-easy-toast';
export default class ConsumerMoney extends Component{
constructor(props){
    super(props)
    this.state={
        changePrice:'',
        fisdeposit:0,//冻结金额
        jine:''
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
     postFetch(API.ZhangJing,null,(result)=>{
         // alert(JSON.stringify(result))
         if(result.status==1){
             this.setState({
                 jine:result.data.cashPledge
             })

         }
     })
    }
    render(){
        const list=this.props.navigation.state.params.data
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
           {/*<View style={[comstyle.item,{marginTop:20}]}>*/}
            {/*<Text>   冻结金额： {list}</Text>*/}

               {/*<Text>申请解冻</Text>*/}
           {/*</View>*/}
            {/*<View style={styles.jin}>*/}
                {/*<View style={styles.chong}>*/}
                    {/*<Text>  冲入保障金：</Text>*/}
                    {/*<TextInput*/}
                        {/*underlineColorAndroid='transparent'*/}
                        {/*style={{borderWidth:1,borderColor:'gray',width:Contants.Screen.width/2+30,marginLeft:20,height:40}}*/}
                        {/*onChangeText={(e)=>{*/}
                            {/*this.setState({*/}
                                {/*changePrice:e,*/}
                            {/*})*/}
                        {/*}}*/}
                        {/*placeholder={'需为100的倍数'}*/}
                    {/*/>*/}
                {/*</View>*/}
                 {/*<View style={styles.shore}>*/}
                     {/*<Text onPress={this.sure.bind(this)}>确认提交</Text>*/}
                 {/*</View>*/}
            {/*</View>*/}
            <View style={styles.iamge}>
                <Image source={require('../../../img/shezhi/baozhangjin.png')}/>
                <Text style={styles.text}>消费者保障金</Text>
                <View style={styles.ling}>
                    <Image source={require('../../../img/shezhi/renmb.png')} style={{width:26,height:28}}/>
                    <Text style={styles.textc}>{this.state.jine}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.chong} onPress={()=>{this.props.navigation.navigate('ChargeView')}}>
                <Image
                    source={require('../../../img/shezhi/chongzhi.png')}
                    style={styles.chong}
                >
                    <Text style={styles.zhi}>充值</Text>
                </Image>
            </TouchableOpacity>
            <View style={styles.chong}>
                <Image
                    source={require('../../../img/shezhi/tixian.png')}
                    style={styles.chong}
                >
                    <Text style={styles.text}>解冻</Text>
                </Image>
            </View>

            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </View>)
    }
    sure(){
         if(this.state.changePrice.length==0){
             this._toast.show('保障金不能为空')
             return
         }
       var r= /^[1-9]\d*00$/;
         if(r.test(this.state.changePrice)==false){
             this._toast.show('请输入100的倍数')
             return
         }

        postFetch(API.BaoZhangJin,{userMemberAccount:{cashPledge:this.state.changePrice}},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
            this.setState({
              fisdeposit:result.data.fixDeposit
             })
            }
        })
    }
}
const styles=StyleSheet.create({
    jin:{
       height:100,
        flexDirection:'column',
        marginTop:10,
        backgroundColor:'white'
    },
    // chong:{
    //     flexDirection:'row',
    //       height:40,
    //     alignItems:'center',
    //     marginTop:10
    // },
    shore:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width:Contants.Screen.width/3,
        marginLeft:Contants.Screen.width/2+30,
        borderWidth:1,borderColor:'gray',
        margin:10
    },
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
    }
})
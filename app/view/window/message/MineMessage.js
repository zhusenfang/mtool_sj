import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    Image,
    TouchableOpacity,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle'
import {API,postFetch} from '../../../common/GConst';
import Toast from "react-native-easy-toast";
import Contants from '../../../common/Contants'
import Storage from '../../../common/GGAsyncStorage'
export default class MineMessage extends Component{
    constructor(props){
        super(props)
        this.state={
            falseSwitchIsOn:false,
            money:0,
            fixDeposit:0,
            name:'',
            description:'',
            pic:'./',
            erwei:'./',
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
        Storage.get('qrCode').then((st)=>{
            this.setState({
                erwei:st
            })
        })
        postFetch(API.PickerYuE,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    // money:result.data.account,
                    // fixDeposit:result.data.fixDeposit
                    money:result.data.userMemberAccount.account,
                    name:result.data.userMember.nickname,
                    description:result.data.userMember.introduction,
                     pic:result.data.userMember.picUrl,

                })
                if(result.data.status==1){
                    this.setState({
                        falseSwitchIsOn:true
                    })
                }else {
                    this.setState({
                        falseSwitchIsOn:false
                    })
                }
            }
        })



    }
    render(){
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
            <TouchableOpacity style={styles.tou} onPress={()=>{this.props.navigation.navigate('PersonalView')}}>
                <View style={styles.flex}>
                <Image source={{uri:this.state.pic}} style={[styles.img,{width:45,height:45,borderRadius:4}]}/>
                <View style={styles.wenzi}>
                    <Text style={styles.names}>{this.state.name}</Text>
                    <Text style={styles.descriptions}>{this.state.description==undefined?'':this.state.description}</Text>
                </View>
                </View>
                <View style={styles.right}>
                <Image source={{uri:this.state.erwei}} style={styles.erweima}/>
                <Image source={require('../../../img/shezhi/jian.png')}/>
                </View>
            </TouchableOpacity>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={[comstyle.item,{marginTop:0}]}>
                <View style={styles.kaiqi}>
           <Image source={require('../../../img/shezhi/open.png')} style={styles.img}/>
            <Text style={styles.text}>开启营业</Text>
                </View>
                <Switch onValueChange={(value)=>
                {this.setState({falseSwitchIsOn:value})
                    if(this.state.falseSwitchIsOn==false){
                        postFetch(API.YingYe,{status:1},(result)=>{
                            // alert(JSON.stringify(result))
                            if(result.status==1){
                                this._toastf.show('开启成功')
                            }
                        })
                    }else {
                        postFetch(API.YingYe,{status:0},(result)=>{
                            // alert(JSON.stringify(result))
                            if(result.status==1){
                                this._toastf.show('关闭成功')
                            }
                        })
                    }
                }}
                        value={this.state.falseSwitchIsOn}
                        onTintColor='#FF305E'
                    // // tintColor='blue'
                        thumbTintColor='white'
                    style={styles.switch}

                />
            </View>

            {/*<View style={[comstyle.item,{marginTop:2}]}>*/}
                {/*<Text>二维码名片</Text>*/}
                {/*<Text> >    </Text>*/}
            {/*</View>*/}

            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <TouchableOpacity style={[comstyle.item,{marginTop:0}]} onPress={()=>{
                this.props.navigation.navigate('MineDongTai')
            }}>
                <View style={styles.kaiqi}>
                    <Image source={require('../../../img/shezhi/dongtai.png')} style={styles.img}/>
                <Text style={styles.text}>我的动态</Text>
                </View>
                {/*<Text onPress={()=>{*/}
                    {/*this.props.navigation.navigate('DongTai')*/}
                {/*}}> >     </Text>*/}

                <TouchableOpacity  style={styles.switch} onPress={()=>{
                this.props.navigation.navigate('MineDongTai')}
                }>
                    <Image source={require('../../../img/shezhi/jian.png')}/>
                </TouchableOpacity>
            </TouchableOpacity>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <TouchableOpacity style={[comstyle.item,{marginTop:0}]} onPress={()=>{
                this.props.navigation.navigate('MyGreated')
            }}>
                <View style={styles.kaiqi}>
                    <Image source={require('../../../img/shezhi/zan.png')} style={styles.img}/>
                    <Text style={styles.text}>我赞过的</Text>
                </View>
                {/*<Text onPress={()=>{this.props.navigation.navigate('MyGreated')}}> >     </Text>*/}
                <TouchableOpacity  style={styles.switch} onPress={()=>{
                    this.props.navigation.navigate('MyGreated')
                }}>
                    <Image source={require('../../../img/shezhi/jian.png')}/>
                </TouchableOpacity>

            </TouchableOpacity>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <TouchableOpacity style={[comstyle.item,{marginTop:0}]} onPress={()=>{
                this.props.navigation.navigate('PicketMoney',{data:this.state.money,fix:this.state.fixDeposit})
            }} >
                <View style={styles.kaiqi}>
                    <Image source={require('../../../img/shezhi/wallet.png')} style={styles.img}/>
                    <Text style={styles.text}>钱  包</Text>
                </View>
                {/*<Text onPress={()=>{*/}
                    {/*this.props.navigation.navigate('PicketMoney',{data:this.state.money,fix:this.state.fixDeposit})*/}
                {/*}}>{this.state.money+'>    '}    </Text>*/}
                <View style={styles.right}>
               <Text style={[styles.switch,{color:'#FF305E',fontSize:14}]}>{'￥'+this.state.money}</Text>
                    <TouchableOpacity  onPress={()=>{
                        this.props.navigation.navigate('PicketMoney',{data:this.state.money,fix:this.state.fixDeposit})
                    }}>
                        <Image source={require('../../../img/shezhi/jian.png')}/>
                    </TouchableOpacity>
                </View>

            </TouchableOpacity>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <TouchableOpacity style={[comstyle.item,{marginTop:0}]} onPress={this.shouc.bind(this)}>
                <View style={styles.kaiqi}>
                    <Image source={require('../../../img/shezhi/shoucang.png')} style={styles.img}/>
                    <Text style={styles.text}>我的收藏</Text>
                </View>
                {/*<Text onPress={this.shouc.bind(this)}> >     </Text>*/}
                <TouchableOpacity  style={comstyle.textright} onPress={this.shouc.bind(this)}>
                    <Image source={require('../../../img/shezhi/jian.png')}/>
                </TouchableOpacity>
            </TouchableOpacity>
            <Toast ref={(e) => {
                this._toastf = e
            }}
                   position='center'
            />
        </View>)
    }
    shouc(){
        this.props.navigation.navigate('MineEnjoyed');
    }

}
const  styles=StyleSheet.create({
    switch:{
        marginRight:20,
    },
    kaiqi:{
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    img:{
        marginLeft:20
    },
    text:{
        marginLeft:5,
        fontSize:14,
        color:'#282828'
    },
    tou:{
        flexDirection:'row',
        height:60,
        backgroundColor:'white',
        alignItems:'center',
        marginTop:20,
        justifyContent:'space-between'

    },
    wenzi:{
        flexDirection:'column',
        marginLeft:5,
        justifyContent:"flex-start",

    },
    right:{
        justifyContent:'flex-end',
        alignItems:'center',
        flexDirection:'row',
        marginRight:20
    },
    flex:{
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    names:{
        fontSize:14,
        color:'#282828'
    },
    descriptions:{
        fontSize:12,
        color:'#B2B2B2'
    },
    erweima:{
        marginRight:20,
        width:30,
        height:30
    }
})
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    BackHandler,
    ToastAndroid,
    Platform,
    BackAndroid,

} from 'react-native';
import Contants from '../common/Contants';
import GGInput from '../common/LogInput';
import {Button} from 'native-base';
import Toast from "react-native-easy-toast";
import Storage from '../common/GGAsyncStorage'
import {API, postFetch, ObjectTransform} from '../common/GConst'
import LoginModule from '../view/nativeModuals/LoginModule'

export default class Login extends Component {
    constructor(props) {
        super(props)
    }

    _androidBack = () => {

        if (this.lastBackPressed && (Date.now() - this.lastBackPressed ) < 2000) {
            BackHandler.exitApp();
        } else {
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按返回退出应用', ToastAndroid.SHORT);
        }

        return true;

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        // this._androidBack()
    }

    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this._androidBack);
    }

    // permissionCheck(){
    //     if(Platform.OS==="android"){
    //
    //     }
    // }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled: false,

    })

    render() {
        return (
            <View style={styles.contain}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    width: Contants.Screen.width,
                    height: Contants.Screen.height,
                    backgroundColor:'#fff'
                }}>
                    <View style={{flexDirection: 'row',alignItems:'flex-end'}}>
                    <Image source={require('../img/login/logo.png')}
                           style={{marginTop: 70,height:32,width:180, marginLeft: 20,marginRight:10}}/>
                        <Text style={{color:'#FF305E',fontSize:16}}>商家</Text>
                    </View>

                    <View style={{width:Contants.Screen.width-40,flexDirection: 'row',alignItems:'center',
                        marginTop:50,  marginLeft: 20,marginRight:20}}>
                        <View style={{width:100,height:30, borderBottomWidth:5,borderBottomColor:'#FF305E'}}>
                            <Text style={{color:'#FF305E',fontSize:16,textAlign:'left'}}>账号密码登录</Text>
                        </View>
                        <TouchableOpacity
                            onPress={()=>{this.props.navigation.navigate('DuanXinLogin')}}
                            style={{width:Contants.Screen.width-140,height:30,
                            marginBottom:2,
                            borderBottomWidth:2,borderBottomColor:'#FF305E'}}>
                            <Text style={{color:'#afafaf',fontSize:16,textAlign:'right'}}>手机验证登录</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{width:Contants.Screen.width-40, marginTop:20,  marginLeft: 20,marginRight:20,padding:10,
                         borderRadius:10,

                        shadowOffset:{h:1,w:1},
                        shadowRadius:5,
                        shadowOpacity:0.8,
                        shadowColor:'#f2f2f2',
                        borderWidth:1,
                        borderColor:'#f2f2f2',
                        elevation: 4,
                    }}>

                            <GGInput
                                ref={e => this._userText = e}
                                style={[styles.input, {alignItems:'center'}]}
                                isPwd={false}
                                leftTitle={"手机号码:"}
                                placeholder={"请输入手机号"}
                                keyboardType={"numeric"}
                            />


                            <View style={styles.hengt}/>

                            <GGInput
                                ref={e => this._pwdText = e}
                                style={[styles.input, {marginTop: 0}]}
                                isPwd={true}
                                leftTitle={"登陆密码:"}
                                placeholder={"请输入密码"}/>

                    </View>

                    {/*<View style={styles.hengt}/>*/}


                    <TouchableOpacity onPress={this.loginAction.bind(this)}
                                      style={[styles.logins,{
                                          flexDirection: 'row',
                                          justifyContent: 'center',
                                          alignItems: "center",
                                          marginTop: 20,
                                          alignSelf: 'center',
                                          height:35,
                                          width:Contants.Screen.width-40,
                                          backgroundColor:'#ff305e',
                                          borderRadius:5
                                      }]}>

                            <Text style={{
                                color: '#fff',
                                fontSize: 16,
                                backgroundColor: 'transparent',
                            }}>登 录</Text>

                    </TouchableOpacity>

                    <View style={styles.items}>
                        <TouchableOpacity style={styles.heng} onPress={this.forgetAction}>
                            <Text style={styles.mima}>登录遇到问题？</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.heng} onPress={() => {
                            //this.props.navigation.navigate('DuanXinLogin')
                            //this.registerAction()
                        }}>
                            <Text style={styles.denglu}>申请入驻≥</Text>
                        </TouchableOpacity>
                    </View>
                    {/*<View style={styles.zuixia}>*/}
                        {/*<View style={styles.buttom}>*/}
                            {/*<Text style={[styles.texts, {color: '#ffffff' , backgroundColor: 'transparent'}]}>登陆即代表阅读并同意</Text>*/}
                            {/*<View style={styles.heng}>*/}
                                {/*<Text style={[styles.texts, {color: '#FF305E' , backgroundColor: 'transparent',}]}>《服务条款》</Text>*/}
                                {/*<View style={styles.xiaf}/>*/}
                            {/*</View>*/}
                            {/*/!*<Text></Text>*!/*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    {/*吐司组件*/}
                    <Toast
                        ref={(e) => {
                            this._toast = e
                        }}
                        position='center'
                    />
                </View>
            </View>
        );
    }

    registerAction = () => {
        this.props.navigation.navigate('Register')
    }
    forgetAction = () => {
        this.props.navigation.navigate('ForgetView')
    }

    loginAction() {
        this._pwdText._input.blur();
        this._userText._input.blur();
        let toast = this._toast;
        let phoneNum = this._userText.state.content;
        let pwd = this._pwdText.state.content;
        if (!phoneNum) {
            toast.show('请输入手机号');
            return
        }
        if (!pwd) {
            toast.show('请输入密码');
            return;
        }
        //手机号验证
        var reg = /^1[34578]\d{9}$/;
        if (!reg.test(this._userText.state.content)) {
            this._toast.show('手机格式错误');
            return;
        }
        if (pwd.length < 6) {
            this._toast.show('密码格式错误');
            return;
        }

        fetch("http://122.112.196.52:8080/mtool/portal/api/user/member/login", {
            method: "POST",
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({
                username: phoneNum,
                password: pwd
            })
        }).then((response) => (
            response.json()
        ).then((responseData) => {
            //alert(JSON.stringify(responseData))
            //console.log('dddddddddd'+JSON.stringify(responseData))
            if (responseData.status == 1) {
                if (responseData.data.type != 1) {
                    toast.show("请使用，商户端账号登录");
                    return;
                }
                //下面行报错，先注释掉 -------朱森方
                //LoginModule.login(responseData.data.hxUsername, responseData.data.hxPassword, responseData.data.nickname, responseData.data.picUrl)
                toast.show(responseData.msg)

                Storage.save("isLogin", true);
                Storage.save("phoneNumber", phoneNum);
                Storage.save("pwd", pwd)

                Storage.save("userId", responseData.data.id)
                //下面行报错,估计借口数据不对，先注释掉 -------朱森方
                // Storage.save("qrCode", responseData.data.qrCode)
                // Storage.save("picUrl", responseData.data.picurl)
                // Storage.save('nickname', responseData.data.nickname)
                // Storage.save('sex', responseData.data.sex)
                // Storage.save("birthday", responseData.data.birthday)
                // Storage.save('personaldescirpt', responseData.data.introduction)
                // Storage.save('address', responseData.data.registerAddr)
                // alert(JSON.stringify(responseData.data.id))

                BackHandler.removeEventListener('hardwareBackPress', this._androidBack);

                this.props.navigation.navigate('Index');

            } else {
                alert(6);
                toast.show(responseData.msg)
            }

        }).catch((error) => {
            alert("errorx:" + error)
        }))

    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: "#f9f9f9"
    },
    containto: {
        marginTop: 20,
        width: Contants.Screen.width,
        height: Contants.Screen.height / 2
    },
    input: {
        flexDirection: "row",
        alignSelf: 'center',
        backgroundColor: "transparent",
    },
    inputs: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 20,
        alignSelf: 'center',

    },
    text: {
        borderColor: 'black',

    },
    zhuce: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'red',
        backgroundColor: '#333',
        height: 60
    },
    mima: {
        color: '#FF305E',
        marginLeft: 30,
        marginTop: 20,
        fontSize: 12,
    },
    items: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "transparent",
    },
    denglu: {
        color: '#FF305E',
        marginRight: 30,
        marginTop: 20,
        fontSize: 14,
    },
    heng: {
        flexDirection: 'column',

    },
    xia: {
        width: 61,
        height: 1,
        backgroundColor: '#FF305E',
        marginLeft: 30
    },
    xiaf: {
        width: 61,
        height: 1,
        backgroundColor: '#FF305E',
        // marginLeft:20
    },
    xias: {
        width: 49,
        height: 1,
        backgroundColor: '#FF305E',
        marginRight: 30
    },
    zuixia: {
        // flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: Contants.Screen.height / 3
    },
    texts: {
        fontSize: 10
    },
    buttom: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logins: {
        alignSelf: 'center',
    },
    hengt:{
        height:2,
        backgroundColor:'red',
    },
})
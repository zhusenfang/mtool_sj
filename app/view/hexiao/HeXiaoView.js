import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    ListView,
    KeyboardAvoidingView,
    TextInput,
    Animated,
    Platform,
    Easing,
    BackHandler
} from 'react-native';
import comstyle from '../../common/CommonStyle';
import {API,postFetch} from '../../common/GConst';
import Camera from 'react-native-camera'
import {QRScannerView} from 'ac-qrcode';
import dismissKeyboard from 'dismissKeyboard'
var TimerMixin = require('react-timer-mixin');
import Toast, {DURATION}  from 'react-native-easy-toast';
import Contants from '../../common/Contants';
import Modal from 'react-native-modal'
export default class HeXiaoView extends Component{

    constructor(props){
        super(props)
       this.state={
           isFlashLight:Camera.constants.TorchMode.off,
           isNumerOpenDoor:false,
           number:"",
           scantime:0,

           //是否显示使用帮助
           isModalVisible:false,
           //闪光灯的开关


       }
        mixins: [TimerMixin]
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        // this.clearInterval(this.timer);
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        // this.timer = this.setInterval(()=>{
        //
        //     if(this.state.scantime == 18){
        //
        //         this.clearInterval(this.timer);
        //
        //         if(isScanEnd == false){
        //
        //             this.setState({
        //
        //                 isNumerOpenDoor:true,
        //             })
        //
        //         }
        //     }
        //
        //     this.setState({
        //
        //         scantime:this.state.scantime+1,
        //     })
        //
        //
        // },1000)



    }


    render(){
        return(<View style={comstyle.contain}>
            <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={()=>{


                dismissKeyboard();

            }}>

                <QRScannerView
                    cornerColor={"#FF305E"}
                    bottomMenuHeight={150}
                    bottomMenuStyle={{backgroundColor:"#0000004D",height:150}}
                    // hintText={'请对准门上的二维码'}
                    hintTextStyle={{marginBottom:-10,color: "white", fontSize: 13, fontWeight: 'bold'}}
                    hintTextPosition={70}
                     maskColor={"#0000004D"}
                    onScanResultReceived={this.barcodeReceived.bind(this)}
                    isShowScanBar={true}
                    renderTopBarView={() =>this._renderTopView()}
                    renderBottomMenuView={()=>this._renderBottomView()}
                    torchMode={this.state.isFlashLight}
                />

                <Modal
                    isVisible={this.state.isModalVisible}
                    style={{justifyContent:"center",alignItems:"center"}}


                >
                    {/*<OpenHelpView superthis={this}/>*/}
                </Modal>

            </TouchableOpacity>

            {this.state.isNumerOpenDoor?<NumberOpenDoor superthis={this} callback={(component,data)=>{


                this.setState({

                    isFlashLight:Camera.constants.TorchMode.off,
                })

                this.props.navigator.push({Component:component,data:{number:data},callback:this.props.router.callback});

                this.setState({

                    isNumerOpenDoor:false,
                })

            }
            }/>:null}

            <Toast
                ref={(e)=>{this._toast=e}}
                position='center'
            />
        </View>)
    }
    _renderTopView() {

        return <Text ></Text>
    }
    _renderBottomView(){

        return (

            <View style={ScanCodeStyle.bottom}>

                <TouchableOpacity onPress={this.bottomAction.bind(this,1)} style={{marginLeft:(Contants.Screen.width-100),alignItems:"center"}}>
                    {/*<Image style={{width:20,height:20}} source={require("../../img/window/write.png")}/>*/}
                    {/*<Text style={{marginTop:8,color:"white"}}>手动输入</Text>*/}
                    <Image source={require('../../img/pinglun/dibu.png')}/>
                </TouchableOpacity>

                {/*<TouchableOpacity onPress={this.bottomAction.bind(this,2)} style={{marginLeft:(Contants.Screen.width-100)/3,alignItems:"center"}}>*/}
                    {/*<Image style={{width:20,height:20}} source={require("../../img/window/write.png")}/>*/}
                    {/*<Text style={{marginTop:8,color:"white"}}>手电筒</Text>*/}
                {/*</TouchableOpacity>*/}

            </View>
        )

    }
    /****************按钮事件***************************/


    barcodeReceived(e) {

        isScanEnd = true;

        if (this.transCode !== "888") {
         var tem=this
            //放在this上，防止触发多次，setstate有延时
            this.transCode = "888";

            var mipaoIP2 = e.data.substr(0,22);

            var mipaoIP1 = e.data.substr(0,20);

            // if(!(( mipaoIP2 === "http://mtool.zhaomini.com"))){
            //
            //     // this._toast.close();
            //     // this._toast.show("二维码格式有误",1500);
            //     alert()
            //     return;
            //
            // }
            var number = e.data.substring(38);

            var reg = /^[0-9]*$/g;

            if(!reg.test(number)){

                number = e.data.substring(40);
            }

          // alert(e.data)
           this.props.navigation.navigate('OrderDetail',{datas:e.data})
        }
    }
    bottomAction(index){

        //1手动输入 2摄像头
        if(index == 2){

            if(this.state.isFlashLight == Camera.constants.TorchMode.on){

                this.setState({

                    isFlashLight:Camera.constants.TorchMode.off,
                })

            }else{

                this.setState({

                    isFlashLight:Camera.constants.TorchMode.on,
                })
            }

        }else{

            // this.setState({
            //
            //     isNumerOpenDoor:!this.state.isNumerOpenDoor,
            // })

         this.props.navigation.navigate('ShouDongWrite')
        }

    }
}
var ScanCodeStyle = StyleSheet.create({

    top:{

        width:160,
        borderColor:"rgb(200,160,21)",
        borderWidth:1,
        borderRadius:8,
        marginLeft:Contants.Screen.width/2-75,
        textAlign:"center",
        padding:10,
        color:"rgb(200,160,21)",
        marginTop:30,
    },

    bottom: {

        flexDirection: "row",
        width: "100%",
        height: 160,
        backgroundColor: "transparent",

    }
})

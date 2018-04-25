import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    Image,
    TouchableOpacity,
    TextInput,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle'
import {API,postFetch} from '../../../common/GConst';
import Toast from "react-native-easy-toast";
import Contants from '../../../common/Contants'
export default class BianJiName extends Component {
    constructor(props) {
        super(props)
        this.state = {
            textinput:'',

        }
    }
    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        const {navigate,goBack,state}=this.props.navigation;

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
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9',flexDirection:'column'}]}>

            <View style={styles.con}>
                <TextInput
                    style={{   backgroundColor: "#FFFFFF",
                        textAlign: "center",
                        height:40,
                        borderWidth:1,
                        borderColor:'#E5E5E5',
                        width:Contants.Screen.width-40,
                        borderRadius:4,
                        marginLeft:20,
                        marginRight:20,}}
                    placeholder={'输入分类名称'}
                    underlineColorAndroid='transparent'
                    placeholderTextColor="#B2B2B2"
                    onChangeText={(e)=>{
                        this.setState({
                         textinput:e,
                        })
                    }}
                />
            </View>

            <View style={comstyle.heng}/>
            <TouchableOpacity  style={styles.ti} onPress={this.tija.bind(this)}>
                <Image source={require('../../../img/window/tijiao.png')} style={styles.ti}>
                    <Text style={styles.ba}>保存</Text>
                </Image>
            </TouchableOpacity>
            <Toast ref={(e) => {
                this._toastss = e
            }}
                   position='top'
            />
        </View>)
    }
    tija(){

        // this.props.navigation.state.params.callbackimg()
        this.props.navigation.state.params.callback(this.state.textinput)
        if(this.state.textinput.length==0){
            this._toastss.show('请输入名称')
            return
        }
        const list=this.props.navigation.state.params.data;
        if(list==''){
            // postFetch(API.BianjiMingCheng,{memberCollectCatalog:{name:this.state.textinput,type:2}},(result)=>{
            //     // alert(JSON.stringify(result))
            //     if(result.status==1){
            //         this._toastss.show('分类添加成功')
                    this.props.navigation.goBack();
            //     }
            // },(error)=>{
            //     this._toastss.show(error)
            // })
        }else {
            var temp=this
           // postFetch(API.BianjiShouCang,{memberCollectCatalog:{name:this.state.textinput,id:list}},(result)=>{
           //     // alert(JSON.stringify(result))
           //     if(result.status==1){
           //         // setTimeout(function () {
           //            this._toastss.show('编辑成功')
           //         // },1000)
           //
                  this.props.navigation.goBack();
           //     }
           // },(error)=>{
           //     this._toastss.show(error)
           // })
        }

    }
}
const styles=StyleSheet.create({
    con:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        height:66,
        backgroundColor:'white',
        marginTop:20
    },
    ti:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    ba:{
       fontSize:14,
       color:'#FF305E'
    }
})
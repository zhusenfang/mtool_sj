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
    NativeModules,
    findNodeHandle,
    BackHandler
} from 'react-native';
import Contants from '../../common/Contants'
import DaiSong from '../nativeModuals/DaiSong'
import {NavigationActions} from 'react-navigation'
// import MyMap from '../nativeModuals/MyMap'
import {API,postFetch} from '../../common/GConst';
export default class ToolsService extends Component{
    constructor(props){
        super(props)
        this.state={
            restaurant:'',//店铺地址
            loge:'./',//店铺logo
            latitude:0,
            longtitude:0,
            jiwei:'',
            index:true
        }

    }

    componentWillMount(){
        postFetch(API.DianPuMessage,null,(result)=>{
        // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    restaurant:result.data.address,
                    loge:result.data.logoUrl,
                    latitude:result.data.latitude,
                    longtitude:result.data.longitude,
                })

            }
        })
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
        DeviceEventEmitter.addListener('data',this.onScanningResult)
        DeviceEventEmitter.addListener('onViewLoaded',this.onResult)
    }
    onScanningResult=(e)=>{
        // alert(e.result)
        // ToastAndroid.show("ddd")
        // alert('sss')
        // if(this.state.index){
        //     this.setState({
        //         jiwei:e.count,
        //         index:false
        //     })
        // }
       this.setState({
           jiwei:e.count,
       })
        // jiwei=e.count
        // alert(this.state.longitude)
        // alert(e.action)

    }
    // componentDidMount() {
    //
    //     // NativeModules.DaisongModual.setShopLocation(findNodeHandle(this),120,162)
    //
    // }
    render(){

        return(
            <View style={styles.cons}>
            {/*<Text>ddd</Text>*/}
            <View style={{flex:1}}>
                   <View style={{flex:1}}>
                    <DaiSong style={{width:Contants.Screen.width,height:Contants.Screen.height}}
                             ref={ component => this._MapView = component }
                    />
                   </View>

                <TouchableOpacity style={styles.fen} onPress={()=>{this._MapView.setShopLocation(this.state.latitude,this.state.longtitude)}}>
                 <Image source={{uri:this.state.loge}} style={styles.image}/>
                    <View style={styles.imgcont}>
                      <View style={styles.wozai}>
                         <Text style={styles.wozaitext}>我在</Text>
                          <Text style={styles.dasha}>{this.state.restaurant}</Text>
                      </View>
                        <View style={styles.wozai}>
                            <Text style={styles.wozaitext}>附近有</Text>
                            <Text style={styles.prisong}>{this.state.jiwei+'位配送员'}</Text>
                            <Text style={styles.wozaitext}>为您服务</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.middle}>
                <TouchableOpacity style={styles.bord} onPress={this.daisong.bind(this)}>
                    <Image source={require('../../img/tools/faqidai.png')}/>
                    <Text style={styles.daitext}>发起代送</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bord,{marginLeft:20}]} onPress={this.order.bind(this)}>
                    <Image source={require('../../img/tools/mineorder.png')}/>
                    <Text style={styles.daitext}>我的订单</Text>
                </TouchableOpacity>
            </View>

        </View>)
    }
    componentDidUpdate(){
        // DeviceEventEmitter.addListener('onViewLoaded',this.onResult)

        // DeviceEventEmitter.addListener('data',this.onScanningResult).remove();'
        // if(this.state.index){
        //     this._MapView.setShopLocation(this.state.latitude,this.state.longtitude)
        //     this.setState({
        //         index:false
        //     })
        // }

    }
    onResult=()=>{
        if(this.state.index){
            this.setState({
                index:false
            })
            this._MapView.setShopLocation(this.state.latitude,this.state.longtitude)
        }


    }
    componentWillUnmount(){
        DeviceEventEmitter.addListener('data',this.onScanningResult).remove();
        DeviceEventEmitter.addListener('onViewLoaded',this.onResult).remove();
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    }
    daisong(){
        this.props.navigation.navigate('ToolsTotal',{data:0})

    }
    order(){
        this.props.navigation.navigate('ToolsTotal',{data:1})
    }
}
const styles=StyleSheet.create({
    cons:{
        backgroundColor:'#f9f9f9',
        flex:1,
     },

    middle:{
        flexDirection:'row',justifyContent:'center',alignItems:'center',height:122,backgroundColor:'white',
    },

    bord:{
        width:81,
        height:81,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#E5E5E5',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
    },
    daitext:{
        fontSize:14,
        color:'#969696',
        marginTop:8
    },
    fen:{
        alignSelf:'center',
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'#E5E5E5',
        borderRadius:40,
        width:255,
        height:54,
        position:'absolute',
        // justifyContent:'flex-end',
        flexDirection:'row',
        marginTop:Contants.Screen.height/2+40,
        justifyContent:'flex-start',
        alignItems:'center',
    },
    image:{
        width:40,
        height:40,
        borderRadius:20,
        borderWidth:1,
        borderColor:'#E5E5E5',
        marginLeft:10
    },
    imgcont:{
        flexDirection:'column',
        justifyContent:'flex-start',
        marginLeft:10
    },
    wozai:{
        flexDirection:'row',

    },
    wozaitext:{
        fontSize:12,
        color:'#282828'
    },
    dasha:{
        fontSize:12,
        color:'#FF305E'
    },
    prisong:{
        fontSize:12,
        color:'#459CF4'
    }

})
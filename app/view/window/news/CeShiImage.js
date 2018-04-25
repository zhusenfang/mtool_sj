import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    FlatList,
    ListView,
    RefreshControl,
    ActivityIndicator,
    ScrollView,
    Modal,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants';
import MyCheckView from '../../../common/MyCheckView'
import Gallery from 'react-native-image-gallery'

import Storage from '../../../common/GGAsyncStorage'
import Toast from "react-native-easy-toast";
// const con=[];
// const images=[
//     {"source":{"uri":'http://122.112.196.52:8080/fileService/uploads/2017/12/06/15125267927654.PNG'},dimensions: { width: 150, height: 150 }},
//     {source:{uri:'http://59.110.1.160:8081/fileService/uploads/2017/12/06/15125267927654.PNG'}},
//     {source:{uri:'http://59.110.1.160:8081/fileService/uploads/2017/12/06/15125267927654.PNG'}},
//     {source:{uri:'http://59.110.1.160:8081/fileService/uploads/2017/12/06/15125267927654.PNG'}},
//     {source:{uri:'http://59.110.1.160:8081/fileService/uploads/2017/12/06/15125267927654.PNG'},dimensions: { width: 150, height: 150 }},
//     {source:{uri:'http://59.110.1.160:8081/fileService/uploads/2017/12/06/15125267927654.PNG'}},
//     {source:{uri:'http://59.110.1.160:8081/fileService/uploads/2017/12/06/15125267927654.PNG'}},
//     {source:{uri:'http://59.110.1.160:8081/fileService/uploads/2017/12/06/15125267927654.PNG'}},
//
// ]
export default class CeShiImage extends Component{
    constructor(props){
        super(props)
        this.state={
            // list:[]
            page:0
        }
    }

    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    componentDidMount(){
        //alert("eeee")
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        // return con
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

        const list=this.props.navigation.state.params.data;
        const index=list.length
        // alert(JSON.stringify(list))

        return(<View style={{flex:1}}>
            <View style={[styles.titleView]}>
                <View style={comstyle.rightview}>
                    <View  style={styles.hua}>
                <Text style={styles.title}>{this.state.page+1}/{index}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
                <Image source={require('../../../img/page/arrow.png')} style={styles.arr}/>
                </TouchableOpacity>
            </View>
            <Gallery
                style={{flex:1,backgroundColor:'transparent'}}
                images={list}
                initialPage={0}
                onPageSelected={(page)=>{
                    this.setState({
                        page:page
                    })
                }}

            />
        </View>)
    }


}
const styles=StyleSheet.create({
    con:{
        flexDirection:'row',
        // backgroundColor:'#F2F2F2'
        position:'absolute',
        zIndex:1000
    },
    cls:{
        justifyContent:'flex-end',
        alignItems:'center',
        flexDirection:'row',
        alignSelf:'flex-end',
        // marginLeft:Contants.Screen.width

        marginRight:20
    },
    shan:{
        width:45,
        height:45,
        backgroundColor:'#FFFFFF',
        opacity:0.69,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center',
        marginTop:15,
        marginRight:20
    },
    titleView: {
        width: "100%",
        height: 55,
        backgroundColor: 'rgba(96,96,96,0.3)',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        flexDirection:'row',
    },
    title: {
        color: '#282828',
        fontSize: 14,
        // marginTop: Platform.OS === 'ios' ? 10 : 0
    },
    hua:{
        alignItems:'center',
        justifyContent:'center',
        width:45,
        height:45,
        borderRadius:22.5,
        backgroundColor:'#FFFFFF',
        opacity:0.7,
        marginLeft:20
    },
    arr:{
        marginRight:20
    }

})
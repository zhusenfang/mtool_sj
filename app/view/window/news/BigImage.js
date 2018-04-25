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
import ImageViewer from 'react-native-image-zoom-viewer'
import *as wechat from 'react-native-wechat'
import Storage from '../../../common/GGAsyncStorage'
import Toast from "react-native-easy-toast";
import RadioModal from 'react-native-radio-master';
const con=[];
export default class BigImage extends Component{
      constructor(props){
          super(props)
          this.state={
           // list:[]
          }
      }

    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    componentDidMount(){
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
        // alert(JSON.stringify(list))
        return(<View>
           <Modal
               visible={true}
              transparent={true}

           >
               <ImageViewer
                   imageUrls={list}
                   enableImageZoom={true}
                   renderHeader={()=>{
                       return(<View style={styles.con}>
                          <View style={comstyle.contain}/>
                           <View style={styles.cls}>
                               {/*<View style={styles.shan}>*/}
                                   {/*<Text>删除</Text>*/}
                               {/*</View>*/}
                               <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
                               <Image source={require('../../../img/page/arrow.png')} style={styles.arr}/>
                               </TouchableOpacity>
                           </View>

                       </View>)
                   }}
                   // renderIndicator={()=>{
                   //     return(<View style={{backgroundColor:'white',}}>
                   //      <Text style={{color:'yellow'}}></Text>
                   //     </View>)
                   // }}
               />

           </Modal>
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
    arr:{
        alignSelf:'flex-end',
        marginTop:15,
        // marginLeft:Contants.Screen.width/2
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
    }
})
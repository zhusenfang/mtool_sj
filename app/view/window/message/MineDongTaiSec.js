import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    Image,
    TouchableOpacity,
    ListView,
    BackHandler,
    Platform
} from 'react-native';
import comstyle from '../../../common/CommonStyle'
import {API,postFetch} from '../../../common/GConst';
import Toast from "react-native-easy-toast";
import Contants from '../../../common/Contants'
import Storage from '../../../common/GGAsyncStorage'
import WatchVideo from '../../nativeModuals/WatchVideo'
var bigimage=[]
var flatlist=''
export default class MineDongTaiSec extends Component{
   constructor(props){
       super(props)
       this.state={
           dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2,
           }),
           isshow:false,
           dataSourceimg: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2,
           }),
           data:[]
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
        Storage.get("userId").then((tagss)=>{
            postFetch(API.MineDongTaiSec,{id:tagss},(result)=>{
                // alert(JSON.stringify(result))
                if(result.status==1){
                    if(result.msg==1){
                        if(result.data==[] || result.data.length==0){
                            this.setState({
                                isshow:false
                            })
                        }else {
                            this.setState({
                                dataSource:this.state.dataSource.cloneWithRows(result.data),
                                isshow:true,
                                data:result.data
                            })
                        }

                    }

                }
            },(error)=>{
                alert(error)
            })
        })


    }
    render(){
        return(<View style={styles.con}>
            {this.state.isshow==true?
                <ListView
                    // initialListSize={9}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    // contentContainerStyle={styles.list}
                />:<View style={{marginTop:20,alignItems:'center',justifyContent:'center'}}>
                    <Text>当前没有动态记录</Text>
                </View>
            }
        </View>)
    }
    _renderRow(rowData,sectionID,rowID){
        bigimage=this.state.data[rowID].forumThreadResources
        flatlist=this.state.data[rowID].forumThreadResources.length
        return(<View style={styles.item}>
             <View style={styles.icon}>
                 <Text style={styles.apptime}>{rowData.month}</Text>
                 {/*<Text style={styles.apptime}>{new Date(rowData.createTime).getMonth()+1+'月'}</Text>*/}
             </View>
              <View style={styles.imgcon}>
                  <ListView
                    dataSource={this.state.dataSourceimg.cloneWithRows(rowData.forumThreadResources)}
                    contentContainerStyle={styles.list}
                    renderRow={this._renderImage.bind(this)}
                  />

              </View>
        </View>)
    }
    _renderImage(rowData){
        return(<View style={styles.space}>
            {rowData.type==0 || rowData.type==undefined?
                <TouchableOpacity onPress={this.rendimgview.bind(this,bigimage)}>
            <Image source={{uri:rowData.resourceUrl}} style={styles.image}/>
                </TouchableOpacity>
           :
                <TouchableOpacity onPress={this.fenmina.bind(this)}>
                <Image source={{uri:rowData.coverUrl}} style={[styles.image,{ backgroundColor:'gray',justifyContent:'center',alignItems:'center'}]}>
                    <Image source={require('../../../img/pinglun/bofang.png')}/>
                </Image>
                </TouchableOpacity>
            }
        </View>)
    }
    rendimgview(rowData){
        let items=[]
        rowData.map((item,index)=>{
            items.push({source:{uri:item.resourceUrl}})
            // 把需要的参数push进去

            // this.setState({
            //     //  你直接把item的值 给data就好了啊  不需要setState的
            // })
        })
        this.props.navigation.navigate('CeShiImage',{data:items})
    }
    fenmina(rowData){
        WatchVideo.playVideo(rowData.coverUrl,rowData.resourceUrl);
    }
}
const styles=StyleSheet.create({
    con:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    item:{
        flexDirection:'column',

    },
    list:{
        marginTop:10,
        justifyContent:'flex-start',
        flexDirection:'row',
        flexWrap:'wrap'
    },
    icon:{
        flexDirection:'row',
        justifyContent:'flex-start',
        marginTop:26,
        marginBottom:10,
        marginLeft:20
    },
    apptime:{
        fontSize:14,
        color:'#282828'
    },
    image:{
        width:100,
        height:100,
        borderRadius:5,

    },
    imgcon:{

        alignItems:'center',
         marginLeft:20,
        flexDirection:'row',
        flexWrap:'wrap',

    },
    space:{
        marginRight:10,
        marginTop:10
    }
})
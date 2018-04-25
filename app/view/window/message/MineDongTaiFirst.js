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
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle'
import {API,postFetch} from '../../../common/GConst';
import Toast from "react-native-easy-toast";
import Contants from '../../../common/Contants'
var flatlist=''
import WatchVideo from '../../nativeModuals/WatchVideo'
var bigimage=[]
export default class MineDongTaiFirst extends Component{
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
          list:[]
      }
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

    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        postFetch(API.MineDongTaiFirst,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                if(result.data==[] || result.data.length==0){
                    this.setState({
                        isshow:false
                    })
                }else {
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(result.data),
                        isshow:true,
                        list:result.data,
                    })
                }

            }
        },(error)=>{
            alert(error)
        })
    }
    render(){
        return(<View style={styles.con}>
            {this.state.isshow==true?
           <ListView
               dataSource={this.state.dataSource}
               renderRow={this.renderItem.bind(this)}
           />:<View style={{marginTop:20,alignItems:'center',justifyContent:'center'}}>
                    <Text>当前没有动态记录</Text>
                </View>
            }
        </View>)
    }
    renderItem(rowData,sectionID,rowID){
        flatlist=this.state.list[rowID].forumThreadResources.length
        bigimage=this.state.list[rowID].forumThreadResources
        return(
            <TouchableOpacity style={styles.toux} onPress={this.dongtaidetail.bind(this,rowData.id)}>
                <View style={[styles.item,{justifyContent:'space-between'}]}>
                    <View style={comstyle.rightview}>
                        <Image source={{uri:rowData.userMember&&rowData.userMember.picUrl}} style={styles.image}/>
                        <View style={styles.chixu}>
                            <Text style={styles.nick}>{rowData.userMember&&rowData.userMember.nickname}</Text>
                            {/*<Text>{rowData.createTime}</Text>*/}
                            <Text style={styles.hours}>{new Date(rowData.createTime).getHours()+'小时前'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{height:40,width:40,alignItems:'center',justifyContent:'center',}}>
                        <Image source={require('../../../img/pinglun/shenglhunpress.png')} style={{marginRight:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={{width:335,height:1,backgroundColor:'#E5E5E5',alignSelf:'center'}}/>
                <View style={{flexDirection:'column',alignItems:'center'}}>
                    <View style={styles.tupian}>
                        <ListView
                            dataSource={this.state.dataSourceimg.cloneWithRows(rowData.forumThreadResources)}
                            renderRow={this.renderimg}
                            removeClippedSubviews={false}
                            // horizontal={true}
                            contentContainerStyle={styles.consty}
                            enableEmptySections={true}
                            style={{backgroundColor:'white',marginLeft:7}}
                        />
                    </View>
                    <View style={styles.item}>
                        <View style={styles.you}>
                            <View style={styles.kai}>
                                <Text style={styles.context} numberOfLines={2}>{rowData.content}</Text>
                            </View>
                            <View style={styles.kais}>
                                <TouchableOpacity >
                                    <Image source={require('../../../img/pinglun/pinglun.png')}/>
                                </TouchableOpacity>
                                <Text style={styles.pingluntext}>{rowData.opposes}</Text>
                                {/*<TouchableOpacity onPress={this.dianzan.bind(this,rowData,rowID)}>*/}
                                <Image source={require('../../../img/pinglun/dianzan.png')} />
                                <Text style={styles.pingluntext}>{rowData.supports}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    dongtaidetail(id){
        this.props.navigation.navigate('DongTaiDetails',{data:id})
    }
    renderimg=(rowData,sectionID,rowID)=>{
        var convert=null
        if(flatlist==1){

            if(rowData.type==undefined || rowData.type==0){
                convert=(<TouchableOpacity onPress={this.fets.bind(this,bigimage)}>
                    <Image source={{uri:rowData.resourceUrl}} style={styles.renderimgs}/>
                </TouchableOpacity>)
            }else {
                // alert(rowData.coverUrl)
                convert=(<TouchableOpacity onPress={this.fengmian.bind(this,rowData)}>
                    <Image source={{uri:rowData.coverUrl}} style={[styles.fenmianvideo]}>
                        <Image source={require('../../../img/pinglun/bofang.png')}/>
                    </Image>
                </TouchableOpacity>)
            }
        }else {
            convert=( <TouchableOpacity onPress={this.fets.bind(this,bigimage)}>
                <Image source={{uri:rowData.resourceUrl}} style={styles.renderimg}/>
            </TouchableOpacity>)
        }
        return(<View style={{flexDirection:'row',flexWrap:'wrap'}} key={rowID}>
            {/*{rowData.type==0?*/}
                {/*<TouchableOpacity onPress={this.fets.bind(this,bigimage)}>*/}
            {/*<Image source={{uri:rowData.resourceUrl}} style={flatlist==1?styles.renderimgs:styles.renderimg}/>*/}
                {/*</TouchableOpacity>*/}
            {/*:*/}
                {/*<TouchableOpacity onPress={this.fengmian.bind(this,rowData)}>*/}
                {/*<Image source={{uri:rowData.coverUrl}} style={styles.renderimgs}/>*/}
                {/*</TouchableOpacity>}*/}
            {convert}
        </View>)
    }
    fets(rowData){
        let items = [];
        rowData.map((item,index)=>{
            items.push({source:{uri:item.resourceUrl}})
            // 把需要的参数push进去

            // this.setState({
            //     //  你直接把item的值 给data就好了啊  不需要setState的
            // })
        })
        this.props.navigation.navigate('CeShiImage',{data:items})
    }
    fengmian(rowData){
        WatchVideo.playVideo(rowData.coverUrl,rowData.resourceUrl);
    }
}
const styles=StyleSheet.create({
    con:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    toux:{
        // backgroundColor:'white',
        flexDirection:'column',
        // height:Contants.Screen.height/6,
        marginTop:10
        ,backgroundColor:'white'
    },
    item:{
        flexDirection:'row',
        flex:1,
        // borderWidth:1,
        // borderColor:'gray',
        alignItems:'center',
        marginTop:10,
        marginBottom:10
    },
    chixu:{
        flexDirection:'column',
        justifyContent:'center',
        // alignItems:'center'
    },
    kai:{
        flexDirection:'row',
        flex:1,
        width:Contants.Screen.width,
        margin:4
    },
    kais:{
        flexDirection:'row',
        justifyContent:'flex-end',
        flex:1,
        width:Contants.Screen.width
    },
    you:{
        flexDirection:'column'
    },
    image:{
        width:35,
        height:35,
        marginRight:10,
        marginLeft:20,
        borderRadius:4
    },
    loadingMore: {
        marginVertical: 20,
        flexDirection:'row',
        justifyContent:'center'
    },
    loadingText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center'
    },
    border:{
        height:57,width:57,borderWidth:1,borderRadius:6,borderColor:'#E5E5E5',
        justifyContent:'center',alignItems:'center',
    },
    scrollist:{
        flexDirection:'column',alignItems:'center',marginTop:20,marginLeft:10,marginRight:10,marginBottom:20
    },
    scrollists:{

        flexDirection:'column',alignItems:'center',marginTop:0,marginLeft:8,marginRight:8
    },
    tupian:{
        width:Contants.Screen.width,
        flexDirection:'row'
        ,flexWrap:'wrap',
        backgroundColor:'white',
    },
    consty:{
        flexWrap:'wrap',
        flexDirection:'row',
        backgroundColor:'white'
    },
    renderimg:{
        width:100,height:100,marginTop:7,marginLeft:7,marginRight:10,borderRadius:4
    },
    renderimgs:{
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5
    },
    fenmianvideo:{
        backgroundColor:'gray',
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5,
        justifyContent:'center',alignItems:'center',
    },
    nick:{
        fontSize:12,color:'#282828'
    },
    hours:{
        fontSize:10,color:'#B2B2B2'
    },
    context:{
        marginLeft:20,fontSize:12,color:'#282828'
    },
    pingluntext:{
        marginRight:20,
        fontSize:12,
        color:'#B2B2B2'
    }

})
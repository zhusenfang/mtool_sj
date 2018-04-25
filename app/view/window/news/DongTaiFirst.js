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
    BackHandler,
    Platform
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants'
import WatchVideo from '../../nativeModuals/WatchVideo'
 var pagelist=[]
export default class DongTaiFirst extends Component{
    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            picurl:null,
            name:'',
            creattime:'',
            support:'',
            content:'',
            forum:[],
            dataSourceimg: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            imglist:"",
            great:[],
            supportType:'',
            dianzanid:'',
            bigimagelist:[]
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
        const list=this.props.navigation.state.params.data;

       postFetch(API.PingLunDetail,{forumPost:{id:list}},(result)=>{
           // alert(JSON.stringify(list))
           if(result.status==1){
               this.setState({
                   picurl:result.data.userMember.picUrl,
                   name:result.data.userMember.nickname,
                   creattime:result.data.createTime,
                   support:result.data.supports,
                   content:result.data.content,
                  dataSource:this.state.dataSource.cloneWithRows(result.data.userMemberDos),
                   dataSourceimg:this.state.dataSourceimg.cloneWithRows(result.data.forumThreadResources),
                   imglist:result.data.forumThreadResources.length,
                   supportType:result.data.suppoppType,
                   dianzanid:result.data.id,
                   bigimagelist:result.data.forumThreadResources

               })
               if(result.data.userMemberDos!=undefined){
                   this.setState({
                       great:result.data.userMemberDos
                   })
               }
           }
       },(error)=>{
           alert(error)
       })
    }
    render(){
        return(<View style={comstyle.contain}>
            <View style={styles.top}>
                <View style={comstyle.rightview}>
                <Image source={{uri:this.state.picurl}} style={{width:35,height:35,marginLeft:20,borderRadius:4}}/>
                <View style={styles.col}>
                   <Text style={{fontSize:12,color:'#282828'}}>{this.state.name}</Text>
                    <Text style={{fontSize:10,color:'#B2B2B2'}}>{new Date(this.state.creattime).getHours()+'小时前'}</Text>
                </View>
                </View>
                <TouchableOpacity style={comstyle.time}>
                    <TouchableOpacity onPress={this.dianzans.bind(this)}>
                <Image source={this.state.supportType==0?require('../../../img/pinglun/dianzan.png'):require('../../../img/pinglun/dianzanpress.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                <Text style={comstyle.textright}>{this.state.support}</Text>
                </TouchableOpacity>
            </View>
            <View style={comstyle.heng}></View>

            <View style={styles.tupian}>
                <ListView
                    dataSource={this.state.dataSourceimg}
                    renderRow={this.renderimg}
                    removeClippedSubviews={false}
                    // horizontal={true}
                    contentContainerStyle={styles.consty}
                    enableEmptySections={true}
                    style={{backgroundColor:'white',marginLeft:7}}
                />
                {/*{pagelist}*/}
            </View>
            <View style={styles.text}>
            <Text style={styles.content}>{this.state.content}</Text>
            </View>
            <View style={comstyle.heng}></View>
            <View style={styles.zan}>
                <Text style={{marginLeft:20,fontSize:14,color:'#282828'}}>最近赞过的人</Text>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('GreatedView',{data:this.state.great})}}>
                <Image source={require('../../../img/pinglun/shenglh.png')} style={comstyle.textright}/>
                </TouchableOpacity>
            </View>
            <View style={comstyle.heng}></View>
            {/*图片的listview*/}
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRowImage}
                enableEmptySections={true}
                // horizontal={true}
                contentContainerStyle={{ flexWrap:'wrap',
                    flexDirection:'row',}}
            />
        </View>)

    }
    dianzans(){
        if(this.state.supportType==0){
            this.setState({
                supportType:1,
                support:this.state.support+1
            })
            postFetch(API.DianZan, {postId: this.state.dianzanid}, (result) => {
          // alert(JSON.stringify(result))
            },(error)=>{
                alert(error)
            })
        }else {
            this.setState({
                supportType:0,
                support:this.state.support-1
            })
            postFetch(API.QuXiaoZan,{forumPostSuppopp:{postId:this.state.dianzanid}},(result)=>{
            // alert(JSON.stringify(result))
            },(error)=>{
                alert(error)
            })
        }

    }
    renderimg=(rowData)=>{
        // alert(JSON.stringify(rowData))
        var convert=null
        if(this.state.imglist==1){

            if(rowData.type==undefined || rowData.type==0){
                convert=(<TouchableOpacity onPress={this.fets.bind(this,rowData)}>
                    <Image source={{uri:rowData.resourceUrl}} style={styles.fenmians}/>
                </TouchableOpacity>)
            }else {
                convert=(<TouchableOpacity onPress={this.fenmina.bind(this,rowData)}>
                    <Image source={{uri:rowData.coverUrl}} style={[styles.fenmianvideo]}>
                        <Image source={require('../../../img/pinglun/bofang.png')}/>
                    </Image>
                </TouchableOpacity>)
            }
        }else {
            convert=( <TouchableOpacity onPress={this.fets.bind(this,rowData)}>
                <Image source={{uri:rowData.resourceUrl}} style={styles.fenmian}/>
            </TouchableOpacity>)
        }
        return(<View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {convert}
        </View>)
    }

    _renderRowImage=(rowData)=>{
      // alert(JSON.stringify(rowData))
        return(<View style={{flexDirection:'row',flexWrap:'wrap'}}>
            <Image source={{uri:rowData.picUrl}} style={styles.rowimages}/>
            {/*<Text>{rowData}</Text>*/}
        </View>)
    }
    fets(rowData){
        let items = [];
        this.state.bigimagelist.map((item,index)=>{
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
     top:{
         flexDirection:'row',
         justifyContent:'space-between',
         alignItems:'center',
         backgroundColor:'white',
         marginTop:20,
         height:60
     },
    col:{
         flexDirection:'column',
        // alignItems:'center',
        justifyContent:'flex-start',
        marginLeft:10
    },
    tupian:{
         width:Contants.width,
        // height:50,
        // margin:10,
        flexDirection:'row'
        ,flexWrap:'wrap',
        backgroundColor:'white',
    },
    text:{
        // margin:10,
        backgroundColor:'white',
        marginBottom:10,
        marginTop:10,
        // height:30,
        // alignItems:'center',

    },
    zan:{
        height:30,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        marginTop:20
    },
    content:{
         marginLeft:20,
        fontSize:12,
        color:'#282828',
        marginRight:20,
        marginTop:5
        // alignSelf:'center',
    },
    consty:{
        flexWrap:'wrap',
        flexDirection:'row',
        backgroundColor:'white'
    },

    time:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'white',
        // width:50,
        // height:50
        // marginBottom:20
    },
    rowimages:{
        width:45,height:45,marginTop:10,marginLeft:10,marginRight:10,borderRadius:4
    },
    fenmianvideo:{
        backgroundColor:'gray',
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5,
        justifyContent:'center',alignItems:'center',
    },
    fenmian:{
        width:100,height:100,marginTop:7,marginLeft:7,marginRight:10,borderRadius:4,

    },
    fenmians:{
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5
    },

})
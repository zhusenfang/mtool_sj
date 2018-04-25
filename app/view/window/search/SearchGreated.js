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
    Switch,
    AsyncStorage,
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
import Storage from '../../../common/GGAsyncStorage'
import dismissKeyboard from 'dismissKeyboard'
var hotlist=[]
var pagelist=[]
export default class SearchGreated extends Component {
    constructor(props){
        super(props);
        // this.shit().bind(this)
        this.state={
            text:'',
            isStyle:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            dataSourceimg: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            hotList:[],
            hisList:[],

        }

    }
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
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

    componentWillMount(){

        // Storage.get('seargr').then((tagss)=>{
        //     // alert(tagss)
        //     this.setState({
        //         hisList:tagss
        //     })
        // })
        // if(this.state.hisList!=null){
        //     // alert('sss')
        //     for(var j=0;j<this.state.hisList.length;j++){
        //         pagelist.push(<View style={styles.bord} key={j}><Text style={styles.keyword}>{this.state.hisList[j]}</Text></View>)
        //     }
        // }
    }
    render(){
        // Storage.get('seargr').then((tagss)=>{
        //     // alert(tagss)
        //     this.setState({
        //         hisList:tagss
        //     })
        // })
        // if(this.state.hisList!=null){
        //     // alert('sss')
        //     for(var j=0;j<this.state.hisList.length;j++){
        //         pagelist.push(<View style={styles.bord} key={j}><Text style={styles.keyword}>{this.state.hisList[j]}</Text></View>)
        //     }
        // }

        var contview=null;
        if(this.state.isStyle==false){
            contview=(<View><View style={styles.his}>
                    <View style={comstyle.rightview}>
                        <Text style={styles.histext}>历史搜索</Text>
                    </View>
                    <View style={comstyle.leftview}>
                        <TouchableOpacity onPress={this.laji.bind(this)}>
                            <Image source={require('../../../img/window/lajitong.png')} style={styles.maleft}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('SearchGreatedHistory')}}>
                            <Image source={require('../../../img/search/shenglh.png')} style={comstyle.textright}/>
                        </TouchableOpacity>
                    </View>
                </View>
                    <View style={[comstyle.heng,{marginTop:15,flexDirection:'row',}]}/>


                    <View>
                        <Heading/>
                    </View>

                </View>
            )
        }else {
            contview=(<ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                enableEmptySections={true}
            />)
        }

        return(<View style={styles.con}>
            <View style={styles.textinput}>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.inputsty}
                    placeholderTextColor="#B2B2B2"
                    onChangeText={(e)=>{
                        this.setState({
                            text:e,
                        })
                    }}
                    multiline={true}
                    placeholder={'输入信息'}
                    onFocus={()=>{this.setState({isStyle:true})}}
                >

                </TextInput>
                <TouchableOpacity onPress={this.searchdong.bind(this)}>
                    <Image source={require('../../../img/page/srarch.png')} style={styles.img}/>
                </TouchableOpacity>
            </View>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
            {contview}

        </View>)
    }
    laji(){
        Storage.delete('seargr').then((tags)=>{
            this.setState({
                hisList:''
            })
        })
        pagelist.splice(0,pagelist.length)
    }
    searchdong(){
        dismissKeyboard();
        if(this.state.text==''){
            this._toast.show('请输入关键字')
            return
        }
        var hist=[this.state.text]
        Storage.get('seargr').then((taggs)=>{
            if(taggs==null){
                taggs = new Array();
            }
            taggs.push(hist)
            AsyncStorage.setItem('seargr', JSON.stringify(taggs),);
        })

        postFetch(API.SearchGreated,{keyWord:this.state.text},(result)=>{
            // alert(JSON.stringify(result))
            // alert(JSON.stringify(this.props))
            if(result.status==1){
                if(result.data==[] || result.data.length==0) {
                    this._toast.show('搜索无结果')
                    return
                }
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data),
                    // dataSourceimg:this.state.dataSourceimg.cloneWithRows(result.data.forumThreadResources)
                })
            }
        },(error)=>{

        })
    }
    _renderRow=(rowData,sectionID,rowID)=>{
        return(<TouchableOpacity style={styles.toux} onPress={this.shit.bind(this,rowData.id)}>
            <View style={[styles.item,{justifyContent:'space-between'}]}>
                <View style={comstyle.rightview}>
                    <Image source={{uri:rowData.userMember&&rowData.userMember.picUrl}} style={styles.image}/>
                    <View style={styles.chixu}>
                        <Text style={{fontSize:12,color:'#282828'}}>{rowData.userMember&&rowData.userMember.nickname}</Text>
                        {/*<Text>{rowData.createTime}</Text>*/}
                        <Text style={{fontSize:10,color:'#B2B2B2'}}>{new Date(rowData.createTime).getHours()+'小时前'}</Text>
                    </View>
                </View>
                <TouchableOpacity  style={{height:40,width:40,alignItems:'center',justifyContent:'center',}}>
                    <Image source={require('../../../img/pinglun/shenglh.png')} style={{marginRight:20}}/>
                </TouchableOpacity>
            </View>

            <View style={{width:335,height:1,backgroundColor:'#E5E5E5',alignSelf:'center',marginBottom:10}}/>
            <View style={{flexDirection:'column'}}>
                <ListView
                    dataSource={this.state.dataSourceimg.cloneWithRows(rowData.forumThreadResources)}
                    renderRow={this._renderImg}
                    contentContainerStyle={{   flexWrap:'wrap',
                        flexDirection:'row',
                    }}
                    enableEmptySections={true}
                />
                <View style={styles.item}>
                    {/*<ListView*/}
                    {/*// dataSource={rowData.resourceIsNull==1?this.state.dataSource.cloneWithRows(rowData.forumThreadResources):0}*/}
                    {/*renderRow={this._renderRow}*/}
                    {/*style={{height:40,width:40}}*/}
                    {/*dataSource={this.state.dataSource}*/}
                    {/*/>*/}

                    <View style={styles.you}>
                        <View style={styles.kai}>
                            <Text style={{marginLeft:20}}>{rowData.content}</Text>
                        </View>
                        <View style={styles.kais}>
                            <TouchableOpacity>
                                <Image source={require('../../../img/pinglun/pinglun.png')}/>
                            </TouchableOpacity>
                            <Text style={{marginRight:20}}>{rowData.opposes}</Text>
                            <TouchableOpacity>
                                <Image source={require('../../../img/pinglun/dianzanpress.png')} />

                            </TouchableOpacity>
                            <Text style={{marginRight:20}}>{rowData.supports}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>)
    }
    shit(id){
        this.props.navigation.navigate('DongTaiDetails',{data:id})
    }
    _renderImg=(row)=>{
        return(<View>
            <Image source={{uri:row.resourceUrl}} style={{height:100,width:100,borderRadius:5,marginLeft:15,marginTop:15}}/>
        </View>)
    }
}
class Heading extends Component{
    constructor(props){
        super(props)
        this.state={
            hisList:[]
        }
    }

    render(){
        Storage.get('seargr').then((tagss)=>{
            // alert(tagss)
            this.setState({
                hisList:tagss
            })
        })
        if(this.state.hisList!=null){
            // alert('sss')
            for(var j=0;j<this.state.hisList.length;j++){
                pagelist.push(<View style={styles.bord} key={j}><Text style={styles.keyword}>{this.state.hisList[j]}</Text></View>)
            }
        }
        return(<View style={styles.pagelist}>{pagelist}</View>)
    }
}
const styles=StyleSheet.create({
    con:{
        backgroundColor:'#f9f9f9',
        flex:1,
        flexDirection:'column',
    },
    textinput:{
        marginTop:25,
        justifyContent:'center',
        // alignItems:'center',
        flexDirection:'row',
        backgroundColor: "#FFFFFF",
        height:42,
        borderWidth:1,
        borderColor:'#E5E5E5',
        width:Contants.Screen.width-40,
        // marginLeft:10,
        // marginRight:40,
        borderRadius:20,
        alignSelf:'center',
    },
    inputsty:{
        backgroundColor: "#FFFFFF",
        // textAlign: "center",
        height:36,
        // borderWidth:1,
        // borderColor:'#E5E5E5',
        width:Contants.Screen.width-80,
        // marginLeft:10,
        // marginRight:40,
        // borderRadius:20,
        // marginTop:5,
        marginLeft:5
    },
    img:{
        // position:'absolute',
        // marginLeft:Contants.Screen.width-50,
        width:16,height:16,
        // alignSelf:'flex-end',
        // marginTop:40
        marginTop:10,
    },
    his:{
        flexDirection:'row',
        marginTop:26,
        justifyContent:'space-between',

    },
    histext:{
        fontSize:14,
        color:'#282828',
        marginLeft:20
    },
    maleft:{
        marginRight:30
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
    bord:{
        borderRadius:4,
        borderWidth:1,
        borderColor:'#E5E5E5',
        height:30,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginLeft:5,marginRight:5,
        marginTop:15
    },
    keyword:{
        fontSize:12,
        color:'#B2B2B2',
        marginLeft:10,marginRight:10,
    },
    pagelist:{
        flexDirection:"row",flexWrap:'wrap',marginLeft:10,marginRight:10
    }

})
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
    BackHandler,
    Platform
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst'
const s=[]
export default class MainSetting extends Component{

    constructor(props){
        super(props)
        this.state={
            changeTime:'',
            isChangeName:false,
            isShowModal:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            class:[],
            list:[],
            classify:''
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
    postFetch(API.ListOrder,null,(result)=>{
        // alert(JSON.stringify(result))
        if(result.status==1){
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(result.data),
                list:result.data
            })
        }
    },(error)=>{
        alert(error)
    })
    }
    render(){
        // alert(JSON.stringify(this.state.list))
        return(
            <View style={[{flex:1,backgroundColor:'#f9f9f9'}]}>
                {/*<View style={comstyle.heng}></View>*/}
            <TouchableOpacity style={[comstyle.item,{marginTop:20}]} onPress={this.classifyPaixu.bind(this)}>
                <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                  <Image source={require('../../../img/window/paixu.png')} style={styles.apai}/>
                <Text style={styles.text}>分类排序</Text>
                </View>
                <TouchableOpacity onPress={this.classifyPaixu.bind(this)}>
                {/*<Text style={styles.texts}>{'>'}</Text>*/}
                <Image source={require('../../../img/shezhi/jian.png')} style={styles.texts}/>
                </TouchableOpacity>
            </TouchableOpacity>
                <View style={[comstyle.item,{marginTop:20}]}>
                    <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <Image source={require('../../../img/window/tianjiafen.png')} style={styles.apai}/>
                    <Text style={styles.text}>{this.state.changeTime==''?'添加新分类':this.state.changeTime}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{
                        if(this.state.changeTime==''){
                            this.setState({
                                isShowModal:true
                            })
                        }else {
                            postFetch(API.ResetListOrder,{foodGroup:{groupName:this.state.changeTime}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this.setState({
                                        isChangeName:true,

                                        list:this.state.list.concat(result.data),
                                        dataSource:this.state.dataSource.cloneWithRows(this.state.list.concat(result.data))
                                    })
                                }
                            },(error)=>{
                                alert(error)
                            })
                        }
                        }}>
                    <Image source={this.state.changeTime==''?require('../../../img/window/write.png'):require('../../../img/window/press.png')} style={styles.img}/>
                    </TouchableOpacity>
                </View>
                {/*listview*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                     style={{marginTop:20,backgroundColor:'#FFFFFF'}}
                />

                <Modal
                    isVisible={this.state.isShowModal}
                    hideOnBack={true}
                    transparent={true}
                    style={styles.modalstyle}
                    //backdropColor='transferent'
                    backdropOpacity={0.3}
                >
                    {/*点击外框，键盘消失*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({isShowModal: false});

                        }}
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                    />
                    <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                        <Text style={{margin:10}}>添加分类</Text>
                        <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                        <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                        <TextInput
                            ref={e => this._nameInput = e}
                            underlineColorAndroid='transparent'
                            style={{
                                // marginLeft: 20,
                                backgroundColor: "#FFFFFF",
                                textAlign: "center",
                                height:40,
                                borderWidth:1,
                                borderColor:'#E5E5E5',
                                width:Contants.Screen.width-80,
                                // marginLeft:10,
                                 marginRight:40,
                                // marginTop:10
                            }}
                            onChangeText={(e)=>{
                                this.setState({
                                    changeTime:e,
                                })
                            }}
                            multiline={true}
                            placeholder={'添加分类'}/>
                        </View>
                        <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                            <TouchableOpacity  onPress={()=>{
                                this.setState({
                                    isShowModal:false
                                })
                            }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text>返回</Text>
                            </TouchableOpacity>
                            <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                            <TouchableOpacity  onPress={()=>{
                                if(this.state.changeTime.length==0){
                                    this._toast.show('分类不能为空');
                                    // return
                                }else {
                                    this.setState({
                                        isShowModal:false,
                                    })
                                }

                                // postFetch(API.ResetListOrder,{foodGroup:{groupName:this.state.changeTime}},(result)=>{
                                //     // alert(JSON.stringify(result))
                                //     if(result.status==1){
                                //         this.setState({
                                //             isChangeName:true,
                                //             isShowModal:false,
                                //             list:this.state.list.concat(result.data),
                                //             dataSource:this.state.dataSource.cloneWithRows(this.state.list.concat(result.data))
                                //         })
                                //     }
                                // },(error)=>{
                                //     alert(error)
                                // })
                                // this.setState({
                                //     isChangeName:true,
                                //     isShowModal:false,
                                //       list:this.state.list.concat(this.state.changeTime),
                                //      dataSource:this.state.dataSource.cloneWithRows(this.state.list.concat(this.state.changeTime))
                                // })

                            }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Toast ref={(e) => {
                    this._toast = e
                }}
                       position='center'
                />
        </View>)
    }
    classifyPaixu(){
        this.props.navigation.navigate('ClassifyPaiXu')
    }
    _delectRow(rowID,rowData){
        // alert(rowData)
          // this.state.class.slice(rowID,1)
        // delete this.state.class[rowID];
        //  alert(rowID)


        postFetch(API.DelectListOrder,{foodGroup:{id:rowData}},(result)=>{
             // alert(JSON.stringify(result))
            if(result.status==1){

                if(result.data==0){
                    this._toast.show('不能删除')
                }else {
                    delete this.state.list[rowID]
                    this.setState({
                        isChangeName:true,
                        // class:this.state.class.concat().slice(rowID,1),
                        // dataSource:this.state.dataSource.cloneWithRows(this.state.class.concat(this.state.changeTime).slice(rowID,1))
                        //  list:this.state.list.slice(rowID,1),

                        dataSource:this.state.dataSource.cloneWithRows(this.state.list)
                    })
                    this._toast.show('删除成功')

                }
            }else {

            }
        },(error)=>{
            // alert(error)
        })
         // alert(JSON.stringify(this.state.class))
    }
    _renderRow=(rowData,sectionID,rowID)=>{
         // alert(rowData.id)
        return(
            <View>
            <TouchableOpacity style={{justifyContent:'space-between',flexDirection:'row',height:50,alignItems:'center'}} onPress={this.detail.bind(this,rowData)}>
            <Text style={styles.context}>{rowData.groupName}</Text>
            {/*<Text>{"x"+rowData.quantity}{"  /  "+rowData.price+'元'}</Text>*/}
            <View style={styles.laji}>
                <TouchableOpacity onPress={()=>this._delectRow(rowID,rowData.id)}>
            <Image source={require('../../../img/window/lajitong.png')} style={styles.img}/>
                </TouchableOpacity>
                <Image source={require('../../../img/shezhi/jian.png')} style={styles.texts}/>
            </View>

        </TouchableOpacity>
                <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
            </View>
                )

    }
    detail(rowData){
        this.props.navigation.navigate('ClassifyDetails',{data:rowData.id,name:rowData.groupName})
    }
}
const styles=StyleSheet.create({
img:{
    // width:20,
    // height:20,
    marginRight:20
},
    texts:{
    marginRight:20,

    },
    laji:{
      flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    apai:{
    marginLeft:20
    },
    text:{
    marginLeft:10,
        fontSize:14,
        color:'#282828',
    },
    context:{
    fontSize:14,
        color:'#282828',
        marginLeft:20,

    }
})
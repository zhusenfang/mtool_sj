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
export default class ClassifyDetails extends Component{
    constructor(props){
        super(props)
        this.state={
            changeTime:'',
            isChangeName:false,
            isShowModal:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            list:[],
            data:''
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
      // postFetch(API.ClassifyDetail,{foodGroup:{id:list}},(result)=>{
      //     // alert(JSON.stringify(result))
      //     if(result.status==1){
      //         this.setState({
      //             dataSource:this.state.dataSource.cloneWithRows(result.data),
      //         })
      //     }
      // },(error)=>{
      //     alert(error)
      // })
      this.postfetchs()
    }
    postfetchs(){
        const list=this.props.navigation.state.params.data;
        postFetch(API.ClassifyDetail,{foodGroup:{id:list}},(result)=>{
            // alert(list)
            //  alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data.foodInfoList),
                    list:result.data.foodInfoList
                })
            }
        },(error)=>{
            // alert(error)

        })
    }
    render(){
        const list=this.props.navigation.state.params.data;
        const name=this.props.navigation.state.params.name;
         // alert(JSON.stringify(this.state.dataSource))
        return(
            <View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
            <TouchableOpacity style={[comstyle.item,{marginTop:10}]} onPress={()=>{this.setState({isShowModal:true})}}>
                <Text style={styles.right}>{this.state.isChangeName==true?this.state.changeTime:name}</Text>
                <TouchableOpacity onPress={()=>{this.setState({
                    isShowModal:true
                })}}>
                <Image source={require('../../../img/window/write.png')} style={styles.img}/>
                </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity style={[comstyle.item,{marginTop:10}]} onPress={()=>{this.props.navigation.navigate('ClassifyAdd',{data:list,callbacks:(data)=>{
                this.setState({data:data})
                this.postfetchs()
            }})}}>
                <Text style={styles.right}>添加到分类</Text>
                {/*<Text onPress={()=>{this.props.navigation.navigate('ClassifyAdd',{data:list,callback:(data)=>{*/}
                    {/*alert(data);*/}

                {/*}})}}>{'>'}</Text>*/}
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ClassifyAdd',{data:list,callbacks:(data)=>{
                    // alert(data)

                    this.setState({data:data})

                    this.postfetchs()

                }})}} style={styles.img}>
                <Image source={require('../../../img/shezhi/jian.png')}/>
                </TouchableOpacity>
            </TouchableOpacity>
                {/*listview*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}

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
                        <TouchableOpacity onPress={()=>{
                                this.setState({
                                    isShowModal:false
                                })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text>返回</Text>

                        </TouchableOpacity>
                            <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                            <TouchableOpacity title={'确定'} color={'#F0F0F0'} onPress={()=>{
                                if(this.state.changeTime.length==0){
                                    this._toast.show('时间不能为空');
                                    return
                                }
                                postFetch(API.ResetListOrder,{foodGroup:{groupName:this.state.changeTime}},(result)=>{
                                    // alert(JSON.stringify(result))
                                    // if(result.status==1){
                                    //     this.setState({
                                    //         isChangeName:true,
                                    //         isShowModal:false,
                                    //         class:this.state.class.concat(result.data),
                                    //         dataSource:this.state.dataSource.cloneWithRows(this.state.list.concat(result.data))
                                    //     })
                                    // }
                                },(error)=>{
                                    alert(error)
                                })
                                this.setState({
                                    isChangeName:true,
                                    isShowModal:false
                                })

                            }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text>返回</Text>

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
    _renderRow=(rowData,sectionID,rowID)=>{
         // alert(JSON.stringify(rowData))
        return(<TouchableOpacity style={{justifyContent:'space-between',flexDirection:'row',margin:10,alignItems:'center'}}>
            {/*rowData.foodImages*/}
            <View style={styles.zuo}>
            <Image source={{uri:rowData.imgUrl}} style={{width:45,height:45}}/>
            <Text style={styles.right}>{rowData.name}</Text>
            </View>
            {/*<Text>{rowData.id}</Text>*/}
            {/*<Text>{"x"+rowData.quantity}{"  /  "+rowData.price+'元'}</Text>*/}
            <View style={styles.laji}>
                <TouchableOpacity onPress={this.shan.bind(this,rowID,rowData.id)}>
                    {/*<Text>{rowData.id}</Text>*/}
                    <Image source={require('../../../img/window/lajitong.png')} style={styles.img}/>
                </TouchableOpacity>
                {/*<Text>{'>'}</Text>*/}
            </View>
        </TouchableOpacity>)

    }
    shan(rowID,info){
        const list=this.props.navigation.state.params.data;
      postFetch(API.ShanChuGoods,{foodGroupLinkinfo:{
          groupId:list,foodId:info
      }},(result)=>{
          // alert(JSON.stringify(result))
          if(result.status==1){
              delete this.state.list[rowID]
              this.setState({
                  dataSource:this.state.dataSource.cloneWithRows(this.state.list)
              })
              this._toast.show('删除成功')
          }
      })
    }
}
const styles=StyleSheet.create({
img:{
    // width:20,
    // height:20
    marginRight:20
},
    laji:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start'
    },
    tupian:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    right:{
    marginLeft:20,
        color:'#282828',
        fontSize:14
    },
    zuo:{
     flexDirection:'row',
       justifyContent:'flex-start',
     alignItems:'center',

    }
})
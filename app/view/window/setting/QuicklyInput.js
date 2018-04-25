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
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
const s=[]
import dismissKeyboard from 'dismissKeyboard'
export default class QuicklyInput extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            shortyu:false,
            shortTextinput:'',
            shortlist:[],
            resetshortyu:false,
            message:'',
            resettextInput:'',
            rowId:'',
            delectid:'',
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
     postFetch(API.TotalHuifu,null,(result)=>{
         // alert(JSON.stringify(result))
         if(result.status==1){
             this.setState({
                 dataSource:this.state.dataSource.cloneWithRows(result.data),
                 shortlist:result.data
             })

         }

     })
    }
    render(){
        return(

            <ScrollView style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
                <TouchableOpacity style={[comstyle.item,{marginTop:20}]} onPress={()=>{
                    this.setState({
                        shortyu:true
                    })
                }}>
                    <View style={styles.she}>
                        <Image source={require('../../../img/window/kuajieshu.png')}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>添加新短语</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{
                 this.setState({
                     shortyu:true
                 })
                    }}>
                        <Image source={require('../../../img/window/write.png')} style={{marginRight:20}}/>
                    </TouchableOpacity>
                </TouchableOpacity>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                style={{marginTop:20}}
                enableEmptySections={true}
            />
                <Modal
                    isVisible={this.state.shortyu}
                    hideOnBack={true}
                    transparent={true}
                    // style={styles.modalstyle}
                    //backdropColor='transferent'
                    backdropOpacity={0.3}
                >
                    {/*点击外框，键盘消失*/}
                    <TouchableOpacity
                        onPress={()=> {
                            this.setState({shortyu: false});

                        }}
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                    />
                    <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                        <Text style={[comstyle.text,{margin:10}]}>添加新短语</Text>
                        <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                        <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                        <TextInput
                            style={{  backgroundColor: "#FFFFFF",
                                textAlign: "center",
                                height:40,
                                borderWidth:1,
                                borderColor:'#E5E5E5',
                                width:Contants.Screen.width-80,
                                // marginLeft:10,
                                marginRight:40,
                               }}
                            placeholder={'设置快捷回复短语'}
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e)=>{
                                this.setState({
                                    shortTextinput:e,
                                })
                            }}
                        />
                        </View>
                        <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                            <TouchableOpacity onPress={()=>{
                                this.setState({
                                    shortyu:false
                                })
                            }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text onPress={()=>{this.setState({shortyu:false})}} style={comstyle.text}>返回</Text>
                            </TouchableOpacity>
                            <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                            <TouchableOpacity title={'确定'} color={'#F0F0F0'} onPress={this.gengai.bind(this)} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text onPress={this.gengai.bind(this)} style={comstyle.text}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Toast ref={(e) => {
                        this._toastqu = e
                    }}
                           position='center'
                    />
                </Modal>
                {/*编辑短语*/}
                <Modal
                    isVisible={this.state.resetshortyu}
                    hideOnBack={true}
                    transparent={true}
                    // style={styles.modalstyle}
                    //backdropColor='transferent'
                    backdropOpacity={0.3}
                >
                    {/*点击外框，键盘消失*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({resetshortyu: false});

                        }}
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                    />
                    <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                        <Text style={[comstyle.text,{margin:10}]}>编辑短语</Text>
                        <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                        <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                        <TextInput
                            style={{backgroundColor: "#FFFFFF",
                                textAlign: "center",
                                height:40,
                                borderWidth:1,
                                borderColor:'#E5E5E5',
                                width:Contants.Screen.width-80,
                                // marginLeft:10,
                                marginRight:40,}}
                            placeholder={this.state.message}
                            // value={this.state.message}
                            // clearTextOnFocus={true}
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e)=>{
                                this.setState({
                                    resettextInput:e,
                                })
                            }}
                        />
                        </View>
                            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                            <TouchableOpacity  onPress={()=>{
                                postFetch(API.DelectHuifu,{merchantUserShortmsg:{id:this.state.rowId}},(result)=>{
                                    // alert(JSON.stringify(result))
                                    if(result.status==1){
                                        delete this.state.shortlist[this.state.delectid]
                                        this.setState({
                                            dataSource:this.state.dataSource.cloneWithRows(this.state.shortlist),
                                            resetshortyu:false
                                        })
                                        this._toast.show('删除成功')
                                    }
                                })

                            }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text style={comstyle.text}>删除</Text>
                            </TouchableOpacity>
                                <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                            <TouchableOpacity onPress={()=>{
                                dismissKeyboard();
                                postFetch(API.GengHuifu,{merchantUserShortmsg:{id:this.state.rowId,message:this.state.resettextInput}},(result)=>{
                                    // alert(JSON.stringify(result))
                                    if(result.status==1){
                                        this.setState({
                                             // shortlist:this.state.shortlist.concat(result.data),
                                            resetshortyu:false,
                                            // dataSource:this.state.dataSource.cloneWithRows(this.state.shortlist)

                                        })
                                        postFetch(API.TotalHuifu,null,(result)=>{
                                            // alert(JSON.stringify(result))
                                            if(result.status==1){
                                                this.setState({
                                                    dataSource:this.state.dataSource.cloneWithRows(result.data),
                                                    // shortlist:result.data
                                                })

                                            }

                                        })
                                    }
                                })



                            }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text style={comstyle.text}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
                <Toast ref={(e) => {
                    this._toast = e
                }}
                       position='center'
                />
        </ScrollView>)
    }
    gengai(){
        dismissKeyboard();
        if(this.state.shortTextinput.length==0){
            this._toastqu.show('费用不能为空');
            return
        }

        postFetch(API.AddingHuifu,{merchantUserShortmsg:{"message":this.state.shortTextinput}
        },(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this._toastqu.show('更改成功')
                this.setState({
                    shortlist:this.state.shortlist.concat(result.data),
                    dataSource:this.state.dataSource.cloneWithRows(this.state.shortlist.concat(result.data)),
                    shortyu:false,

                })
            }
        },(error)=>{
            alert(error)
        })
    }
    _renderRow=(rowData,sectionID,rowID)=>{
        return(
            <View>
            <View style={comstyle.item}>
           <Text style={[styles.right,comstyle.text]}>{rowData.message}</Text>
            <TouchableOpacity onPress={this.delectRow.bind(this,rowID,rowData.id,rowData.message)}>
            <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
            </TouchableOpacity>

        </View>
                <View style={comstyle.heng}/>
            </View>)
    }
    delectRow(rowID,rowData,rowMsg){
      this.setState({
          resetshortyu:true,
          message:rowMsg,
          rowId:rowData,
          delectid:rowID
      })
    }
}
const styles=StyleSheet.create({
    modalstyle:{
        backgroundColor:"transparent",
        margin:0,
        position:'absolute',
        // marginLeft:Contants.Screen.width/2+80,
        // marginTop:20
    },
    right:{
        marginLeft:20
    },
    she:{
        flexDirection:'row',
        justifyContent:'flex-start',
        marginLeft:20
    }
})
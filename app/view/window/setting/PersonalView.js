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
    BackHandler,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import Storage from '../../../common/GGAsyncStorage'
var mSelectWhat = -1;
import NickModual from './NickModual'
var FormatimeFn = require( '../../CommonPage/formatime');
import Picker from 'react-native-picker'
export default class PersonalView extends Component{
    constructor(props){
        super(props)
        this.state={
             picurl:'',
             nickna:'',
             sex:'',
             birthday:'',
             personaldes:'',
             erweima:'',
             address:'',
             diaoyong:'',
             userid:'',
             isShow:false,
             chosesex:false,
             initsex:'0',
             defaultimg:false,
             follow: {
                newestStatus: '',
                newestStatusName: '',
                nextfollowtime: "",
                productNo: "",
                productName: ''
            },
            nickis:false,
            introduce:false,
            content:'',
            isintroduce:false
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._androidBack);
       this.diaoyongs=   DeviceEventEmitter.addListener('data',this.onScanningResult)
        Storage.get("picUrl").then((tagss)=>{
          // alert(tagss)
            this.setState({
                picurl:tagss
            })
        })
        Storage.get("nickname").then((tagss)=>{
            this.setState({
                nickna:tagss
            })
        })
        Storage.get("sex").then((tagss)=>{
            // alert(tagss)
            this.setState({
                sex:tagss
            })
        })
        Storage.get("birthday").then((tags)=>{
          // alert(tags)
             this.setState({
                birthday:tags
            })
        })
        Storage.get("personaldescirpt").then((tagss)=>{

            this.setState({
                personaldes:tagss
            })
        })
        Storage.get("qrCode").then((tagss)=>{

            this.setState({
                erweima:tagss
            })
        })
        Storage.get("address").then((tagss)=>{

            this.setState({
                address:tagss
            })
        })
        Storage.get("userId").then((tagss)=>{

            this.setState({
                userid:tagss
            })
        })
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    onScanningResult=(e)=> {
        // alert(e.result)
        // ToastAndroid.show("dd
        // alert('sss')
        this.setState({
            diaoyong: e.address,
            latitude: e.latitude,
            longitude: e.longitude,
        })
    }
    componentWillUnmount(){
        this.diaoyongs.remove()
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    }
    render(){
        return(
            <View style={comstyle.con}>
            <View style={styles.items}>
                <View style={comstyle.rightview}>
              <Image source={require('../../../img/order/mine.png')} style={comstyle.maleft}/>
                <Text style={comstyle.text}>  头  像</Text>
                </View>
                <View style={comstyle.leftview}>
                    <Image source={{uri:this.state.picurl?this.state.picurl:''}} style={styles.touxiang}/>
                    <TouchableOpacity onPress={this.touxiang.bind(this)}>
                    <Image source={require('../../../img/window/write.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.item}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/page/nickname.png')} style={comstyle.maleft}/>
                    <Text style={comstyle.text}>  昵  称</Text>
                </View>
                <View style={comstyle.leftview}>
                    <Text style={styles.text}>{this.state.nickna===''?'未设置':this.state.nickna}</Text>
                    <TouchableOpacity onPress={this.nicheng.bind(this)}>
                    <Image source={this.state.nickis==false?require('../../../img/window/write.png'):require('../../../img/window/press.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.item}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/page/sex.png')} style={comstyle.maleft}/>
                    <Text style={comstyle.text}>  性  别</Text>
                </View>
                <View style={comstyle.leftview}>
                    <Text style={styles.text}>{this.state.sex===''?'未设置':this.state.sex==='0'?'男':'女'}</Text>
                    <TouchableOpacity onPress={this.selectsex.bind(this)}>
                    <Image source={this.state.defaultimg==false?require('../../../img/window/write.png'):require('../../../img/window/press.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.item}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/page/birthday.png')} style={comstyle.maleft}/>
                    <Text style={comstyle.text}>  生  日</Text>
                </View>
                <TouchableOpacity style={comstyle.leftview} onPress={this.birthday.bind(this)}>
                    <Text style={styles.text}>{this.state.birthday===''?'未设置':this.state.follow.nextfollowtime===''?this.state.birthday:this.state.follow.nextfollowtime}</Text>
                    <Image source={this.state.follow.nextfollowtime===''?require('../../../img/window/write.png'):require('../../../img/window/press.png')} style={comstyle.textright}/>
                </TouchableOpacity>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.item}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/page/gerenjian.png')} style={comstyle.maleft}/>
                    <Text style={comstyle.text}>  个人简介</Text>
                </View>
                <View style={comstyle.leftview}>
                    <Text style={styles.text}>{this.state.personaldes===''?'未设置':this.state.personaldes}</Text>
                    <TouchableOpacity onPress={this.jianjie.bind(this)}>
                    <Image source={this.state.isintroduce==false?require('../../../img/window/write.png'):require('../../../img/window/press.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.item}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/shezhi/erweima.png')} style={comstyle.maleft}/>
                    <Text style={comstyle.text}>  二维码</Text>
                </View>
                <View style={comstyle.leftview}>
                   <Image source={{uri:this.state.erweima}} style={styles.erwei}/>
                    {/*<Image source={require('../../../img/window/write.png')} style={comstyle.textright}/>*/}
                </View>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.item}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/tools/golocation.png')} style={comstyle.maleft}/>
                    <Text style={comstyle.text}>  地  区</Text>
                </View>
                <View style={comstyle.leftview}>
                    <Text style={styles.text}>{this.state.address===''?'未设置':this.state.diaoyong===''?this.state.address:this.state.diaoyong}</Text>
                    <TouchableOpacity onPress={this.diao.bind(this)}>
                    <Image source={require('../../../img/window/write.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={comstyle.heng}/>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
            <Modal
                isVisible={this.state.isShow}
                hideOnBack={true}
                transparent={true}
                // style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                    this.setState({
                        isShow:false
                    })

                    }}
                    style={styles.jian}
                />
                 <NickModual
                     title={'昵称'}
                     ref={e=>this._userText=e}
                     default={this.state.nickna}
                     cancle={()=>{this.setState({isShow:false})}}
                     sure={this.surebtn.bind(this)}
                 />
            </Modal>
            <Modal
                isVisible={this.state.chosesex}
                hideOnBack={true}
                transparent={true}
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            chosesex:false
                        })
                    }}
                    style={styles.jian}
                />
                <View style={styles.one}>
                    <Text style={[comstyle.text,{margin:10}]}>{"性 别"}</Text>
                    <View style={comstyle.heng}/>
                    <View style={styles.two}>
                         <TouchableOpacity style={styles.sex} onPress={this.choosesex.bind(this,1)}>
                            <Image source={this.state.initsex==='0'?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')}/>
                             <Text>  男生</Text>
                         </TouchableOpacity>
                        <TouchableOpacity style={[styles.sex,{marginLeft:20,marginRight:30}]} onPress={this.choosesex.bind(this,2)}>
                            <Image source={this.state.initsex==='1'?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')}/>
                            <Text>  女生</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={comstyle.heng}/>
                    <View style={styles.three}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({ chosesex:false})
                        }} style={styles.for}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={styles.fif}/>
                        <TouchableOpacity onPress={this.shurebtn.bind(this)} style={styles.for}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                isVisible={this.state.introduce}
                hideOnBack={true}
                transparent={true}
                backdropOpacity={0.3}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            introduce:false
                        })
                    }}
                    style={styles.jian}
                />
                <View style={styles.one}>
                    <Text style={[comstyle.text,{margin:10}]}>{"个人简介"}</Text>
                    <View style={comstyle.heng}/>
                    <View style={styles.twos}>

                        <TextInput
                            style={{   backgroundColor: "#FFFFFF",
                                // textAlign: "center",
                                height:70,
                                borderWidth:1,
                                borderColor:'#E5E5E5',
                                width:Contants.Screen.width-80,
                                borderRadius:4,
                                // marginLeft:10,
                                marginRight:40,}}
                            placeholder={"描述一下自己吧。。。"}
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(text)=>{this.changeText(text)}}
                            defaultValue={this.state.personaldes}
                        />
                    </View>
                    <View style={comstyle.heng}/>
                    <View style={styles.three}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({ introduce:false})
                        }} style={styles.for}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={styles.fif}/>
                        <TouchableOpacity onPress={this.gerenjianjie.bind(this)} style={styles.for}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
        )
    }
    gerenjianjie(){
      this.setState({
          introduce:false,
          isintroduce:true,

      })
        if(this.state.personaldes===''){
          this.setState({
              personaldes:this.state.personaldes
          })
        }else {
            this.setState({
                personaldes:this.state.content
            })
        }
    }
    jianjie(){
        if(this.state.isintroduce==false){
            this.setState({
                introduce:true
            })
        }else {
            postFetch(API.WanShanPersonal,{id:this.state.userid,introduction:this.state.personaldes===''?this.state.content:this.state.personaldes},(result)=>{
              // alert(JSON.stringify(result))
                if(result.status==1){
                    this.setState({
                        isintroduce:false
                    })
                 Storage.save('personaldescirpt',this.state.content)
                }
            })
        }

    }
    changeText(text){

        this.setState({

            content:text,
        })
    }
    birthday(){
        if(this.state.follow.nextfollowtime===''){
        let that = this
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for(let i=1;i<119;i++){
            years.push(i+1900+'年');
        }
        for(let i=1;i<13;i++){
            months.push(i+'月');
        }
        // for(let i=1;i<25;i++){
        //     hours.push(i+'时');
        // }
        for(let i=1;i<32;i++){
            days.push(i+'日');
        }
        // for(let i=1;i<61;i++){
        //     minutes.push(i+'分');
        // }
        let pickerData = [years, months, days];
        let date = new Date();
        let selectedValue = [
            [date.getFullYear()],
            [date.getMonth()+1],
            [date.getDate()],
            // [date.getHours() > 11 ? 'pm' : 'am'],
            // [date.getHours() === 12 ? 12 : date.getHours()%12],
            // [date.getMinutes()]
        ];
        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: pickedValue => {
                this.state.follow.nextfollowtime = pickedValue
                that.setState({
                        follow: this.state.follow
                    },
                    ()=> {
                        this.state.follow.nextfollowtime = FormatimeFn.timestampConvertMin(this.state.follow.nextfollowtime);
                        this.setState({
                            follow: this.state.follow,
                            birthday:this.state.follow.nextfollowtime
                        })
                    }
                )
            },
            onPickerCancel:pickedValue => {
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if(parseInt(targetValue[1]) === 2){
                    if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                        targetValue[2] = 29;
                    }
                    else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                        targetValue[2] = 28;
                    }
                }
                else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                    targetValue[2] = 30;

                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if(k !== 3){
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }

        });
        Picker.show();
        }else {
            postFetch(API.WanShanPersonal,{id:this.state.userid,birthday:this.state.follow.nextfollowtime},(result)=>{
                Storage.save("birthday",this.state.follow.nextfollowtime)
                if(result.status==1){
                    this.setState({
                      follow:{
                          nextfollowtime:''
                      },
                        birthday: this.state.follow.nextfollowtime
                    })

                }
            })
        }
    }
    selectsex(){
        if(this.state.defaultimg==false){
            this.setState({
                chosesex:true
            })
        }else {
            postFetch(API.WanShanPersonal,{id:this.state.userid,sex:this.state.initsex},(result)=>{
                // alert(JSON.stringify(result))
                if(result.status==1){
                    this.setState({
                        defaultimg:false
                    })
                    Storage.save("sex",this.state.initsex)
                }
            })
        }
    }
    shurebtn(){
     this.setState({
         defaultimg:true,
         chosesex:false
     })
        if(this.state.initsex==='0'){
         this.setState({
             sex:'0'
         })
        }else {
            this.setState({
                sex:'1'
            })
        }
    }
    choosesex(index){
        switch (index){
            case 1:{
                if(this.state.initsex==='0'){
                  this.setState({
                      initsex:'0'
                  })
                }else {
                    this.setState({
                        initsex:'0'
                    })
                }
                break;
            }
            case 2:{
                if(this.state.initsex==='0'){
                    this.setState({
                        initsex:'1'
                    })
                }else {
                    this.setState({
                        initsex:'1'
                    })
                }
                break
            }
        }
    }
    surebtn(){
        // alert('sss')
        this._userText._input.blur();
        let nickname=this._userText.state.content;
       this.setState({
           nickis:true,
           isShow:false,
           nickna:nickname,
       })
    }
    diao(){

    }
    nicheng(){
        if(this.state.nickis==false){
       this.setState({
           isShow:true
       })
        }else {
            // this._userText._input.blur();
            // let nickname=this._userText.state.content;
            postFetch(API.WanShanPersonal,{id:this.state.userid,nickname:this.state.nickna},(result)=>{
                // alert(JSON.stringify(result))
                if(result.status==1){
                    this.setState({
                        nickis:false,
                        // nickis:true
                    })
                    Storage.save('nickname',this.state.nickna)
                }
            })
        }
    }
    touxiang(){
        var photoOptions = {

            title:"请选择",
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'选择相册',
            quality:0.7,
            maxWidth:200,
            maxHeight:200,
            allowsEditing:true,
            noData:false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        ImagePicker.showImagePicker(photoOptions,(res)=>{
            if(res.didCancel){
                return
            }else {
                let source;  // 保存选中的图片
                source = {uri: 'data:image/jpeg;base64,' + res.data};

                if (Platform.OS === 'android') {
                    source = { uri: res.uri };
                } else {
                    source = { uri: res.uri.replace('file://','') };
                }

                // this.setState({
                //     avatarSource: source
                // });
                let file = {uri: source.uri, type: 'multipart/form-data', name: 'image.jpg'};
                var formData=new FormData();
                formData.append('file',file)

                fetch(API.ShangChuan,{
                    method:"POST",
                    // body:ObjectTransform(data),
                    body:formData,
                    headers: {'Content-Type':'multipart/form-data',},
                }).then((response)=>response.json()).then((result)=>{
                    // alert(JSON.stringify(result))
                    if(result.status==1){
                        this.setState({
                            picurl:result.url
                        })
                        Storage.save('picUrl',result.url)
                        postFetch(API.WanShanPersonal,{id:this.state.userid,
                            picUrl:result.url},(result)=>{
                            // alert(JSON.stringify(result))
                            if(result.status==1){
                                // alert('成功')

                                 this._toast.show('更改成功')
                            }
                        })
                    }
                }).catch((error)=>{
                    alert(error)
                })
                //
            }

        })
    }
}
const styles=StyleSheet.create({
    items:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        height:59,
        marginTop:20
    },
    touxiang:{
        width:45,
        height:45,
        borderRadius:4,
        marginRight:36
    },
    item:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        height:45
    },
    erwei:{
        width:30,
        height:30,
        marginRight:76
    },
    text:{
       fontSize:14,
       color:'#B2B2B2',
       marginRight:36
    },
    sex:{
        width:138,
        height:36,
        borderRadius:4,
        borderWidth:1,
        borderColor:'#E5E5E5',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    jian:{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0
    },
    one:{
        flexDirection:'column',backgroundColor:'white',borderRadius:5
    },
    two:{
        height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center',flexDirection:'row'
    },
    twos:{
        height:100,width:Contants.Screen.width,alignItems:'center',justifyContent:'center',flexDirection:'row'
    },
    three:{
        flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40
    },
    for:{
        justifyContent:'center',alignItems:"center",flex:1
    },
    fif:{
        height:40,width:1,backgroundColor:'#E5E5E5'
    }

})
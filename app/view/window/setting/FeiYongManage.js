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
var mSelectWhat = -1;
export default class FeiYongManage extends Component{
    constructor(props){
        super(props)
        this.state={
            isShowqs:false,
            changePrice:'',//起送价
            isShowPrice:false,
            peisongPrice:'',//配送费用
            dizengprice:'',//递增价格
            percentPrice:false,//人均消费
            percenttextinput:'',//人均消费的textinput
            yuyueTime:false,
            yuyuetextinput:'',
            yuyueflse:false,//字体上的显示
            falseSwitchIsOn:false,
            isShowPS:false,//是否选择配送商
            goodsid:'',//商品ID
            restartantsId:'',//商户

            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            qibuprice:0,//起步价刚开始的
            peisongshangname:'',//配送商名称
            peisongshangtoux:'',//配送商头像
            dizengjiage:'',//递增价格
            result:"",
            peisongfei:'',//配送费
            qibug:'',
            qibub:'',
            pssname:"",
            list:'',
            fe:'',
            qisong:'',
            all:'',
            img:'',
            renjun:'',
            yu:'',
            allfeeid:'',
            selectArray: [],
            shps:false,
            shqsj:false,
            shrnj:false,
            imgs:require('../../../img/window/jianxia.png'),
            outSwitch:'',
        }
        // this._selectRow = this._selectRow.bind(this)
        this.checkedArr=[]
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
        //总的获得费用管理的接口
    postFetch(API.GuanLi,null,(result)=>{
       // alert(JSON.stringify(result))
        if(result.status==1){
            if(result.data.expressageMerchantDo!=undefined){
                this.setState({
                    fe:result.data.expressageMerchantDo.name,
                    img:result.data.expressageMerchantDo.imgUrl,
                    qisong:result.data.expressageMerchantDo.expressageDeliveryCost.startingPrice,
                    qibug:result.data.expressageMerchantDo.expressageDeliveryCost.startings,
                    dizengjiage:result.data.expressageMerchantDo.expressageDeliveryCost.increasePrice,
                })
            }
            this.setState({

                list:result.data,
                qibuprice:result.data.deliverAmount,


                all:result.data.allofee.startPrice,

                 renjun:result.data.avgConsume,
                yu:result.data.activeTime,
                allfeeid:result.data.allofee.id,


            })
            if(result.data.takeOutSwitch==1){
                this.setState({
                    falseSwitchIsOn:true
                })
            }else {
                this.setState({
                    falseSwitchIsOn:false
                })
            }
            // this.setState({
            //     qisong:result.data.expressageDeliveryCost.startingPrice
            // })
        }

    })


    }
    componentWillMount(){
        //获得配送商
        postFetch(API.PeiSongType,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                // var dataArray=result.data;
                // for(var index in dataArray ){
                //     var modal =dataArray[index]
                //     modal=Object.assign(modal,{isSelect:false})
                // }
                // this.dataArray=dataArray
                var LetAll=result.data;
                result.data.map((o,i)=>{
                    if(!this.props.mID){
                        LetAll[i]['isCheck']=false
                    }else {
                        if(this.props.mID==o.user_id){
                            LetAll[i]['isCheck']=true
                        }else {
                            LetAll[i]['isCheck']=false
                        }
                    }
                })
                this.LetAll=LetAll
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
                })
               // alert(JSON.stringify(this.LetAll))
            }
        },(error)=>{
            alert(error)
        })
    }

    render(){
        // alert(JSON.stringify(this.state.list))
        var contentView=null;
        if(this.state.isShowPS==false){
            contentView=(<View></View>)
        }else {
            contentView=(<View>
                {/*<View style={styles.peisongshang}>*/}
                    {/*<View style={styles.rou}>*/}
                        {/*<Image/>*/}
                        {/*<View style={styles.pei}>*/}
                            {/*<Text>配送商名称</Text>*/}
                            {/*<Text>ss</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}

                {/*</View>*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />
            </View>)
        }

        return(<ScrollView style={[comstyle.contain,{backgroundColor:"#f9f9f9"}]}>
            <Text style={styles.shes}>外送设置</Text>

            <View style={comstyle.item}>
              <Text style={[comstyle.maleft,comstyle.text]}>开启配送</Text>
                <Switch onValueChange={(value)=>
                {this.setState({falseSwitchIsOn:value})
                if(this.state.falseSwitchIsOn==false){
                 postFetch(API.FeiYongReset,{takeOutSwitch:"1",allofee:{id:this.state.allfeeid}
                 },(result)=>{
                     // alert(JSON.stringify(result))
                     if(result.status==1){
                         this._toast.show('开启成功')
                     }
                 })
                }else {
                    postFetch(API.FeiYongReset,{takeOutSwitch:"0",allofee:{id:this.state.allfeeid}
                    },(result)=>{
                        // alert(JSON.stringify(result))
                        if(result.status==1){
                            this._toast.show('关闭成功')
                        }
                    })
                }
                }}
                        value={this.state.falseSwitchIsOn}
                        style={comstyle.textright}
                        onTintColor='#FF305E'
                    // // tintColor='blue'
                        thumbTintColor='white'
                />

            </View>
            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.zhi}>
                <Text style={[comstyle.maleft,comstyle.text]}>起送价格</Text>
                    <Text style={[comstyle.maleft,styles.shezitext]}>{this.state.shqsj==true?this.state.changePrice:this.state.qibuprice==undefined?0:this.state.qibuprice}</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    this.setState({
                        isShowqs:true
                    })
                }}>
                <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}
                />
                </TouchableOpacity>
            </View>
            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.zhi}>
                    <Text style={[comstyle.maleft,comstyle.text]}>配送费用</Text>
                    <Text style={[comstyle.maleft,styles.shezitext]}>{this.state.shps==true?this.state.peisongPrice:this.state.all+'元'}</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    this.setState({
                        isShowPrice:true
                    })
                }}>
                <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
                </TouchableOpacity>
            </View>
            <View style={styles.toux}>
                <View style={styles.rou}>
                <Image source={{uri:this.state.img}} style={{width:40,height:40,marginLeft:20,borderRadius:4}}/>
                    <View style={styles.pei}>
                        <Text style={comstyle.text}>{this.state.fe}</Text>
                        <Text style={styles.shezitext}>{this.state.qibug+'km '+this.state.qisong+'元/'+this.state.dizengjiage+'元'}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={()=>{
                   if(this.state.isShowPS==false&&this.state.imgs==require('../../../img/window/jianxia.png')){
                       this.setState({
                           isShowPS:true,
                           imgs:require('../../../img/window/jianshang.png')
                       })
                   }else {
                       this.setState({
                           isShowPS:false,
                           imgs:require('../../../img/window/jianxia.png')
                       })
                   }
                }} style={{width:50,height:50,justifyContent:'center',alignItems:'center',}}>
                    <Image source={this.state.imgs} style={comstyle.textright}/>
                </TouchableOpacity>
            </View>
            {contentView}
            <Text style={styles.shes}>到店设置</Text>
            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.zhi}>
                    <Text style={[comstyle.maleft,comstyle.text]}>人均消费</Text>
                    <Text style={[comstyle.maleft,styles.shezitext]}>{this.state.shrnj?this.state.percenttextinput:this.state.renjun+'元'}</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    this.setState({
                        percentPrice:true
                    })
                }}>
                <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
                </TouchableOpacity>
            </View>
            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.zhi}>
                    <Text style={[comstyle.maleft,comstyle.text]}>预约时间</Text>
                    <Text style={[comstyle.maleft,styles.shezitext]}>{this.state.yuyueflse==true?this.state.yuyuetextinput:this.state.yu}</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    this.setState({
                        yuyueTime:true
                    })
                }}>
            <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={this.state.isShowqs}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShowqs: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                    <Text style={[comstyle.text,{margin:10}]}>起送价</Text>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        ref={e => this._nameInput = e}
                        underlineColorAndroid='transparent'
                        style={{
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
                        placeholderTextColor="#B2B2B2"
                        onChangeText={(e)=>{
                            this.setState({
                                changePrice:e,
                            })
                        }}
                        multiline={true}
                        placeholder={'单位：元'}/>
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({
                                isShowqs:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity onPress={()=>{
                            if(this.state.changePrice.length==0){
                                this._toasts.show('费用不能为空');
                                return
                            }
                            postFetch(API.FeiYongReset,{deliverAmount:this.state.changePrice
                            },(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toasts.show('更改成功')
                                    this.setState({
                                        isShowqs:false,
                                        shqsj:true
                                    })
                                }else {
                                    this._toasts.show('请输入具体数字')
                                }
                            },(error)=>{
                                alert(error)
                            })

                        }}  style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>确定</Text>

                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toasts = e
                }}
                       position='center'
                />
            </Modal>
            {/*配送费用*/}
            <Modal
                isVisible={this.state.isShowPrice}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShowPrice: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                    <Text style={{margin:10,fontSize:14,color:'#282828'}}>配送费用</Text>
                    <View style={{height:1,backgroundColor:"#E5E5E5"}}/>
                    <View style={[comstyle.rightview,{height:50}]}>
                    <Text style={styles.she}>起步范围： </Text>
                        <Text style={styles.yanse}>5公里/km</Text>
                    </View>
                    <View style={{height:1,backgroundColor:"#E5E5E5"}}/>
                    <View style={{flexDirection:'row',alignItems:'center',margin:10}}>
                        <Text style={{fontSize:14,color:'#282828'}}>起步价格:  </Text>
                        <TextInput
                            ref={e => this._nameInput = e}
                            underlineColorAndroid='transparent'
                            style={{
                                // marginLeft: 20,
                                backgroundColor: "white",
                                textAlign: "center",
                                width:Contants.Screen.width/2+30,
                                height:35,
                                borderColor:'#E5E5E5',
                                borderWidth:1,
                            }}
                            onChangeText={(e)=>{
                                this.setState({
                                    peisongPrice:e,
                                })
                            }}
                            multiline={true}
                            placeholderTextColor="#B2B2B2"
                            placeholder={'单位：元'}/>
                    </View>
                    <View style={{height:1,backgroundColor:"#E5E5E5"}}/>
                    <View style={{flexDirection:'row',alignItems:'center',margin:10}}>
                        <Text style={{fontSize:14,color:'#282828'}}>递增价格:  </Text>
                        <TextInput
                            ref={e => this._nameInput = e}
                            underlineColorAndroid='transparent'
                            style={{
                                // marginLeft: 20,
                                backgroundColor: "white",
                                textAlign: "center",
                                width:Contants.Screen.width/2+30,
                                height:35,
                                borderColor:'#E5E5E5',
                                borderWidth:1,
                            }}
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e)=>{
                                this.setState({
                                    dizengprice:e,
                                })
                            }}
                            multiline={true}
                            placeholder={'每增加1公里增加--元'}/>
                    </View>
                    <View style={{height:1,backgroundColor:"#E5E5E5"}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity title={'返回'} color={'#F0F0F0'} onPress={()=>{
                            this.setState({
                            isShowPrice:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity title={'确定'} color={'#F0F0F0'} onPress={()=>{
                            if(this.state.peisongPrice.length==0){
                                this._toastf.show('费用不能为空');
                                return
                            }
                            if(this.state.dizengprice.length==0){
                                this._toastf.show('费用不能为空');
                                return
                            }
                            postFetch(API.FeiYongReset,{allofee:{id:this.state.allfeeid,startPrice:this.state.peisongPrice,stepPrice:this.state.dizengprice}
                            },(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('更改成功')
                                    this.setState({
                                        isShowPrice:false,
                                         shps:true
                                    })
                                }
                            },(error)=>{
                                alert(error)
                            })

                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toastf = e
                }}
                       position='center'
                />
            </Modal>
            {/*人均消费*/}
            <Modal
                isVisible={this.state.percentPrice}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({percentPrice: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                    <Text style={[comstyle.text,{margin:10}]}>人均消费</Text>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                    style={{// marginLeft: 20,
                        backgroundColor: "#FFFFFF",
                        textAlign: "center",
                        height:40,
                        borderWidth:1,
                        borderColor:'#E5E5E5',
                        width:Contants.Screen.width-80,
                        // marginLeft:10,
                        marginRight:40,
                        }}
                    placeholder={'单位：元'}
                    placeholderTextColor="#B2B2B2"
                    underlineColorAndroid='transparent'
                    onChangeText={(e)=>{
                        this.setState({
                            percenttextinput:e,
                        })
                    }}
                    />
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                percentPrice:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity title={'确定'} color={'#F0F0F0'} onPress={()=>{
                            if(this.state.percenttextinput.length==0){
                                this._toastss.show('费用不能为空');
                                return
                            }

                            postFetch(API.FeiYongReset,{avgConsume:this.state.percenttextinput},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastss.show('更改成功')
                                    this.setState({
                                        percentPrice:false,
                                         shrnj:true
                                    })
                                }else {
                                    this._toastss.show('请输入正确的数字')
                                }
                            },(error)=>{
                                alert(error)
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toastss = e
                }}
                       position='center'
                />
            </Modal>
            <Modal
                isVisible={this.state.yuyueTime}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({yuyueTime: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                    <Text style={[comstyle.text,{margin:10}]}>预约时间</Text>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        style={{   backgroundColor: "#FFFFFF",
                            textAlign: "center",
                            height:40,
                            borderWidth:1,
                            borderColor:'#E5E5E5',
                            width:Contants.Screen.width-80,
                            // marginLeft:10,
                            marginRight:40,}}
                        placeholder={'单位：小时'}
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#B2B2B2"
                        onChangeText={(e)=>{
                            this.setState({
                                yuyuetextinput:e,
                            })
                        }}
                    />
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({
                                yuyueTime:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity onPress={()=>{
                            if(this.state.yuyuetextinput.length==0){
                                this._toasty.show('时间不能为空');
                                return
                            }
                            postFetch(API.FeiYongReset,{activeTime:this.state.yuyuetextinput},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toasty.show('更改成功')
                                    this.setState({
                                        yuyueTime:false,
                                        yuyueflse:true
                                    })
                                }else {
                                    this._toasty.show('请输入正确的时间')
                                }
                            },(error)=>{
                                alert(error)
                            })

                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toasty = e
                }}
                       position='center'
                />
            </Modal>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </ScrollView>)
    }
    _renderRow=(model,sectionID,rowID)=>{
        return(
            <View>
                <View style={styles.peisongshang}>
               <View style={styles.rou}>
                   <Image source={{uri:model.imgUrl}} style={[comstyle.maleft,{width:40,height:40,borderRadius:4}]}/>
               <View style={styles.pei}>
                <Text style={comstyle.text}>{model.name}</Text>
               <Text style={styles.shezitext}>{model.expressageDeliveryCost.startings+'km '+model.expressageDeliveryCost.startingPrice+'元 /'+model.expressageDeliveryCost.increasePrice+'元'}</Text>
                </View>
                </View>
                    <TouchableOpacity onPress={()=>{this._selectRow(model,rowID)}}>
                 <Image source={model.isCheck==true?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')} style={comstyle.textright}/>
                        {/*{model.isCheck&&<Image source={require('../../../img/window/strokeCircle.png')}/>}*/}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _selectRow(item,index){
      if(item.isCheck){
          this.LetAll[index]['isCheck']=false;
          mSelectWhat=-1
      }else {
          this.LetAll.map((o,i)=>{
              if(i==index){
                  this.LetAll[i]['isCheck']=true
                  mSelectWhat=i;
                // alert(JSON.stringify(this.LetAll[i]['isCheck']))
                  // if(this.LetAll[i]['isCheck'])==true)
                  if(this.LetAll[i]['isCheck']==true){
                    // alert(JSON.stringify(this.LetAll[i]['id']))
                      postFetch(API.FeiYongReset,{deliveryId:this.LetAll[i]['id']},(result)=>{
                          // alert(JSON.stringify(result))
                          if(result.status==1){
                              this._toast.show('更改成功')
                          }
                      })
                  }
              }else {
                  this.LetAll[i]['isCheck']=false
              }
          })
      }

      this.setState({

          dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
      })
        // alert(JSON.parse(JSON.stringify(this.LetAll[i]['isCheck'])))
        // if(JSON.parse(JSON.stringify(item.isCheck==true))){
        //     alert('sss')
        // }
        // alert(JSON.stringify(this.LetAll))
    }

    // _selectRow(model){
    //     let selectArray = this.state.selectArray;
    //     // alert(JSON.stringify(this.dataArray))
    //     model.isSelect=!model.isSelect;
    //     let newArray=[]
    //     var allCount=this.dataArray.length
    //
    //     var hasItem=false
    //     if(allCount==0){
    //         var datas=this.data.slice()
    //         for(let i=0;i<datas.length;i++){}
    //         // if(datas[i])
    //     }
    //
    //     // for(var i=0;i<allCount;i++){
    //     //     var modal =this.dataArray[i]
    //     //     // if(modal.isSelect==true){
    //     //     //    modal.isSelect=false
    //     //     //     // for(let j=0;j<selectArray.length;j++){
    //     //     //     //    let id=selectArray[j]
    //     //     //     //     // if(id==modal)
    //     //     //     // }
    //     //     // }else {
    //     //     //     modal.isSelect=true
    //     //     // }
    //     //      newArray.push(modal)
    //     // }
    //     this.setState({
    //         dataSource:this.state.dataSource.cloneWithRows(this.dataArray),
    //         isShowPS:false
    //     })
    // }
}
const styles=StyleSheet.create({
    she:{
        // marginTop:30,
        // marginLeft:20,
        // marginBottom:20,
        // fontSize:14,
        color:'#000000',
        marginLeft:10,
        fontSize:14,
    },
    shes:{
        marginTop:30,
        marginLeft:20,
        marginBottom:20,
        fontSize:14,
        color:'#282828',
    },
    yanse:{
        fontSize:14,
        color:'#282828',
    },
    zhi:{
        flexDirection:'column',
        justifyContent:'flex-start',
        marginLeft:20
    },
    toux:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        height:50,
        marginTop:10,
        alignItems:'center'
    },
    rou:{
        flexDirection:'row',
        justifyContent:"flex-start"
    },
    pei:{
        flexDirection:'column',
        marginLeft:10
    },
    peisongshang:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        height:50
    },
    shezitext:{
        fontSize:12,
        color:'#B2B2B2'
    }
})
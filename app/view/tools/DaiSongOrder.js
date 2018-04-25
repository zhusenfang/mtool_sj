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
    DeviceEventEmitter,
    ToastAndroid,
    Platform,
    BackHandler
} from 'react-native';
import Contants from '../../common/Contants'
import comstyle from '../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../common/GConst'
import ToolsTotal from "./ToolsTotal";
import RadioModal from 'react-native-radio-master';
import Picker from 'react-native-picker'
import MyMap from '../nativeModuals/MyMap'
import {NavigationActions} from 'react-navigation'
import *as wechat from 'react-native-wechat'

var FormatimeFn = require( '../CommonPage/formatime');
var mSelectWhat = -1;
var mSelectWhats = -1;
var list=[
    {text:'小吃',id:'小吃',img:require('../../img/tools/xiaochipress.png'),unimg:require('../../img/tools/xiaochi.png')},
    {text:'烟酒',id:'烟酒',img:require('../../img/tools/yanjiupress.png'),unimg:require('../../img/tools/yanjiu.png')},
    {text:'水果',id:'水果',img:require('../../img/tools/shuiguopress.png'),unimg:require('../../img/tools/shuiguo.png')},
    {text:'饮料',id:'饮料',img:require('../../img/tools/yinliaopress.png'),unimg:require('../../img/tools/yinliao.png')},
    {text:'咖啡',id:'咖啡',img:require('../../img/tools/kafeipress.png'),unimg:require('../../img/tools/kafei.png')},
    {text:'其他',id:'其他',img:require('../../img/tools/qitapress.png'),unimg:require('../../img/tools/qita.png')},
]
export default class DaiSongOrder extends Component{
    constructor(props){
        super(props)
        this.state={
            initItem:'时间',
            initId:'0',
            isShowShou:false,
            text:'',
            image:require('../../img/tools/jiandown.png'),
            bet:false,
            da:false,
            jb:false,
            bw:false,
            gf:false,
            dian:false,
            follow: {
                newestStatus: '',
                newestStatusName: '',
                nextfollowtime: "",
                productNo: "",
                productName: ''
            },
            liji:false,
            phone:'',
            address:'',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isShowModal:false,
            dataSourcechang: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            kehu:'',//客户
            dianhua:'',//电话
            dizhi:'',//地址
            peisongfei:0,
            lianxiren:'',
            minedianhua:'',
            xiangxiaddress:'',
            daishouhuo:0,
            dingdanbeizhi:'',
            isChecked:false,
            frouttype:'',
            zhicanshijian:'',
            diaoyong:'',
            latitude:'',
            longitude:'',

        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }


        wechat.registerApp('wx1ccb336f561e993d')

        postFetch(API.DaiSongF,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
              this.setState({
                  phone:result.data.hotline,
                  address:result.data.address,

              })
            }
        },(error)=>{
           this._toast.show(error)
        })


        DeviceEventEmitter.addListener('data',this.onScanningResult)
        // DeviceEventEmitter.addListener('event',this.onResult)

        // postFetch(API.PetSongFei,{deliveryGeo:this.state.latitude+','+this.state.longitude},(result)=>{
        //     alert(JSON.stringify(result))
        //     if(result.status==1){
        //         this.setState({
        //             peisongfei:result.data,
        //         })
        //     }
        // },(error)=>{
        //     this._toast.show(error)
        // })

    }


    // onResult=(e)=>{
    //     // this.props.navigation.navigate('HeXiaoView')
    // }


    componentWillUnmount(){
        DeviceEventEmitter.addListener('data',this.onScanningResult).remove();
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    }
    componentWillMount(){
        postFetch(API.ChangYong,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
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
                    dataSourcechang:this.state.dataSourcechang.cloneWithRows(this.LetAll)
                })
            }
        },(error)=>{
            this._toast.show(error)
        })
       var Let=list;
        list.map((o,i)=>{
            if(!this.props.mID){
                Let[i]['selected']=false
            }else {
                if(this.props.mID=o.user_id){
                    Let[i]['selected']=true
                }else {
                    Let[i]['selected']=false
                }
            }
        })
        this.Let=Let
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.Let)))
        })

    }
    onScanningResult=(e)=>{
        // alert(e.result)
        // ToastAndroid.show("dd
        // alert('sss')
        this.setState({
            diaoyong:e.address,
            latitude:e.latitude,
            longitude:e.longitude,
        })
        this.feiyong(e.latitude,e.longitude)
        // alert(this.state.longitude)
        // alert(e.action)

    }

    //计算配送费用
    feiyong(latitude,longitude){
        postFetch(API.PetSongFei,{deliveryGeo:latitude+','+longitude},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    peisongfei:result.data,
                })
            }
        },(error)=>{
            this._toast.show(error)
        })
    }


    render(){


        var peisong=parseInt(this.state.peisongfei)
        var daishou=parseInt(this.state.daishouhuo)
        var totalprice=peisong+daishou;
        var contentView=null;
        if(this.state.isShowShou==false){
            contentView=(<View></View>)
        }else {
            contentView=(<View>
                <View style={styles.items}>
                    <Text style={comstyle.maleft}>代收货款:</Text>
                    <TextInput placeholder={'请输入商品价格'} style={styles.textinput}
                               underlineColorAndroid='transparent'
                               placeholderTextColor="#B2B2B2"
                               onChangeText={(e)=>{
                                   this.setState({
                                       daishouhuo:e,
                                   })
                               }}
                    />
                </View>
                <View style={comstyle.heng}/>
                <View style={styles.beizhus}>
                    <Text style={{marginLeft:20,marginTop:20}}>特殊需求：</Text>
                    <TouchableOpacity style={[styles.bord,{backgroundColor:this.state.bet==false?'#FFFFFF':'#FF305E'}]} onPress={()=>{
                      if(this.state.bet==false){
                          this.setState({
                              bet:true,

                          })
                      }else {
                          this.setState({
                              bet:false,

                          })
                      }
                    }}>
                        <Text style={{color:this.state.bet==false?'#B2B2B2':'#FFFFFF',marginLeft:10,marginRight:10}}>极速达</Text>
                        {/*<Text>{this.state.bet==false?'':'极速达'}</Text>*/}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bord,{backgroundColor:this.state.da==false?'#FFFFFF':'#FF305E'}]} onPress={()=>{
                        if(this.state.da==false){
                            this.setState({
                                da:true,

                            })
                        }else {
                            this.setState({
                                da:false,

                            })
                        }
                    }}>
                        <Text style={{color:this.state.da==false?'#B2B2B2':'#FFFFFF',marginLeft:10,marginRight:10}}>务必立即配送</Text>
                        {/*<Text>{this.state.bet==false?'':'极速达'}</Text>*/}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bord,{backgroundColor:this.state.jb==false?'#FFFFFF':'#FF305E'}]} onPress={()=>{
                        if(this.state.jb==false){
                            this.setState({
                                jb:true,

                            })
                        }else {
                            this.setState({
                                jb:false,

                            })
                        }
                    }}>
                        <Text style={{color:this.state.jb==false?'#B2B2B2':'#FFFFFF',marginLeft:10,marginRight:10}}>加点冰块</Text>
                        {/*<Text>{this.state.bet==false?'':'极速达'}</Text>*/}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bord,{backgroundColor:this.state.bw==false?'#FFFFFF':'#FF305E'}]} onPress={()=>{
                        if(this.state.bw==false){
                            this.setState({
                                bw:true,

                            })
                        }else {
                            this.setState({
                                bw:false,

                            })
                        }
                    }}>
                        <Text style={{color:this.state.bw==false?'#B2B2B2':'#FFFFFF',marginLeft:10,marginRight:10}}>要保温箱配送</Text>
                        {/*<Text>{this.state.bet==false?'':'极速达'}</Text>*/}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bord,{backgroundColor:this.state.gf==false?'#FFFFFF':'#FF305E'}]} onPress={()=>{
                        if(this.state.gf==false){
                            this.setState({
                                gf:true,

                            })
                        }else {
                            this.setState({
                                gf:false,

                            })
                        }
                    }}>
                        <Text style={{color:this.state.gf==false?'#B2B2B2':'#FFFFFF',marginLeft:10,marginRight:10}}>要穿工服</Text>
                        {/*<Text>{this.state.bet==false?'':'极速达'}</Text>*/}
                    </TouchableOpacity>
                </View>
            </View>)
        }
        return(
            <ScrollView style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>

            {/*<Text>sss</Text>*/}

            <View style={styles.xiaochi}>
                <Text style={styles.text}>请选择你的物品类型，便于配送员提前准备携带工具</Text>

                <View style={styles.row}>
                    <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.rendeshui}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{width:Contants.Screen.width}}
                    />

                </View>
            </View>

          <View style={[styles.items,{marginTop:20}]}>
              <Image source={require('../../img/tools/fahofang.png')} style={comstyle.maleft}/>
              <Text style={styles.faho}>  发货方</Text>
          </View>
            <View style={comstyle.heng}/>
            <View style={styles.items}>
                <Text style={comstyle.maleft}>电  话:  </Text>
                <Text style={comstyle.maleft}>{this.state.phone}</Text>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.items}>
                <Text style={comstyle.maleft}>地  址:  </Text>
                <Text style={[comstyle.maleft,{width:Contants.Screen.width-80}]} ellipsizeMode='tail' numberOfLines={1}>{this.state.address}</Text>
            </View>
            <View style={comstyle.heng}/>
            <View style={[styles.items,{marginTop:20,justifyContent:'space-between'}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../img/tools/shouhuo.png')} style={comstyle.maleft}/>
                    <Text style={styles.faho}>   收货方</Text>
                </View>
                 <TouchableOpacity onPress={()=>{this.setState({
                     isShowModal:true
                 })}}>
                <Text style={styles.chang}>常用</Text>
                 </TouchableOpacity>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.itemss}>
                <Text style={comstyle.maleft}>定位区域:</Text>
                {/*<TextInput*/}
                    {/*placeholderTextColor="#B2B2B2"*/}

                    {/*placeholder={'去定位'} style={[styles.textinput,{ textAlign: "center",}]}*/}
                    {/*underlineColorAndroid='transparent'*/}
                {/*/>*/}
                <TouchableOpacity style={styles.textinput} onPress={()=>{
                    this.props.navigation.navigate('MyMapView',{callbacks:(data)=>{}});
                    // MyMap.toMapActivity();
                    // const resetAction=NavigationActions.reset({
                    //     index:1,
                    //     actions:[NavigationActions.navigate({routeName:'DaiSongOrder'}),
                    //         NavigationActions.navigate({routeName:'MyMapView'})
                    //     ]
                    // })
                    // this.props.navigation.dispatch(resetAction)
                }}>
                   <Image source={require('../../img/tools/golocation.png')}/>
                    <Text style={styles.textgo}>{this.state.diaoyong==''?'去定位':this.state.diaoyong}</Text>
                </TouchableOpacity>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.itemss}>
            <Text style={comstyle.maleft}>详细地址:</Text>
                <TextInput placeholder={'街道/门牌号/楼层'} style={styles.textinput}
                           underlineColorAndroid='transparent'
                           placeholderTextColor="#B2B2B2"
                           defaultValue={this.state.dizhi}
                           onChangeText={(e)=>{
                               this.setState({
                                   xiangxiaddress:e,
                               })
                           }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.itemss}>
                <Text style={comstyle.maleft}>电        话:</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.textinput}
                    placeholderTextColor="#B2B2B2"
                    defaultValue={this.state.dianhua}
                    onChangeText={(e)=>{
                        this.setState({
                            minedianhua:e,
                        })
                    }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={[styles.itemss]}>
                <Text style={comstyle.maleft}>联  系  人 </Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.textinput}
                    placeholderTextColor="#B2B2B2"
                    defaultValue={this.state.kehu}
                    onChangeText={(e)=>{
                        this.setState({
                            lianxiren:e,
                        })
                    }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.beizhu}>
                <Text style={comstyle.maleft}>订单备注:</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.textinputs}
                    placeholderTextColor="#B2B2B2"
                    onChangeText={(e)=>{
                        this.setState({
                            dingdanbeizhi:e,
                        })
                    }}
                />
            </View>
            <View style={[comstyle.heng]}/>
            <View style={styles.itemss}>
                <Text style={comstyle.maleft}>制餐时间:</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.textinput}
                    placeholderTextColor="#B2B2B2"
                    // defaultValue={this.state.dianhua}
                    onChangeText={(e)=>{
                        this.setState({
                            zhicanshijian:e,
                        })
                    }}
                />
            </View>
            <View style={styles.qu}>
                <Text style={comstyle.maleft}>取        货: </Text>
                {/*<RadioModal*/}
                    {/*selectedValue={this.state.initId}*/}
                    {/*onValueChange={(id,item)=>this.setState({initId:id,initItem:item})}*/}
                    {/*style={{flexDirection:'row',flex:1}}*/}
                {/*>*/}
                    {/*<Text value='0'>时间</Text>*/}
                    {/*<Text value='1'>立刻</Text>*/}
                {/*</RadioModal>*/}
            <TouchableOpacity style={comstyle.rightview} onPress={()=>{

           if(this.state.dian==false){
               this.showTracePicker()
               this.setState({
                   dian:true,
                   liji:false
               })
           }else {

               this.setState({
                   dian:false,
                   liji:true
               })
           }
            }
            }>
              <Image source={this.state.dian==false?require('../../img/tools/choose.png'):require('../../img/tools/choosepress.png')} style={comstyle.maleft}/>
                <Text style={{marginLeft:10}}>时间</Text>

            </TouchableOpacity>
                <TouchableOpacity style={comstyle.rightview} onPress={()=>{

                    if(this.state.liji==false){
                        // this.showTracePicker()
                        this.setState({
                            liji:true,
                            dian:false
                        })
                    }else {

                        this.setState({
                            liji:false,
                            dian:true
                        })
                    }
                }
                }>
                    <Image source={this.state.liji==false?require('../../img/tools/choose.png'):require('../../img/tools/choosepress.png')} style={comstyle.maleft}/>
                    <Text style={{marginLeft:10}}>立即</Text>

                </TouchableOpacity>
            </View>
            <View style={styles.time}>
                <Text style={styles.data}>{this.state.follow.nextfollowtime}</Text>
            </View>
            <View style={styles.shou}>
                 <TouchableOpacity style={[styles.yuan,{borderColor:this.state.isShowShou==false?'#E7E7E7':'#FF305E',}]} onPress={()=>{
                     if(this.state.isShowShou==false){
                         this.setState({
                        isShowShou:true,
                             image:require('../../img/tools/jianup.png')

                         })
                     }else {
                         this.setState({
                             isShowShou:false,
                             image:require('../../img/tools/jiandown.png')
                         })
                     }

                 }}>
                     <Text style={{color:this.state.isShowShou==false?'#282828':'#FF305E'}}>{this.state.isShowShou==true?'收起':"更多要求"}</Text>
                     <Image source={this.state.image} style={comstyle.maleft}/>
                 </TouchableOpacity>
            </View>
            {contentView}
            <View style={comstyle.heng}/>

            <View style={styles.feiyong}>
                <View style={comstyle.rightview}>
                <Text style={{marginLeft:20,fontSize:14,color:'#282828'}}>费用:</Text>
                <Text style={{color:'#FF305E'}}>{'￥'+totalprice}</Text>
                </View>
                <TouchableOpacity style={styles.bordd} onPress={this.zhifu.bind(this)}>
                    <Text style={styles.textc}>去下单</Text>
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={this.state.isShowModal}
                hideOnBack={true}
                transparent={true}
                // style={styles.modalstyle}
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
                <View>
              <ListView
                dataSource={this.state.dataSourcechang}
                renderRow={this._renderchang.bind(this)}
                enableEmptySections={true}
                style={{borderRadius:4,backgroundColor:'white',height:300}}
              />
                </View>
            </Modal>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='bottom'
            />
        </ScrollView>)
    }

    checkAction(index){

    }
    rendeshui=(rowData,sectionID,rowID)=>{
        return(
            <TouchableOpacity style={styles.col}
        // ref={(e)=>this._doorBreak=e}
                onPress={this.rendshuiitem.bind(this,rowData,rowID)}
        >
        <Image source={rowData.selected==true?rowData.img:rowData.unimg}/>
        <Text style={{color:rowData.selected==true?'#FF305E':'#282828'}}>{rowData.text}</Text>
        </TouchableOpacity>
        )
    }
    _renderchang(rowData,sectionID,rowID){
        return(

            <TouchableOpacity style={styles.listitem} onPress={this.choose.bind(this,rowData,rowID)}>
            <View style={styles.listrow}>
                <Text style={[comstyle.maleft,{marginTop:20}]}>客户：</Text>
                <Text style={{marginTop:20}}>{rowData.consignee}</Text>
            </View>
            <View style={styles.listrow}>
                <Text style={comstyle.maleft}>电话：</Text>
                <Text style={{fontSize:14,color:'#459CF4'}}>{rowData.consigneePhone}</Text>
            </View>
            <View style={[styles.listrow,{marginBottom:20}]}>
                <Text style={comstyle.maleft}>地址：</Text>
                <Text style={comstyle.textright}>{rowData.consigneeAddr}</Text>
            </View>
                <Image source={require('../../img/tools/xuxian.png')}/>
        </TouchableOpacity>)
    }
    rendshuiitem(item,index){
        // alert(JSON.stringify(item))
      if(item.selected){
          this.Let[index]['selected']=false
         mSelectWhats = -1;
      }else {
          this.Let.map((o,i)=>{
              if(i==index){
                  this.Let[i]['selected']=true
                  mSelectWhats=i;
                  if(this.Let[i]['selected']==true){
                      // alert(JSON.stringify(this.Let[i]['text']))
                      this.setState({
                          frouttype:this.Let[i]['text']
                      })
                  }
              }else {
                  this.Let[i]['selected']=false
              }
          })
      }
      this.setState({
          dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.Let)))
      })
    }
    choose(item,index){
        if(item.isCheck){
            this.LetAll[index]['isCheck']=false;
            mSelectWhat=-1
        }else {
            this.LetAll.map((o,i)=>{
                if(i==index){
                    this.LetAll[i]['isCheck']=true
                    mSelectWhat=i;

                    if(this.LetAll[i]['isCheck']==true){
                        // alert(JSON.stringify(this.LetAll[i]['id']))
                        // alert(JSON.stringify(this.LetAll[i]))
                        this.setState({
                        kehu:this.LetAll[i].consignee,
                            dianhua:this.LetAll[i].consigneePhone,
                            dizhi:this.LetAll[i].consigneeAddr,
                            isShowModal:false

                        })
                    }
                }else {
                    this.LetAll[i]['isCheck']=false
                }
            })
        }
        this.setState({
            dataSourcechang:this.state.dataSourcechang.cloneWithRows(this.LetAll)
        })
    }
    showTracePicker(){
        let that = this
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for(let i=1;i<20;i++){
            years.push(i+2016+'年');
        }
        for(let i=1;i<13;i++){
            months.push(i+'月');
        }
        for(let i=1;i<25;i++){
            hours.push(i+'时');
        }
        for(let i=1;i<32;i++){
            days.push(i+'日');
        }
        for(let i=1;i<61;i++){
            minutes.push(i+'分');
        }
        let pickerData = [years, months, days, hours, minutes];
        let date = new Date();
        let selectedValue = [
            [date.getFullYear()],
            [date.getMonth()+1],
            [date.getDate()],
            [date.getHours() > 11 ? 'pm' : 'am'],
            [date.getHours() === 12 ? 12 : date.getHours()%12],
            [date.getMinutes()]
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
                            follow: this.state.follow
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
    }
    zhifu(){
        if(this.state.peisongfei===''){
            this._toast.show('配送费不能为空')

            return
        }
        if(this.state.lianxiren===''&&this.state.kehu===''){
            this._toast.show('联系人不能为空')
            return
        }
        if(this.state.minedianhua===''&&this.state.dianhua===''){
            this._toast.show('电话不能为空')
            return
        }
        if(this.state.xiangxiaddress===''&&this.state.dizhi===''){
            this._toast.show('地址不能为空')
            return
        }
        if(this.state.daishouhuo===''){
            this._toast.show('代收货款不能为空')
            return
        }
        if(this.state.zhicanshijian===''){
            this._toast.show('制餐时间不能为空')
            return
        }
        // if(this.state.dian!=false&&this.state.liji!=false){
        //     this._toast.show('请选择取货方式')
        //     return
        // }
       var starttime=this.state.follow.nextfollowtime
        starttime=starttime.replace(new RegExp("-","gm"),"/");

        var starttimes=(new Date(starttime)).getTime();
        // var totalprice=this.state.peisongfei+this.state.daishouhuo;
        var peisong=parseInt(this.state.peisongfei)
        var daishou=parseInt(this.state.daishouhuo)
        var totalprice=peisong+daishou;
        // alert(starttimes)
        postFetch(API.GoZhiFu,{
        //     payInfo:{
        //     totalPrice:this.state.peisongfei,pathType:'0',pathName:'微信支付'
        // },
        //     orderDiningVo:{
            type:'0',consignee:this.state.lianxiren==''?this.state.kehu:this.state.lianxiren,deliveryGeo:this.state.latitude+','+this.state.longitude,
                consigneePhone:this.state.minedianhua==''?this.state.dianhua:this.state.minedianhua,
                consigneeAddr:this.state.xiangxiaddress==''?this.state.dizhi:this.state.xiangxiaddress,
                totalPrice:totalprice,remark:this.state.dingdanbeizhi,deliverFee:this.state.peisongfei,
                specificRemark:this.state.bet==false?'':'极速达'+','+this.state.da==false?'':'务必立即配送'+','+this.state.jb==false?'':'加点冰块'+','+
                this.state.bw==false?'':'要保温箱配送'+','+this.state.gf==false?'':'要穿工服',
                deliveryType:this.state.dian==false?'0':'1',
                appointTime:starttimes,
                foodType:this.state.frouttype,
                totalProcessTime:this.state.zhicanshijian
            // }
        },(result)=>{

            // alert(JSON.stringify(result))
            if(result.status==2){
                // this.props.navigation.navigate('Login');
            }else {
                if(result.status==0){
                    this._toast.show(result.msg)
                }else {
                    if(result.status==3){
                        this._toast.show(result.msg)
                    }else {
                        if(result.status==1){
                            // try{
                            //     let payResult=wechat.pay({
                            //         partnerId:result.data.partnerid,
                            //         prepayId:result.data.prepayid,
                            //         nonceStr:result.data.noncestr,
                            //         timeStamp:result.data.timestamp,
                            //         package:result.data.package,
                            //         sign:result.data.sign
                            //     })
                            // } catch (error){
                            //     alert(error)
                            // }
                            this.props.navigation.navigate('ToolsTotal',{data:1})
                            // alert(JSON.stringify(result))
                        }
                    }
                }
            }
        })
    }
    _onPressItem=(item)=>{
        const {list} = this.state;
        let arr = [...list];

        arr.map(v => {
            v.selected = v.id === item.id
        });

        this.selectItem = item;

        this.setState({
            list: arr
        })
    }
}
// var images={require('')}
// const RowItem=({item, index, onPress})=>{
//     <TouchableOpacity
//         activeOpacity={0.7}
//         style={[selected && {backgroundColor: "red"}]}
//         onPress={() => onPress(item, index)}>
//         <Text style={[ selected && {color: '#fff'}]}>{text}</Text>
//         {selected &&
//         <Image
//             source={img}
//             // style={styles.icon}
//         />
//
//         }
//     </TouchableOpacity>
// }
const styles=StyleSheet.create({
  xiaochi:{
      width:Contants.Screen.width,
      height:100,
      marginTop:20,
      backgroundColor:'white',
      flexDirection:'column',
      alignItems:'center'
  },
    col:{
      flexDirection:'column',
        alignItems:'center',
        flex:1,
        justifyContent:'center',
        // marginLeft:15
        width:Contants.Screen.width/6
    },
    text:{
      margin:10,
        fontSize:12,
        color:'#B2B2B2'
    },
    items: {
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        height: 60

    },

    textinput:{
      width:Contants.Screen.width/2+60,
        borderWidth:1,
        borderColor:'#E7E7E7',
        height:40,
        marginLeft:20,
        borderRadius:4,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
    },
    itemss: {
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        height: 60,
        justifyContent:"flex-start"
        // margin:10
    },
    textinputs:{
        width:Contants.Screen.width/2+60,
        borderWidth:1,
        borderColor:'#E7E7E7',
        height:70,
        marginLeft:20,
        // marginTop:10,
        borderRadius:4,

    },
    beizhu: {
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        height:100,
        justifyContent:'flex-start',
        // height: 50,
        // margin:10
    },
    beizhus: {
        backgroundColor: 'white',
        // alignItems: 'center',
        flexDirection: 'row',
        height:100,
        justifyContent:'flex-start',
        flexWrap:'wrap'

    },
    qu:{
      flexDirection:'row',
     backgroundColor:'white',
        height:30,
        alignItems:'center',
        justifyContent:'flex-start',
    },
    time:{
      justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'white',
        marginBottom:20
    },
    shou:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        margin:20,
    },
    yuan:{
        borderWidth:1,

        borderRadius:20,
        width:Contants.Screen.width/2,
        alignItems:'center',
        height:30,
        backgroundColor:'white',
        justifyContent:'center',
        flexDirection:'row',

    },
    textc:{
      color:'white'
    },
    bord:{
        borderWidth:1,
        borderColor:'#E5E5E5',
        // backgroundColor:'#FF305E',
        // width:Contants.Screen.width/5+15,
        height:30,
        // backgroundColor:'gray',
        marginRight:20,
        marginTop:20,
        alignItems:'center',
        justifyContent:'center',
       borderRadius:4
       //  width:90,

    },
    bordd:{
        borderWidth:1,
        borderColor:'#FF305E',
        backgroundColor:'#FF305E',
        // width:Contants.Screen.width/5+15,
        height:35,
        // backgroundColor:'gray',
        marginRight:20,
        // marginTop:20,
        alignItems:'center',
        justifyContent:'center',
        // borderRadius:4
        width:90,

    },
    bords:{
        borderWidth:1,
        borderColor:'#E5E5E5',
        // width:Contants.Screen.width/5+15,
        height:30,
        // backgroundColor:'gray',
        marginLeft:50,
        marginTop:20,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:4

    },
    feiyong:{
      justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'white',
        marginTop:30,
        height:60,
    },
    row:{
      flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    faho:{
      fontSize:14,
        color:'#282828'
    },
    chang:{
      marginRight:20,
        fontSize:14,
        color:'#459CF4',

    },
    data:{
      color:'#FF305E',
        fontSize:12,

    },
    modalstyle:{
        backgroundColor:"transparent",
        // margin:0,
        position:'absolute',
        // marginLeft:Contants.Screen.width/2+80,
        // marginTop:20
        justifyContent:'center',
        alignSelf:'center',
        marginTop:Contants.Screen.height/3-30
        // height:380

    },
    listitem:{
      // height:80,
        flexDirection:'column',
        // alignItems:"center",
        // justifyContent:'flex-start',

    },
    listrow:{
      flexDirection:'row',
        alignItems:"center",
        justifyContent:'flex-start',
    },
    textgo:{
      fontSize:14,
        color:'#B2B2B2'
    }

})
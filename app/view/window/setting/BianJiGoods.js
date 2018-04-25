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
    ActivityIndicator
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
var mSelectWhat = -1;
var mSelectWhats = -1;
export default class QuicklyInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initItem:'外送',
            initId:'0',
            isShowModal:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            dataSourceImage: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            trueSwitchIsOn:true,
            falseSwitchIsOn:false,
            item:'',
            language:"0",
            // list:[],
            isShowGuiGe:false,
            changeName:'',//规格名称
            outprice:'',//外送价格
            homeprice:'',//到店价格
            kucun:'',//每日库存
            guilist:[],//添加规格的list
            imagelist:[],//添加图片的list
            // avatarSource:require('../../../img/window/duigou.png'),
            goodsname:'',//商品名称
            goodsdaodianprice:'',//到店价格
            goodswaisongprice:'',//外送价格
            everykucun:'',//每日库存
            maketime:'',//制餐时间
            wenzidescription:'',//商品的文字描述
            // typeceshi: new ListView.DataSource({
            //     rowHasChanged: (row1, row2) => row1 !== row2,
            // }),
            // ceshilist:[],
            ceshiguige: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            ceshiguigelist:[],

            shangjia:'',
            shangpingname:'',//商品名称
            waisongjiage:0,//外送价格
            daodianjige:0,//到店
            meirikuc:0,
            zhicantime:0,//制餐时间
            goodsweizims:'',//商品文字描叙
            foodImageDoss:[],//图片的数组
            imguri:[],
            falseSure:false,
            goosfenlei:'',//食品分类
            foodSkus:[],//商品规格
            img:require('../../../img/window/jianxia.png'),
            isGuige:false,
            foodList:[],
            big:"",
            small:'',
            classifychoose:new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            animating:false
        }
        // const list=this.props.navigation.state.params.data

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
        const list=this.props.navigation.state.params.data
        // alert(list)
      postFetch(API.BianJiGoods,{foodInfo:{id:list}},(result)=>{
          // alert(JSON.stringify(result))
          if(result.status==1){
              //是否上架
              if(result.data.status==1){
                  this.setState({
                      falseSwitchIsOn:true
                  })
              }else {
                  this.setState({
                      falseSwitchIsOn:false
                  })
              }

             this.setState({
                 shangpingname:result.data.name,
                 waisongjiage:result.data.priceOut,
                 daodianjige:result.data.priceIn,
                 meirikuc:result.data.stock,
                 zhicantime:result.data.makeTime,
                 goodsweizims:result.data.description,
                  foodImageDoss:result.data.foodImageDos,
                 dataSourceImage:this.state.dataSourceImage.cloneWithRows(result.data.foodImageDos),
                 goosfenlei:result.data.foodGroup[0].groupName,
                 foodSkus:result.data.foodSkus,
                 // dataSource:this.state.dataSource.cloneWithRows(result.data.foodSkus),
                 foodList:result.data.foodSkus
             })
              var LetAll=result.data.foodSkus;
              result.data.foodSkus.map((o,i)=>{
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
          }
      })
        postFetch(API.ListOrder,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                var LetAlls=result.data;
                result.data.map((o,i)=>{
                    if(!this.props.mID){
                        LetAlls[i]['isCheck']=false
                    }else {
                        if(this.props.mID==o.user_id){
                            LetAlls[i]['isCheck']=true
                        }else {
                            LetAlls[i]['isCheck']=false
                        }
                    }
                })
                this.LetAlls=LetAlls
                this.setState({
                    classifychoose:this.state.classifychoose.cloneWithRows(JSON.parse(JSON.stringify(this.LetAlls)))
                })
            }
        },(error)=>{
            alert(error)
        })

    }

    render(){
       const{navigate,goBack,state}=this.props.navigation;
       state.params.callback('')
        // alert(JSON.stringify(list))
        var contentView=null;
        if(this.state.isShowGuiGe==false){
            contentView=(<View></View>)
        }else {
            contentView=(
                <View>
                    <View style={styles.fanwei}>
                        <Text style={comstyle.text}>规格名称：</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder={'支持中英文名称'}
                            numberofLines={1} //限制一行
                            style={styles.input}
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e)=>{
                                this.setState({
                                    changeName:e,
                                })
                            }}
                        />
                    </View>
                    <View style={styles.fanwei}>
                        <Text style={comstyle.text}>外送价格：</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder={'单位：元'}
                            numberofLines={1} //限制一行
                            style={styles.input}
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e)=>{
                                this.setState({
                                    outprice:e,
                                })
                            }}
                        />
                    </View>
                    <View style={styles.fanwei}>
                        <Text style={comstyle.text}>到店价格：</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder={'单位：元'}
                            numberofLines={1} //限制一行
                            style={styles.input}
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e)=>{
                                this.setState({
                                    homeprice:e,
                                })
                            }}
                        />
                    </View>
                    <View style={styles.fanwei}>
                        <Text style={comstyle.text}>每日库存：</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder={'每日自动重置的库存数量'}
                            numberofLines={1} //限制一行
                            style={styles.input}
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e)=>{
                                this.setState({
                                    kucun:e,
                                })
                            }}
                        />
                    </View>
                </View>
            )
        }
        return(<ScrollView style={[comstyle.contain,{backgroundColor:"#f9f9f9"}]}>
            <View style={[comstyle.item,{marginTop:20}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/window/shangjia.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>是否上架</Text>
                </View>
                <Switch onValueChange={(value)=>this.setState({falseSwitchIsOn:value})}
                        style={{marginRight:20}}
                        value={this.state.falseSwitchIsOn}
                        onTintColor='#FF305E'
                    // // tintColor='blue'
                        thumbTintColor='white'
                />
            </View>

            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/window/tianjiafen.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>选择分类</Text>
                </View>
                <View style={styles.she}>
                    <Text style={comstyle.textright}>{this.state.falseSure==true?this.state.item:this.state.goosfenlei}</Text>
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                            isShowModal:true
                        })
                    }}>
                        <Image source={require('../../../img/window/write.png')} style={{marginRight:20}}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/window/shangpin.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>商品信息</Text>
                </View>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.fanwei}>
                <Text style={[comstyle.maleft,{marginRight:20},comstyle.text]}>经营范围:</Text>
                {/*<Text>{this.state.initId}</Text>*/}
                <RadioModal
                    selectedValue={this.state.initId}
                    onValueChange={(id,item)=>this.setState({initId:id,initItem:item})}
                    style={{flexDirection:'row',flex:1}}
                    seledImg={require('../../../img/window/goupress.png')}
                    selnoneImg={require('../../../img/window/gouunpress.png')}
                    selImg={require('../../../img/window/gouunpress.png')}
                >
                    <Text value='0'>外送</Text>
                    <Text value='1'>到店</Text>
                </RadioModal>

            </View>
            <View style={comstyle.heng}/>
            <View style={styles.fanwei}>
                <Text style={comstyle.text}>商品名称：</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={'支持中英文名称'}
                    numberofLines={1} //限制一行
                    style={styles.input}
                    placeholderTextColor="#B2B2B2"
                    editable={true}
                    defaultValue={this.state.shangpingname}
                    onChangeText={(e)=>{
                        this.setState({
                            goodsname:e,
                        })
                    }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.fanwei}>
                <Text style={comstyle.text}>外送价格：</Text>
                <TextInput

                    underlineColorAndroid='transparent'
                    placeholder={'单位：元'}
                    numberofLines={1} //限制一行
                    // editable={true}
                    defaultValue={this.state.waisongjiage.toString()}
                    placeholderTextColor="#B2B2B2"
                    // defaultValue={'2342435'}
                    // Value={this.state.waisongjiage}
                    style={styles.input}
                    onChangeText={(e)=>{
                        this.setState({
                            goodswaisongprice:e,
                        })
                    }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.fanwei}>
                <Text style={comstyle.text}>到店价格：</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={'单位：元'}
                    numberofLines={1} //限制一行
                    editable={true}
                    placeholderTextColor="#B2B2B2"
                    defaultValue={this.state.daodianjige.toString()}
                    style={styles.input}
                    onChangeText={(e)=>{
                        this.setState({
                            goodsdaodianprice:e,
                        })
                    }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.fanwei}>
                <Text style={comstyle.text}>每日库存：</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={'每日自动重置的库存数量'}
                    numberofLines={1} //限制一行
                    style={styles.input}
                    editable={true}
                    placeholderTextColor="#B2B2B2"
                    defaultValue={this.state.meirikuc.toString()==undefined?'':this.state.meirikuc.toString()}
                    onChangeText={(e)=>{
                        this.setState({
                            everykucun:e,
                        })
                    }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.fanwei}>
                <Text style={comstyle.text}>制餐时间：</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={'单位分钟，必须整数'}
                    numberofLines={1} //限制一行
                    editable={true}
                    placeholderTextColor="#B2B2B2"
                    defaultValue={this.state.zhicantime.toString()}
                    style={styles.input}
                    onChangeText={(e)=>{
                        this.setState({
                            maketime:e,
                        })
                    }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.miaosu}>
                <TextInput
                    placeholder={'商品的文字描述'}
                    multiline={true} //代表可以输入多行
                    underlineColorAndroid='transparent'
                    editable={true}
                    placeholderTextColor="#B2B2B2"
                    defaultValue={this.state.goodsweizims}
                    onChangeText={(e)=>{
                        this.setState({
                            wenzidescription:e,
                        })
                    }}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.imglist}>
                <TouchableOpacity style={styles.picker} onPress={this.selectImage.bind(this)}>
                    {/*image的listview*/}
                    <Image source={require('../../../img/window/jia.png')} style={{marginLeft:20}}/>
                </TouchableOpacity>
                {/*<ScrollView style={{horizontal:true,flexDirection:'row'}}>*/}
                <ListView
                    dataSource={this.state.dataSourceImage}
                    renderRow={this._renderRowImage}
                    horizontal={true}
                    // style={styles.listviews}
                />
                {/*</ScrollView>*/}
            </View>


            {/*listview*/}
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}

            />
            <View style={[comstyle.item,{marginTop:20}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/window/guige.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>添加规格</Text>
                </View>
                <View style={styles.she}>
                    {/*对勾图片*/}
                    <TouchableOpacity onPress={()=>{
                        if(this.state.changeName===''){
                            this._toast.show('规格名称不能为空')
                            return
                        }
                        this.setState({
                            foodSkus:this.state.foodSkus.concat([{"spec":this.state.changeName}]),
                            dataSource:this.state.dataSource.cloneWithRows(this.state.foodSkus.concat([{"spec":this.state.changeName}])),
                             ceshiguigelist:this.state.foodSkus.concat([{"spec":this.state.changeName,"priceOut":this.state.outprice,"priceIn":this.state.homeprice,"stock":this.state.kucun}]),
                            ceshiguige:this.state.ceshiguige.cloneWithRows(this.state.ceshiguigelist.concat(this.state.changeName,this.state.outprice,this.state.homeprice,this.state.kucun))
                        })
                         // alert(JSON.stringify(this.state.ceshiguigelist))
                    }}>
                        <Image source={require('../../../img/window/press.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                    {/*<Text>未设置</Text>*/}
                    <TouchableOpacity onPress={()=>{
                        if(this.state.isShowGuiGe==false&&this.state.img==require('../../../img/window/jianxia.png')){
                            this.setState({
                                isShowGuiGe:true,
                                img:require('../../../img/window/jianshang.png')
                            })
                        }else {
                            this.setState({
                                isShowGuiGe:false,
                                img:require('../../../img/window/jianxia.png')
                            })
                        }
                    }}>
                        <Image source={this.state.img} />
                    </TouchableOpacity>
                </View>

            </View>
            {contentView}
            <View style={styles.shanchu}>
                <TouchableOpacity style={styles.tijiaos} onPress={this.delectgoods.bind(this)}>
                <Image source={require('../../../img/window/ashanchu.png')} style={styles.tijiaos}>
                    <Text style={comstyle.text}>删除商品</Text>
                </Image>
                </TouchableOpacity>
                <View style={styles.tijiaos} onPress={this.tijiao.bind(this)}>
                    <Image source={require('../../../img/window/baocun.png')} style={styles.tijiaos}>
                <Text onPress={this.tijiao.bind(this)} style={comstyle.text}>确认提交</Text>
                 </Image>
                </View>
            </View>

            {/*modal弹窗*/}
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
                <View style={{backgroundColor:'white',borderWidth:1,borderRadius:5,borderColor:"#E7E7E7"}}>
                    <Text style={{margin:10,color:'#282828',fontSize:14}}>选择分类</Text>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>

                    <ListView
                        dataSource={this.state.classifychoose}
                        renderRow={this._renderRowClassify}
                        style={{height:300}}
                    />
                    {/*<Text onPress={()=>{this.setState({falseSure:true,isShowModal:false})}}>确定</Text>*/}
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5',marginTop:15}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({
                                isShowModal:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({
                                falseSure:true,isShowModal:false
                            })

                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={this.state.animating}
                hideOnBack={true}
                transparent={true}
                style={{backgroundColor:'transparent',}}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                <ActivityIndicator
                    animating={true}
                    style={{zIndex:100,alignSelf:'center',padding:8}}
                    color='#FF305E'
                    size="large"
                />
            </Modal>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='bottom'
            />
        </ScrollView>)
    }
    _renderRowClassify=(rowData,sectionID,rowID)=>{
        return(<View style={{flexDirection:'column',}}>
            <View style={[{marginTop:15,marginBottom:15,height:2,backgroundColor:'#E5E5E5'}]}/>
            <TouchableOpacity style={{flexDirection:'row',height:35,borderColor:'#E5E5E5',borderRadius:4,borderWidth:1,justifyContent:'space-between',alignItems:'center',
                marginLeft:20,marginRight:20
            }}
                              onPress={this.selectRowClassify.bind(this,rowData,rowID)}>
                <Text style={[comstyle.text,{marginLeft:12}]}>{rowData.groupName}</Text>
                <Image source={rowData.isCheck==true?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')} style={{marginRight:12}}/>
            </TouchableOpacity>
        </View>)
    }
    selectRowClassify=(item,index)=>{
        if(item.isCheck){
            this.LetAlls[index]['isCheck']=false;
            mSelectWhats=-1
        }else {
            this.LetAlls.map((o,i)=>{
                if(i==index){
                    this.LetAlls[i]['isCheck']=true
                    mSelectWhats=i;
                    if(this.LetAlls[i]['isCheck']==true){
                        this.setState({
                            language:item.id,
                            item:item.groupName
                        })
                        // alert(item.groupName)
                    }
                }else {
                    this.LetAlls[i]['isCheck']=false
                }
            })
        }

        this.setState({

            classifychoose:this.state.classifychoose.cloneWithRows(JSON.parse(JSON.stringify(this.LetAlls)))
        })
    }

    _renderRow=(rowData,sectionID,rowID)=>{
        // alert(this.state.isGuige)
        var contentViews=null;
        if(rowData.isCheck==false){
            contentViews=(<View></View>)
        }else {
            contentViews=(<View>
                <View style={styles.fanwei}>
                    <Text style={comstyle.text}>规格名称：</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        // placeholder={'支持中英文名称'}
                        numberofLines={1} //限制一行
                        style={styles.input}
                        placeholderTextColor="#B2B2B2"
                        placeholder={rowData.spec}
                        onChangeText={(e)=>{
                            this.setState({
                                big:e,
                            })
                        }}
                    />
                </View>
                <Image source={require('../../../img/window/xuxian.png')}/>
                <View style={styles.fanwei}>
                    <Text style={comstyle.text}>外送价格：</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        // placeholder={'单位：元'}
                        numberofLines={1} //限制一行
                        style={styles.input}
                        placeholderTextColor="#B2B2B2"
                        // placeholder={rowData.priceOut.toString()}
                        onChangeText={(e)=>{
                            this.setState({
                                small:e,
                            })
                        }}
                    />
                </View>
                <View style={comstyle.heng}/>
                <TouchableOpacity style={[styles.tijiaos,{marginTop:10,marginBottom:10}]} onPress={()=>{
                    delete this.state.foodSkus[rowID]
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(this.state.foodSkus)
                    })
                }}>
                    <Image source={require('../../../img/window/shanchu.png')} style={styles.tijiaos}>
                        <Text style={comstyle.text}>删除规格</Text>
                    </Image>
                </TouchableOpacity>

            </View>)
        }
        return(<View>
            <View style={[comstyle.item,{marginTop:20}]}>
            <Text style={comstyle.maleft}>{rowData.spec}</Text>
            <TouchableOpacity onPress={this.guige.bind(this,rowData,rowID)}>
            <Image source={rowData.isCheck==true?require('../../../img/window/press.png'):require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
            </TouchableOpacity>
        </View>
            {contentViews}
        </View>)
    }
    guige(rowData,rowID){
   // alert(JSON.stringify(this.LetAll))
        if(rowData.isCheck){
            this.LetAll[rowID]['isCheck']=false;
            mSelectWhat=-1
            if(this.LetAll[rowID]['isCheck']==false){
                this.setState({
                    // isGuige:false
                })
            }
        }else {
            this.LetAll.map((o,i)=>{
                if(i==rowID){
                    this.LetAll[i]['isCheck']=true
                    mSelectWhat=i;

                    if(this.LetAll[i]['isCheck']==true){
                        this.setState({
                            // isGuige:true
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



    }
    _renderRowImage=(rowData)=>{
        // this.setState({
        //    imguri:rowData.imgUrl
        // })
       // alert(this.state.imguri)
        return(<View  style={{flexDirection:'row',flexWrap:'wrap'}}>
            {/*<Text>{rowData.id}</Text>*/}
            <Image source={{uri:rowData.imgUrl}} style={styles.rowimage}/>
            {/*<Text>{rowData}</Text>*/}
        </View>)
    }
    //图片选择
    selectImage(){
        var photoOptions = {

            title:"请选择",
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'选择相册',
            quality:0.75,
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
                this.setState({
                    animating:true
                });
                ImageResizer.createResizedImage(source.uri,105,105,"PNG", 80,0).then((response)=>{
                    // this.setState({
                    //     imglujing:response.uri
                    // })
                    this.handlers(response.uri)
                }).catch((err)=>{
                    // alert(err)
                })

                //
            }

        })
    }
    handlers(img){
        let file = {uri: img, type: 'multipart/form-data', name: 'image.jpg'};
        var formData=new FormData();
        formData.append('file',file)
        // alert(JSON.stringify(this.state.avatarSource))
        // postFetch(API.ShangChuan,{body:formData},(result)=>{
        //      alert(JSON.stringify(result))
        // },(error)=>{
        //      alert(error)
        // })
        fetch(API.ShangChuan,{
            method:"POST",
            // body:ObjectTransform(data),
            body:formData,
            headers: {'Content-Type':'multipart/form-data',},
        }).then((response)=>response.json()).then((result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    // avatarSource:result.url,
                    foodImageDoss:this.state.foodImageDoss.concat([{"imgUrl":result.url}]),
                    dataSourceImage:this.state.dataSourceImage.cloneWithRows(this.state.foodImageDoss.concat([{"imgUrl":result.url}])),
                    animating:false
                    // ceshilist:this.state.ceshilist.concat("{imgUrl:"+result.url+'}'),
                    // typeceshi:this.state.typeceshi.cloneWithRows(this.state.ceshilist.concat(result.url)),

                })
                // alert(JSON.stringify(this.state.foodImageDoss))
            }
        }).catch((error)=>{
            alert(error)
        })
    }
    delectgoods(){
        const list=this.props.navigation.state.params.data
       postFetch(API.DelectGoodsManage,{foodInfo:{id:list}},(result)=>{
           // alert(JSON.stringify(result))
           if(result.status==1){
               this._toast.show('删除成功')
               this.props.navigation.navigate('GoodsManage')
           }
       })
    }
    tijiao(){
        // alert(this.state.everykucun)
        if(this.state.language=="0"){
            this._toast.show('选择分类不能为空');
            return
        }
        const list=this.props.navigation.state.params.data;
      postFetch(API.SoureGeng,{groupIds:[this.state.language],foodInfo:{id:list,name:this.state.goodsname==''?this.state.shangpingname:this.state.goodsname,
          priceIn:this.state.goodsdaodianprice==''?this.state.daodianjige:this.state.goodsdaodianprice,
          priceOut:this.state.goodswaisongprice==''?this.state.waisongjiage:this.state.goodswaisongprice,
          makeTime:this.state.maketime==''?this.state.zhicantime:this.state.maketime,type:this.state.initId,isNew:'1',isFeatured:'0',isRecoverStock:this.state.everykucun==''?this.state.meirikuc:this.state.everykucun,
          boxNum:'1',boxPrice:'1',unit:'份',
          description:this.state.wenzidescription==''?this.state.goodsweizims:this.state.wenzidescription,
          status:this.state.falseSwitchIsOn==true?'1':'0'
      }, foodImageDos:this.state.foodImageDoss,foodSkuList:this.state.ceshiguigelist


      },(result)=>{
          // alert(JSON.stringify(result))
          if(result.status==1){
              this._toast.show('更改成功')
          }
      })
    }
}
const styles=StyleSheet.create({
    mesg:{
        marginLeft:20
    },
    fanwei:{
        justifyContent:'space-around',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        marginTop:10,
        // width:Contants.screen.width
        height:60
    },
    input:{
        width:Contants.Screen.width/2+50,
        color:'black',
        borderColor:'#E7E7E7',
        borderWidth:1,
        height:40,
        borderRadius:5

    },miaosu:{
        borderColor:'#E5E5E5',
        borderWidth:1,
        width:Contants.Screen.width-40,
        marginTop:10,
        height:70,
        // marginLeft:10,
        marginBottom:10,
        borderRadius:5,
        alignSelf:'center',
    },
    picker:{
        marginTop:10,
        // borderColor:'gray',
        // borderWidth:1,
        // width:50,
        // height:50
    },
    she:{
        flexDirection:"row",
        justifyContent:'flex-end',
        marginRight:20
    },
    tijiao:{
        marginTop:30,
        borderColor:'gray',
        borderWidth:1,
        width:Contants.Screen.width/2-40,
        marginLeft:Contants.Screen.width/2-20,
        height:25,
        alignItems:'center',
        backgroundColor:'white',
        marginBottom:50
    },
    imglist:{
        flexDirection:'row',
        width:Contants.Screen.width,

    },
    shanchu:{
         flexDirection:'row',
        justifyContent:'space-around',
        margin:10
    },
    tijiaos:{
        justifyContent:"center",
        alignItems:'center',

    },
    rowimage:{
        width:60,height:60,marginTop:10,marginLeft:10,marginRight:10,borderRadius:5,alignSelf:'center'
    },

})
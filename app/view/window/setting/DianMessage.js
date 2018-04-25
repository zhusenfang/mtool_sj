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
// import ImagePickers from 'react-native-syan-image-picker'
export default class DianMessage extends Component {
    constructor(props){
        super(props)
        this.state={
            isShowModal:false,
            isShow_fuwu:false,
            change:'',
            tupian:'',
            phone:'',
            name:'',
            description:'',
            jianjie:false,

            imgpng:'',
            tup:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            addimg:'',
            isDelect:false,
            list:[],
            imagelist:[],//添加图片的list
            imglujing:'',
            imgs:'',
            bigImagelist:[],
            oldllist:[],
            animating:false,

            fuwu_string:'',
            fuwu_bool:false,
            wifi_bool:false,//无线
            wifilan_bool:false,//有线
            park_bool:false,//停车
            pack_bool:false,//包裹


            tup_erwm:false,//二维码
            img_erwm:'',
            img_erwm_default:'../../../img/dian/erweima.png',

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
        postFetch(API.DianPuMessage,null,(result)=>{
            if(result.status==1){
               // alert(JSON.stringify(result.data.merchantRestaurantsSurroundingsImg))
                   this.setState({
                       tupian:result.data.logoUrl,
                       phone:result.data.hotline,
                       name:result.data.name,
                       description:result.data.description,
                       dataSource:this.state.dataSource.cloneWithRows(result.data.merchantRestaurantsSurroundingsImg),
                       list:result.data.merchantRestaurantsSurroundingsImg,
                       oldllist:result.data.merchantRestaurantsSurroundingsImg,
                       change:result.data.description,
                })
            }
        })
    }

    render(){
        return(
            <View style={[comstyle.contain,{backgroundColor:'#f9f9f9',flexDirection:'column',}]}>
            <ScrollView>
            <View style={styles.dianz}>
               <View style={comstyle.rightview}>
                   <Image source={require('../../../img/dian/dian.png')} style={comstyle.maleft}/>
               <Text style={[comstyle.mesg,comstyle.text]}>店招图片</Text>
               </View>
               <View style={styles.tview}>
                   <Image source={this.state.tup==true?{uri:this.state.imgpng}:this.state.tupian==undefined?require('../../../img/window/write.png'):{uri:this.state.tupian}} style={styles.tupian}/>
                   <TouchableOpacity onPress={this.imageset.bind(this)}>
                   <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
                   </TouchableOpacity>
               </View>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={[comstyle.item,{marginTop:0}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/dian/dianjianjie.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>店铺简介</Text>
                </View>
                <View style={[styles.tview,{alignItems:'center'}]}>
                    <Text style={[comstyle.textright,comstyle.text]}>
                        {this.state.jianjie==true?this.state.change:this.state.description==undefined?'未设置':this.state.description}
                        </Text>
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                            isShowModal:true
                        })
                    }}>
                    <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={[comstyle.item,{marginTop:0}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/dian/fuwu.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>可提供服务</Text>
                </View>
                <View style={[styles.tview,{alignItems:'center'}]}>
                    <Text style={[comstyle.textright,comstyle.text]}>
                        {this.state.fuwu_bool==true?this.state.change:this.state.fuwu_string==undefined?'未设置':this.state.fuwu_string}
                    </Text>
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                            isShow_fuwu:true
                        })
                    }}>
                        <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={[comstyle.item,{marginTop:0}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/dian/dianname.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>店铺名称</Text>
                </View>

                    <Text style={[styles.mag,comstyle.text]}>{this.state.name==undefined?'未设置':this.state.name}</Text>

            </View>
            <View style={comstyle.heng}/>
            <View style={[comstyle.item,{marginTop:0}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/dian/dianguhua.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>店铺固话</Text>
                </View>

                <Text style={[styles.mag,comstyle.text]}>{this.state.phone==undefined?'未设置':this.state.phone}</Text>

            </View>
            <View style={comstyle.heng}/>

            <View style={styles.er_wei_ma}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/dian/erweima.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>店铺二维码</Text>
                </View>
                <View style={styles.tview}>
                    {/*<Image source={ this.state.tup_erwm==true?{uri:this.state.img_erwm}:*/}
                                    {/*this.state.img_erwm_default==undefined?require('../../../img/dian/erweima.png'):*/}
                                    {/*{uri:this.state.img_erwm_default}}*/}

                    <Image source={ this.state.tup_erwm==true?{uri:this.state.img_erwm}:require('../../../img/dian/erweima.png')}
                           style={[comstyle.img,{marginRight:20}]}/>
                    <TouchableOpacity onPress={this.up_img_erwm.bind(this)}>
                        <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>

            <View style={styles.dianhuanjing}>
                <View style={styles.con}>
                    <Image source={require('../../../img/dian/dianhuanj.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>店铺环境相册</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',width:Contants.Screen.width}}>
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderImg.bind(this)}
            // horizontal={true}
            // style={{height:50}}
            enableEmptySections={true}
             contentContainerStyle={styles.consty}
            // style={{backgroundColor:'white',height:10}}
            />
            </View>

            <View style={styles.jiav}>
                 <TouchableOpacity onPress={this.dianhuanjimg.bind(this)}>
                 <Image source={require('../../../img/window/jia.png')} style={comstyle.maleft}/>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={this.delectimg.bind(this)}>
                 <Image source={require('../../../img/dian/jian.png')} style={{marginLeft:30}}/>
                 </TouchableOpacity>
             </View>

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
                    <Text style={[comstyle.text,{margin:10}]}>店铺简介</Text>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{height:100,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        defaultValue={this.state.description}
                        ref={e => this._nameInput = e}
                        underlineColorAndroid='transparent'
                        style={{
                            // marginLeft: 20,
                            backgroundColor: "white",
                            textAlign:'auto',
                            height:70,
                            borderWidth:1,
                            borderColor:'#E5E5E5',
                            width:Contants.Screen.width-80,
                            // marginLeft:10,
                            marginRight:40,
                        }}
                        placeholderTextColor="#B2B2B2"
                        onChangeText={(e)=>{
                            this.setState({
                                change:e,

                            })
                        }}
                        multiline={true}
                        placeholder={'输入店铺简介'}/>
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
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
                            if(this.state.change.length==0){
                                this._toast.show('介绍内容不能为空');
                                return
                            }
                           postFetch(API.DianPuReset,
                               { description:this.state.change},(result)=>{


                               if(result.status == 1){
                                   this.setState({
                                       isShowModal:false,
                                       jianjie:true,
                                       description:this.state.change
                                   })
                                   this._toast.show('更改成功')
                               }
                               else
                               {
                                   this._toast.show('更改失败')


                               }


                               //alert(result);

                                //alert(JSON.stringify(result))
                               // this.setState({
                               //     isShowModal:false,
                               //     jianjie:true
                               // })
                               // this._toast.show('更改成功')
                           })

                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toast = e
                }}
                       position='center'
                />
            </Modal>

            {/*加载器*/}
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

            {/*可提供服务*/}
            <Modal
                isVisible={this.state.isShow_fuwu}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShow_fuwu: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                    <Text style={[comstyle.text,{margin:10}]}>可提供服务</Text>

                    <View style={styles.fuwu_line}/>





                    <View style={styles.fuwu_view}>
                        <View style={styles.fuwu_left_view}>
                            <View style={styles.fuwu_img_view}>
                                <Image source={require('../../../img/dian/youxian.png')} style={{marginLeft:10}}/>
                                <Text style={[comstyle.mesg,comstyle.text]}>有线上网</Text>
                            </View>
                            <TouchableOpacity onPress={()=>{this.setState({
                                wifilan_bool:!this.state.wifilan_bool
                            })}} >
                                <Image source={this.state.wifilan_bool==true?require('../../../img/window/goupress.png'):
                                    require('../../../img/window/gouunpress.png')} style={{marginRight:10}}/>
                            </TouchableOpacity>

                        </View>

                    </View>
                    <View style={styles.fuwu_line}/>

                    <View style={styles.fuwu_view}>
                        <View style={styles.fuwu_left_view}>
                            <View style={styles.fuwu_img_view}>
                                <Image source={require('../../../img/dian/wifi.png')} style={{marginLeft:10}}/>
                                <Text style={[comstyle.mesg,comstyle.text]}> 无线上网</Text>
                            </View>
                            <TouchableOpacity onPress={()=>{this.setState({
                                wifi_bool:!this.state.wifi_bool
                            })}} >
                                <Image source={this.state.wifi_bool==true?require('../../../img/window/goupress.png'):
                                    require('../../../img/window/gouunpress.png')} style={{marginRight:10}}/>
                            </TouchableOpacity>

                        </View>

                    </View>
                    <View style={styles.fuwu_line}/>

                    <View style={styles.fuwu_view}>
                        <View style={styles.fuwu_left_view}>
                            <View style={styles.fuwu_img_view}>
                                <Image source={require('../../../img/dian/park.png')} style={{marginLeft:10}}/>
                                <Text style={[comstyle.mesg,comstyle.text]}>停车场</Text>
                            </View>
                            <TouchableOpacity  onPress={()=>{this.setState({
                                park_bool:!this.state.park_bool
                            })}} >
                                <Image source={this.state.park_bool==true?require('../../../img/window/goupress.png'):
                                    require('../../../img/window/gouunpress.png')} style={{marginRight:10}}/>
                            </TouchableOpacity>

                        </View>

                    </View>
                    <View style={styles.fuwu_line}/>

                    <View style={styles.fuwu_view}>
                        <View style={styles.fuwu_left_view}>
                            <View style={styles.fuwu_img_view}>
                                <Image source={require('../../../img/dian/pack.png')} style={{marginLeft:10}}/>
                                <Text style={[comstyle.mesg,comstyle.text]}>行李寄存</Text>
                            </View>
                            <TouchableOpacity onPress={()=>{this.setState({
                                pack_bool:!this.state.pack_bool
                            })}} >
                                <Image source={this.state.pack_bool==true?require('../../../img/window/goupress.png'):
                                    require('../../../img/window/gouunpress.png')} style={{marginRight:10}}/>
                            </TouchableOpacity>

                        </View>

                    </View>
                    <View style={styles.fuwu_line}/>






                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({
                                isShow_fuwu:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>

                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>

                        <TouchableOpacity  onPress={()=>{

                                alert("接口建设中");
                                if(this.state.change.length==0){
                                    this._toast.show('介绍内容不能为空');
                                    return
                                }

                                // postFetch(API.DianPuReset,
                                //     { description:this.state.change},(result)=>{
                                //         if(result.status == 1){
                                //             this.setState({
                                //                 isShow_fuwu:false,
                                //                 jianjie:true,
                                //                 description:this.state.change
                                //             })
                                //             this._toast.show('更改成功')
                                //         }
                                //         else
                                //         {
                                //             this._toast.show('更改失败')
                                //
                                //
                                //         }
                                //     });

                            }}
                            style={{justifyContent:'center',alignItems:"center",flex:1}}>

                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toast = e
                }}
                       position='center'
                />
            </Modal>




            <Toast ref={(e) => {
            this._toasts = e
        }}
               position='center'
            />
            </ScrollView>
        </View>)
    }
    _renderImg(rowData,sectionID,rowID){
        return(<TouchableOpacity style={styles.conimg} onPress={this.delect.bind(this,rowID,rowData.id)}>
             <Image source={{uri:rowData.imgUrl}} style={{width:75,height:75,borderRadius:4}}/>
        </TouchableOpacity>)
    }
    delectimg(){
        this.setState({
            isDelect:true,

        })
    }
    delect(rowid,rowdata){
        if(this.state.isDelect==true){
            delete this.state.list[rowid]
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.state.list)
            })
           postFetch(API.DianDelect,{id:rowdata},(result)=>{
               // alert(JSON.stringify(result))
               if(result.status==1){
                   this._toasts.show(result.msg)
               }
           },(error)=>{
               this._toasts.show(error)
           })
        }else {
            // let items=[];
            // this.state.list.map((item,index)=>{
            //     items.push({url:item.imgUrl})
            // })
            // this.props.navigation.navigate('BigImage',{data:items})
            let items=[];
            this.state.oldllist.map((item,index)=>{
                items.push({source:{uri:item.imgUrl}})

            })
            //alert(JSON.stringify(result));
            this.props.navigation.navigate('CeShiImage',{data:items})
        }

    }
     imageset(){
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
                     //alert(JSON.stringify(result))
                    if(result.status==1){
                        this.setState({
                            imgpng:result.url,
                            addimg:result.url,
                        })
                        // alert(JSON.stringify(this.state.ceshilist))
                        postFetch(API.DianPuReset,{
                            logoUrl:result.url},(result)=>{
                            // alert(JSON.stringify(result))
                            if(result.status==1){
                                // alert('成功')
                                this._toasts.show('更改成功')
                                this.setState({
                                    tup:true
                                })
                            }
                        })
                    }
                }).catch((error)=>{
                    alert("网络错误:"+error)
                })
                //
            }

        })
    }

    //上传二维码图片
    up_img_erwm(){
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

                let file = {uri: source.uri, type: 'multipart/form-data', name: 'image.jpg'};
                var formData=new FormData();
                formData.append('file',file)

                alert("二维码图片上传接口建设中");
                // fetch(API.ShangChuan,{
                //     method:"POST",
                //     // body:ObjectTransform(data),
                //     body:formData,
                //     headers: {'Content-Type':'multipart/form-data',},
                // }).then((response)=>response.json()).then((result)=>{
                //     //alert(JSON.stringify(result))
                //     if(result.status==1){
                //         this.setState({
                //             imgpng:result.url,
                //             addimg:result.url,
                //         })
                //         // alert(JSON.stringify(this.state.ceshilist))
                //         postFetch(API.DianPuReset,{
                //             logoUrl:result.url},(result)=>{
                //             // alert(JSON.stringify(result))
                //             if(result.status==1){
                //                 // alert('成功')
                //                 this._toasts.show('更改成功')
                //                 this.setState({
                //                     tup:true
                //                 })
                //             }
                //         })
                //     }
                // }).catch((error)=>{
                //     alert("网络错误:"+error)
                // });
            }

        })
    }
   // handler= async(img)=>{
   //   const result=await  ImageResizer.createResizedImage(img,45,45,'PNG',80,0);
   //   return result
   //  }
    handler=(img)=>{

         // alert(JSON.stringify(img))
        let file = {uri:img, type: 'multipart/form-data', name: 'image.png'};
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
                // ImageResizer.createResizedImage(result.url,45,45,"PNG", 80,0).then((response)=>{
                //   // alert(JSON.stringify(response))
                // }).catch((err)=>{
                //   // alert(err)
                // })
                if(this.state.list.length>7){
                    this._toasts.show('最多上传8张图片')
                    this.setState({
                        animating:false
                    })
                    return
                }
                postFetch(API.DianAdd,{imgUrl:result.url},(result)=>{
                    // alert(JSON.stringify(result))
                    if(result.status==1){
                        //
                        this._toasts.show('上传成功')
                        this.setState({
                            list:this.state.list.concat(result.data),
                            dataSource:this.state.dataSource.cloneWithRows(this.state.list.concat(result.data)),
                            animating:false
                        })
                        // alert(this.state.list)
                        //alert(JSON.stringify(result))
                    }
                },(error)=>{
                    this._toasts.show(error)
                })

            }
        }).catch((error)=>{
            // alert(error)
        })
    }
    dianhuanjimg(){
        // this.imageset();
        if(this.state.isDelect==true){
            this.setState({
                isDelect:false
            })
        }
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
        // const options={
        //     imageCount:1,
        //     isCamera:true,
        //     isCrop:true,
        //     CropH:25,
        //     CropW:25,
        //     isGif:false,
        //     showCropCircle:false,
        //     showCropFrame:true,
        //     showCropGrid:false
        // }
        ImagePicker.showImagePicker(photoOptions,(res)=>{
            // alert(JSON.stringify(res))
            // if(err){
            //     return
            // }
            // var img=''
            if(res.didCancel){
                return
            }else {
                let source;  // 保存选中的图片
                source = {uri: 'data:image/jpeg;base64,' + res.data};

                if (Platform.OS === 'android') {
                    source = {uri: res.uri};
                } else {
                    source = {uri: res.uri.replace('file://', '')};
                }

                this.setState({
                    oldllist:this.state.oldllist.concat([{"imgUrl":source.uri}]),
                    animating:true
                })
          // alert(JSON.stringify(this.state.imgs))
          //   let source;  // 保存选中的图片
          //   // source = {uri: 'data:image/jpeg;base64,' + res.data};
          //
          //   if (Platform.OS === 'android') {
          //       source = { uri: res[0].uri };
          //   } else {
          //       source = { uri: res[0].uri.replace('file://','') };
          //   }
          // async()=>{
          //       const result=await  ImageResizer.createResizedImage(res[0].uri,45,45,'PNG',80,0);
          //       return result
          //   }
            ImageResizer.createResizedImage(res.uri,150,150,"PNG", 80,0).then((response)=>{
                 // this.setState({
                 //     imglujing:response.uri
                 // })
                this.handler(response.uri)
            }).catch((err)=>{
              // alert(err)
            })
            }

            // this.state.imglujing ? this.handler(this.state.imglujing):null


             // alert(JSON.stringify(this.state.imglujing))


        })
    }

}
const styles=StyleSheet.create({
    dianz:{
        width:Contants.Screen.width,
        height:Contants.Screen.height/8,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'white',
        marginTop:30
    },
    er_wei_ma:{
        width:Contants.Screen.width,
        height:46,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'white',
    },
    textu:{
     marginLeft:20
    },
    tupian:{
        width:45,
        height:45,
        marginRight:20,
        borderRadius:4
    },
    tview:{
        // flexDirection:'flex-end',
        flexDirection:'row',
         alignItems:'center'
    },
    mag:{
        marginRight:20
    },
    dianhuanjing:{
        flexDirection:'row',
        backgroundColor:'white'
    },
    con:{
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',
        height:46
    },
    consty:{
        flexWrap:'wrap',
       flexDirection:'row',
       backgroundColor:'white'
    },
    conimg:{
        // width:95,
        // height:95,
        alignItems:"center",
        justifyContent:'center',
        marginLeft:10,
        flexWrap:'wrap',
        flexDirection:'row',
        marginTop:5,
        marginBottom:5
    },
    jiav:{
        flexDirection:'row',
        // alignItems:'center'
        backgroundColor:'white',

    },
    fuwu_view:{width:Contants.Screen.width,alignItems:'center',justifyContent:'center'},
    fuwu_line: { height:1,backgroundColor:'#E5E5E5'},
    fuwu_left_view:{ height:35,borderRadius:5,borderWidth:1,
        width:Contants.Screen.width-80, borderColor:'#E5E5E5',
        marginRight:40,
        marginTop:20,
        marginBottom:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
    },
    fuwu_img_view:{
        flex:1, flexDirection:'row',justifyContent:'flex-start',alignItems:'center',
    }



})
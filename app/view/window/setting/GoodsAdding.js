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
import DashLine from '../../../common/DashLine';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import Picker from 'react-native-picker'
var FormatimeFn = require( '../../CommonPage/formatime');
var mSelectWhat = -1;
export default class GoodsAdding extends Component{
    constructor(props){
        super(props);
        this.state={
            initItem:'到店',
            initId:'1',
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
            // imgpng:'',
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
            img:require('../../../img/window/jianxia.png'),
            xuanze:false,
            guice:[],
            classifychoose:new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            animating:false,
            dateto:'1',
            datestart:'2018-02-21',
            dateend:'2018-08-02',
            timestart:'12:00',
            timeend:'18:00',
            datestart_json:[2018,2,21],
            dateend_json:[2018,8,2],
            timestart_json:[12,0],
            timeend_json:[18,0],
            isShowShuoming:false,
            shuomingChoose:new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
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
                    classifychoose:this.state.classifychoose.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
                    ,
                    //暂时借用分类数据
                    shuomingChoose:this.state.classifychoose.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
                })
            }
        },(error)=>{
            alert(error)
        })
    }
    render(){
        var contentView=null;
        if(this.state.isShowGuiGe==false){
            contentView=(<View></View>)
        }else {
            contentView=(
                <View style={{backgroundColor:"#fff"}}>
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
                    {/*<View style={styles.fanwei}>*/}
                        {/*<Text style={comstyle.text}>加送价格：</Text>*/}
                        {/*<TextInput*/}
                            {/*underlineColorAndroid='transparent'*/}
                            {/*placeholder={'单位：元'}*/}
                            {/*numberofLines={1} //限制一行*/}
                            {/*placeholderTextColor="#B2B2B2"*/}
                            {/*style={styles.input}*/}
                            {/*onChangeText={(e)=>{*/}
                                {/*this.setState({*/}
                                    {/*outprice:e,*/}
                                {/*})*/}
                            {/*}}*/}
                        {/*/>*/}
                    {/*</View>*/}
                    <View style={{ overflow: 'hidden',
                        backgroundColor:'#fff',
                        marginLeft: 20,marginRight:20}}><DashLine/></View>

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
                    {/*<View style={styles.fanwei}>*/}
                        {/*<Text style={comstyle.text}>每日库存：</Text>*/}
                        {/*<TextInput*/}
                            {/*underlineColorAndroid='transparent'*/}
                            {/*placeholder={'每日自动重置的库存数量'}*/}
                            {/*numberofLines={1} //限制一行*/}
                            {/*style={styles.input}*/}
                            {/*placeholderTextColor="#B2B2B2"*/}
                            {/*onChangeText={(e)=>{*/}
                                {/*this.setState({*/}
                                    {/*kucun:e,*/}
                                {/*})*/}
                            {/*}}*/}
                        {/*/>*/}
                    {/*</View>*/}
                </View>
            )
        }

        var daodian=null
        if(this.state.initId==='0'){
            daodian=(<View>
                <View style={styles.fanwei}>
                    <Text style={comstyle.text}>外送价格：</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder={'单位：元'}
                        numberofLines={1} //限制一行
                        placeholderTextColor="#B2B2B2"
                        style={styles.input}
                        onChangeText={(e)=>{
                            this.setState({
                                goodswaisongprice:e,
                            })
                        }}
                    />
                </View>
                <View style={comstyle.heng}/>
            </View>)
        }else {
            daodian=(<View>
                <View style={styles.fanwei}>
                    <Text style={comstyle.text}>到店价格：</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder={'单位：元'}
                        numberofLines={1} //限制一行
                        placeholderTextColor="#B2B2B2"
                        style={styles.input}
                        onChangeText={(e)=>{
                            this.setState({
                                goodsdaodianprice:e,
                            })
                        }}
                    />
                </View>
                <View style={comstyle.heng}/>
            </View>)
        }
        // alert(JSON.stringify(this.state.ceshiguigelist))
        return(<ScrollView style={[comstyle.contain,{backgroundColor:"#f9f9f9"}]}>

            <View style={[comstyle.item,{marginTop:20}]}>
                <View style={comstyle.rightview}>
                 <Image source={require('../../../img/window/shangjia.png')} style={comstyle.maleft}/>
              <Text style={[comstyle.mesg,comstyle.text]}>是否上架</Text>
                </View>
                <TouchableOpacity style={{marginRight:20}} onPress={()=>{
                    this.setState({
                        falseSwitchIsOn:!this.state.falseSwitchIsOn
                    })
                }}>
                <Image  source={ this.state.falseSwitchIsOn? require('../../../img/goods/switchon.png'):require('../../../img/goods/switchoff.png')}/>
                </TouchableOpacity>
              {/*<Switch onValueChange={(value)=>this.setState({falseSwitchIsOn:value})}*/}
                      {/*style={{marginRight:20}}*/}
                      {/*value={this.state.falseSwitchIsOn}*/}
                      {/*onTintColor='#FF305E'*/}
                  {/*// // tintColor='blue'*/}
                      {/*thumbTintColor='white'*/}
              {/*/>*/}
            </View>
            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/window/tianjiafen.png')} style={comstyle.maleft}/>
                <Text style={[comstyle.mesg,comstyle.text]}>选择分类</Text>
                </View>
                <View style={styles.she}>
                    <Text style={[comstyle.textright,comstyle.text]}>{this.state.xuanze==true?this.state.item:'未设置'}</Text>
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

                <View style={{flexDirection:'row', flex:1}}>
                    <TouchableOpacity
                        style={{flexDirection:'row',
                            alignItems:'center',flex:1,height:30,borderWidth:1,
                            borderRadius:5, borderColor:'#E5E5E5',
                            paddingLeft:10,marginRight:10}}
                        onPress={()=>{ this.setState({initId:'0',initItem:'外送'}) } }>
                        <Image source={this.state.initId==='0'?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')} />
                        <Text style={{marginLeft:20}} value='0'>外送</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{flexDirection:'row',
                            alignItems:'center',flex:1,height:30,borderWidth:1,
                            borderRadius:5, borderColor:'#E5E5E5',
                            paddingLeft:10,marginRight:10}}
                        onPress={()=>{
                        this.setState({initId:'1',initItem:'到店'}) }
                    }>
                        <Image source={this.state.initId==='1'?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')} />
                        <Text style={{marginLeft:20}} value='1'>到店</Text>
                    </TouchableOpacity>
                </View>



                {/*<RadioModal*/}
                {/*selectedValue={this.state.initId}*/}
                {/*onValueChange={(id,item)=>this.setState({initId:id,initItem:item})}*/}
                {/*style={{flexDirection:'row',flex:1,borderWidth:1,borderWidth:5, borderColor:'#E5E5E5'}}*/}
                {/*seledImg={require('../../../img/window/goupress.png')}*/}
                {/*selnoneImg={require('../../../img/window/gouunpress.png')}*/}
                {/*selImg={require('../../../img/window/gouunpress.png')}*/}
                {/*>*/}
                    {/*<View style={{borderWidth:1,borderWidth:5, borderColor:'#E5E5E5'}}>*/}
                    {/*<Text value='0'>外送</Text>*/}
                    {/*</View>*/}

                    {/*<View style={{borderWidth:1,borderWidth:5, borderColor:'#E5E5E5'}}>*/}
                    {/*<Text value='1'>到店</Text>*/}
                    {/*</View>*/}
                {/*</RadioModal>*/}



            </View>

            <View style={comstyle.heng}/>
            <View style={styles.fanwei}>
                <Text style={[comstyle.text,{marginLeft:20}]}>商品名称：</Text>

                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={'支持中英文名称'}
                    numberofLines={1} //限制一行
                    placeholderTextColor="#B2B2B2"
                    style={styles.input_good}
                    onChangeText={(e)=>{
                        this.setState({
                            goodsname:e,
                        })
                    }}
                />
            </View>

            <View style={comstyle.heng}/>
            <View style={styles.zhu_miaosu_view}>
            <View style={[styles.zhu_miaosu]}>
                <TextInput style={{fontSize:13,paddingLeft:10}}
                    placeholder={'商品的文字描述'}
                    multiline={true} //代表可以输入多行
                    underlineColorAndroid='transparent'
                    placeholderTextColor="#B2B2B2"
                    onChangeText={(e)=>{
                        this.setState({
                            wenzidescription:e,
                        })
                    }}
                />
            </View>
            </View>


            <View style={comstyle.heng}/>
            <View style={styles.imglist}>
                <TouchableOpacity style={styles.picker} onPress={this.selectImage.bind(this)}>
                    {/*image的listview*/}
                    <Image source={require('../../../img/window/jia.png')} style={{marginLeft:20}}/>
                </TouchableOpacity>
                {/*<ScrollView style={{horizontal:true,flexDirection:'row'}}>*/}
                <View style={{flexWrap:'wrap',flexDirection:'row'}}>
                    <ListView
                        dataSource={this.state.dataSourceImage}
                        renderRow={this._renderRowImage}
                        enableEmptySections={true}
                        // style={{flexWrap:'wrap',flexDirection:'row'}}
                        // pageSize={5}
                        horizontal={true}

                        style={styles.listviews}
                    />
                    {/*<

                </ScrollView>*/}
                </View>
            </View>

            {/*listview*/}
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                enableEmptySections={true}
            />
            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/window/guige.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>添加规格</Text>
                </View>
                <View style={styles.she}>
                    {/*对勾图片*/}
                    {/*<TouchableOpacity onPress={()=>{*/}
                        {/*if(this.state.changeName===''){*/}
                            {/*this._toast.show('规格名称不能为空')*/}
                            {/*return*/}
                        {/*}*/}
                        {/*this.setState({*/}
                            {/*guilist:this.state.guilist.concat(this.state.changeName),*/}
                            {/*// guice:this.state.guice.concat([{"spec":this.state.changeName,"priceOut":this.state.outprice,"priceIn":this.state.homeprice,"stock":this.state.kucun}]),*/}
                            {/*guice:[{"spec":this.state.changeName,"priceOut":this.state.outprice,"priceIn":this.state.homeprice,"stock":this.state.kucun}],*/}
                            {/*dataSource:this.state.dataSource.cloneWithRows(this.state.guilist.concat(this.state.changeName)),*/}
                            {/*ceshiguigelist:this.state.ceshiguigelist.concat([{"spec":this.state.changeName,"priceOut":this.state.outprice,"priceIn":this.state.homeprice,"stock":this.state.kucun}]),*/}
                            {/*ceshiguige:this.state.ceshiguige.cloneWithRows(this.state.ceshiguigelist.concat([{"spec":this.state.changeName,"priceOut":this.state.outprice,"priceIn":this.state.homeprice,"stock":this.state.kucun}]))*/}
                        {/*})*/}
                        {/*// alert(JSON.stringify(this.state.ceshiguigelist))*/}
                    {/*}}>*/}
                        {/*<Image source={require('../../../img/window/press.png')} style={comstyle.textright}/>*/}
                    {/*</TouchableOpacity>*/}


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
                        <Image source={require('../../../img/window/write.png')} />
                        {/*<Image source={this.state.img}/>*/}
                    </TouchableOpacity>


                </View>

            </View>
            <View style={comstyle.heng}/>
            {contentView}



            <View style={[comstyle.heng,{marginTop:10}]}/>
            {/*<View style={styles.fanwei}>*/}
                {/*<Text style={comstyle.text}>外送价格：</Text>*/}
                {/*<TextInput*/}
                    {/*underlineColorAndroid='transparent'*/}
                    {/*placeholder={'单位：元'}*/}
                    {/*numberofLines={1} //限制一行*/}
                    {/*placeholderTextColor="#B2B2B2"*/}
                    {/*style={styles.input}*/}
                    {/*onChangeText={(e)=>{*/}
                        {/*this.setState({*/}
                            {/*goodswaisongprice:e,*/}
                        {/*})*/}
                    {/*}}*/}
                {/*/>*/}
            {/*</View>*/}
            {/*<View style={comstyle.heng}/>*/}
                {/*<View style={styles.fanwei}>*/}
                    {/*<Text style={comstyle.text}>到店价格：</Text>*/}
                    {/*<TextInput*/}
                        {/*underlineColorAndroid='transparent'*/}
                        {/*placeholder={'单位：元'}*/}
                        {/*numberofLines={1} //限制一行*/}
                        {/*placeholderTextColor="#B2B2B2"*/}
                        {/*style={styles.input}*/}
                        {/*onChangeText={(e)=>{*/}
                            {/*this.setState({*/}
                                {/*goodsdaodianprice:e,*/}
                            {/*})*/}
                        {/*}}*/}
                    {/*/>*/}
                {/*</View>*/}
            {/*<View style={comstyle.heng}/>*/}
            {/*{daodian}*/}
            <View style={styles.fanwei}>
                <Image source={require('../../../img/dian/mrkc.png')} style={comstyle.maleft}/>
                <Text style={comstyle.text}>每日库存：</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={'每日自动重置的库存数量'}
                    numberofLines={1} //限制一行
                    placeholderTextColor="#B2B2B2"
                    style={[styles.input,{marginRight:10}]}
                    onChangeText={(e)=>{
                        this.setState({
                            everykucun:e,
                        })
                    }}
                />
            </View>

            <View style={comstyle.heng}/>

            <View style={{backgroundColor:"#fff"}}>
                <View style={styles.fanwei}>
                    <Text style={[comstyle.maleft,comstyle.text,{marginRight:20,width:65}]}>有 效 期:</Text>
                    <View style={{flexDirection:'row', flex:1}}>
                        <TouchableOpacity
                            style={{flexDirection:'row',
                                alignItems:'center',flex:1,height:30,borderWidth:1,
                                borderRadius:5, borderColor:'#E5E5E5',
                                paddingLeft:5,marginRight:5}}
                                onPress={()=>{ this.selectdate(1)} }
                        >
                            <Image source={require('../../../img/goods/date.png')} />
                            <Text style={{marginLeft:5}} value='0'>
                                {this.state.datestart===''?'开始日期':this.state.datestart} </Text>
                        </TouchableOpacity>
                        <View style={{flexDirection:'row',width:20,alignItems:'center',height:30}}><Text>至</Text></View>
                        <TouchableOpacity
                            style={{flexDirection:'row',
                                alignItems:'center',flex:1,height:30,borderWidth:1,
                                borderRadius:5, borderColor:'#E5E5E5',
                                paddingLeft:5,marginRight:5}}
                             onPress={()=>{ this.selectdate(2)}}
                        >
                            <Image source={require('../../../img/goods/date.png')} />
                            <Text style={{marginLeft:5}} value='1'>
                                {this.state.dateend===''?'结束日期':this.state.dateend}  </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ overflow: 'hidden',
                backgroundColor:'#fff',
                marginLeft: 20,marginRight:20}}><DashLine/></View>

                <View style={styles.fanwei}>
                    <Text style={[comstyle.maleft,{marginRight:20,width:65},comstyle.text]}>折扣时段:</Text>
                    <View style={{flexDirection:'row', flex:1}}>
                        <TouchableOpacity
                            style={{flexDirection:'row',
                                alignItems:'center',flex:1,height:30,borderWidth:1,
                                borderRadius:5, borderColor:'#E5E5E5',
                                paddingLeft:5,marginRight:5}}
                                onPress={()=>{ this.selecttime(1)} }
                        >
                            <Image source={require('../../../img/goods/clock.png')} />
                            <Text style={{marginLeft:5}} value='0'>
                                {this.state.timestart===''?'开始时间':this.state.timestart}
                            </Text>
                        </TouchableOpacity>
                        <View style={{flexDirection:'row',width:20,alignItems:'center',height:30}}><Text>至</Text></View>
                        <TouchableOpacity
                            style={{flexDirection:'row',
                                alignItems:'center',flex:1,height:30,borderWidth:1,
                                borderRadius:5, borderColor:'#E5E5E5',
                                paddingLeft:5,marginRight:5}}
                                onPress={()=>{ this.selecttime(2)} }
                        >
                            <Image source={require('../../../img/goods/clock.png')} />
                            <Text style={{marginLeft:5}} value='1'>
                                {this.state.timeend===''?'结束时间':this.state.timeend}
                                </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={[comstyle.item,{marginTop:10}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../../img/goods/cpsm.png')} style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,comstyle.text]}>产品说明</Text>
                </View>
                <View style={styles.she}>
                    <TouchableOpacity  onPress={()=>{ this.setState({ isShowShuoming:true }) }}>
                        <Image source={require('../../../img/window/write.png')} />
                        {/*<Image source={this.state.img}/>*/}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.fanwei}>
            <View style={{flexDirection:'row', flex:1}}>
                <TouchableOpacity
                    style={{flexDirection:'row',
                        alignItems:'center', height:30,borderWidth:1,
                        borderRadius:5, borderColor:'#E5E5E5',
                        paddingLeft:5,paddingRight:5, marginLeft:10}}
                  >
                      <Text >进店说明</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={{flexDirection:'row',
                        alignItems:'center', height:30,borderWidth:1,
                        borderRadius:5, borderColor:'#E5E5E5',
                        paddingLeft:5,paddingRight:5,marginLeft:10}}
                >
                    <Text >产品须知</Text>
                </TouchableOpacity>
            </View>
            </View>


            {/*<View style={styles.fanwei}>*/}
                {/*<Text style={comstyle.text}>制餐时间：</Text>*/}
                {/*<TextInput*/}
                    {/*underlineColorAndroid='transparent'*/}
                    {/*placeholder={'单位分钟，必须整数'}*/}
                    {/*numberofLines={1} //限制一行*/}
                    {/*placeholderTextColor="#B2B2B2"*/}
                    {/*style={styles.input}*/}
                    {/*onChangeText={(e)=>{*/}
                        {/*this.setState({*/}
                            {/*maketime:e,*/}
                        {/*})*/}
                    {/*}}*/}
                {/*/>*/}
            {/*</View>*/}



            {/*<View style={styles.tijiao}>*/}
                {/*<Text onPress={this.sure.bind(this)}>确认提交</Text>*/}
            {/*</View>*/}
            <TouchableOpacity style={[styles.tijiaos]} onPress={this.sure.bind(this)}>
                {/*<Image source={require('../../../img/window/tijiao.png')} style={styles.tijiaos}>*/}
                  {/**/}
                {/*</Image>  */}
                <Text style={[comstyle.text,{color:'red'}]}>确认提交</Text>
            </TouchableOpacity>

            {/*modal弹窗 -----分类选择-------*/}
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
                    <View style={comstyle.heng}/>
                    <ListView
                        dataSource={this.state.classifychoose}
                        renderRow={this._renderRowClassify}
                        style={{height:300}}
                    />
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
                                isShowModal:false,
                                xuanze:true
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



            {/*modal弹窗 -----产品说明-------*/}
            <Modal
                isVisible={this.state.isShowShuoming}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShowShuoming: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={{backgroundColor:'white',borderWidth:1,borderRadius:5,borderColor:"#E7E7E7"}}>
                    <Text style={{margin:10,color:'#282828',fontSize:14}}>产品说明</Text>
                    <View style={comstyle.heng}/>
                    <ListView
                        dataSource={this.state.shuomingChoose}
                        renderRow={this._renderRowShuoming}
                    />
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5',marginTop:15}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({
                                isShowShuoming:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity  onPress={()=>{
                            alert("接口建设中");
                            //this.setState({ isShowShuoming:false  })

                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text style={comstyle.text}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </ScrollView>)
      // alert(JSON.stringify(this.state.ceshiguigelist))
    }



    _renderRowShuoming=(rowData,sectionID,rowID)=>{
        return(<View style={{flexDirection:'column',}}>
            <View style={[{marginTop:15,marginBottom:15,height:2,backgroundColor:'#E5E5E5'}]}/>
            <TouchableOpacity style={{flexDirection:'row',height:35,borderColor:'#E5E5E5',borderRadius:4,borderWidth:1,
                                        justifyContent:'space-between',alignItems:'center',
                                        marginLeft:20,marginRight:20
                                    }}
                              //onPress={this.selectRowClassify.bind(this,rowData,rowID)}
            >
                    <Text style={[comstyle.text,{marginLeft:12}]}>
                        {'产品说明'}
                        {/*{rowData.groupName} */}
                    </Text>
                <Image source={rowData.isCheck==true?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')} style={{marginRight:12}}/>
            </TouchableOpacity>
        </View>)
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
            this.LetAll[index]['isCheck']=false;
            mSelectWhat=-1
        }else {
            this.LetAll.map((o,i)=>{
                if(i==index){
                    this.LetAll[i]['isCheck']=true
                    mSelectWhat=i;
                    if(this.LetAll[i]['isCheck']==true){
                        this.setState({
                            language:item.id,
                            item:item.groupName
                        })
                        // alert(item.groupName)
                    }
                }else {
                    this.LetAll[i]['isCheck']=false
                }
            })
        }

        this.setState({

            classifychoose:this.state.classifychoose.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
        })
    }

     _renderRow=(rowData,sectionID,rowID)=>{
        return(<View style={{justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={comstyle.maleft}>{rowData}</Text>
        </View>)
     }
    _renderRowImage=(rowData)=>{
        // alert(rowData)
        return(<View style={{flexDirection:'row',flexWrap:'wrap'}}>
            <Image source={{uri:rowData}} style={styles.rowimage}/>
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
            allowsEditing:true,
            maxWidth:200,
            maxHeight:200,
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
                // this.setState({
                //     // imgpng:result.url,
                //     // avatarSource:source.uri,
                //     imagelist:this.state.imagelist.concat(source.uri),
                //     dataSourceImage:this.state.dataSourceImage.cloneWithRows(this.state.imagelist.concat(source.uri)),
                //     ceshilist:this.state.ceshilist.concat([{"imgUrl":source.uri}]),
                //     typeceshi:this.state.typeceshi.cloneWithRows(this.state.ceshilist.concat([{"imgUrl":source.uri}])),
                //     animating:true
                // })
                ImageResizer.createResizedImage(source.uri,115,115,"PNG", 80,0).then((response)=>{
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
                // alert(JSON.stringify(result))
                this.setState({
                    // imgpng:result.url,
                    // avatarSource:result.url,
                    imagelist:this.state.imagelist.concat(result.url),
                    dataSourceImage:this.state.dataSourceImage.cloneWithRows(this.state.imagelist.concat(result.url)),
                    // ceshilist:this.state.ceshilist.concat([{"imgUrl":result.url}]),
                    // typeceshi:this.state.typeceshi.cloneWithRows(this.state.ceshilist.concat([{"imgUrl":result.url}])),
                    animating:false
                })
                // alert(JSON.stringify(this.state.ceshilist))
                // this.setState({
                //
                // })
            }
        }).catch((error)=>{
            alert(error)
        })
    }
    sure(){//确认提交
        // alert(JSON.stringify(this.state.ceshiguigelist))
        if(this.state.goodsname.length==0){
            this._toast.show('商品名称不能为空');
            return
        }
        if(this.state.initId=='0'){
            if(this.state.goodswaisongprice.length==0){
                this._toast.show('外送价格不能为空');
                return
            }
        }else if(this.state.goodsdaodianprice.length==0){
                this._toast.show('到店价格不能为空');
                return
            }
        if(this.state.everykucun.length==0){
            this._toast.show('每日库存不能为空');
            return
        }
        if(this.state.language=="0"){
            this._toast.show('选择分类不能为空');
            return
        }
      postFetch(API.GoodsAddings,{groupIds:[this.state.language],foodInfo:{name:this.state.goodsname,priceIn:this.state.goodsdaodianprice,
          priceOut:this.state.goodswaisongprice,makeTime:this.state.maketime,type:this.state.initId,isNew:'1',isFeatured:'0',isRecoverStock:this.state.everykucun,
          boxNum:'1',boxPrice:'1',unit:'份',
          description:this.state.wenzidescription,status:this.state.falseSwitchIsOn==false?'0':'1'
      }, foodImageDos:this.state.ceshilist,foodSkuList:this.state.ceshiguigelist

      },(result)=>{
          // alert(JSON.stringify(result))
          if(result.status==1){
             this._toast.show(result.data)
          }
      },(error)=>{
          alert(error)
      })

    }


    //日期选择
    selectdate(t){
        let that = this
        let years = [],
            months = [],
            days = [];

        for(let i=1;i<119;i++){
            years.push(i+1900);
        }
        for(let i=1;i<13;i++){
            months.push(i);
        }
        for(let i=1;i<32;i++){
            days.push(i);
        }
        let pickerData = [years, months, days];
        let date = new Date();
        let selectedValue = (t==1 ? this.state.datestart_json:this.state.dateend_json);
        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: pickedValue => { },
            onPickerCancel:pickedValue => { },
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
                }
                pickedValue = targetValue;
                Picker.select(targetValue);

                let d =  FormatimeFn.timestampConvertMin(targetValue);

                if(t==1)
                {
                    that.setState({
                        datestart: d,
                        datestart_json:targetValue
                    });
                }
                else
                {
                    that.setState({
                        dateend: d,
                        dateend_json:targetValue
                    });

                }
            }

        });
        Picker.show();

    }

    //日期选择
    selecttime(t){
        let that = this
        let hours = [], minutes = [];

        for(let i=1;i<25;i++){
            hours.push(i);
        }
        for(let i=0;i<60;i++){
            minutes.push(i);
        }

        let pickerData = [hours, minutes];
        let date = new Date();
        let selectedValue = (t==1 ? this.state.timestart_json:this.state.timeend_json);

        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: pickedValue => {
                let d =  FormatimeFn.zhu_GetTime(pickedValue);
                if(t==1)
                {
                    that.setState({
                        timestart: d,
                        timestart_json:pickedValue
                    });
                }
                else
                {
                    that.setState({
                        timeend: d,
                        timeend_json:pickedValue
                    });

                }
            },
            onPickerCancel:pickedValue => { },
            onPickerSelect: pickedValue => { }

        });
        Picker.show();
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
         //marginTop:10,
         // width:Contants.screen.width
        height:60
    },
    input:{
     width:Contants.Screen.width/2+50,
        color:'black',
        borderColor:'#E7E7E7',
        borderWidth:1,
        height:40,
        borderRadius:5,
        paddingLeft:10

    },

    input_good:{
        flex:1,
        //width:Contants.Screen.width/2+50,
        color:'black',
        borderColor:'#E7E7E7',
        borderWidth:1,
        height:40,
        borderRadius:5,
        paddingLeft:10,
        marginRight:10,
        marginLeft:10

    },
    miaosu:{
        borderColor:'#E5E5E5',
        borderWidth:1,
        width:Contants.Screen.width-40,
        marginTop:10,
        height:70,
        marginLeft:20,
        borderRadius:4,
        marginRight:20,
        backgroundColor:'white',
        marginBottom:10
    },
    zhu_miaosu:{
        flex:1,
        borderColor:'#E5E5E5',
        borderWidth:1,
        width:Contants.Screen.width-40,
        marginTop:10,
        height:70,
        marginLeft:20,
        borderRadius:4,
        marginRight:10,
        backgroundColor:'white',
        marginBottom:10
    },

    zhu_miaosu_view:{
        justifyContent:'space-around',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
    },
    zhu_input:{paddingLeft:10},

    picker:{
     marginTop:10,
        marginBottom:10
        // borderColor:'#E7E7E7',
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
        borderColor:'#E5E5E5',
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
       backgroundColor:'white',

    },
    listviews:{

    },
    tijiaos:{
      justifyContent:"center",
      alignItems:'center',
      borderColor:"red",
      borderWidth:1,
        borderRadius:5,
        marginLeft:50,
        marginRight:50,
        marginTop:20,
        marginBottom:20,
        paddingTop:10,
        paddingBottom:10

    },
    rowimage:{
        width:60,height:60,marginTop:10,marginLeft:10,marginRight:10,borderRadius:5,alignSelf:'center'
    },
    heng_xuxian:{
        flex:1,
        height:1,
        borderStyle:'dashed',
        borderTopWidth:2,
        borderTopColor:'#E5E5E5',
        marginLeft:20,
        marginRight:20,
    },
})
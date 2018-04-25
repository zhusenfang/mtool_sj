import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    TextInput,
    ListView,
    BackHandler,
    Platform
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants'
import Toast from 'react-native-easy-toast';
import *as wechat from 'react-native-wechat'
// import {CheckBox} from "native-base";
import CheckBox from '../../CommonPage/GGCheckView'
import Alipay from 'react-native-yunpeng-alipay';
import Modal from 'react-native-modal'
var mSelectWhat = -1;
export default class TiXianView extends Component{
    constructor(props){
        super(props)
        this.state={
            changePrice:'',
            isCharge:false,
            // payType:1,
            kaname:'',
            id:'',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            bankname:'',
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

    componentDidMount (){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
       this.postdata()

    }
    postdata(){
        postFetch(API.ZhuanZhang,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status===1){
                this.setState({
                    kaname:result.data.bankName,
                    id:result.data.id
                })
            }
        },(error)=>{

        })
        postFetch(API.SearchAllCard,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status===1){
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
            }
        })

    }
    render(){
        return(<View style={comstyle.con}>

          <TouchableOpacity style={styles.sty} onPress={this.daoz.bind(this)}>
            <Text style={[styles.text,{marginTop:25,marginLeft:20}]}>到账银行卡</Text>
              <View style={styles.guo}>
                  <Text style={styles.text}>{this.state.bankname===''?this.state.kaname:this.state.bankname}</Text>
                  <Text style={styles.tab}>提现手续费率0.1%</Text>
              </View>
          </TouchableOpacity>
            <View style={comstyle.heng}/>
            <View style={styles.tix}>
                <View style={styles.titext}>
                <Text style={styles.tixian}>提现金额</Text>
                </View>
                <View style={{flexDirection:'column',}}>
                    <View style={{flexDirection:'row',height:60}}>
                        <View style={{justifyContent:'center'}}>
                            <Image source={require('../../../img/shezhi/renmb.png')} style={[comstyle.maleft]}/>
                        </View>
                        <TextInput style={styles.input}
                                   onChangeText={(e)=>{
                                       this.setState({
                                           changePrice:e,
                                       })}}
                                   underlineColorAndroid='transparent'
                        />
                    </View>
                    <View style={styles.heng}/>
                    <Text style={[styles.tab,{marginLeft:20,marginBottom:26}]}>额外扣除￥0.10(服务费)</Text>
                </View>
            </View>
            <View style={comstyle.heng}/>

            <TouchableOpacity style={styles.chong} onPress={this.tixian.bind(this)}>
                <Image
                    source={require('../../../img/shezhi/chongzhi.png')}
                    style={styles.chong}
                >
                    <Text style={styles.zhi}>提现</Text>
                </Image>
            </TouchableOpacity>
            <View style={styles.daoz}>
                <Text style={styles.tab}>T+3个工作日到账</Text>
            </View>
            <Modal
                isVisible={this.state.isCharge}
                hideOnBack={true}
                transparent={true}
                // style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isCharge: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={styles.yinhang}>
                    <Text style={styles.daozhang}>选择到账银行卡</Text>
                    {/*<View style={styles.you}>*/}
                        {/*<Text style={[comstyle.text,comstyle.maleft]}>{this.state.kaname}</Text>*/}
                        {/*<CheckBox onClick={()=>this.selectitem(1)}*/}
                                  {/*isChecked={this.state.payType===1}*/}
                                  {/*style={comstyle.textright}*/}
                        {/*/>*/}
                    {/*</View>*/}

                    <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem}
                    />
                    <TouchableOpacity style={styles.you} onPress={()=>{this.selectitem()}}>
                        <Text style={[comstyle.text,comstyle.maleft]}>使用新卡提现</Text>
                        {/*<CheckBox onClick={()=>this.selectitem(2)}*/}
                                  {/*isChecked={this.state.payType===2}*/}
                                  {/*style={comstyle.textright}*/}
                        {/*/>*/}
                    </TouchableOpacity>
                </View>
            </Modal>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </View>)
    }
    renderItem=(rowData,sectionID,rowID)=>{
        return(<TouchableOpacity style={styles.listview} onPress={()=>{this._selectRow(rowData,rowID)}}>
             <Text style={[comstyle.text,comstyle.maleft]}>{rowData.bankName}</Text>
            {/*<TouchableOpacity >*/}
             {/*<Image source={rowData.isCheck===true?require('../../../img/window/redsqree.png'):require('../../../img/window/huisqree.png')} style={comstyle.textright}/>*/}
            {/*</TouchableOpacity>*/}
        </TouchableOpacity>)
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

                    if(this.LetAll[i]['isCheck']==true){
                        this.setState({
                          bankname:item.bankName,
                          isCharge:false
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
    selectitem(){
        // this.setState({
        //     payType:index
        // })
        // if(index===2){
            this.setState({
                isCharge:false
            })
            this.props.navigation.navigate('AddNewCard',{callbacks:(data)=>{
                // alert(data)
                this.postdata()
            }})
        // }
    }
    daoz(){
        this.setState({
            isCharge:true
        })
    }
    tixian(){
        if(this.state.changePrice<50){
            this._toast.show('提现金额必须大于50元')
            return
        }
        postFetch(API.TiXianView,{bankId:this.state.id,withdrawalMoney:this.state.changePrice},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status===1){
                this._toast.show('提现成功，请耐心等待')
                this.setState({
                    changePrice:''
                })
            }else {
                this._toast.show(result.msg)
            }
        })
    }

}
const styles=StyleSheet.create({
    sty:{
       flexDirection:'row',
        backgroundColor:'white',
        marginTop:20,
        height:100
    },
    guo:{
        flexDirection:'column',
        marginLeft:20,
        marginTop:25
    },
    text:{
        fontSize:14,
        color:'#2D2D2D'
    },
    tab:{
        fontSize:12,
        color:'#B2B2B2',
        marginTop:10
    },
    tix:{
        flexDirection:'column',
        backgroundColor:'white',
    },
    jin:{
        flexDirection:'row',
    },
    input:{
        width:Contants.Screen.width-40,
        alignSelf:'center',
        fontSize:36,
        color:'#FF305E'
        // marginBottom:20
    },
    tixian:{
        fontSize:14,
        color:'#2D2D2D',
        marginLeft:20,
        marginTop:25
    },
    titext:{
        justifyContent:'center',
        marginTop:20
    },
    heng:{
        // width:Contants.Screen.width,
        height:1,
        backgroundColor:"#E5E5E5",
        marginBottom:0,
        marginLeft:20,
        marginRight:20
    },
    chong:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    zhi:{
        color:'white',
    },
    daoz:{
        justifyContent:'center',
        alignItems:'center',
    },
    yinhang:{
        flexDirection:'column',
        // height:130,
        // justifyContent:'flex-end',
        backgroundColor:'white',
        borderRadius:5
    },
    daozhang:{
         marginTop:20,
        marginLeft:20,
        fontSize:15,
        color:'#282828'
    },
    you:{
        justifyContent:'space-between',
        height:46,
        alignItems:'center',
        flexDirection:'row',
    },
    listview:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:40
    }

})
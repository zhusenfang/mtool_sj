import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ListView
} from 'react-native';
import Contants from '../../common/Contants';
import CheckBox from '../CommonPage/GGCheckView'
import {API,postFetch} from '../../common/GConst'
import Toast from "react-native-easy-toast";
export default class SearchDetail extends Component {
    constructor(props){
        super(props)
        this.state={
         count:0,//合计
            buymoney:0,//配送费
            one:'',//商品名称
           name:"",//客户
            phone:'',
            adress:'',
           //listview的
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
         type:0
        }
     }
    componentDidMount(){
        const s=this.props.navigation.state.params.data
        // alert(JSON.stringify(s))
        postFetch(API.SearchDetail,{orderDining:{id:s}},(result)=>{
            // alert(JSON.stringify(result));
            if(result.status==1){
            this.setState({
                 count:result.data.totalPrice,
                dataSource:this.state.dataSource.cloneWithRows(result.data.orderDetailList),
                name:result.data.consignee,
                phone:result.data.consigneePhone,
                adress:result.data.consigneeAddr,
                buymoney:result.data.deliverFee,
                type:result.data.diningType
            })
            }
        },(error)=>{
            alert(error)
        })
    }

render(){


    // alert(s)

    return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
        <View style={styles.dayin}>
     <Text style={styles.text}>
        打印订单
    </Text>
        </View>
        <View style={styles.heng}/>
    <Item
        leftTitle={this.state.type==0?"外送-立即配送":"到店"}

    >

    </Item>
        <View style={styles.heng}/>
        <Item
             leftTitle={"合计: "+this.state.count}

        >

        </Item>
        <View style={styles.heng}/>
        <Item
            leftTitle="配送费"
            rightTitle={this.state.buymoney+'元'}
        >

        </Item>
        <View style={styles.heng}/>
        {/*<Item*/}
            {/*leftTitle="蓝莓蓝果茶"*/}
            {/*rightTitle='>'*/}
        {/*>*/}

        {/*</Item>*/}
        {/*<View style={styles.heng}/>*/}
        {/*<Item*/}
            {/*leftTitle="收  藏"*/}
            {/*rightTitle='>'*/}
        {/*>*/}

        {/*</Item>*/}
        <ListView
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
        />
        <View style={styles.vies}>

            <View style={styles.heng}/>
                <Text style={styles.mesg}>用户信息</Text>
                <View style={styles.heng}/>
                <View style={styles.kehu}>
                    <Text>客户： {this.state.name}</Text>
                    <Text>电话： {this.state.phone}</Text>
                    <Text>地址： {this.state.adress}</Text>
                </View>

        </View>
    </View>)
}

    _renderRow=(rowData)=>{
    return(<View style={{justifyContent:'space-between',flexDirection:'row',margin:10}}>
        <Text>{rowData.goodsName}</Text>
        <Text>{"x"+rowData.quantity}{"  /  "+rowData.price+'元'}</Text>
    </View>)
    }
}
const styles=StyleSheet.create({
    contain:{
        flex:1,
        width:Contants.Screen.width,

    },
    dayin:{
        justifyContent:'flex-end',
        width:Contants.Screen.width,
        height:40
    },
    text:{
        fontSize:16,
        alignItems:'flex-end'
    },
    heng:{
        width:Contants.Screen.width,
        height:1,
        backgroundColor:"#C0C0C0"
    },
    container:{
        width:Contants.Screen.width,
        backgroundColor:"white",
        height:45,
        marginTop:1,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    rightView:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        marginRight:20,
    },

    leftView:{
        marginLeft:20,
        fontSize:15,
        color:"#1c1c1c"
    },
    kehu:{
        flexDirection:'column',

    },
    list:{
        width:Contants.Screen.width,
        height:200,
        backgroundColor:"white"
    },
    vies:{
        width:Contants.Screen.width,
        height:300,
        backgroundColor:'white',
        marginTop:10
    },
    mesg:{
        marginBottom:10,
        marginLeft:10
    }
})
var Item=React.createClass({
    render(){
        return(
            <View>

                <View style={styles.container}>

                    <Text style={styles.leftView}>{this.props.leftTitle}</Text>

                    <View style={styles.rightView}>

                        <Text style={{color: "#a8a8a8", fontSize: 15}}>{this.props.rightTitle}</Text>

                    </View>

                </View>

            </View>

        )
    }
})
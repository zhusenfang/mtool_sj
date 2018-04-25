import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Contants from '../../common/Contants';
import SearchViews from '../CommonPage/ComonModal'
var navigation=null
export default class SearchView extends Component {
    constructor(props){
        super(props)
        navigation=this.props.navigation
    }
    render() {
        return (
           <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
               {/*<SearchViews navigation={navigation}/>*/}
               <View style={styles.dingdan}>
                   <Text>订  单</Text>
               </View>
               <View style={styles.heng}/>
             <Item
                 action={this.changeAction.bind(this,1)}
             leftTitle="餐饮订单"
             rightTitle='>'
             ></Item>
               <View style={styles.heng}/>
               <Item
                   action={this.changeAction.bind(this,2)}
                   leftTitle="代送订单"
                   rightTitle='>'
               >

               </Item>
               <View style={styles.heng}/>
               <View style={styles.shejiao}>
                   <Text>社  交</Text>
               </View>
               <View style={styles.heng}/>
               <Item
                   action={this.changeAction.bind(this,3)}
                   leftTitle="消息与联系人"
                   rightTitle='>'
               ></Item>
               <View style={styles.heng}/>
               <Item
                   action={this.changeAction.bind(this,4)}
                   leftTitle="动  态"
                   rightTitle='>'
               ></Item>
               <View style={styles.heng}/>
               <View style={styles.shejiao}>
                   <Text>我  的</Text>
               </View>
               <View style={styles.heng}/>
               <Item
                   action={this.changeAction.bind(this,5)}
                   leftTitle="收  藏"
                   rightTitle='>'
               ></Item>
           </View>
        );
    }

    changeAction(index){
   switch (index){
       case 1:{
           this.props.navigation.navigate("RestaurantView")
           break;
       }
       case 2:{
           this.props.navigation.navigate('DaiSongView')
           break;
       }
       case 3:{

           break;
       }
       case 4:{

           break;
       }
       case 5:{

           break;
       }
   }
    }
}
const styles=StyleSheet.create({
    contain:{
        flex:1
    },
    dingdan:{
        marginLeft:10,
        marginTop:20,
        width:Contants.Screen.width,
        marginBottom:10
    },
   heng:{
       width:Contants.Screen.width,
       height:1,
       backgroundColor:"#E5E5E5"
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
   shejiao:{
        marginTop:10,
       marginBottom:10,
       marginLeft:10,
   }

})
var Item=React.createClass({
    render(){
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => {
                this.props.action()
            }}>

                <View style={styles.container}>

                    <Text style={styles.leftView}>{this.props.leftTitle}</Text>

                    <View style={styles.rightView}>

                        <Text style={{color: "#a8a8a8", fontSize: 15}}>{this.props.rightTitle}</Text>

                    </View>

                </View>

            </TouchableOpacity>

        )
    }
})
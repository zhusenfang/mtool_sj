import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Contants from '../common/Contants'
export default class SearchPage extends Component {
    state: {
        fadeAnim: Animated,
        currentAlpha:number,
    };
    constructor(props){
        super(props)
        this.state={
            currentAlpha:1.0,
            fadeAnim:new Animated.Value(1.0),
            bigDogeTransY : new Animated.Value(0),
              imagesource:require('../img/page/button.png'),

        }

    }

    startAnimation(){


        alert("qwe");
        if(this.state.imagesource==require('../img/page/button.png')){
            this.setState({
               imagesource:require("../img/page/buttonselt.png")
            })
        }else {
            this.setState({
                imagesource:require("../img/page/button.png")
            })
        }

        this.state.currentAlpha=this.state.currentAlpha ==1.0?0.0:1.0
        Animated.timing(this.state.fadeAnim,
            {toValue:this.state.currentAlpha}
            ).start();


    }
    render() {
        return (
           <View style={{flex:1,width:Contants.Screen.width}}>
               <View style={styles.headercontainer}>
               <TouchableOpacity onPress = {()=> this.startAnimation()}>
                   <Image source={this.state.imagesource} style={styles.btnimg}

                   />
               </TouchableOpacity>
               </View>
               {/*<ActionButton buttonColor="rgba(231,76,60,1)">*/}
                   {/*<ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>*/}
                       {/*<Image source={require("../img/page/button.png")}/>*/}
                   {/*</ActionButton.Item>*/}
                   {/*<ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>*/}
                       {/*<Image source={require("../img/page/button.png")}/>*/}
                   {/*</ActionButton.Item>*/}
                   {/*<ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>*/}
                       {/*<Image source={require("../img/page/button.png")}/>*/}
                   {/*</ActionButton.Item>*/}
               {/*</ActionButton>*/}
               {/*<Animated.Image source={require("../img/page/button.png")}*/}
                      {/*style={{opacity:this.state.fadeAnim,*/}
                          {/*transform: [//transform动画*/}
                              {/*{*/}
                                  {/*translateY: this.state.fadeAnim.interpolate({*/}
                                      {/*inputRange: [0, 1],*/}
                                      {/*outputRange: [60, 0] //线性插值，0对应60，0.6对应30，1对应0*/}
                                  {/*}),*/}

                              {/*},*/}
                              {/*{*/}
                                  {/*scale:this.state.fadeAnim*/}
                              {/*},*/}
                          {/*],*/}
                      {/*}}*/}
               {/*>*/}

               {/*</Animated.Image>*/}
               <Animated.View style={{opacity:this.state.fadeAnim,
                   width:Contants.Screen.width,
                   transform:[{
                   translateX:Dimensions.get('window').width/2+30
               },
                   {
                       translateY:this.state.fadeAnim.interpolate({
                       inputRange: [0, 1],
                       outputRange: [0, 1] //线性插值，0对应60，0.6对应30，1对应0
                   }),
                   },
                       // {
                       //     scale:this.state.fadeAnim
                       // },

               ]}}

               >
                   {/*<Image source={require("../img/page/button.png")}/>*/}
                   <Image source={require("../img/page/background.png")} style={{width:120,height:232,marginTop:20,marginRight:Dimensions.get('window').width/2+30}}>
                       {/*<TouchableOpacity style={styles.gonggao}>*/}
                           {/*<Image source={require("../img/page/public.png")} style={styles.publicview}/>*/}
                           {/*<Text>公告</Text>*/}
                       {/*</TouchableOpacity>*/}
                       {/*<TouchableOpacity style={styles.sousuo}>*/}
                           {/*<Image source={require("../img/page/srarch.png")} style={styles.search}/>*/}
                           {/*<Text>搜索</Text>*/}
                       {/*</TouchableOpacity>*/}
                       {/*/!*中心红色按钮*!/*/}

                       {/*/!*下面的订单等*!/*/}
                       {/*<TouchableOpacity style={styles.dingdan}>*/}
                           {/*<Image source={require("../img/page/public.png")} style={styles.publicview}/>*/}
                           {/*<Text>订单</Text>*/}
                       {/*</TouchableOpacity>*/}
                       {/*<View style={styles.xiaoxi}>*/}
                           {/*<Image source={require("../img/page/public.png")} style={styles.publicview}/>*/}
                           {/*<Text>消息</Text>*/}
                       {/*</View>*/}
                       {/*<View style={styles.xiaoxi}>*/}
                           {/*<Image source={require("../img/page/public.png")} style={styles.publicview}/>*/}
                           {/*<Text>工具</Text>*/}
                       {/*</View>*/}
                       {/*<View style={styles.xiaoxi}>*/}
                           {/*<Image source={require("../img/page/public.png")} style={styles.publicview}/>*/}
                           {/*<Text>我的</Text>*/}
                       {/*</View>*/}
                       {/*<View style={styles.xiaoxi}>*/}
                           {/*<Image source={require("../img/page/public.png")} style={styles.publicview}/>*/}
                           {/*<Text>核销</Text>*/}
                       {/*</View>*/}
                   </Image>
               </Animated.View>

           </View>
        );
    }
}
const styles=StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    headercontainer:{
        zIndex:1000,
        marginBottom:40,
        position:'absolute',
        marginLeft:Contants.Screen.width/2+80,
        marginTop:20
    },
    btnimg:{
        width:60,
        height:60
    },
    gonggao:{
        flexDirection:'column',
        position:'absolute',
        marginLeft:50,
        marginTop:10,
        alignItems:'center',
        justifyContent:'center'
    },
    search:{
        width:16,
        height:16
    },
    sousuo:{
        flexDirection:'column',
        position:'absolute',
        marginTop:10,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:100,
    },
    publicview:{
        width:20,
        height:20
    },
    dingdan:{
        flexDirection:'column',

        alignItems:'center',
        justifyContent:'center',
        marginLeft:Contants.Screen.width/3+50
    },
    xiaoxi:{
        flexDirection:'column',

        alignItems:'center',
        justifyContent:'center',
        marginLeft:Contants.Screen.width/3+50,
        marginTop:30
    }

})